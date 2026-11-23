import { z } from "zod";

export const TIME_SLOTS = ["Morning", "Afternoon", "Evening"] as const;
export const CONSULTATION_TYPES = ["in-clinic", "online", "follow-up"] as const;
export const CONSULTATION_LABELS: Record<(typeof CONSULTATION_TYPES)[number], string> = {
  "in-clinic": "In-clinic consultation",
  online: "Online consultation",
  "follow-up": "Follow-up consultation",
};
export const APPOINTMENT_STATUSES = ["pending", "contacted", "confirmed", "cancelled", "completed"] as const;
export const CONTACT_STATUSES = ["new", "read", "replied", "archived"] as const;
export const ROLES = ["admin", "editor", "staff"] as const;

function isoDay(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const phone = z
  .string()
  .trim()
  .refine((val) => {
    const digits = val.replace(/\D/g, "");
    const hasOnlyValidChars = /^(\+91)?[\d\s-]*$/.test(val);
    if (!hasOnlyValidChars) return false;
    if (val.startsWith("+91")) {
      return digits.length === 12 && digits.startsWith("91");
    }
    return digits.length === 10;
  }, "Please enter a valid 10-digit phone number")
  .transform((val) => {
    const digits = val.replace(/\D/g, "");
    const clean10 = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
    return `+91 ${clean10}`;
  });

/* ------------------------------ Public forms ----------------------------- */

export const BRANCHES = ["bhavnagar", "ahmedabad"] as const;
export const BRANCH_LABELS: Record<(typeof BRANCHES)[number], string> = { bhavnagar: "Bhavnagar", ahmedabad: "Ahmedabad" };

export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone,
  email: z.email("Enter a valid email address").max(200),
  branch: z.enum(BRANCHES, { error: "Choose a preferred branch" }),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a preferred date")
    // one day of grace so timezone differences never reject a valid "today"
    .refine((d) => d >= isoDay(-1), "Please choose today or a later date")
    .refine((d) => d <= isoDay(365), "Please choose a date within the next year"),
  preferredTime: z.enum(TIME_SLOTS, { error: "Choose a preferred time" }),
  consultationType: z.enum(CONSULTATION_TYPES, { error: "Choose a consultation type" }),
  message: z.string().trim().max(1000, "Please keep your message under 1000 characters"),
  consent: z.literal(true, { error: "Please agree so we can contact you about this request" }),
  website: z.string().max(500).optional(), // honeypot: real users leave it empty; filled = bot, dropped silently by the API
});
export type AppointmentInput = z.infer<typeof appointmentSchema>;

// Fields follow the original contact form: Full Name, E-mail Address, Phone No, Message (plus consent).
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.email("Enter a valid email address").max(200),
  phone,
  branch: z.enum(["bhavnagar", "ahmedabad", "either"]).default("either"),
  subject: z.string().trim().max(150).default(""),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(2000),
  consent: z.literal(true, { error: "Please agree so we can reply to you" }),
  website: z.string().max(500).optional(), // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password").max(200),
});

/* ----------------------------- Admin content ----------------------------- */

const str = (max: number) => z.string().trim().max(max).default("");
const lines = (maxItems = 30, maxLen = 300) =>
  z.array(z.string().trim().min(1).max(maxLen)).max(maxItems).default([]);
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only")
  .max(120);
const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/media/") || /^https:\/\//.test(v), "Use an uploaded image or an https URL")
  .default("");
const seo = { seoTitle: str(70), seoDescription: str(170) };

