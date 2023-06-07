import type { PropsWithChildren } from "react";

/**
 * PAGE LAYOUT COMPONENT
 * This component renders the layout of a page.
 */

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="no-scrollbar h-full w-full overflow-y-scroll border-x border-slate-400 md:max-w-2xl">
        {/* Render the child components within the layout */}
        {props.children}
      </div>
    </main>
  );
};
