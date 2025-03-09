import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Source Password Manager | Zero-Trust Chrome Password Cleaner",
  description: "100% local password management for Chrome, Brave & Edge. Open-source, zero-trust, and fully offline. Clean your passwords with military-grade security. No accounts, no cloud, no tracking.",
  keywords: "password manager, chrome password export, brave password manager, edge password export, password security tool, password organizer, secure password cleaner, free password manager, password cleanup tool, password security analyzer, chrome passwords, brave passwords, edge passwords, password export tool, password organization",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  metadataBase: new URL('https://passwords.doruk.ch'),
  openGraph: {
    title: "Open Source Password Manager | Zero-Trust Security",
    description: "Privacy-first password management. 100% local processing, military-grade encryption, and open-source code. Clean Chrome & Brave passwords with complete peace of mind. No servers, no tracking.",
    type: "website",
    locale: "en_US",
    siteName: "Password Cleaner by Doruk",
    images: [
      {
        url: '/favicon.ico',
        width: 32,
        height: 32,
        alt: 'Open Source Password Manager'
      }
    ],
    url: 'https://passwords.doruk.ch'
  },
  twitter: {
    card: 'summary',
    title: 'Open Source Password Manager | Zero-Trust Security',
    description: 'Privacy-focused password management. 100% local, open-source, and zero-trust. Clean your Chrome & Brave passwords with military-grade security.',
    images: ['/favicon.ico'],
    creator: '@dorukozturk',
    site: '@dorukozturk'
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
  alternates: {
    canonical: 'https://passwords.doruk.ch',
    languages: {
      'en-US': 'https://passwords.doruk.ch',
    }
  },
  authors: [
    { name: 'Doruk Tan Ozturk' }
  ],
  category: 'Security Tools',
  applicationName: 'Password Cleaner',
  generator: 'Next.js',
  creator: 'Doruk Tan Ozturk',
  publisher: 'Doruk Tan Ozturk',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  other: {
    'trustworthy': 'open-source',
    'security-level': 'military-grade',
    'privacy-level': 'zero-trust',
    'github-repo': 'https://github.com/peaktwilight/csv-password-cleaner'
  }
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