/** Filter groups on /treatments. */
export const TREATMENT_GROUPS = ["general", "life-stages", "mind", "body-systems", "specialist-care"] as const;
export const TREATMENT_GROUP_LABELS: Record<(typeof TREATMENT_GROUPS)[number], string> = {
  general: "General consultations",
  "life-stages": "Women, children & older adults",
  mind: "Mind & dependence",
  "body-systems": "Body systems",
  "specialist-care": "Specialist medical care",
};
/** Icon keys rendered by src/components/TreatmentIcon.tsx. */
export const TREATMENT_ICONS = ["leaf", "wine", "ribbon", "brain", "baby", "hand", "venus", "pregnancy", "elderly", "lungs", "endocrine", "heart", "neuro", "kidney", "bone", "gut", "liver", "stethoscope"] as const;
/**
 * "standard": general educational notice.
 * "specialist": condition list includes serious diseases; page shows a prominent "seek qualified medical care" notice.
 */
export const RISK_LEVELS = ["standard", "specialist"] as const;

export const treatmentSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug,
  summary: z.string().trim().min(10).max(300),
  body: z.string().trim().min(20).max(20000),
  highlights: lines(10),
  conditions: lines(30, 160),
  originalTitle: str(160),
  originalConditions: str(1000),
  group: z.enum(TREATMENT_GROUPS).default("body-systems"),
  icon: z.enum(TREATMENT_ICONS).default("leaf"),
  riskLevel: z.enum(RISK_LEVELS).default("standard"),
  safetyNotice: str(1500),
  image: imageUrl,
  imageAlt: str(160),
  order: z.number().int().min(0).max(999).default(0),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  ...seo,
});

export const conditionSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug,
  summary: z.string().trim().min(10).max(300),
  body: z.string().trim().min(20).max(20000),
  seeDoctorFirst: z.string().trim().min(10, "Describe when to seek urgent or conventional care first").max(2000),
  relatedTreatments: lines(10, 120),
  order: z.number().int().min(0).max(999).default(0),
  isPublished: z.boolean().default(true),
  ...seo,
});

export const articleSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    slug,
    excerpt: z.string().trim().min(10).max(300),
    body: z.string().trim().min(50).max(50000),
    category: z.union([z.enum(["homeopathy-basics", "wellbeing", "nutrition-lifestyle", "women-children", "clinic-news"]), z.literal("")]).default(""),
    tags: lines(10, 40),
    authorSlug: str(120),
    reviewerSlug: str(120),
    reviewedAt: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]).default(""),
    image: imageUrl,
    imageAlt: str(160),
    publishedAt: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date"), z.literal("")]).default(""),
    isPublished: z.boolean().default(false),
    ...seo,
  })
  // Health articles may only go live once a medical reviewer and review date are recorded.
  .refine((a) => !a.isPublished || a.category === "clinic-news" || (a.reviewerSlug && a.reviewedAt), {
    message: "Health articles need a medical reviewer and review date before they can be published",
    path: ["reviewerSlug"],
  })
  .refine((a) => !a.isPublished || a.authorSlug, { message: "Choose an author before publishing", path: ["authorSlug"] })
  .refine((a) => !a.isPublished || a.imageAlt || !a.image, { message: "Add image alt text", path: ["imageAlt"] });

export const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(100),
  location: str(100),
  quote: z.string().trim().min(10).max(2500),
  isVerified: z.boolean().default(false),
  consentGiven: z.boolean().default(false),
  verificationNote: str(500),
  isPublished: z.boolean().default(false),
});

export const FAQ_CATEGORIES = ["about-homeopathy", "medicines-safety", "evidence", "consultations"] as const;
export const FAQ_CATEGORY_LABELS: Record<(typeof FAQ_CATEGORIES)[number], string> = {
  "about-homeopathy": "About homeopathy",
  "medicines-safety": "Medicines & safety",
  evidence: "Scientific evidence",
  consultations: "Consultations & appointments",
};
/**
 * pending-review: answer is a proposed rewrite awaiting clinical sign-off.
 * clinically-reviewed: a clinician has approved the published answer.
 * original-unchanged: published answer equals the original (factual, no claims).
 */
