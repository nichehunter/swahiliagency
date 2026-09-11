import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "leaflet/dist/leaflet.css";
import "@/styles/utils.css";
import "@/styles/common/datatable.css";
import "@/styles/common/form.css";
import "@/styles/common/datadetails.css";
import "@/styles/common/skeleton.css";
import "@/styles/common/mainloading.css";

import { App as AntdApp } from "antd";

import { LoadingProvider } from "@/components/common/LoadingProvider";
import { NotificationProvider } from "@/components/common/NotificationProvider";
import NavigationLoadingProvider from "@/components/common/loading/NavigationLoadingProvider";
import SessionTimeoutProvider from "@/components/common/session/SessionTimeoutProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="theme-color" content="#000000" />

        <meta name="description" content="SwahiliExpi Agency Portal" />

        <title>SwahiliExpi | Agency</title>
      </head>

      <body>
        <AntdApp>
          <NotificationProvider>
            <NavigationLoadingProvider>
              <SessionTimeoutProvider>
                <LoadingProvider>{children}</LoadingProvider>
              </SessionTimeoutProvider>
            </NavigationLoadingProvider>
          </NotificationProvider>
        </AntdApp>
      </body>
    </html>
  );
}
