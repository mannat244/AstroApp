import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Astro Booking - Expert Astrology by Vinnay Raj | Kundali & Vastu Consultation",
    template: "%s | Astro Booking"
  },
  description: "Book expert astrology consultations with Vinnay Raj. Get kundali matching, vastu shastra services, and personalized horoscope readings. Expert guidance for career, love, health, wealth, and family matters.",
  keywords: [
    "astrology consultation",
    "Vinnay Raj astrologer",
    "kundali matching",
    "vastu shastra",
    "horoscope reading",
    "astrologer booking",
    "birth chart analysis",
    "vedic astrology",
    "online astrology",
    "career astrology",
    "love astrology",
    "financial astrology",
    "vastu consultant"
  ],
  authors: [{ name: "Vinnay Raj" }],
  creator: "Vinnay Raj",
  publisher: "Astro Booking",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Astro Booking',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://astro-booking.com",
    title: "Astro Booking - Expert Astrology by Vinnay Raj",
    description: "Book expert astrology consultations with Vinnay Raj. Get kundali matching, vastu shastra services, and personalized guidance from a certified astrologer.",
    siteName: "Astro Booking",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astro Booking - Expert Astrology by Vinnay Raj",
    description: "Book expert astrology consultations, kundali matching, and vastu shastra services with Vinnay Raj.",
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
