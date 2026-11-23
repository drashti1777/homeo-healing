import mongoose, { type Model } from "mongoose";

const { Schema, model, models } = mongoose;

const opts = { timestamps: true } as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any>;
function get(name: string, schema: mongoose.Schema): AnyModel {
  return (models[name] as AnyModel) ?? model(name, schema);
}

const seoFields = { seoTitle: { type: String, default: "" }, seoDescription: { type: String, default: "" } };
const imageFields = { image: { type: String, default: "" }, imageAlt: { type: String, default: "" } };

export const User = get(
  "User",
  new Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      name: { type: String, required: true },
      passwordHash: { type: String, required: true, select: false },
      role: { type: String, enum: ["admin", "editor", "staff"], default: "staff" },
    },
    opts,
  ),
);

const statusHistory = {
  type: [new Schema({ status: String, at: Date, by: String, note: { type: String, default: "" } }, { _id: false })],
  default: [],
};

export const Appointment = get(
  "Appointment",
  new Schema(
    {
      /** Human-friendly reference shown to the patient, e.g. HH-261120-7K4Q. */
      reference: { type: String, unique: true, sparse: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      branch: { type: String, enum: ["bhavnagar", "ahmedabad"], default: "bhavnagar", index: true },
      preferredDate: { type: String, required: true },
      preferredTime: { type: String, enum: ["Morning", "Afternoon", "Evening"], required: true },
      consultationType: { type: String, enum: ["in-clinic", "online", "follow-up"], required: true },
      message: { type: String, default: "" },
      consent: { type: Boolean, required: true },
      /** sha256(email|phone|date) for duplicate-submission protection. */
      fingerprint: { type: String, index: true },
      status: {
        type: String,
        enum: ["pending", "contacted", "confirmed", "cancelled", "completed"],
        default: "pending",
        index: true,
      },
      confirmedDate: { type: String, default: "" },
      confirmedTime: { type: String, default: "" },
      internalNote: { type: String, default: "" },
      statusHistory,
    },
    opts,
  ),
);

export const ContactMessage = get(
  "ContactMessage",
  new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
      subject: { type: String, required: true },
      message: { type: String, required: true },
      consent: { type: Boolean, required: true },
      branch: { type: String, enum: ["bhavnagar", "ahmedabad", "either"], default: "either" },
      fingerprint: { type: String, index: true },
      status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new", index: true },
      internalNote: { type: String, default: "" },
      statusHistory,
    },
    opts,
  ),
);

export const GalleryImage = get(
  "GalleryImage",
  new Schema(
    {
      src: { type: String, required: true },
      alt: { type: String, required: true },
      caption: { type: String, default: "" },
      category: { type: String, enum: ["doctor-profile", "clinic-interior", "clinic-environment", "medical-facilities", "events-activities"], required: true, index: true },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      order: { type: Number, default: 0 },
      isPublished: { type: Boolean, default: true },
      /** Ownership/consent record, e.g. "Original clinic photo, migrated from gallery.php". */
      sourceNote: { type: String, default: "" },
      sourceUrl: { type: String, default: "" },
    },
    opts,
  ),
);

export const Author = get(
  "Author",
  new Schema(
    {
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      credentials: { type: String, default: "" },
      bio: { type: String, default: "" },
      photo: { type: String, default: "" },
      /** Medical reviewers can be selected as an article's reviewer. */
      isMedicalReviewer: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
    },
    opts,
  ),
);

export const Treatment = get(
  "Treatment",
  new Schema(
    {
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      summary: { type: String, required: true },
      body: { type: String, required: true },
      highlights: { type: [String], default: [] },
      /** Condition list, spelling corrected. */
      conditions: { type: [String], default: [] },
      /** Verbatim title and condition text from drneetahomeohealing.com/treatment.php (migration record). */
      originalTitle: { type: String, default: "" },
      originalConditions: { type: String, default: "" },
      group: { type: String, enum: ["general", "life-stages", "mind", "body-systems", "specialist-care"], default: "body-systems", index: true },
      icon: { type: String, default: "leaf" },
      riskLevel: { type: String, enum: ["standard", "specialist"], default: "standard" },
      safetyNotice: { type: String, default: "" },
      ...imageFields,
      order: { type: Number, default: 0 },
      isFeatured: { type: Boolean, default: false },
      isPublished: { type: Boolean, default: true },
      ...seoFields,
    },
    opts,
  ),
);

export const Condition = get(
  "Condition",
  new Schema(
    {
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      summary: { type: String, required: true },
      body: { type: String, required: true },
      seeDoctorFirst: { type: String, required: true },
      relatedTreatments: { type: [String], default: [] },
      order: { type: Number, default: 0 },
      isPublished: { type: Boolean, default: true },
      ...seoFields,
    },
    opts,
  ),
);

