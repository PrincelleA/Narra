import { User } from "@clerk/backend/dist/types/api";

/**
 * FILTER USER FOR CLIENT
 * @param user - The user object to be filtered.
 * @returns The filtered user object.
 */

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    imageUrl: user.imageUrl,
  };
};
