/**
 * API HANDLER FOR THE TRPC ENDPOINT
 * It exports the API handler created using the trpc library.
 */

import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// Export API handler
export default createNextApiHandler({
  // Create a context for each request
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          // Log errors in development
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined, // Optional error handler, only used in development environment
});