export const FAQ_REVIEW_STATUSES = ["pending-review", "clinically-reviewed", "original-unchanged"] as const;

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  slug,
  answer: z.string().trim().min(10).max(3000),
  category: z.enum(FAQ_CATEGORIES).default("about-homeopathy"),
  relatedSlugs: lines(5, 120),
  // originalQuestion / originalAnswer / sourceUrl are migration records: set only by scripts/migrate-faqs.ts,
  // deliberately not accepted from the admin API so an edit can never overwrite them.
  reviewStatus: z.enum(FAQ_REVIEW_STATUSES).default("pending-review"),
  reviewNote: str(2000),
  reviewedBy: str(120),
  reviewedAt: str(10),
  order: z.number().int().min(0).max(999).default(0),
  isPublished: z.boolean().default(true),
});

export const seoPageSchema = z.object({
  path: z
    .string()
    .trim()
    .regex(/^\/[a-z0-9\-/]*$/, "Start with / and use lowercase letters, numbers, hyphens")
    .max(200),
  title: z.string().trim().min(3).max(70),
  description: z.string().trim().min(20).max(170),
  ogImage: imageUrl,
  noIndex: z.boolean().default(false),
});

export const DOCTOR_ENTRY_CATEGORIES = ["education", "certification", "experience", "teaching"] as const;
export type DoctorEntryCategory = (typeof DOCTOR_ENTRY_CATEGORIES)[number];

const doctorEntrySchema = z.object({
  category: z.enum(DOCTOR_ENTRY_CATEGORIES),
  year: str(40),
  title: z.string().trim().min(2, "Each entry needs a title").max(160),
  institution: str(250),
  description: str(1000),
  /** Shown in the "Achievements" section of the About page. */
  highlight: z.boolean().default(false),
});

const approachItemSchema = z.object({
  title: z.string().trim().min(2, "Each approach item needs a title").max(100),
  text: str(600),
});

export const doctorSchema = z.object({
  name: str(100),
  title: str(120),
  bio: str(6000),
  entries: z.array(doctorEntrySchema).max(40).default([]),
  mission: str(2000),
  vision: lines(6, 400),
  approach: z.array(approachItemSchema).max(8).default([]),
  registrationNumber: str(100),
  languages: lines(10, 60),
  photo: imageUrl,
  photoAlt: str(160),
  isPublished: z.boolean().default(false),
});

/* --------------------------------- Payment ---------------------------------- */

export const paymentSettingsSchema = z
  .object({
    enabled: z.boolean().default(false),
    provider: str(80),
    upiId: z.union([z.string().trim().regex(/^[\w.-]{2,64}@[a-zA-Z]{2,32}$/, "Use a valid UPI ID (name@bank)"), z.literal("")]).default(""),
    merchantVerified: z.boolean().default(false),
    amountAndPurposeVerified: z.boolean().default(false),
    callbacksVerified: z.boolean().default(false),
    notes: str(2000),
  })
  .refine((p) => !p.enabled || (p.provider && p.merchantVerified && p.amountAndPurposeVerified && p.callbacksVerified), {
    message: "Payments can only be enabled after the provider, merchant account, amount/purpose and callbacks are all verified",
    path: ["enabled"],
  });

export const branchSchema = z.object({
  key: z.enum(BRANCHES),
  name: str(120),
  address: str(300),
  phone: z.union([phone, z.literal("")]).default(""),
  mapEmbedUrl: z.union([z.string().trim().regex(/^https:\/\/www\.google\.com\/maps\/embed\?/, "Paste the https://www.google.com/maps/embed?… URL from Google Maps → Share → Embed"), z.literal("")]).default(""),
  mapLinkUrl: z.union([z.url({ protocol: /^https$/ }), z.literal("")]).default(""),
  hours: lines(10, 100),
  hoursVerified: z.boolean().default(false),
});

export const userCreateSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(2).max(100),
  role: z.enum(ROLES),
  password: z.string().min(12, "Use at least 12 characters").max(200),
});

