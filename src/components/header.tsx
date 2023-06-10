import { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import Link from "next/link";

/**
 * HEADER COMPONENT
 * Navigation bar at the top of the page.
 */
export const HeaderView = () => {
  return (
    <div className="h-10 w-full border border-slate-400 bg-slate-800/5 p-4 shadow-[inset_10px_-50px_94px_0_rgb(203,213,225,0.05)]  backdrop-blur"></div>
  );
};
