import "@/app/globals.css";
import { NavMenu } from '../components/NavigationMenu';

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
    <html lang={params.lang}>
      <body>
        <header className="flex flex-col items-center justify-between">
          <NavMenu />
        </header>
        <main className="flex flex-col items-center justify-between min-h-[80vh]">
          {children}
        </main>
        <footer className="flex flex-col items-center justify-between">
          Rodapé
        </footer>
      </body>
    </html>
  );
}
