// [lang]/layout.tsx
import "@/app/globals.css";
import { Footer } from '../components/Footer';

interface LangParams {
  lang: string;
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "de" }, { lang: "es" }, { lang: "fr" }, { lang: "it" }, { lang: "pt" }, { lang: "zh" }];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LangParams;
}>) {
  return (
    <html lang={params.lang} className="dark">
      <body>
        <main className="flex flex-col items-center justify-between min-h-[80vh]">
          {children}
        </main>
        <footer className="flex flex-col items-center justify-between">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
