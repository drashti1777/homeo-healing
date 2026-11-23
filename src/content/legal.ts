export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalDoc = { title: string; description: string; path: string; updated: string; intro: string; sections: LegalSection[] };

const UPDATED = "20 November 2026";

export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  description: "How Dr. Neeta's Homeo Health Care collects, uses and protects the personal information you share through this website.",
  path: "/privacy-policy",
  updated: UPDATED,
  intro: "This policy explains what personal information Dr. Neeta's Homeo Health Care collects through this website, why, and the choices you have. It is a general template and should be reviewed by a qualified legal adviser to make sure it meets the laws that apply to the clinic in its location before launch.",
  sections: [
    { heading: "Information we collect", paragraphs: [
      "When you send an appointment request we collect your name, phone number, email address, preferred date and time, consultation type and any message you choose to write.",
      "When you use the contact form we collect your name, email address, optional phone number, subject and message.",
      "We do not ask you to submit medical records through this website. Please do not include sensitive health details in free-text boxes unless necessary." ] },
    { heading: "How we use your information", paragraphs: [
      "We use the information only to respond to your enquiry, arrange and confirm consultations, and to keep a record of our communication with you.",
      "We do not sell your personal information and we do not use it for third-party advertising." ] },
    { heading: "Storage and security", paragraphs: [
      "Enquiries are stored in a database accessible only to authorised clinic staff who sign in to a protected administration area. We use reasonable technical measures to protect your information, but no online system can be guaranteed to be completely secure." ] },
    { heading: "How long we keep information", paragraphs: [
      "We keep enquiries only for as long as needed to handle your request and meet any legal or professional record-keeping duties. You may ask us to delete your enquiry at any time." ] },
    { heading: "Your rights", paragraphs: [
      "Depending on where you live, you may have the right to access, correct or delete your personal information, or to object to certain uses. To exercise these rights, contact us using the details on our Contact page." ] },
    { heading: "Cookies", paragraphs: [
      "This website uses only a strictly necessary session cookie for staff who sign in to the administration area. Visitors are not tracked with advertising or analytics cookies." ] },
    { heading: "Changes", paragraphs: ["We may update this policy from time to time. The date at the top shows when it was last changed."] },
  ],
};

export const TERMS: LegalDoc = {
  title: "Terms & Conditions",
  description: "The terms that apply to your use of the Dr. Neeta's Homeo Health Care website and appointment request service.",
  path: "/terms-and-conditions",
  updated: UPDATED,
  intro: "By using this website you agree to these terms. They are a general template and should be reviewed by a qualified legal adviser before launch.",
  sections: [
    { heading: "Educational purpose", paragraphs: [
      "Content on this website is provided for general education. It is not medical advice, diagnosis or treatment, and should not be relied on as a substitute for advice from a qualified healthcare professional." ] },
    { heading: "Appointment requests", paragraphs: [
      "Submitting the appointment form sends a request only. An appointment is confirmed only after the clinic has contacted you and agreed a date and time. The clinic may decline or reschedule a request." ] },
    { heading: "No guarantee of outcomes", paragraphs: [
      "We do not guarantee any health outcome. Individual experiences differ, and nothing on this website promises that a treatment will cure, prevent or relieve any condition." ] },
    { heading: "Acceptable use", paragraphs: [
      "You agree not to misuse the website, attempt to gain unauthorised access, submit false or harmful content, or use automated tools to overload the service." ] },
    { heading: "Intellectual property", paragraphs: [
      "Text, design and images on this website belong to Dr. Neeta's Homeo Health Care or its licensors. You may not copy or republish them without written permission." ] },
    { heading: "Limitation of liability", paragraphs: [
      "To the extent permitted by law, Dr. Neeta's Homeo Health Care is not liable for loss arising from your use of, or reliance on, the information on this website. Nothing in these terms limits liability that cannot lawfully be limited." ] },
    { heading: "Changes and governing law", paragraphs: [
      "We may update these terms from time to time. They are governed by the laws that apply where the clinic is located." ] },
  ],
};

export const DISCLAIMER: LegalDoc = {
  title: "Medical Disclaimer",
  description: "Important information about the educational nature of Dr. Neeta's Homeo Health Care content and the limits of homeopathy.",
  path: "/medical-disclaimer",
  updated: UPDATED,
  intro: "Please read this disclaimer carefully before using any information on this website.",
  sections: [
    { heading: "Not medical advice", paragraphs: [
      "Everything on this website is for general educational purposes only. It is not medical advice and does not create a doctor–patient relationship. It must not be used to diagnose, treat, cure or prevent any disease." ] },
    { heading: "About homeopathy", paragraphs: [
      "Homeopathy is a complementary approach. Major health bodies and systematic reviews have not found reliable evidence that homeopathic remedies are effective for treating health conditions beyond placebo. Homeopathy should not replace evidence-based medical care." ] },
    { heading: "Do not delay or stop medical care", paragraphs: [
      "Never ignore professional medical advice, delay seeking it, or stop or change prescribed medication because of something you have read here. Speak to your doctor before making any change to your care." ] },
    { heading: "Emergencies", paragraphs: [
      "This website is not for medical emergencies. If you think you or someone else may have a medical emergency, call your local emergency number immediately." ] },
    { heading: "Individual results", paragraphs: [
      "Experiences differ between people. Any patient experiences shown are shared with permission and are not a guarantee or prediction of results." ] },
    { heading: "Pregnancy, children and long-term conditions", paragraphs: [
      "If you are pregnant, breastfeeding, caring for a child or living with a serious or long-term condition, speak with a qualified healthcare professional before using any complementary approach." ] },
  ],
};
