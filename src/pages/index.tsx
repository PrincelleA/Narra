/**
 * HOME PAGE
 * This page serves as the main landing page of the application. It displays the feed of posts and allows users to sign in and create new posts.
 */

import { type NextPage } from "next";
import { api } from "~/utils/api";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

/**
 * CREATE POST WIZARD COMPONENT
 * This component renders the create post wizard, which allows users to create new posts.
 */

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  // Create a new post using a trpc mutation
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      {/* Display the user's profile avatar */}
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-14 w-14 rounded-full overflow-hidden",
          },
        }}
      />

      {/* <Image
        src={user.imageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      /> */}

      {/* Input field to enter post content */}
      <input
        type="text"
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none "
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />

      {/* Submit button */}
      {input !== "" && !isPosting && (
        <button
          className="text-slate-300 hover:text-slate-200"
          onClick={() => mutate({ content: input })}
        >
          Post
        </button>
      )}

      {/* Display a loading spinner while posting */}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

/**
 * FEED COMPONENT
 * This component renders the feed of posts.
 */

const Feed = () => {
  // Fetch all posts using a trpc query
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  // Return a loading page if posts are loading
  if (postsLoading) return <LoadingPage />;

  // Return an error message if posts failed to load
  if (!data) return <div>Something went wrong</div>;

  // Return a list of posts
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

/**
 * HOME PAGE COMPONENT
 * This component renders the home page.
 */

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  api.posts.getAll.useQuery();

  // Return empty div if user isn't loaded
  if (!userLoaded) return <div />;

  return (
    <>
      <PageLayout>
        <div className="border-b border-slate-400 p-4">
          {/* Display the sign in button if the user isn't signed in */}
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {/* Display the create post wizard if the user is signed in */}
          {!!isSignedIn && <CreatePostWizard />}
        </div>

        {/* Display the feed */}
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
