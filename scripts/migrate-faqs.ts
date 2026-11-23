/**
 * Migrates every FAQ from https://drneetahomeohealing.com/faq.php into MongoDB.
 *   - originalQuestion / originalAnswer: verbatim copy (from docs/faq-content.json), kept for the migration record.
 *   - question: original wording, spelling and grammar corrected only.
 *   - answer: for factual answers the corrected original; for answers with unsupported claims a proposed rewrite
 *     marked "pending-review" until a clinician approves it in the admin.
 * The 4 safety FAQs added in the first seed are kept under "Consultations & appointments".
 * Run: npm run migrate:faqs   (idempotent; matched by slug. Does not overwrite answers already marked clinically-reviewed.)
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import { Faq } from "../src/lib/models";

type SourceFaq = { id: string; originalTitle: string; original: string; revisedProposal: string; flags: string[]; verificationStatus: string };
const source = JSON.parse(readFileSync("docs/faq-content.json", "utf8")) as { sourceUrl: string; items: SourceFaq[] };

type Target = { slug: string; question: string; category: string; related: string[]; answer?: string };

/** Keyed by source id. Answers left undefined use the audited revisedProposal. */
const TARGETS: Record<string, Target> = {
  "faq-01": { slug: "what-is-homeopathy", question: "What is homoeopathy?", category: "about-homeopathy", related: ["who-is-a-homeopath", "what-are-homeopathic-medicines-made-of", "is-homeopathy-scientifically-proven"] },
  "faq-02": { slug: "why-homeopathy", question: "Why homoeopathy?", category: "about-homeopathy", related: ["is-homeopathy-scientifically-proven", "what-happens-in-a-first-consultation", "other-benefits-of-consulting-us"],
    answer: "People choose homoeopathy for different reasons. At our clinic, medicine is always prescribed after a detailed analysis of your personality and the totality of your individual characteristics, both physical and mental. Homoeopathic medicines are used for all age groups and come as easy-to-take sweet pills.\n\nHomoeopathy is a complementary approach. It does not replace diagnosis or evidence-based treatment by a qualified medical doctor, and we do not promise any particular result." },
  "faq-03": { slug: "other-benefits-of-consulting-us", question: "What are the other benefits if you connect to us?", category: "consultations", related: ["why-homeopathy", "what-happens-in-a-first-consultation"],
    answer: "Our consultations look at you as a whole person rather than a single complaint, including your lifestyle, sleep, appetite and emotional wellbeing. For children, we also pay attention to overall growth and development.\n\nPlease continue routine check-ups, vaccinations, and any nutrition or supplement advice from your paediatrician or doctor." },
  "faq-04": { slug: "who-is-a-homeopath", question: "Who is a homeopath?", category: "about-homeopathy", related: ["what-is-homeopathy", "what-happens-in-a-first-consultation"] },
  "faq-05": { slug: "what-are-homeopathic-medicines-made-of", question: "What are homeopathic medicines made up of?", category: "medicines-safety", related: ["do-homeopathic-medicines-contain-steroids", "can-homeopathic-medicines-be-taken-with-other-medicines"],
    answer: "Homeopathic medicines are made from highly diluted substances of natural origin, such as plants (for example arnica, red onion, belladonna, poison ivy and stinging nettle), animals (for example crushed bees) or minerals (for example white arsenic). They are diluted with the help of alcohol, water or sugar." },
  "faq-06": { slug: "do-homeopathic-medicines-contain-steroids", question: "Do homeopathic medicines contain steroids?", category: "medicines-safety", related: ["what-are-homeopathic-medicines-made-of", "can-homeopathic-medicines-be-taken-with-other-medicines", "can-i-use-homeopathy-instead-of-prescribed-medicine"],
    answer: "Properly prepared homoeopathic medicines are made from highly diluted natural substances and do not contain steroids. Buy medicines only from your homeopath or a licensed pharmacy.\n\nIf you take prescribed steroid medicine, never stop it suddenly or reduce the dose without your doctor's advice. Stopping steroids abruptly can be dangerous." },
  "faq-07": { slug: "can-homeopathic-medicines-be-taken-with-other-medicines", question: "Can homeopathic medicines be taken along with other medicines?", category: "medicines-safety", related: ["can-i-use-homeopathy-instead-of-prescribed-medicine", "do-homeopathic-medicines-contain-steroids"],
    answer: "Homeopathic medicines are usually taken alongside conventional treatment. Always tell both your homeopath and your doctor about every medicine, remedy and supplement you take.\n\nDo not stop or change any prescribed medicine without your doctor's advice." },
  "faq-08": { slug: "is-homeopathy-scientifically-proven", question: "Is homeopathy scientifically proven?", category: "evidence", related: ["what-is-homeopathy", "why-homeopathy", "is-this-website-medical-advice"],
    answer: "No. Research in homeopathy is limited, and large systematic reviews have not found reliable evidence that homeopathic remedies work better than placebo for treating any health condition. Homeopathy is not scientifically proven to cure, treat or prevent disease.\n\nSome people still choose homeopathy as a complementary approach, for example for the time and attention of a detailed consultation. If you do, please keep seeing your doctor, continue prescribed treatment, and do not delay medical care for new, severe or worsening symptoms." },
};

