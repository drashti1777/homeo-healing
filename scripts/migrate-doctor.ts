/**
 * Moves the doctor profile to structured entries (education / certification / experience / teaching),
 * using the 8 entries published on https://drneetahomeohealing.com/about.php (see docs/doctor-profile.md).
 * Wording: original facts, grammar and spelling corrected only. Nothing added that the source site does not state.
 * Run: npm run migrate:doctor   (re-running overwrites these fields with the same values)
 */
import mongoose from "mongoose";
import { Doctor } from "../src/lib/models";

const entries = [
  // Education
  { category: "education", year: "2011", title: "Graduation in Homoeopathy", institution: "Swami Vivekananda Homoeopathic Medical College, Bhavnagar", description: "", highlight: false },
  { category: "education", year: "June 2016", title: "Post-graduation in Repertory", institution: "Ahmedabad Homoeopathic Medical College, affiliated with Hemchandracharya North Gujarat University, Patan", description: "Completed post-graduation in the special subject of Repertory.", highlight: true },
  { category: "education", year: "2014", title: "Post Graduate Certificate Course in Hospital Management (PCHM)", institution: "New Delhi", description: "Post Graduate Certificate Course in hospital and healthcare management.", highlight: false },
  // Certifications and training
  { category: "certification", year: "2016", title: "Certificate Course in Advance Homoeopathy", institution: "Maharashtra University of Health Sciences, Nashik, Maharashtra", description: "", highlight: true },
  { category: "certification", year: "July 2016", title: "Certificate of Master Course in Advance Homoeopathy", institution: "The Other Song – International Academy of Advanced Homoeopathy, Mumbai", description: "Six-month training with Masters of Homoeopathy.", highlight: true },
  // Professional experience
  { category: "experience", year: "Present", title: "Chief Homoeopathic Consultant", institution: "Dr. Neeta's Homoeo Health Care, Bhavnagar, and Homeo Health Care & Pharmacy, Ahmedabad", description: "", highlight: false },
  { category: "experience", year: "2017", title: "Visiting Homoeopathic Consultant", institution: "Jivraj Mehta Hospital, Ahmedabad", description: "", highlight: true },
  // Teaching
  { category: "teaching", year: "Since July 2017", title: "HOD & Associate Professor, Department of Homoeopathic Pharmacy", institution: "Shree Swaminarayan Homoeopathy Medical College, Kalol, Gujarat", description: "Teaching faculty in the department of Homoeopathic Pharmacy.", highlight: true },
];

// About page, Vision & Mission tab (grammar corrected; "cure" removed per audit, see docs/content-inventory.json).
const mission =
  "In homoeopathy, every person is an individual, a unique creation and a whole in themselves. Dr. Neeta wishes to practise in an unbiased manner, listening attentively to every patient and reaching the similimum by understanding the altered pattern in each case through a scientific and systematic approach.";
const vision = [
  "To bring every patient to a healthy state with the best possible effort, through homoeopathic remedies.",
  "To spread awareness of the homoeopathic system of medicine as widely as possible.",
];
// Factual approach points from the source site (FAQ "Why homoeopathy?" and the Mission text).
const approach = [
  { title: "Listening first", text: "Every consultation begins by listening attentively to the patient and understanding the complete picture of their health." },
  { title: "The individual as a whole", text: "Medicine is prescribed only after a detailed analysis of the personality and the totality of individual characteristics, physical and mental." },
  { title: "A systematic method", text: "Each case is studied in a scientific and systematic way to reach the most suitable remedy, the similimum." },
  { title: "Care for every age", text: "Homoeopathic medicines are used for all age groups, from children to the elderly." },
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(process.env.MONGODB_URI);
  const res = await Doctor.updateOne(
    { key: "main" },
    {
      $set: {
        entries,
        mission,
        vision,
        approach,
        bio: [
          "Dr. Neeta Parmar is the Chief Homoeopathic Consultant at Dr. Neeta's Homoeo Health Care, Bhavnagar, and at Homeo Health Care & Pharmacy, Ahmedabad.",
          "She graduated from Swami Vivekananda Homoeopathic Medical College, Bhavnagar, in 2011 and completed her post-graduation in Repertory at Ahmedabad Homoeopathic Medical College in 2016. Alongside her clinical practice, she has taught as HOD & Associate Professor of Homoeopathic Pharmacy at Shree Swaminarayan Homoeopathy Medical College, Kalol, since July 2017.",
        ].join("\n\n"),
      },
      $unset: { qualifications: "", experience: "" },
      $setOnInsert: { key: "main", name: "Dr. Neeta Parmar", title: "Chief Homoeopathic Consultant" },
    },
    { upsert: true, strict: false },
  );
  console.log(`Doctor profile: ${entries.length} entries, mission, ${vision.length} vision points, ${approach.length} approach points (matched ${res.matchedCount})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
