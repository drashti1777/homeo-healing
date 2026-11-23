import { connectDb } from "./db";
import { Article, Author, Condition, Doctor, Faq, GalleryImage, SeoPage, Settings, Testimonial, Treatment } from "./models";

/** Mongoose documents -> plain JSON-safe objects (ObjectId/Date become strings). */
function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export type TreatmentDoc = {
  _id: string; title: string; slug: string; summary: string; body: string; highlights: string[];
  conditions: string[]; originalTitle: string; originalConditions: string;
  group: "general" | "life-stages" | "mind" | "body-systems" | "specialist-care";
  icon: string; riskLevel: "standard" | "specialist"; safetyNotice: string;
  image: string; imageAlt: string; order: number; isFeatured: boolean; isPublished: boolean;
  seoTitle: string; seoDescription: string; updatedAt: string;
};
export type ConditionDoc = {
  _id: string; title: string; slug: string; summary: string; body: string; seeDoctorFirst: string;
  relatedTreatments: string[]; order: number; isPublished: boolean; seoTitle: string; seoDescription: string; updatedAt: string;
};
export type ArticleDoc = {
  _id: string; title: string; slug: string; excerpt: string; body: string; category: string; tags: string[]; author: string;
  authorSlug: string; reviewerSlug: string; reviewedAt: string;
  image: string; imageAlt: string; publishedAt: string; isPublished: boolean; seoTitle: string; seoDescription: string; updatedAt: string;
};
export type AuthorDoc = { _id: string; name: string; slug: string; credentials: string; bio: string; photo: string; isMedicalReviewer: boolean; isActive: boolean };
export type GalleryImageDoc = { _id: string; src: string; alt: string; caption: string; category: string; width: number; height: number; order: number };
export type BranchDoc = { key: "bhavnagar" | "ahmedabad"; name: string; address: string; phone: string; mapEmbedUrl: string; mapLinkUrl: string; hours: string[]; hoursVerified: boolean };
export type PaymentSettings = { enabled: boolean; provider: string; upiId: string; merchantVerified: boolean; amountAndPurposeVerified: boolean; callbacksVerified: boolean; notes: string };
export type TestimonialDoc = {
  _id: string; name: string; location: string; quote: string; isVerified: boolean; consentGiven: boolean;
  verificationNote: string; isPublished: boolean;
};
export type FaqDoc = {
  _id: string; question: string; slug: string; answer: string; order: number; isPublished: boolean;
  category: "about-homeopathy" | "medicines-safety" | "evidence" | "consultations"; relatedSlugs: string[];
};
export type DoctorEntry = {
  category: "education" | "certification" | "experience" | "teaching";
  year: string; title: string; institution: string; description: string; highlight: boolean;
};
export type DoctorDoc = {
  name: string; title: string; bio: string; entries: DoctorEntry[]; mission: string; vision: string[];
  approach: { title: string; text: string }[]; registrationNumber: string;
  languages: string[]; photo: string; photoAlt: string; isPublished: boolean;
};
export type SettingsDoc = {
  clinicName: string; phone: string; email: string; addressLine: string; otherAddresses: string[]; city: string; state: string; postalCode: string;
  country: string; mapUrl: string; openingHours: string[]; instagramUrl: string; facebookUrl: string; youtubeUrl: string;
  verifiedStats: string[]; branches: BranchDoc[]; payment?: PaymentSettings;
};
export type SeoPageDoc = { path: string; title: string; description: string; ogImage: string; noIndex: boolean };

export const defaultSettings: SettingsDoc = {
  clinicName: "Dr. Neeta's Homeo Health Care", phone: "", email: "", addressLine: "", otherAddresses: [], city: "", state: "", postalCode: "", country: "",
  mapUrl: "", openingHours: [], instagramUrl: "", facebookUrl: "", youtubeUrl: "", verifiedStats: [], branches: [],
};

export async function getSettings(): Promise<SettingsDoc> {
  try {
    await connectDb();
    const s = await Settings.findOne({ key: "main" }).lean();
    if (!s) return defaultSettings;
    const doc = { ...defaultSettings, ...plain<SettingsDoc>(s) };
    // Payment configuration is admin-only; the public site only needs to know whether it is enabled.
    if (doc.payment) doc.payment = { ...doc.payment, notes: "" };
    return doc;
  } catch (err) {
    return defaultSettings;
  }
}

export async function getTreatments(opts: { featured?: boolean } = {}): Promise<TreatmentDoc[]> {
  try {
    await connectDb();
    const q: Record<string, unknown> = { isPublished: true };
    if (opts.featured) q.isFeatured = true;
    return plain(await Treatment.find(q).sort({ order: 1, title: 1 }).lean());
  } catch (err) {
    return [];
  }
}
export async function getTreatment(slug: string): Promise<TreatmentDoc | null> {
  try {
    await connectDb();
    const d = await Treatment.findOne({ slug, isPublished: true }).lean();
    return d ? plain(d) : null;
  } catch (err) {
    return null;
  }
}

export async function getConditions(): Promise<ConditionDoc[]> {
  try {
    await connectDb();
    return plain(await Condition.find({ isPublished: true }).sort({ order: 1, title: 1 }).lean());
  } catch (err) {
    return [];
  }
}
export async function getCondition(slug: string): Promise<ConditionDoc | null> {
  try {
    await connectDb();
    const d = await Condition.findOne({ slug, isPublished: true }).lean();
    return d ? plain(d) : null;
  } catch (err) {
    return null;
  }
}

