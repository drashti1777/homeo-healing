/**
 * Stores all 16 treatment categories from https://drneetahomeohealing.com/treatment.php with:
 *   - originalTitle / originalConditions: verbatim from the source site (docs/treatment-categories.json)
 *   - conditions: the same list with spelling corrected
 *   - group, icon, riskLevel, safetyNotice: for filtering and medical safety messaging
 * Body text is educational ("areas of interest"), never a claim of effectiveness.
 * Run: npm run migrate:treatments   (idempotent; matched by slug, keeps existing images)
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import { Treatment } from "../src/lib/models";

type SourceCategory = { id: string; order: number; originalTitle: string; correctedTitle: string; originalConditions: string; correctedConditions: string[]; clinicalReview: boolean };
const source = JSON.parse(readFileSync("docs/treatment-categories.json", "utf8")) as { categories: SourceCategory[] };

type Meta = { slug: string; title: string; group: string; icon: string; specialist: boolean; notice: string };

const GENERAL_SPECIALIST =
  "Some conditions in this category are serious and need diagnosis and treatment by a qualified medical doctor or specialist. Homeopathy is not a substitute for that care. Please continue any prescribed treatment and do not stop or change it without your doctor's advice.";

/** Keyed by source id (tc-01 … tc-16). Titles keep the source wording with spelling corrected. */
const META: Record<string, Meta> = {
  "tc-01": { slug: "alcoholism", title: "Alcoholism", group: "mind", icon: "wine", specialist: true, notice: "Stopping heavy or long-term drinking suddenly can cause dangerous withdrawal, including seizures. Speak to a medical doctor or a de-addiction service before stopping, and seek emergency care for confusion, seizures or hallucinations." },
  "tc-02": { slug: "oncology", title: "Oncology", group: "specialist-care", icon: "ribbon", specialist: true, notice: "Cancer, including leukaemia and lymphoma, must be diagnosed and treated by an oncologist. Homeopathy is not a treatment for cancer and must never delay or replace surgery, chemotherapy, radiotherapy, immunotherapy or any other care recommended by your oncology team. Tell your oncologist about anything else you take." },
  "tc-03": { slug: "psychiatric", title: "Psychiatric", group: "mind", icon: "brain", specialist: true, notice: "Conditions such as schizophrenia, severe depression, personality disorders and OCD need assessment and care from a psychiatrist. Do not stop or reduce psychiatric medicines without your psychiatrist's advice. If you have thoughts of harming yourself, contact emergency services or a crisis helpline immediately." },
  "tc-04": { slug: "pediatric", title: "Pediatric", group: "life-stages", icon: "baby", specialist: true, notice: "Delayed milestones need assessment by a paediatrician. Jaundice in a newborn, high fever, breathing difficulty, dehydration or unusual drowsiness in a child need urgent medical attention. Keep to the vaccination schedule recommended by your paediatrician." },
  "tc-05": { slug: "skin-disease", title: "Skin Disease", group: "body-systems", icon: "hand", specialist: true, notice: "Measles is an infectious illness that needs medical assessment, and SLE and vasculitis can affect internal organs and need care from a specialist. See a doctor for a rash with fever, rapidly spreading skin changes or skin pain." },
  "tc-06": { slug: "womens-health", title: "Women's Health", group: "life-stages", icon: "venus", specialist: false, notice: "See a gynaecologist for heavy or irregular bleeding, severe pelvic pain, bleeding after menopause or any new lump." },
  "tc-07": { slug: "during-pregnancy", title: "During Pregnancy", group: "life-stages", icon: "pregnancy", specialist: true, notice: "Kidney disease, SLE, diabetes, thyroid disease, blood disorders and infections in pregnancy need care from your obstetrician. Always stay under obstetric care and tell your obstetrician about anything you take. Seek emergency care for bleeding, severe abdominal pain, severe headache, sudden swelling, fits, or reduced baby movements." },
  "tc-08": { slug: "geriatric", title: "Geriatric", group: "life-stages", icon: "elderly", specialist: true, notice: "Inability to pass urine (urethral obstruction) can be a medical emergency. Falls with injury, sudden confusion or new weakness need urgent medical attention. Older adults on several medicines should review them regularly with their doctor." },
  "tc-09": { slug: "respiratory-disease", title: "Respiratory Disease", group: "body-systems", icon: "lungs", specialist: true, notice: "Pneumonia and asthma attacks need conventional medical treatment. Seek emergency care for severe breathlessness, blue lips, chest pain, or an asthma attack that does not settle with your prescribed inhaler. Do not stop prescribed inhalers." },
  "tc-10": { slug: "endocrine", title: "Endocrine", group: "body-systems", icon: "endocrine", specialist: true, notice: "Diabetes, thyroid, adrenal (Cushing's and Conn's syndrome), pituitary and parathyroid disorders need monitoring by a physician or endocrinologist. Never stop insulin, thyroid or other hormone medicines. Very high or very low blood sugar needs urgent medical care." },
  "tc-11": { slug: "cardiac-disease", title: "Cardiac Disease", group: "specialist-care", icon: "heart", specialist: true, notice: "Chest pain, pressure or breathlessness can be a heart attack: call emergency services immediately. Heart disease, valve disease and high blood pressure must remain under the care of a cardiologist or physician. Do not stop blood pressure, blood-thinning or heart medicines." },
  "tc-12": { slug: "neurological-problems", title: "Neurological Problems", group: "body-systems", icon: "neuro", specialist: true, notice: "Epilepsy, dementia and multiple sclerosis need care from a neurologist. Do not stop anti-epileptic medicines. A first seizure, a sudden severe headache, new weakness, facial droop or difficulty speaking need emergency care." },
  "tc-13": { slug: "kidney-and-urinary-tract", title: "Kidney & Urinary Tract", group: "specialist-care", icon: "kidney", specialist: true, notice: "Nephrotic syndrome, kidney tumours and kidney disease need care from a nephrologist or urologist. Severe flank pain, fever with urinary symptoms, blood in the urine or reduced urine output need prompt medical attention." },
  "tc-14": { slug: "disorder-of-joints-and-muscle", title: "Disorder of Joints & Muscle", group: "body-systems", icon: "bone", specialist: false, notice: "See a doctor for a hot, swollen joint with fever, sudden severe back pain, or numbness or weakness in the legs." },
  "tc-15": { slug: "gi-system", title: "GI System", group: "body-systems", icon: "gut", specialist: true, notice: "Vomiting blood, black or bloody stools, severe abdominal pain, difficulty swallowing or signs of dehydration need emergency care. Ulcerative colitis, Crohn's disease and ascites need care from a gastroenterologist." },
  "tc-16": { slug: "liver-spleen-gallbladder-pancreas", title: "Liver, Spleen, Gallbladder & Pancreas Related Disorders", group: "specialist-care", icon: "liver", specialist: true, notice: "Hepatitis, cirrhosis, ascites and pancreatitis need medical and often hospital care. Yellowing of the eyes or skin, severe abdominal pain, confusion or vomiting blood need urgent medical attention." },
};

