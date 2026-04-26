import "@/app/globals.css";
import localFont from "next/font/local";
import { NavPill } from "../components/NavPill";
import { SiteFooter } from "../components/SiteFooter";

const geist = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

interface LangParams {
  lang: string;
}

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "de" },
    { lang: "es" },
    { lang: "fr" },
    { lang: "it" },
    { lang: "pt" },
    { lang: "zh" },
  ];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LangParams;
}>) {
  return (
    <html
      lang={params.lang}
      className={`dark ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <NavPill lang={params.lang} />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
