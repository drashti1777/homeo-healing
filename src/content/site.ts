export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/treatments", label: "Treatments" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/pay-now", label: "Pay Now" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  Categories: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/treatments", label: "Treatment" },
    { href: "/faq", label: "FAQ" },
  ],
  Links: [
    { href: "/gallery", label: "Gallery" },
    { href: "/pay-now", label: "Pay Now" },
    { href: "/contact", label: "Contact Us" },
  ],
} as const;

export const DISCLAIMER_SHORT =
  "The information on this website is for education only. It is not medical advice and does not replace care from a qualified healthcare professional. In an emergency, contact your local emergency services.";

export const APPROACH = [
  { title: "Listen first", text: "Your first consultation is a conversation about your health history, daily life and concerns, not a checklist." },
  { title: "Consider the whole person", text: "Sleep, stress, diet and emotional wellbeing are discussed alongside your physical symptoms." },
  { title: "Work alongside your other care", text: "Homeopathy here is complementary. We encourage you to keep seeing your GP or specialist and never to stop prescribed treatment without their advice." },
  { title: "Review and adjust", text: "Follow-up conversations let us look at how you are doing and decide together what, if anything, to change." },
];

export const PROCESS = [
  { title: "Request a consultation", text: "Send an enquiry with your preferred date and time. The clinic contacts you to arrange a slot." },
  { title: "Share your story", text: "A detailed conversation about your health, history, lifestyle and what matters most to you." },
  { title: "Agree a plan", text: "Your doctor explains the suggested approach, what to expect, and how it fits with any conventional care." },
  { title: "Follow up", text: "Regular reviews to talk through how you feel and whether anything should change." },
];

export const WHY = [
  { title: "Honest expectations", text: "We do not promise cures or guaranteed outcomes. You get plain information about what homeopathy can and cannot offer." },
  { title: "Unhurried consultations", text: "Time to explain your concerns properly and ask your questions." },
  { title: "Safety first", text: "We tell you when a concern needs urgent or conventional medical attention before anything else." },
  { title: "Clear, educational content", text: "Our articles explain; they do not diagnose or replace your clinician." },
];

export const HOMEOPATHY_SECTIONS = [
  {
    title: "What is homeopathy?",
    body: [
      "Homeopathy is a system of complementary medicine developed in the late 18th century by Samuel Hahnemann. Its central idea, often summarised as \"like cures like\", is that a substance that causes certain symptoms in a healthy person may be used in a very dilute form to address similar symptoms in someone who is unwell.",
      "Remedies are made from plant, mineral and animal sources through repeated dilution and shaking, a process called potentisation.",
    ],
  },
  {
    title: "What does the scientific evidence say?",
    body: [
      "Homeopathy remains scientifically controversial. Major health bodies and systematic reviews have not found reliable evidence that homeopathic remedies work better than placebo for treating health conditions. Some people nonetheless report feeling better after a consultation, and the time and attention involved may play a part.",
      "We share this openly because you deserve to make informed choices. Homeopathy should not be used in place of evidence-based treatment for serious or long-term conditions.",
    ],
  },
  {
    title: "How a homeopathic consultation works",
    body: [
      "A first consultation is usually longer than a typical medical appointment. The practitioner asks about your symptoms, medical history, sleep, energy, appetite, emotional wellbeing and daily life. Based on this conversation, a remedy and a follow-up plan may be suggested.",
      "Follow-up appointments review how you are feeling and whether anything should change.",
    ],
  },
  {
    title: "Using homeopathy safely",
    body: [
      "Tell your doctor and your homeopath about everything you are taking, including prescribed medicines and supplements.",
      "Never stop or reduce prescribed medication because of anything you have read here. Do not delay seeing a doctor for new, severe, worsening or persistent symptoms. Vaccination and other preventive care should follow advice from qualified medical professionals.",
    ],
  },
];

export const EMERGENCY_NOTE =
  "If you or someone else has chest pain, difficulty breathing, signs of stroke, severe bleeding, a serious injury, thoughts of self-harm or any sudden severe symptom, contact your local emergency services immediately. Do not wait for a homeopathic consultation.";
