/**
 * PROFILE PAGE
 * This page displays the profile of a user based on their username. It fetches the user's information, including their profile image and posts, and renders them.
 */

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { PostView } from "~/components/postview";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

/**
 * PROFILE FEED COMPONENT
 * This component renders the posts of a user.
 */

const ProfileFeed = (props: { userId: string }) => {
  // Fetch the posts by the user ID using a trpc query
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  // If the data is loading, return a loading page
  if (isLoading) return <LoadingPage />;

  // If there is no data, or the data is empty, return a message
  if (!data || data.length === 0) return <div>User has not posted</div>;

  // Otherwise, render the posts
  return (
    <div className="flex flex-col">
      {/* Render the post views for each post */}
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

/**
 * PROFILE PAGE COMPONENT
 */

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  // Fetch the user by their username using a trpc query
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  // If there is no data, return a 404 page
  if (!data) return <div>404</div>;

  // Otherwise, render the profile page
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-48 bg-slate-600">
          <Image
            src={data.imageUrl}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400"></div>

        {/* *Render the profile feed* */}
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

/**
 * SERVER-SIDE PROPS
 * Fetch the user's data during build time using a getStaticProps function
 */

export const getStaticProps: GetStaticProps = async (context) => {
  // Create a helper function to generate the SSG data
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  // Fetch the user by their username using a trpc query
  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

/**
 * SERVER-SIDE PATHS
 * This function is responsible for generating the paths for the posts.
 * It returns an empty array because we don't know the paths at build time.
 * We will use fallback: "blocking" to generate the paths at runtime.
 */

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
