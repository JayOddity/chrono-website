import { redirect } from 'next/navigation';

export default async function MonstersListRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  qs.set('type', 'monsters');
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== 'type') qs.set(k, v);
  }
  redirect(`/database?${qs.toString()}`);
}
