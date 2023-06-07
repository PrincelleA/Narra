/**
 * MAIN ROUTER
 * Primary entry point for handling API requests.
 */

import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { profileRouter } from "./routers/profile";

/**
 * SUB-ROUTERS
 * @property posts - Router for posts related endpoints.
 * @property profile - Router for profile related endpoints.
 */

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  profile: profileRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