/** Safety FAQs from the first seed (matched by their current question text). */
const SEED: Record<string, Target> = {
  "Can I use homeopathy instead of my prescribed medicine?": { slug: "can-i-use-homeopathy-instead-of-prescribed-medicine", question: "Can I use homeopathy instead of my prescribed medicine?", category: "medicines-safety", related: ["can-homeopathic-medicines-be-taken-with-other-medicines", "is-homeopathy-scientifically-proven"] },
  "What happens in a first consultation?": { slug: "what-happens-in-a-first-consultation", question: "What happens in a first consultation?", category: "consultations", related: ["does-the-appointment-form-book-my-appointment", "who-is-a-homeopath"] },
  "Does sending the appointment form book my appointment?": { slug: "does-the-appointment-form-book-my-appointment", question: "Does sending the appointment form book my appointment?", category: "consultations", related: ["what-happens-in-a-first-consultation"] },
  "Is this website a substitute for medical advice?": { slug: "is-this-website-medical-advice", question: "Is this website a substitute for medical advice?", category: "consultations", related: ["is-homeopathy-scientifically-proven", "can-i-use-homeopathy-instead-of-prescribed-medicine"] },
};

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(process.env.MONGODB_URI);
  if (source.items.length !== 8) throw new Error(`Expected 8 source FAQs, found ${source.items.length}`);

  // Earlier imports stored these without slugs; attach slugs by question text before upserting.
  const existing = await Faq.find({}).lean<{ _id: unknown; question: string; slug?: string; reviewStatus?: string }[]>();
  const byQuestion = new Map(existing.map((f) => [f.question.toLowerCase(), f]));

  let order = 0;
  for (const s of source.items) {
    const t = TARGETS[s.id];
    order += 1;
    const factual = s.flags.length === 0;
    const answer = t.answer ?? (s.revisedProposal === "Unchanged." ? s.original : s.revisedProposal);
    const prior = byQuestion.get(t.question.toLowerCase());
    const keepReviewed = prior?.reviewStatus === "clinically-reviewed";
    const set: Record<string, unknown> = {
      slug: t.slug, question: t.question, category: t.category, relatedSlugs: t.related, order,
      originalQuestion: s.originalTitle, originalAnswer: s.original, sourceUrl: source.sourceUrl,
    };
    if (!keepReviewed) {
      set.answer = answer;
      set.reviewStatus = factual ? "original-unchanged" : "pending-review";
      set.reviewNote = factual ? "Factual answer; spelling and grammar corrected only." : `Unsupported claims removed from the original: ${s.flags.join("; ")}. Approve or edit before marking as clinically reviewed.`;
      set.isPublished = true;
    }
    const filter = prior ? { _id: prior._id } : { slug: t.slug };
    await Faq.updateOne(filter, { $set: set }, { upsert: true });
  }

  for (const [q, t] of Object.entries(SEED)) {
    const prior = byQuestion.get(q.toLowerCase());
    order += 1;
    const set = { slug: t.slug, question: t.question, category: t.category, relatedSlugs: t.related, order, sourceUrl: "", originalQuestion: "", originalAnswer: "" };
    if (prior) await Faq.updateOne({ _id: prior._id }, { $set: { ...set, ...(prior.reviewStatus ? {} : { reviewStatus: "pending-review", reviewNote: "Safety FAQ written for the new website (not on the previous site)." }) } });
  }

  const all = await Faq.find({}).select("slug category reviewStatus isPublished").sort({ order: 1 }).lean<{ slug: string; category: string; reviewStatus: string; isPublished: boolean }[]>();
  const missing = all.filter((f) => !f.slug);
  console.log(`FAQs: ${all.length} total, ${all.filter((f) => f.isPublished).length} published, ${missing.length} without slug`);
  for (const f of all) console.log(`  ${f.slug.padEnd(58)} ${f.category.padEnd(18)} ${f.reviewStatus}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
