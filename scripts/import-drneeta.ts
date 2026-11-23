/**
 * Imports the clinic's own content from https://drneetahomeohealing.com into MongoDB.
 * Run:  npm run import:drneeta   (safe to run again; records are upserted)
 *
 * Facts (addresses, phone, qualifications, treatment areas, FAQ topics) are kept as published by the clinic.
 * Claims of cure, "no side effects" or guaranteed results are reworded neutrally, and testimonials are
 * imported UNPUBLISHED until the clinic confirms patient consent in the admin panel.
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import sharp from "sharp";
import { Doctor, Faq, Settings, Testimonial, Treatment } from "../src/lib/models";

const SOURCE = "https://drneetahomeohealing.com";
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");

/** Downloads an image once, converts to WebP and returns its /media/ path. Deterministic name = idempotent. */
async function importImage(url: string): Promise<string> {
  const name = `${createHash("sha256").update(url).digest("hex").slice(0, 24)}.webp`;
  const file = path.join(UPLOAD_DIR, name);
  try {
    await access(file);
    return `/media/${name}`;
  } catch { /* not downloaded yet */ }
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const out = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(file, out);
  return `/media/${name}`;
}

const SAFETY =
  "## Important\n\nHomeopathy is offered here as a complementary approach. It does not replace diagnosis or treatment by your doctor or specialist. Please continue any prescribed treatment and do not stop or change it without medical advice.";

type Area = { slug: string; title: string; image: string; items: string[]; urgent?: string; featured?: boolean };

const AREAS: Area[] = [
  { slug: "respiratory-disease", title: "Respiratory Disease", image: "respiratory", featured: true, items: ["Asthma", "Pneumonia", "Common cold", "Allergic rhinitis", "Pharyngitis", "Sinusitis"], urgent: "Seek emergency care for severe breathlessness, blue lips, chest pain or an asthma attack that does not settle with your prescribed inhaler. Pneumonia needs assessment by a doctor." },
  { slug: "skin-disease", title: "Skin Disease", image: "skin-disease", featured: true, items: ["Psoriasis", "Allergy", "Urticaria", "Scabies", "Measles", "Ringworm", "SLE", "Vasculitis"] },
  { slug: "womens-health", title: "Women's Health", image: "women-health", featured: true, items: ["Problems related to menses", "PCOS", "Leucorrhoea", "Infection", "Fibroid"] },
  { slug: "pediatric", title: "Pediatric", image: "pediatric", items: ["Delayed milestones (walking, talking etc.)", "Recurrent URTI", "Jaundice"], urgent: "Children with high fever, breathing difficulty, dehydration, drowsiness or jaundice in a newborn need to be seen by a doctor urgently. Keep to the recommended vaccination schedule." },
  { slug: "endocrine", title: "Endocrine", image: "endochrine", items: ["Thyroid gland disorder", "Obesity", "Cushing's syndrome", "Conn's syndrome", "Diabetes mellitus", "Hyperprolactinemia", "Hyperparathyroidism", "Osteoporosis"], urgent: "Do not stop insulin, thyroid or other prescribed hormone medicines. Very high or low blood sugar needs urgent medical care." },
  { slug: "disorder-of-joints-and-muscle", title: "Disorder of Joints & Muscle", image: "disorder-of-joints", items: ["Gout", "Sciatica", "Arthritis", "Osteoarthritis", "Spondylosis"] },
  { slug: "gi-system", title: "GI System", image: "gi-system", items: ["Dysphagia", "Aphthous ulcer", "Diarrhoea", "Nausea", "Irritable bowel syndrome", "Constipation", "Peptic ulcer", "GI bleeding", "Ulcerative colitis", "Ascites", "Crohn's disease"], urgent: "Vomiting blood, black stools, severe abdominal pain or signs of dehydration need emergency care." },
  { slug: "liver-spleen-gallbladder-pancreas", title: "Liver, Spleen, Gallbladder & Pancreas", image: "liver", items: ["Jaundice", "Hepatitis", "Ascites", "Cirrhosis", "Gallstone", "Pancreatitis"], urgent: "Severe abdominal pain, yellowing of the eyes or skin, confusion or vomiting blood need urgent medical assessment." },
  { slug: "kidney-and-urinary-tract", title: "Kidney & Urinary Tract", image: "kidney", items: ["Nephrotic syndrome", "Renal tumours", "Renal and ureteric stones", "Nephropathy"], urgent: "Severe flank pain, fever with urinary symptoms, blood in urine or reduced urine output need a doctor promptly. Renal tumours must be managed by a specialist." },
  { slug: "neurological-problems", title: "Neurological Problems", image: "nuerological", items: ["Epilepsy", "Headache", "Migraine", "Dementia", "Multiple sclerosis"], urgent: "A first seizure, a sudden severe headache, weakness, facial droop or trouble speaking need emergency care. Do not stop anti-epileptic medicines." },
  { slug: "cardiac-disease", title: "Cardiac Disease", image: "cardiac-disease", items: ["Angina / chest pain", "Valvular heart disease", "Ischemic heart disease", "Atherosclerosis", "Hypertension", "Blood related disorders"], urgent: "Chest pain, pressure or breathlessness can be a heart attack. Call emergency services immediately. Heart conditions and high blood pressure must stay under the care of a cardiologist or physician." },
  { slug: "psychiatric", title: "Psychiatric", image: "psychiatric", items: ["Depression", "Anxiety", "Lack of confidence", "OCD", "Schizophrenia", "Personality disorder"], urgent: "If you have thoughts of self-harm or suicide, contact emergency services or a crisis helpline now. Do not stop psychiatric medicines without your psychiatrist's advice." },
  { slug: "geriatric", title: "Geriatric", image: "geriatric", items: ["Depression", "Urinary incontinence", "Urethral obstruction", "Falls"], urgent: "Falls with injury, sudden confusion or inability to pass urine need urgent medical care." },
  { slug: "during-pregnancy", title: "During Pregnancy", image: "pregnancy", items: ["Renal disease", "SLE", "Caroli disease", "Diabetes mellitus", "Thyroid disease", "Haematological disorders", "Infection (bacterial / viral / fungal)"], urgent: "During pregnancy, always stay under the care of your obstetrician. Bleeding, severe pain, reduced baby movements, severe headache or swelling need emergency care. Tell your obstetrician about anything you take." },
  { slug: "oncology", title: "Oncology", image: "oncology", items: ["Various types of malignancy", "Lymphoma", "Leukaemia"], urgent: "Cancer must be diagnosed and treated by an oncologist. Homeopathy is not a treatment for cancer and must never delay or replace surgery, chemotherapy, radiotherapy or other oncology care." },
  { slug: "alcoholism", title: "Alcoholism", image: "alchoholism", items: ["Support for alcohol dependence"], urgent: "Stopping heavy drinking suddenly can cause dangerous withdrawal. Speak to a doctor or a de-addiction service before stopping." },
];

