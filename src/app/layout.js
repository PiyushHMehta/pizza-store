import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { AppProvider } from "@/components/AppContext";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const roboto = Roboto({ subsets: ["latin"], weight: ['400', '500', '700'] });

export const metadata = {
  title: "Best Pizza in Town - My Pizza Store",
  description: "Enjoy delicious, freshly baked pizzas at My Pizza Store. Order online and get it delivered to your doorstep!",
  keywords: "pizza, best pizza, pizza delivery, order pizza online, fresh pizza",
  author: "My Pizza Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <Head>
        <title>{metadata.title}</title>
        <link rel="icon" href="/pizza.png" type="image/x-icon" />
        {/* <link rel="icon" href="/pizza.png" type="image/png" /> */}
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="/pizza.png" />
        <meta property="og:url" content="https://my-pizzza-store.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/pizza.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "My Pizza Store",
              url: "https://my-pizzza-store.vercel.app/",
              description: metadata.description,
              servesCuisine: "Pizza",
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Pizza St",
                addressLocality: "Pizzatown",
                addressRegion: "PZ",
                postalCode: "12345",
                addressCountry: "US",
              },
              telephone: "+1234567890",
            }),
          }}
        />
      </Head>
      <body className={roboto.className}>
        <main className="max-w-4xl mx-auto p-4">
          <AppProvider>
            <Toaster />
            <Header />
            {children}
            <footer className="border-t p-8 text-center text-gray-500 mt-16">
              &copy; 2024, All Rights Reserved
            </footer>
          </AppProvider>
        </main>
      </body>
    </html>
  );
}