export async function getArticles(limit = 0): Promise<ArticleDoc[]> {
  try {
    await connectDb();
    const q = Article.find({ isPublished: true }).sort({ publishedAt: -1, createdAt: -1 });
    return plain(await (limit ? q.limit(limit) : q).lean());
  } catch (err) {
    return [];
  }
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Paginated, filterable article listing for /blog. Search uses an escaped regex (no user regex injection). */
export async function searchArticles(opts: { q?: string; category?: string; page?: number; perPage?: number }) {
  try {
    await connectDb();
    const perPage = Math.min(Math.max(opts.perPage ?? 9, 1), 24);
    const filter: Record<string, unknown> = { isPublished: true };
    if (opts.category) filter.category = opts.category;
    const q = (opts.q ?? "").trim().slice(0, 80);
    if (q) {
      const re = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: re }, { excerpt: re }, { body: re }, { tags: re }];
    }
    const total = await Article.countDocuments(filter);
    const pages = Math.max(1, Math.ceil(total / perPage));
    const page = Math.min(Math.max(opts.page ?? 1, 1), pages);
    const items = await Article.find(filter).select("-body").sort({ publishedAt: -1, createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).lean();
    return { items: plain<ArticleDoc[]>(items), total, page, pages };
  } catch (err) {
    return { items: [], total: 0, page: 1, pages: 1 };
  }
}

export async function getArticle(slug: string): Promise<ArticleDoc | null> {
  try {
    await connectDb();
    const d = await Article.findOne({ slug, isPublished: true }).lean();
    return d ? plain(d) : null;
  } catch (err) {
    return null;
  }
}

export async function getRelatedArticles(a: ArticleDoc, limit = 3): Promise<ArticleDoc[]> {
  try {
    await connectDb();
    const related = await Article.find({ isPublished: true, slug: { $ne: a.slug }, $or: [{ category: a.category }, { tags: { $in: a.tags ?? [] } }] })
      .select("-body").sort({ publishedAt: -1 }).limit(limit).lean();
    return plain(related);
  } catch (err) {
    return [];
  }
}

export async function getAuthors(): Promise<AuthorDoc[]> {
  try {
    await connectDb();
    return plain(await Author.find({ isActive: true }).sort({ name: 1 }).lean());
  } catch (err) {
    return [];
  }
}

export async function getGalleryImages(): Promise<GalleryImageDoc[]> {
  try {
    await connectDb();
    return plain(await GalleryImage.find({ isPublished: true }).select("src alt caption category width height order").sort({ order: 1, createdAt: 1 }).lean());
  } catch (err) {
    return [];
  }
}

/** Branches configured in Settings, falling back to the legacy address fields. Hours are hidden unless verified. */
export function branchesFrom(s: SettingsDoc): BranchDoc[] {
  if (s.branches?.length) return s.branches.map((b) => ({ ...b, hours: b.hoursVerified ? b.hours : [] }));
  const bhav = [s.addressLine, s.city, s.state].filter(Boolean).join(", ");
  return [
    ...(bhav ? [{ key: "bhavnagar" as const, name: s.clinicName, address: bhav, phone: s.phone, mapEmbedUrl: "", mapLinkUrl: "", hours: [], hoursVerified: false }] : []),
    ...s.otherAddresses.map((a) => ({ key: "ahmedabad" as const, name: "Homeo Health Care & Pharmacy", address: a, phone: s.phone, mapEmbedUrl: "", mapLinkUrl: "", hours: [], hoursVerified: false })),
  ];
}

/** Only testimonials that are published, verified AND have recorded patient consent are ever shown. */
export async function getTestimonials(): Promise<TestimonialDoc[]> {
  try {
    await connectDb();
    return plain(await Testimonial.find({ isPublished: true, isVerified: true, consentGiven: true }).sort({ createdAt: -1 }).lean());
  } catch (err) {
    return [];
  }
}

export async function getFaqs(): Promise<FaqDoc[]> {
  try {
    await connectDb();
    // Public projection only: migration and review fields stay in the admin.
    return plain(
      await Faq.find({ isPublished: true })
        .select("question slug answer category relatedSlugs order isPublished")
        .sort({ order: 1, createdAt: 1 })
        .lean(),
    );
  } catch (err) {
    return [];
  }
}

export async function getDoctor(): Promise<DoctorDoc | null> {
  try {
    await connectDb();
    const d = await Doctor.findOne({ key: "main" }).lean();
    if (!d) return null;
    const raw = plain<Partial<DoctorDoc>>(d);
    const doc: DoctorDoc = {
      name: "", title: "", bio: "", registrationNumber: "", photo: "", photoAlt: "", mission: "", isPublished: false,
      ...raw,
      entries: raw.entries ?? [], vision: raw.vision ?? [], approach: raw.approach ?? [], languages: raw.languages ?? [],
    };
    return doc.isPublished && doc.name ? doc : null;
  } catch (err) {
    return null;
  }
}

export async function getSeoPage(path: string): Promise<SeoPageDoc | null> {
  try {
    await connectDb();
    const d = await SeoPage.findOne({ path }).lean();
    return d ? plain(d) : null;
  } catch (err) {
    return null;
  }
}

export function parseStats(stats: string[]) {
  return stats
    .map((s) => s.split("|"))
    .filter((p) => p.length === 3 && Number.isFinite(Number(p[0])))
    .map(([value, suffix, label]) => ({ value: Number(value), suffix, label }));
}
