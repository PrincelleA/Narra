import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  /**
   * GET USER BY USERNAME
   * @param username - The username of the user.
   * @returns The user profile data.
   * @throws TRPCError if the user is not found.
   */

  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      // Retrieve the user from the Clerk user list based on the provided username
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      // If the user doesn't exist, throw an error
      if (!user)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });

      // Filter the user data for client consumption
      return filterUserForClient(user);
    }),
});
