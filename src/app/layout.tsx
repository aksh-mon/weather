import localFont from 'next/font/local';
import { Geist, Geist_Mono, Nabla } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nabla = Nabla({
  variable: "--font-nabla",
  subsets: ["latin"],
  weight: "400", 
});

const asimovian = localFont({
  src: "./fonts/Asimovian-Regular.ttf", 
  variable: "--font-ash",
  weight: "400",
});

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
        <meta name="google-site-verification" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nabla.variable} ${asimovian.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