export const Article = get(
  "Article",
  new Schema(
    {
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      excerpt: { type: String, required: true },
      body: { type: String, required: true },
      category: { type: String, default: "", index: true },
      tags: { type: [String], default: [] },
      /** Legacy free-text author; new articles use authorSlug (Author collection). */
      author: { type: String, default: "" },
      authorSlug: { type: String, default: "" },
      reviewerSlug: { type: String, default: "" },
      reviewedAt: { type: String, default: "" },
      ...imageFields,
      publishedAt: { type: String, default: "" },
      isPublished: { type: Boolean, default: false },
      ...seoFields,
    },
    opts,
  ),
);

export const Testimonial = get(
  "Testimonial",
  new Schema(
    {
      name: { type: String, required: true },
      location: { type: String, default: "" },
      quote: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
      consentGiven: { type: Boolean, default: false },
      verificationNote: { type: String, default: "" },
      isPublished: { type: Boolean, default: false },
    },
    opts,
  ),
);

export const Faq = get(
  "Faq",
  new Schema(
    {
      question: { type: String, required: true },
      /** Stable anchor for deep links (/faq#slug) and related-question references. */
      slug: { type: String, required: true, unique: true },
      answer: { type: String, required: true },
      category: { type: String, enum: ["about-homeopathy", "medicines-safety", "evidence", "consultations"], default: "about-homeopathy", index: true },
      relatedSlugs: { type: [String], default: [] },
      /** Migration record from drneetahomeohealing.com/faq.php. Never sent to the public site. */
      originalQuestion: { type: String, default: "" },
      originalAnswer: { type: String, default: "" },
      sourceUrl: { type: String, default: "" },
      /** Clinical review workflow. Never sent to the public site. */
      reviewStatus: { type: String, enum: ["pending-review", "clinically-reviewed", "original-unchanged"], default: "pending-review" },
      reviewNote: { type: String, default: "" },
      reviewedBy: { type: String, default: "" },
      reviewedAt: { type: String, default: "" },
      order: { type: Number, default: 0 },
      isPublished: { type: Boolean, default: true },
    },
    opts,
  ),
);

export const SeoPage = get(
  "SeoPage",
  new Schema(
    {
      path: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      ogImage: { type: String, default: "" },
      noIndex: { type: Boolean, default: false },
    },
    opts,
  ),
);

export const Doctor = get(
  "Doctor",
  new Schema(
    {
      key: { type: String, default: "main", unique: true },
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      bio: { type: String, default: "" },
      entries: {
        type: [
          new Schema(
            {
              category: { type: String, enum: ["education", "certification", "experience", "teaching"], required: true },
              year: { type: String, default: "" },
              title: { type: String, required: true },
              institution: { type: String, default: "" },
              description: { type: String, default: "" },
              highlight: { type: Boolean, default: false },
            },
            { _id: false },
          ),
        ],
        default: [],
      },
      mission: { type: String, default: "" },
      vision: { type: [String], default: [] },
      approach: { type: [new Schema({ title: { type: String, required: true }, text: { type: String, default: "" } }, { _id: false })], default: [] },
      registrationNumber: { type: String, default: "" },
      languages: { type: [String], default: [] },
      photo: { type: String, default: "" },
      photoAlt: { type: String, default: "" },
      isPublished: { type: Boolean, default: false },
    },
    opts,
  ),
);

export const Settings = get(
  "Settings",
  new Schema(
    {
      key: { type: String, default: "main", unique: true },
      clinicName: { type: String, default: "Dr. Neeta's Homeo Health Care" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      addressLine: { type: String, default: "" },
      otherAddresses: { type: [String], default: [] },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
      mapUrl: { type: String, default: "" },
      openingHours: { type: [String], default: [] },
      instagramUrl: { type: String, default: "" },
      facebookUrl: { type: String, default: "" },
      youtubeUrl: { type: String, default: "" },
      verifiedStats: { type: [String], default: [] },
      /** Per-branch details. Hours are shown only when hoursVerified is true. */
      branches: {
        type: [
          new Schema(
            {
              key: { type: String, enum: ["bhavnagar", "ahmedabad"], required: true },
              name: { type: String, default: "" },
              address: { type: String, default: "" },
              phone: { type: String, default: "" },
              mapEmbedUrl: { type: String, default: "" },
              mapLinkUrl: { type: String, default: "" },
              hours: { type: [String], default: [] },
              hoursVerified: { type: Boolean, default: false },
            },
            { _id: false },
          ),
        ],
        default: [],
      },
      /**
       * Payment integration stays disabled until every item below has been verified with the clinic's provider.
       * No credentials are stored here; gateway secrets belong in environment variables.
       */
      payment: {
        enabled: { type: Boolean, default: false },
        provider: { type: String, default: "" },
        upiId: { type: String, default: "" },
        merchantVerified: { type: Boolean, default: false },
        amountAndPurposeVerified: { type: Boolean, default: false },
        callbacksVerified: { type: Boolean, default: false },
        notes: { type: String, default: "" },
      },
    },
    opts,
  ),
);
