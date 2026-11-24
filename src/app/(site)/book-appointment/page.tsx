import { ArrowRight, Clock, MapPin, ExternalLink } from "lucide-react";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Disclaimer, EmergencyNotice, PageHero } from "@/components/ui";
import { branchesFrom, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({
    path: "/book-appointment",
    title: "Request an Appointment | Dr. Neeta's Homeo Health Care",
    description:
      "Request a homeopathic consultation with Dr. Neeta Parmar in Bhavnagar or Ahmedabad. Immediate reference ID and prompt clinical confirmation.",
  });

type Props = { searchParams: Promise<{ branch?: string }> };

export default async function BookAppointmentPage({ searchParams }: Props) {
  const [settings, sp] = await Promise.all([getSettings(), searchParams]);
  const branches = branchesFrom(settings);
  const defaultBranch = sp.branch === "ahmedabad" ? "ahmedabad" : "bhavnagar";

  return (
    <>
      {/* 1. Page Hero Banner */}
      <PageHero
        eyebrow="Appointments"
        title="Request a consultation"
        intro="Tell us which clinic and when suits you. Your request is not a booking until the clinic confirms it with you."
        crumbs={[{ label: "Book an Appointment" }]}
      />

      {/* 2. Modern Interactive Appointment Experience */}
      <section className="section py-12 lg:py-16 bg-gradient-to-b from-white via-sand-50/40 to-white">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Form Column (7 of 12) */}
            <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-9 shadow-xl shadow-forest-950/5 border border-forest-800/10">
              <AppointmentForm defaultBranch={defaultBranch} />
            </div>

            {/* Information Sidebar (5 of 12) */}
            <aside className="lg:col-span-5 space-y-5">
              {/* Card 1: What Happens Next (Visual Timeline) */}
              <div className="rounded-3xl bg-[#edf5ee] p-6 sm:p-7 border border-[#d5ecc0]">
                <h2 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2 mb-5">
                  <Clock className="size-5 text-emerald-700" />
                  What happens next
                </h2>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-300">
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 flex size-4.5 items-center justify-center rounded-full bg-forest-900 text-[10px] font-bold text-white shadow-xs">
                      1
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-forest-950">
                      You receive a reference number straight away.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 flex size-4.5 items-center justify-center rounded-full bg-forest-900 text-[10px] font-bold text-white shadow-xs">
                      2
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-forest-950">
                      The clinic reviews your request.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 flex size-4.5 items-center justify-center rounded-full bg-forest-900 text-[10px] font-bold text-white shadow-xs">
                      3
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-forest-950">
                      We contact you by phone or email to agree a time.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 flex size-4.5 items-center justify-center rounded-full bg-forest-900 text-[10px] font-bold text-white shadow-xs">
                      4
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-forest-950">
                      Your appointment is confirmed only once we have spoken with you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Our Clinics */}
              {branches.length > 0 && (
                <div className="rounded-3xl bg-white p-6 sm:p-7 border border-forest-800/10 shadow-xs">
                  <h2 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2 mb-4">
                    <MapPin className="size-5 text-emerald-700" />
                    Our clinics
                  </h2>
                  <div className="space-y-4 divide-y divide-forest-900/10">
                    {branches.map((b) => (
                      <div key={b.key} className={b.key === "ahmedabad" ? "pt-3.5" : ""}>
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm font-bold text-forest-950">
                            {b.key === "ahmedabad" ? "Ahmedabad Branch" : "Bhavnagar Clinic"}
                          </strong>
                          {b.mapLinkUrl && (
                            <a
                              href={b.mapLinkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-forest-700 hover:text-emerald-700 underline inline-flex items-center gap-1"
                            >
                              Directions <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-ink-soft leading-relaxed font-normal">
                          {b.address}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 3: Emergency Notice & Medical Disclaimer */}
              <div className="space-y-3.5">
                <EmergencyNotice />
                <Disclaimer />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
