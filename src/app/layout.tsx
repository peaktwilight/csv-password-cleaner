import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Password Cleaner - Secure Password Management Tool",
  description: "A secure, client-side tool for managing and cleaning up your password exports from Chrome and Brave browsers. Organize, deduplicate, and maintain your passwords locally.",
  keywords: "password manager, password cleaner, chrome passwords, brave passwords, security tool, password organization, password security, password cleanup",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  metadataBase: new URL('https://passwords.doruk.ch'),
  openGraph: {
    title: "Password Cleaner - Secure Password Management Tool",
    description: "Clean and organize your browser passwords securely and locally",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/favicon.ico',
        width: 32,
        height: 32,
        alt: 'Password Cleaner Tool'
      }
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Password Cleaner - Secure Password Management Tool',
    description: 'Clean and organize your browser passwords securely and locally',
    images: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // You'll need to add your actual Google verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>{children}</body>
    </html>
  );
}
