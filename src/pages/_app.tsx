/**
 * APP ENTRY POINT
 * It sets up the application, including the required providers and global configurations.
 */

import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { SignUpPage } from "~/components/sign-in";
import Page from "./sign-in/[[...index]]";
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
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
      </Head>
      <Toaster position="bottom-center" />

      <SignedIn>
        {/* Render the component and pass the pageProps to it */}
        <Component {...pageProps} />
      </SignedIn>

      <SignedOut>
        <Page />
      </SignedOut>
    </ClerkProvider>
  );
};

// Wrap the application with the withTRPC HOC to enable server-side rendering and handle API requests.
export default api.withTRPC(MyApp);
