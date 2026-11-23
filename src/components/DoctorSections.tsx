import type { DoctorDoc, DoctorEntry } from "@/lib/data";

export const ENTRY_SECTIONS: { key: DoctorEntry["category"]; eyebrow: string; title: string }[] = [
  { key: "education", eyebrow: "Education", title: "Education and qualifications" },
  { key: "experience", eyebrow: "Practice", title: "Professional experience" },
  { key: "certification", eyebrow: "Training", title: "Certifications and training" },
  { key: "teaching", eyebrow: "Academic", title: "Teaching experience" },
];

export const entriesFor = (doctor: DoctorDoc, key: DoctorEntry["category"]) => doctor.entries.filter((e) => e.category === key);

/** Vertical timeline used for each category of doctor entries. */
export function EntryTimeline({ entries }: { entries: DoctorEntry[] }) {
  return (
    <ol className="relative border-l border-forest-800/15 pl-8">
      {entries.map((e, i) => (
        <li key={`${e.year}-${e.title}`} className="relative pb-10 last:pb-0" data-reveal data-delay={(i % 3) * 0.06}>
          <span aria-hidden="true" className="absolute -left-[2.37rem] top-1.5 size-3 rounded-full border-2 border-paper bg-forest-600" />
          {e.year && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-500">{e.year}</p>}
          <h3 className="mt-1 text-xl font-normal md:text-2xl">{e.title}</h3>
          {e.institution && <p className="mt-1 text-ink">{e.institution}</p>}
          {e.description && <p className="mt-2 text-sm text-ink-soft">{e.description}</p>}
        </li>
      ))}
    </ol>
  );
}
