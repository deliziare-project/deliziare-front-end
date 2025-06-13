import BottomBar from "@/components/deliveryBoy/bottomBar";
import Navbar from "@/components/deliveryBoy/Navbar";
import ToastProvider from "@/components/shared/ToastProvider";
import type { Metadata, Viewport } from "next";
import React from "react";

// Correct metadata (without themeColor)
export const metadata: Metadata = {
  title: "Delivery App",
  manifest: "/manifest.json",
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

// ✅ New viewport export for themeColor
export const viewport: Viewport = {
  themeColor: "#ff4d00",
};

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
      </div>
    </ToastProvider>
  );
}
