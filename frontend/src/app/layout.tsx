import "@/src/styles/globals.css";
import { Metadata } from "next";
import Header from "@/src/components/Header";
import BottomNavigation from "@/src/components/BottomNavigation";
import { SessionProvider } from "@/src/contexts/SessionProvider";
import AppolloProviderWrapper from "@/src/contexts/AppolloProviderWrapper";
import ChakraCustomProvider from "@/src/contexts/ChakraCustomProvider";

export const metadata: Metadata = {
  title: {
    default: "麻雀ヤリタイ | 麻雀好きが集まる場所",
    template: "%s | 麻雀ヤリタイ",
  },
  description:
    "麻雀が好きな人、麻雀を新しく始めたい人が集まる場所です。ライトに麻雀を楽しむための情報やコミュニティを提供します。",
  authors: [{ name: "麻雀ヤリタイ" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "麻雀ヤリタイ | 麻雀好きが集まる場所",
    description: "麻雀が好きな人、麻雀を新しく始めたい人が集まる場所です。",
    url: "https://www.mahjong-yaritai.com",
    siteName: "麻雀ヤリタイ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "麻雀ヤリタイ | 麻雀好きが集まる場所",
    description: "麻雀が好きな人、麻雀を新しく始めたい人が集まる場所です。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ChakraCustomProvider>
          <AppolloProviderWrapper>
            <SessionProvider>
              <main
                className="flex pb-24 flex-col min-h-screen bg-secondary overflow-x-hidden text-neutral "
                style={{ fontFamily: "PT Serif, serif" }}>
                <div className="mb-16">
                  <Header />
                </div>
                <div className="flex-grow w-screen flex items-stretch">{children}</div>
              </main>
              <BottomNavigation />
            </SessionProvider>
          </AppolloProviderWrapper>
        </ChakraCustomProvider>
      </body>
    </html>
  );
}
