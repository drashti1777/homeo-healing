import Link from "next/link";
import { connectDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Appointment, Article, ContactMessage, Testimonial, Treatment } from "@/lib/models";

export const metadata = { title: "Overview" };

export default async function AdminOverview() {
  const session = await getSession();
  await connectDb();
  const [pending, newMessages, recent, treatments, articles, unverified] = await Promise.all([
    Appointment.countDocuments({ status: "pending" }),
    ContactMessage.countDocuments({ status: "new" }),
    Appointment.find().sort({ createdAt: -1 }).limit(5).lean<{ _id: string; name: string; preferredDate: string; status: string }[]>(),
    Treatment.countDocuments({ isPublished: true }),
    Article.countDocuments({ isPublished: true }),
    Testimonial.countDocuments({ isVerified: false }),
  ]);
  const canContent = session?.role !== "staff";
  const cards = [
    { label: "Pending appointment requests", value: pending, href: "/admin/appointments" },
    { label: "New contact messages", value: newMessages, href: "/admin/contacts" },
    ...(canContent ? [
      { label: "Published treatments", value: treatments, href: "/admin/treatments" },
      { label: "Published articles", value: articles, href: "/admin/articles" },
      { label: "Testimonials awaiting verification", value: unverified, href: "/admin/testimonials" },
    ] : []),
  ];
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-normal">Welcome, {session?.name}</h1>
        <p className="mt-1 text-ink-soft">Here is what needs your attention.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="block rounded-2xl border border-sage-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-forest-900/5">
              <p className="font-serif text-4xl text-forest-800">{c.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{c.label}</p>
            </Link>
          </li>
        ))}
      </ul>
      <section>
        <h2 className="mb-4 text-2xl font-normal">Latest appointment requests</h2>
        {recent.length === 0 ? <p className="rounded-2xl border border-dashed border-sage-300 bg-white p-8 text-center text-ink-soft">No requests yet.</p> : (
          <ul className="divide-y divide-sage-100 rounded-2xl border border-sage-200 bg-white">
            {recent.map((r) => (
              <li key={String(r._id)} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                <span className="font-medium text-forest-800">{r.name}</span>
                <span className="text-ink-soft">{r.preferredDate}</span>
                <span className="rounded-full bg-sage-100 px-3 py-1 text-xs capitalize text-forest-800">{r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
