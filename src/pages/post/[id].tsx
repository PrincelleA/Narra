/**
 * SINGLE POST PAGE
 * This page is responsible for rendering a single post based on the provided ID.
 */

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PostView } from "~/components/postview";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

/**
 * SINGLE POST PAGE COMPONENT
 * This component renders the single post page.
 */

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        {/* Set the page title based on the post content and author */}
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        {/* Render the post view */}
        <PostView {...data} />
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

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no slug");

  // Fetch the user by their username using a trpc query
  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
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

export default SinglePostPage;
