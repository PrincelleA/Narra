import { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import Link from "next/link";

// Define a type for a post with the user information
type PostWithUser = RouterOutputs["posts"]["getAll"][number];

/**
 * POST VIEW COMPONENT
 * @param props - Props containing the post and author information.
 */

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <Link href={`/post/${post.id}`}>
      <div
        key={post.id}
        className="mt-4 flex gap-3 rounded-lg border border-slate-400 bg-slate-800/5 p-4 shadow-[inset_10px_-50px_94px_0_rgb(203,213,225,0.05)]  backdrop-blur"
      >
        {/* Author's profile image, username, and timestamp */}
        <Link href={`/@${author.username}`}>
          <Image
            src={author.imageUrl}
            alt={`@${author.username}`}
            className="h-14 w-14 rounded-full"
            width={56}
            height={56}
            onClick={(e) => {
              e.stopPropagation;
            }}
          />
        </Link>

        <div className="flex flex-col">
          <div className="flex gap-2 text-slate-300">
            <Link href={`/@${author.username}`}>
              <span
                onClick={(e) => {
                  e.stopPropagation;
                }}
              >
                {`@${author.username}`}
              </span>
            </Link>
            <span>·</span>

            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </div>

          {/* Post content */}
          <span className="whitespace-pre-wrap">{post.content}</span>
        </div>
      </div>
    </Link>
  );
};
