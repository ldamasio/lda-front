import { redirect } from "next/navigation";

export default function PortfolioPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  redirect(`/${lang}/#work`);
}
