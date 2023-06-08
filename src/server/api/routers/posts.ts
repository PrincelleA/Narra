import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Post } from "@prisma/client";

/**
 * ADD USER DATA FUNCTION
 * Helper function to add user data to a list of posts
 * @param posts - The list of posts to add user data to.
 * @returns The list of posts with user data.
 */

const addUserDataToPosts = async (posts: Post[]) => {
  // Retrieve the user data for each post
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
  )
    // Filter the user data for client consumption
    .map(filterUserForClient);

  // Iterate over the posts and add the author data
  return posts.map((post) => {
    {
      // Find the author for the post
      const author = users.find((user) => user.id === post.authorId);

      // If the author doesn't exist, throw an error
      if (!author || !author.username)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });

      // Return the post with the author data
      return {
        post,
        author: {
          ...author,
          username: author.username,
        },
      };
    }
  });
};

/**
 * RATE LIMITER SETUP
 * Create a new rate limiter instance to restrict the number of requests per minute.
 * In this case, users are limited to 3 requests per minute.
 */

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,

  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

/**
 * POSTS ROUTER
 * Router for handling post-related API requests.
 */

export const postsRouter = createTRPCRouter({
  /**
   * GET POST BY ID
   * @param {string} id - The ID of the post.
   * @returns {Promise<PostWithUser>} A promise that resolves to the post with user data.
   */

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      });

      // If the post doesn't exist, throw an error
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToPosts([post]))[0];
    }),

  /**
   * GET ALL POSTS
   * @returns {Promise<PostWithUser[]>} A promise that resolves to an array of posts with user data.
   */

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return addUserDataToPosts(posts);
  }),

  /**
   * GET ALL POSTS BY A USER
   * @param {string} userId - The ID of the user.
   * @returns {Promise<PostWithUser[]>} A promise that resolves to an array of posts with user data.
   */

  getPostsByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.post
        .findMany({
          where: {
            authorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToPosts)
    ),

  /**
   * CREATE NEW POST
   * @param {object} input - The input object containing post data.
   * @param {string} input.content - The content of the post.
   * @returns {Promise<Post>} A promise that resolves to the created post.
   */

  create: privateProcedure
    // Validate the input
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed!").min(1).max(280),
      })
    )

    // Execute the query
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      // Check if the user has exceeded their ratelimit
      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      // Create the post
      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),

  // /**
  //  * DELETE POST
  //  * @param {string} id - The ID of the post.
  //  * @returns {Promise<Post>} A promise that resolves to the deleted post.
  //  * @throws {TRPCError} Throws an error if the user is not authorized to delete the post.
  //  */

  // delete: privateProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const post = await ctx.prisma.post.findUnique({
  //       where: { id: input.id },
  //     });

  //     // If the post doesn't exist, throw an error
  //     if (!post) throw new TRPCError({ code: "NOT_FOUND" });

  //     // If the user is not authorized to delete the post, throw an error
  //     if (post.authorId !== ctx.userId)
  //       throw new TRPCError({ code: "UNAUTHORIZED" });

  //     // Delete the post
  //     await ctx.prisma.post.delete({ where: { id: input.id } });

  //     return post;
  //   }),

  // /**
  //  * LIKE POST
  //  * @param {string} id - The ID of the post.
  //  * @returns {Promise<Post>} A promise that resolves to the liked post.
  //  */

  // like: privateProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const post = await ctx.prisma.post.findUnique({
  //       where: { id: input.id },
  //     });

  //     // If the post doesn't exist, throw an error
  //     if (!post) throw new TRPCError({ code: "NOT_FOUND" });

  //     // If the user has already liked the post, throw an error
  //     if (post.likes.includes(ctx.userId))
  //       throw new TRPCError({ code: "UNAUTHORIZED" });

  //     // Like the post
  //     await ctx.prisma.post.update({
  //       where: { id: input.id },
  //       data: {
  //         likes: {
  //           push: ctx.userId,
  //         },
  //       },
  //     });

  //   return post;
  // }
});
