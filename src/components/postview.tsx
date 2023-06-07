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
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      {/* Author's profile image, username, and timestamp */}
      <Image
        src={author.imageUrl}
        alt={`@${author.username}`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-2 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <span>·</span>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>

        {/* Post content */}
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
