import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, ScrollArea } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Provider } from "react-redux";
import store from "../app/store";
import { AppNavbar } from "../components/base/AppNavbar";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Provider store={store}>
        <Head>
          <title>xAlgs</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "dark",
          }}
        >
          <NotificationsProvider>
            <div
              style={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                flexDirection: "row",
              }}
            >
              <AppNavbar />
              <ScrollArea style={{ width: "100%", height: "100%" }}>
                <div style={{ padding: "2em", width: "100%", height: "100%" }}>
                  <Component {...pageProps} />
                </div>
              </ScrollArea>
            </div>
          </NotificationsProvider>
        </MantineProvider>
      </Provider>
    </>
  );
}
