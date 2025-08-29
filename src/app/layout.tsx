import { Geist, Geist_Mono, Nabla,Asimovian  } from "next/font/google";
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
  weight: "400", // or the weight you want
});

const ash = Asimovian({
  variable:"--font-ash",
  weight:"400",
})


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
        className={`${geistSans.variable} ${geistMono.variable} ${nabla.variable} ${ash.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
