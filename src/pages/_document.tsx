import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Title dan Deskripsi */}
        <meta name="title" content="Promo Suzuki Alsut" />
        <meta name="description" content="Kami menyediakan unit mobil suzuki terlengkap dengan harga terbaru dan pastinya promo yang menarik. Hanya di showroom kami Anda bisa dengan mudah mendapatkan mobil impian dengan DP yang ringan." />

        {/* Open Graph (untuk Facebook, WhatsApp, dsb) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://promosuzukialsut.vercel.app/" />
        <meta property="og:title" content="Promo Suzuki Alsut" />
        <meta property="og:description" content="Kami menyediakan unit mobil suzuki terlengkap dengan harga terbaru dan pastinya promo yang menarik. Hanya di showroom kami Anda bisa dengan mudah mendapatkan mobil impian dengan DP yang ringan." />
        <meta property="og:image" content="https://promosuzukialsut.vercel.app/bapak_suzuki.jpeg" />

        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://promosuzukialsut.vercel.app/" />
        <meta property="og:title" content="Promo Suzuki Alsut" />
        <meta property="og:description" content="Kami menyediakan unit mobil suzuki terlengkap dengan harga terbaru dan pastinya promo yang menarik. Hanya di showroom kami Anda bisa dengan mudah mendapatkan mobil impian dengan DP yang ringan." />
        <meta property="og:image" content="https://promosuzukialsut.vercel.app/bapak_suzuki.jpeg" />

        {/* Favicon (opsional) */}
        <link rel="icon" href="/sujuki.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