function areaBody(a: Area) {
  return [
    `## Conditions in this area`,
    `Patients consult Dr. Neeta's Homeo Health Care about concerns such as:`,
    a.items.map((i) => `- ${i}`).join("\n"),
    `## How a consultation works`,
    `Your consultation includes a detailed history of your symptoms, health, personality and lifestyle. Homeopathic medicine is prescribed on the basis of this individual assessment, and your progress is reviewed at follow-up visits.`,
    ...(a.urgent ? [`## When to see a doctor first`, a.urgent] : []),
    SAFETY,
  ].join("\n\n");
}

const FAQS = [
  { order: 1, question: "What is homoeopathy?", answer: "Homoeopathy is a system of alternative medicine founded by Samuel Hahnemann. It is based on the principle \"similia similibus curentur\", or \"like cures like\": a substance that causes symptoms in a healthy person is used, in a highly diluted form, to treat similar symptoms in a sick person." },
  { order: 2, question: "Why homoeopathy?", answer: "Homoeopathic medicine is used for people of all age groups, from children to the elderly. The medicines are easy to take, usually as sweet pills. Medicine is prescribed after a detailed analysis of your personality and the totality of your individual symptoms, both physical and mental." },
  { order: 3, question: "What are the other benefits if you connect to us?", answer: "Our approach looks at you as a whole person rather than a single complaint. For children, we pay attention to overall growth and development alongside the presenting problem. Please continue routine care, nutrition advice and vaccinations from your paediatrician or doctor." },
  { order: 4, question: "Who is a homeopath?", answer: "A homeopath is a medical professional trained in homeopathy. They prescribe remedies after considering a person's symptoms, personality, lifestyle and hereditary factors, using minute doses of natural substances according to homeopathic principles." },
  { order: 5, question: "What are homeopathic medicines made up of?", answer: "Homeopathic medicines are made from highly diluted substances of natural origin, such as plants (for example arnica, red onion, belladonna, poison ivy and stinging nettle), animal sources (for example crushed bees) or minerals (for example white arsenic). They are diluted with alcohol, water or sugar." },
  { order: 6, question: "Do homeopathic medicines contain steroids?", answer: "Properly prepared homoeopathic medicines do not contain steroids; they are made from highly diluted natural substances. Buy medicines only from your homeopath or a licensed pharmacy, and never stop prescribed steroid medicines suddenly without your doctor's advice." },
  { order: 7, question: "Can homeopathic medicines be taken along with other medicines?", answer: "Homeopathic medicines are generally taken alongside conventional treatment. Always tell both your homeopath and your doctor about every medicine you take, and do not stop or change prescribed medicines without your doctor's advice." },
  { order: 8, question: "Is homeopathy scientifically proven?", answer: "Research in homeopathy is limited, and systematic reviews have not found reliable evidence that homeopathic remedies work better than placebo for treating health conditions. Many people nonetheless choose homeopathy as a complementary approach. We encourage you to make an informed choice and to keep working with your doctor." },
];

