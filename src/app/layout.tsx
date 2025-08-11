import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather-Mon | Live Weather App",
  description:
    "Weather-Mon is a real-time weather application that shows live weather updates, forecasts, and temperature details for any city.",
  keywords: [
    "weather app",
    "live weather",
    "forecast",
    "temperature",
    "Weather-Mon",
    "current weather",
    "weather tracker",
  ],
  authors: [{ name: "Akshay" }],
  openGraph: {
    title: "Weather-Mon | Live Weather App",
    description:
      "Check live weather, forecasts, and temperature details for any city with Weather-Mon.",
    url: "https://weather-mon.netlify.app",
    siteName: "Weather-Mon",
    images: [
      {
        url: "https://weather-mon.netlify.app/og-image.jpg", // replace with your actual image path
        width: 1200,
        height: 630,
        alt: "Weather-Mon - Live Weather App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather-Mon | Live Weather App",
    description:
      "Check live weather, forecasts, and temperature details for any city with Weather-Mon.",
    images: ["https://weather-mon.netlify.app/og-image.jpg"], // replace with your actual image path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://weather-mon.netlify.app" />
        <meta name="google-site-verification" content="m_kj2_ts7NEAGgo6GjUSv2a63FodqLbnhTFrHH4UQXs" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
