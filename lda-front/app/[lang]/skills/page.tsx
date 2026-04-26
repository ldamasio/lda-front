import { redirect } from "next/navigation";

export default function SkillsPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  redirect(`/${lang}/#work`);
}