export const settingsSchema = z.object({
  clinicName: z.string().trim().min(2).max(100).default("Dr. Neeta's Homeo Health Care"),
  phone: z.union([phone, z.literal("")]).default(""),
  email: z.union([z.email(), z.literal("")]).default(""),
  addressLine: str(200),
  otherAddresses: lines(5, 250),
  city: str(80),
  state: str(80),
  postalCode: str(20),
  country: str(80),
  mapUrl: z.union([z.url({ protocol: /^https$/ }), z.literal("")]).default(""),
  openingHours: lines(10, 100),
  instagramUrl: z.union([z.url({ protocol: /^https$/ }), z.literal("")]).default(""),
  facebookUrl: z.union([z.url({ protocol: /^https$/ }), z.literal("")]).default(""),
  youtubeUrl: z.union([z.url({ protocol: /^https$/ }), z.literal("")]).default(""),
  /** one per line: value|suffix|label  e.g.  1200|+|Consultations completed (verified numbers only) */
  verifiedStats: z
    .array(z.string().regex(/^\d{1,9}\|[^|]{0,3}\|.{2,60}$/, "Use the format: value|suffix|label"))
    .max(4)
    .default([]),
  branches: z.array(branchSchema).max(2).default([]),
  payment: paymentSettingsSchema.optional(),
});

export const appointmentAdminSchema = z
  .object({
    status: z.enum(APPOINTMENT_STATUSES),
    confirmedDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date"), z.literal("")]).default(""),
    confirmedTime: str(40),
    internalNote: str(2000),
  })
  .refine((v) => v.status !== "confirmed" || (v.confirmedDate && v.confirmedTime), {
    message: "Enter the agreed date and time before marking an appointment as confirmed",
    path: ["confirmedDate"],
  });
export const contactAdminSchema = z.object({
  status: z.enum(CONTACT_STATUSES),
  internalNote: str(2000),
});

/* ---------------------------------- Gallery --------------------------------- */

export const GALLERY_CATEGORIES = ["doctor-profile", "clinic-interior", "clinic-environment", "medical-facilities", "events-activities"] as const;
export const GALLERY_CATEGORY_LABELS: Record<(typeof GALLERY_CATEGORIES)[number], string> = {
  "doctor-profile": "Doctor Profile",
  "clinic-interior": "Clinic Interior",
  "clinic-environment": "Clinic Environment",
  "medical-facilities": "Medical Facilities",
  "events-activities": "Events and Activities",
};
export const galleryImageSchema = z.object({
  src: imageUrl.refine((v) => v !== "", "Upload an image"),
  alt: z.string().trim().min(5, "Describe the image for screen readers").max(200),
  caption: str(300),
  category: z.enum(GALLERY_CATEGORIES),
  width: z.number().int().min(0).max(20000).default(0),
  height: z.number().int().min(0).max(20000).default(0),
  order: z.number().int().min(0).max(9999).default(0),
  isPublished: z.boolean().default(true),
  sourceNote: str(500),
});
export const reorderSchema = z.object({ ids: z.array(z.string().regex(/^[a-f0-9]{24}$/)).min(1).max(500) });

/* ----------------------------------- Blog ----------------------------------- */

export const ARTICLE_CATEGORIES = ["homeopathy-basics", "wellbeing", "nutrition-lifestyle", "women-children", "clinic-news"] as const;
export const ARTICLE_CATEGORY_LABELS: Record<(typeof ARTICLE_CATEGORIES)[number], string> = {
  "homeopathy-basics": "Homeopathy basics",
  wellbeing: "Everyday wellbeing",
  "nutrition-lifestyle": "Nutrition & lifestyle",
  "women-children": "Women & children",
  "clinic-news": "Clinic news",
};
export const authorSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug,
  credentials: str(200),
  bio: str(2000),
  photo: imageUrl,
  isMedicalReviewer: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
