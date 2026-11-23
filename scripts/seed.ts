/**
 * Creates the first admin user and a small amount of safe starter content.
 * Run:  npm run seed      (needs MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local)
 *
 * It never invents doctor details, testimonials or statistics. Those stay empty until the clinic adds real ones.
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Condition, Faq, Settings, Treatment, User } from "../src/lib/models";

async function main() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(MONGODB_URI);

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    if (ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
    const email = ADMIN_EMAIL.toLowerCase();
    if (!(await User.findOne({ email }))) {
      await User.create({ email, name: "Administrator", role: "admin", passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12) });
      console.log(`Created admin user ${email}`);
    } else console.log(`Admin ${email} already exists`);
  } else console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set, skipping admin creation");

  await Settings.updateOne({ key: "main" }, { $setOnInsert: { key: "main", clinicName: "Dr. Neeta's Homeo Health Care" } }, { upsert: true });

  if ((await Treatment.countDocuments()) === 0) {
    await Treatment.insertMany([
      {
        title: "Initial homeopathic consultation", slug: "initial-consultation", order: 1, isFeatured: true,
        summary: "A longer first conversation about your health history, symptoms and daily life.",
        highlights: ["Time to talk through your concerns", "Questions about sleep, energy, stress and diet", "A discussion of options and what to expect", "No promises of cure or specific results"],
        body: "## What happens\n\nYour first consultation is a detailed conversation. Your doctor will ask about your symptoms, medical history, medicines you already take, sleep, appetite, energy and emotional wellbeing.\n\n## What to expect\n\nAt the end, your doctor may suggest a homeopathic remedy and a follow-up plan, and will explain what it can and cannot be expected to do.\n\n## Important\n\nHomeopathy is a complementary approach and the scientific evidence for its effectiveness is limited. Please keep taking any prescribed medicine and keep seeing your doctor. Do not stop or change treatment without medical advice.",
      },
      {
        title: "Follow-up consultation", slug: "follow-up-consultation", order: 2, isFeatured: true,
        summary: "A shorter review to talk through how you are feeling and whether anything should change.",
        highlights: ["Review since your last visit", "Open discussion of any changes", "Shared decisions about next steps"],
        body: "## Reviewing together\n\nFollow-up consultations look at how you have been since your last appointment and whether the plan should stay the same or change.\n\n## Your wider care\n\nWe will always ask about any conventional care you are receiving and encourage you to keep your other clinicians informed.",
      },
      {
        title: "Online consultation", slug: "online-consultation", order: 3, isFeatured: true,
        summary: "A video or phone consultation for people who cannot easily visit in person.",
        highlights: ["Convenient if you live far away", "Same unhurried conversation", "Not suitable for urgent or emergency problems"],
        body: "## How it works\n\nAfter your request is confirmed by the clinic, you will be told how to join the call.\n\n## Limits\n\nSome concerns need an in-person examination or urgent care. If so, we will say so and suggest seeing your doctor or local urgent care service.",
      },
    ]);
    console.log("Added starter treatments");
  }

  if ((await Condition.countDocuments()) === 0) {
    await Condition.insertMany([
      {
        title: "Stress and sleep difficulties", slug: "stress-and-sleep", order: 1,
        summary: "Everyday stress and poor sleep are common. Here is what is worth knowing.",
        seeDoctorFirst: "Seek medical advice if you have persistent low mood, thoughts of self-harm, severe or worsening anxiety, sleep problems lasting more than a few weeks, or if stress is affecting your ability to function. In a crisis, contact your local emergency or crisis service.",
        body: "## Overview\n\nMost people have periods of stress or poor sleep. Habits such as regular sleep times, daylight, movement and limiting late caffeine are widely recommended.\n\n## Where a consultation may fit\n\nSome people find it helpful to talk through stress and routines in an unhurried consultation. We cannot promise that homeopathy will improve stress or sleep, and the scientific evidence that homeopathic remedies work beyond placebo is limited.\n\n## Working with your doctor\n\nPersistent symptoms deserve a proper medical assessment to rule out other causes.",
      },
      {
        title: "Seasonal coughs and colds", slug: "coughs-and-colds", order: 2,
        summary: "Most coughs and colds pass on their own. Know the signs that need medical attention.",
        seeDoctorFirst: "Seek urgent care for difficulty breathing, chest pain, blue lips, confusion, high fever that does not settle, symptoms in babies or very young children, or if you have a long-term lung or heart condition. See a doctor if symptoms last more than a couple of weeks.",
        body: "## Overview\n\nMost coughs and colds are caused by viruses and improve with rest, fluids and time.\n\n## Our approach\n\nWe can discuss comfort measures and answer your questions. We do not claim homeopathy treats or prevents infections, and it is not a substitute for vaccination or medical care.",
      },
    ]);
    console.log("Added starter health conditions");
  }

  if ((await Faq.countDocuments()) === 0) {
    await Faq.insertMany([
      { order: 1, question: "Is homeopathy scientifically proven?", answer: "No. Major health bodies and systematic reviews have not found reliable evidence that homeopathic remedies work better than placebo for treating health conditions. We think you should know this before deciding whether a consultation is right for you." },
      { order: 2, question: "Can I use homeopathy instead of my prescribed medicine?", answer: "No. Please never stop or change prescribed medicine without advice from your doctor. Homeopathy here is offered as a complementary approach only." },
      { order: 3, question: "What happens in a first consultation?", answer: "It is a detailed conversation about your symptoms, health history, sleep, energy, emotional wellbeing and daily life. Your doctor explains any suggestions and what to expect." },
      { order: 4, question: "Does sending the appointment form book my appointment?", answer: "No. The form sends a request. Your appointment is confirmed only once the clinic has contacted you and agreed a time." },
      { order: 5, question: "Is this website a substitute for medical advice?", answer: "No. Everything here is educational. For urgent or emergency problems contact your local emergency services." },
    ]);
    console.log("Added starter FAQs");
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
