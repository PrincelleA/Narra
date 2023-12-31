import type { PropsWithChildren } from "react";
import { HeaderView } from "./header";

/**
 * PAGE LAYOUT COMPONENT
 * This component renders the layout of a page.
 */

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {/* Header */}
      <HeaderView />

      <div className="no-scrollbar h-full w-full overflow-y-scroll md:max-w-2xl">
        <div className="gradient"></div>

        {/* Render the child components within the layout */}
        {props.children}
      </div>
    </main>
  );
};