const TESTIMONIALS = [
  {
    name: "Kiya Chapaneri",
    location: "",
    quote: "My experience with Dr. Neeta's Homeo Healthcare has been wonderful. I had visited Dr. Neeta's Homeo Healthcare to increase immunity of my little daughter. The treatment given by them was very effective and no side effects. Thank you.",
  },
  {
    name: "Dr. Chandrika Pandya (MD - Anaesthesia)",
    location: "Bhavnagar, Gujarat",
    quote: "My self Dr. Chandrika Pandya and my 2 daughters are on Homeopathic medicines since last 1 and 1/2 years. We all 3 have \"Bronchial Asthma\". My daughters also have milk protein allergy. So both have very frequent episodes of bronchitis and hospitalization at least twice in a month, so we were literally tired of this illness of my children. Then Dr. Mehul Gosai sir gave us guidance to consult Dr. Neeta Parmar madam & take homeopathic medicines as per her expert opinion after her consultation. So, we have started the medicines since last 1 and 1/2 years and after that, I would like to say that really health of all of us have improved drastically. Episodes decreased significantly and my both the daughters are now able to take tea and buttermilk which we have stopped since last 2 years. I am really thankful to Dr. Neeta mam whose medicines along with positive counseling with humane touch & thoughts booster helps us a lot to fight with this battle and finally we have won the battle and now all 3 of us are quiet asymptomatic and also special thanks to our pediatrician, whose guidance about homeopathic medicines helped us to come out from all these panic situations of chronic illness and frequent hospitalization. I express my best wishes to Neeta madam and her team and as an Anaesthetist, I would like to recommend more & more people who is suffering such frequently occurring, recurrent or chronic problem should trust on Homeopathy & meet Dr. Neeta Madam for her expert Homeopathic opinion and its management.",
  },
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(process.env.MONGODB_URI);

  await Settings.updateOne(
    { key: "main" },
    {
      $set: {
        clinicName: "Dr. Neeta's Homeo Health Care",
        phone: "+91 81606 02060",
        email: "drneetahomeohealing@gmail.com",
        addressLine: "2nd Floor, Ratna Plaza Complex, R.T.O, Vithalwadi Road, Above R.K Travels, Opposite Madhav Complex, Shastrinagar",
        city: "Bhavnagar",
        state: "Gujarat",
        country: "India",
        otherAddresses: ["32_FF, 1st Floor, 4D Square, Opp. IIT Eng. College, Nr. Visat Petrol Pump to Gandhinagar Highway, Motera, Ahmedabad, Gujarat"],
        facebookUrl: "https://www.facebook.com/Dr-Neetss-Homeo-Health-Care-107686881068210",
        instagramUrl: "https://www.instagram.com/drneetahomeoheathcare/",
      },
      $setOnInsert: { key: "main" },
    },
    { upsert: true },
  );
  console.log("Settings: clinic name, phone, email, both addresses, social links");

  await Doctor.updateOne(
    { key: "main" },
    {
      $set: {
        name: "Dr. Neeta Parmar",
        title: "Chief Homoeopathic Consultant",
        bio: [
          "Dr. Neeta Parmar is the chief homoeopathic consultant at Dr. Neeta's Homoeo Health Care, Bhavnagar, and at Homeo Health Care & Pharmacy, Ahmedabad.",
          "She graduated from Swami Vivekananda Homoeopathic Medical College, Bhavnagar in 2011, and completed her post-graduation in Repertory at Ahmedabad Homeopathic Medical College (affiliated with Hemchandracharya North Gujarat University, Patan) in June 2016.",
          "Since July 2017 she has served as a teaching faculty member (HOD & Associate Professor) in the department of Homoeopathic Pharmacy at Shree Swaminarayan Homoeopathy Medical College, Kalol, Gujarat. She has also worked as a visiting homoeopathic consultant at Jivraj Mehta Hospital, Ahmedabad (2017).",
        ].join("\n\n"),
        qualifications: [
          "Graduate, Swami Vivekananda Homoeopathic Medical College, Bhavnagar (2011)",
          "Post-graduation in Repertory, Ahmedabad Homeopathic Medical College, Hemchandracharya North Gujarat University, Patan (2016)",
          "Certificate Course in Advance Homoeopathy, Maharashtra University of Health Sciences, Nashik (2016)",
          "Certificate of Master Course in Advance Homoeopathy, The Other Song – International Academy of Advanced Homoeopathy, Mumbai (2016)",
          "PGCHM – Post Graduate Certificate Course in Hospital and Healthcare Management, New Delhi (2014)",
        ],
        experience: "HOD & Associate Professor, Hom. Pharmacy, Shree Swaminarayan Homoeopathy Medical College, Kalol (since July 2017)",
        isPublished: true,
      },
      $setOnInsert: { key: "main" },
    },
    { upsert: true },
  );
  console.log("Doctor profile: Dr. Neeta Parmar (registration number left blank, not published on source site)");

  // Earlier generic starter consultations move after the clinic's own treatment areas.
  await Treatment.updateMany({ slug: { $in: ["initial-consultation", "follow-up-consultation", "online-consultation"] } }, { $set: { isFeatured: false } });
  await Treatment.updateMany({ slug: { $in: ["initial-consultation", "follow-up-consultation", "online-consultation"] }, order: { $lt: 100 } }, { $inc: { order: 100 } });

  let i = 0;
  for (const a of AREAS) {
    i += 1;
    let image = "";
    try {
      image = await importImage(`${SOURCE}/assets/img/treatment/${a.image}.webp`);
    } catch (err) {
      console.warn(`  image failed for ${a.title}:`, (err as Error).message);
    }
    await Treatment.updateOne(
      { slug: a.slug },
      {
        $set: {
          title: a.title,
          summary: `Homeopathic consultation for ${a.items.slice(0, 4).join(", ").toLowerCase()}${a.items.length > 4 ? " and related concerns" : ""}.`.slice(0, 300),
          body: areaBody(a),
          highlights: [],
          image,
          imageAlt: `${a.title} treatment at Dr. Neeta's Homeo Health Care`,
          order: i,
          isFeatured: Boolean(a.featured),
          isPublished: true,
        },
      },
      { upsert: true },
    );
  }
  console.log(`Treatments: ${AREAS.length} treatment areas with images`);

  // Replace the earlier generic "scientifically proven" FAQ with the clinic's own, keep the other safety FAQs after them.
  await Faq.deleteMany({ question: "Is homeopathy scientifically proven?" });
  for (const f of FAQS) await Faq.updateOne({ question: f.question }, { $set: { ...f, isPublished: true } }, { upsert: true });
  await Faq.updateMany({ question: { $nin: FAQS.map((f) => f.question) }, order: { $lt: 20 } }, { $inc: { order: 20 } });
  console.log(`FAQs: ${FAQS.length} clinic FAQs`);

  for (const t of TESTIMONIALS) {
    await Testimonial.updateOne(
      { name: t.name },
      {
        $set: { quote: t.quote, location: t.location },
        $setOnInsert: {
          isVerified: false,
          consentGiven: false,
          isPublished: false,
          verificationNote: "Imported from drneetahomeohealing.com on 20 Nov 2026. Confirm the patient's consent before publishing.",
        },
      },
      { upsert: true },
    );
  }
  console.log(`Testimonials: ${TESTIMONIALS.length} imported as UNPUBLISHED (verify consent in admin)`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
