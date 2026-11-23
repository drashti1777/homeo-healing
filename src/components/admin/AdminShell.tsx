"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarCheck, CreditCard, FileText, HelpCircle, ImageIcon, Images, LayoutDashboard, LogOut, Mail, Menu, PenLine, Quote, Search, Settings, Stethoscope, UserRound, Users, X, Leaf, HeartPulse } from "lucide-react";
import type { Role } from "@/lib/auth";

const LINKS: { href: string; label: string; icon: React.ElementType; roles: Role[] }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, roles: ["admin", "editor", "staff"] },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck, roles: ["admin", "editor", "staff"] },
  { href: "/admin/contacts", label: "Contact enquiries", icon: Mail, roles: ["admin", "editor", "staff"] },
  { href: "/admin/treatments", label: "Treatments", icon: Stethoscope, roles: ["admin", "editor"] },
  { href: "/admin/conditions", label: "Health conditions", icon: HeartPulse, roles: ["admin", "editor"] },
  { href: "/admin/articles", label: "Articles", icon: FileText, roles: ["admin", "editor"] },
  { href: "/admin/authors", label: "Authors & reviewers", icon: PenLine, roles: ["admin", "editor"] },
  { href: "/admin/gallery", label: "Gallery", icon: Images, roles: ["admin", "editor"] },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote, roles: ["admin", "editor"] },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, roles: ["admin", "editor"] },
  { href: "/admin/doctor", label: "Doctor profile", icon: UserRound, roles: ["admin", "editor"] },
  { href: "/admin/seo", label: "SEO metadata", icon: Search, roles: ["admin", "editor"] },
  { href: "/admin/media", label: "Images", icon: ImageIcon, roles: ["admin", "editor"] },
  { href: "/admin/settings", label: "Clinic settings", icon: Settings, roles: ["admin", "editor"] },
  { href: "/admin/payment", label: "Payment integration", icon: CreditCard, roles: ["admin"] },
  { href: "/admin/users", label: "Admin users", icon: Users, roles: ["admin"] },
];

export function AdminShell({ user, children }: { user: { name: string; role: Role }; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const links = LINKS.filter((l) => l.roles.includes(user.role));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-paper text-forest-900" : "text-sage-100 hover:bg-paper/10"}`}>
            <Icon className="size-4" aria-hidden="true" /> {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-sage-50 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-forest-900 lg:flex">
        <div className="flex items-center gap-2 px-6 py-6 text-paper"><Leaf className="size-5" aria-hidden="true" /><span className="font-serif text-xl">Dr. Neeta's Homeo Health Care</span></div>
        {nav}
        <div className="border-t border-paper/10 p-4 text-sm text-sage-200">
          <p className="truncate font-medium text-paper">{user.name}</p>
          <p className="mb-3 capitalize">{user.role}</p>
          <button type="button" onClick={logout} className="flex items-center gap-2 text-sage-200 hover:text-paper"><LogOut className="size-4" aria-hidden="true" /> Sign out</button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sage-200 bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
          <span className="font-serif text-lg text-forest-800">Admin</span>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open admin menu" className="grid size-10 place-items-center rounded-full border border-forest-800/20"><Menu className="size-5" aria-hidden="true" /></button>
        </header>
        {open && (
          <div className="fixed inset-0 z-40 flex bg-forest-950/60 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu" onClick={() => setOpen(false)}>
            <div className="flex w-72 flex-col bg-forest-900" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-5 text-paper"><span className="font-serif text-xl">Dr. Neeta's Homeo Health Care</span><button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><X className="size-5" /></button></div>
              {nav}
              <div className="border-t border-paper/10 p-4 text-sm text-sage-200"><button type="button" onClick={logout} className="flex items-center gap-2"><LogOut className="size-4" aria-hidden="true" /> Sign out</button></div>
            </div>
          </div>
        )}
        <main className="p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
