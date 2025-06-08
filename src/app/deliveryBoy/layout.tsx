import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Delivery App",
  manifest: "/manifest.json",
  themeColor: "#ff4d00",
  icons: [
    {
      rel: "icon",
      url: "/icons/android/android-launchericon-72-72.png",
    },
    {
      rel: "apple-touch-icon",
      url: "/icons/android/android-launchericon-72-72.png",
    },
  ],
};

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