function body(c: SourceCategory, m: Meta) {
  const list = c.correctedConditions.length ? c.correctedConditions : [m.title];
  return [
    "## About this category",
    `${m.title} is one of the areas of interest listed by Dr. Neeta's Homeo Health Care. This page is educational: it describes concerns that patients discuss with the clinic and does not claim that homeopathy treats, cures or prevents any of them.`,
    "## Conditions listed by the clinic",
    list.map((x) => `- ${x}`).join("\n"),
    "## What a consultation involves",
    "A homoeopathic consultation includes a detailed history of your symptoms, health, personality and lifestyle. Any homoeopathic medicine is chosen on the basis of this individual assessment and reviewed at follow-up visits, alongside the care you receive from your doctor.",
    "## Important",
    "Homeopathy is offered as a complementary approach. It is not a replacement for diagnosis or evidence-based treatment by a qualified medical doctor. Please continue any prescribed treatment and do not stop or change it without your doctor's advice.",
  ].join("\n\n");
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(process.env.MONGODB_URI);
  if (source.categories.length !== 16) throw new Error(`Expected 16 source categories, found ${source.categories.length}`);

  for (const c of source.categories) {
    const m = META[c.id];
    if (!m) throw new Error(`No metadata for ${c.id}`);
    const list = c.correctedConditions;
    const summary = list.length
      ? `Area of interest including ${list.slice(0, 3).join(", ").toLowerCase()}${list.length > 3 ? ` and ${list.length - 3} more` : ""}.`
      : `Area of interest listed by the clinic.`;
    await Treatment.updateOne(
      { slug: m.slug },
      {
        $set: {
          title: m.title,
          originalTitle: c.originalTitle,
          originalConditions: c.originalConditions,
          conditions: list,
          group: m.group,
          icon: m.icon,
          riskLevel: m.specialist ? "specialist" : "standard",
          safetyNotice: m.specialist ? `${GENERAL_SPECIALIST} ${m.notice}` : m.notice,
          summary,
          body: body(c, m),
          highlights: [],
          order: c.order,
          isPublished: true,
          seoTitle: `${m.title} | Homeo-Healing, Bhavnagar & Ahmedabad`.slice(0, 70),
          seoDescription: `${m.title}: conditions listed by Dr. Neeta's Homeo Health Care${list.length ? `, including ${list.slice(0, 3).join(", ")}` : ""}. Educational information, not a substitute for medical care.`.slice(0, 170),
        },
        $setOnInsert: { image: "", imageAlt: "", isFeatured: false },
      },
      { upsert: true },
    );
  }
  // Featured on the homepage: three non-specialist / general-interest categories, matching earlier selection.
  await Treatment.updateMany({ order: { $lt: 100 } }, { $set: { isFeatured: false } });
  await Treatment.updateMany({ slug: { $in: ["respiratory-disease", "skin-disease", "womens-health", "disorder-of-joints-and-muscle", "pediatric", "endocrine"] } }, { $set: { isFeatured: true } });
  // The three generic consultation pages from the first seed are kept, grouped as "general".
  await Treatment.updateMany({ slug: { $in: ["initial-consultation", "follow-up-consultation", "online-consultation"] } }, { $set: { group: "general", icon: "stethoscope", riskLevel: "standard" } });

  const count = await Treatment.countDocuments({ order: { $lt: 100 }, isPublished: true });
  const specialist = await Treatment.countDocuments({ riskLevel: "specialist" });
  console.log(`Treatment categories: ${count} published (${specialist} with specialist-care notice)`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
