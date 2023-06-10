/**
 * APP ENTRY POINT
 * It sets up the application, including the required providers and global configurations.
 */

import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

/**
 * APP COMPONENT
 */

const MyApp: AppType = ({ Component, pageProps }) => {
  // Set up the ClerkProvider to provide authentication and user management functionality.
  // Pass the pageProps to make them available to all components rendered by the application.
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Narra</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />

      {/* Render the component and pass the pageProps to it */}
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

// Wrap the application with the withTRPC HOC to enable server-side rendering and handle API requests.
export default api.withTRPC(MyApp);
