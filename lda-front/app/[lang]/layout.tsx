import "@/app/globals.css";

interface LangParams {
  lang: string;
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "zh" }];
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
        {children}
      </body>
    </html>
  );
}
