import { authMiddleware } from "@clerk/nextjs";

/**
 * CLERK AUTHENTICATION MIDDLEWARE
 * A piece of code that will validate the user's session on every request.
 */

export default authMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
