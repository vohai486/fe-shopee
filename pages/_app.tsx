import { EmptyLayout } from "@/components/layouts/empty";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useState } from "react";
import { Inter } from "next/font/google";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "@/contexts/app.context";
import Head from "next/head";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import { SocketInitializer } from "@/components/common";
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: ({ children }: { children: ReactNode }) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 0,
          },
        },
      })
  );
  return (
    <div className={inter.className}>
      <Head>
        <title>Bách Hóa Online</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AppProvider>
            <Layout>
              <Component {...pageProps} />
              <SocketInitializer />
            </Layout>
          </AppProvider>
        </Hydrate>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryClientProvider>
    </div>
  );
}
