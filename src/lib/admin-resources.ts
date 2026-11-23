import type { Model } from "mongoose";
import type { ZodType } from "zod";
import type { Role } from "./auth";
import {
  Appointment, Article, Author, Condition, ContactMessage, Faq, GalleryImage, SeoPage, Testimonial, Treatment, User,
} from "./models";
import {
  appointmentAdminSchema, articleSchema, authorSchema, conditionSchema, contactAdminSchema, faqSchema,
  galleryImageSchema, seoPageSchema, testimonialSchema, treatmentSchema, userCreateSchema,
} from "./validators";

export type ResourceDef = {
  model: Model<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: ZodType;
  /** Roles allowed to list/read, write (create/update) and delete. */
  read: Role[];
  write: Role[];
  remove: Role[];
  /** If false, records cannot be created through the admin (e.g. public submissions). */
  creatable: boolean;
  sort: Record<string, 1 | -1>;
  select?: string;
  /** Fields matched by the admin list search (?q=). */
  search?: string[];
  /** Fields that can be filtered exactly from the admin list (?status=new). */
  filters?: string[];
  /** Record each status change with time and staff name. */
  trackStatus?: boolean;
  /** Supports drag/arrow reordering via PATCH /api/admin/[resource] { ids }. */
  reorderable?: boolean;
};

const CONTENT: Role[] = ["admin", "editor"];
const ALL: Role[] = ["admin", "editor", "staff"];

export const RESOURCES: Record<string, ResourceDef> = {
  treatments: { model: Treatment, schema: treatmentSchema, read: CONTENT, write: CONTENT, remove: CONTENT, creatable: true, sort: { order: 1, title: 1 }, search: ["title", "conditions"], filters: ["group", "riskLevel"] },
  conditions: { model: Condition, schema: conditionSchema, read: CONTENT, write: CONTENT, remove: CONTENT, creatable: true, sort: { order: 1, title: 1 } },
  articles: { model: Article, schema: articleSchema, read: CONTENT, write: CONTENT, remove: CONTENT, creatable: true, sort: { createdAt: -1 }, search: ["title", "excerpt", "tags"], filters: ["category", "isPublished", "authorSlug"] },
  authors: { model: Author, schema: authorSchema, read: CONTENT, write: CONTENT, remove: ["admin"], creatable: true, sort: { name: 1 }, search: ["name"] },
  gallery: { model: GalleryImage, schema: galleryImageSchema, read: CONTENT, write: CONTENT, remove: CONTENT, creatable: true, sort: { order: 1, createdAt: 1 }, search: ["alt", "caption"], filters: ["category", "isPublished"], reorderable: true },
  testimonials: { model: Testimonial, schema: testimonialSchema, read: CONTENT, write: ["admin"], remove: ["admin"], creatable: true, sort: { createdAt: -1 } },
  faqs: { model: Faq, schema: faqSchema, read: CONTENT, write: CONTENT, remove: CONTENT, creatable: true, sort: { order: 1, createdAt: 1 }, search: ["question", "answer"], filters: ["category", "reviewStatus", "isPublished"] },
  seo: { model: SeoPage, schema: seoPageSchema, read: CONTENT, write: CONTENT, remove: CONTENT, creatable: true, sort: { path: 1 } },
  appointments: { model: Appointment, schema: appointmentAdminSchema, read: ALL, write: ALL, remove: ["admin"], creatable: false, sort: { createdAt: -1 }, select: "-fingerprint", search: ["reference", "name", "email", "phone"], filters: ["status", "branch", "consultationType"], trackStatus: true },
  contacts: { model: ContactMessage, schema: contactAdminSchema, read: ALL, write: ALL, remove: ["admin"], creatable: false, sort: { createdAt: -1 }, select: "-fingerprint", search: ["name", "email", "phone", "message", "subject"], filters: ["status", "branch"], trackStatus: true },
  users: { model: User, schema: userCreateSchema, read: ["admin"], write: ["admin"], remove: ["admin"], creatable: true, sort: { createdAt: 1 }, select: "-passwordHash" },
};
