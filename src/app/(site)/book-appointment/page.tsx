import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Disclaimer, EmergencyNotice, PageHero } from "@/components/ui";
import { branchesFrom, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({ path: "/book-appointment", title: "Request an Appointment", description: "Request a homoeopathic consultation with Dr. Neeta Parmar in Bhavnagar or Ahmedabad. You will receive a reference number and the clinic will contact you to confirm." });

type Props = { searchParams: Promise<{ branch?: string }> };

export default async function BookAppointmentPage({ searchParams }: Props) {
  const [settings, sp] = await Promise.all([getSettings(), searchParams]);
  const branches = branchesFrom(settings);
  const defaultBranch = sp.branch === "ahmedabad" ? "ahmedabad" : "bhavnagar";
  return (
    <>
      <PageHero eyebrow="Appointments" title="Request a consultation" intro="Tell us which clinic and when suits you. Your request is not a booking until the clinic confirms it with you." crumbs={[{ label: "Book an Appointment" }]} />
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <AppointmentForm defaultBranch={defaultBranch} />
          <aside className="space-y-6">
            <div className="rounded-3xl bg-sage-50 p-7">
              <h2 className="text-2xl font-normal">What happens next</h2>
              <ol className="prose-hh mt-4 text-base">
                <li>You receive a reference number straight away.</li>
                <li>The clinic reviews your request.</li>
                <li>We contact you by phone or email to agree a time.</li>
                <li>Your appointment is confirmed only once we have spoken with you.</li>
              </ol>
            </div>
            {branches.length > 0 && (
              <div className="rounded-3xl border border-sage-200 p-7">
                <h2 className="text-xl font-normal">Our clinics</h2>
                <ul className="mt-4 space-y-4 text-sm text-ink-soft">
                  {branches.map((b) => <li key={b.key}><strong className="block text-forest-800">{b.key === "ahmedabad" ? "Ahmedabad" : "Bhavnagar"}</strong>{b.address}</li>)}
                </ul>
              </div>
            )}
            <EmergencyNotice />
            <Disclaimer />
          </aside>
        </div>
      </section>
    </>
  );
}
