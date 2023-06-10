import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

/**
 * HEADER COMPONENT
 * Navigation bar at the top of the page.
 */
export const HeaderView = () => {
  return (
    <div className="gap:4 flex w-full items-center justify-between border-y border-slate-400 bg-slate-800/5 p-5 shadow-[inset_10px_-50px_94px_0_rgb(203,213,225,0.05)] backdrop-blur lg:px-12">
      {/* Logo */}
      <Link href="/">
        {/* <Image
            src="/assets/images/Logo.svg"
            alt="Narra Logo"
            className="h-14 w-14 rounded-full"
            width={56}
            height={56}
          /> */}
        <h1 className=" p-0 text-2xl font-bold text-slate-300">Narra</h1>
      </Link>

      {/* Navigation */}
      <button className="w-screen text-slate-300 hover:text-slate-200">
        New Narrative +
      </button>

      {/* Display the user's profile avatar */}
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-10 w-10 rounded-full overflow-hidden",
          },
        }}
      />
    </div>
  );
};
