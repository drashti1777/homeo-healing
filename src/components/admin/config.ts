import { APPOINTMENT_STATUSES, ARTICLE_CATEGORIES, ARTICLE_CATEGORY_LABELS, BRANCHES, CONSULTATION_LABELS, CONTACT_STATUSES, DOCTOR_ENTRY_CATEGORIES, FAQ_CATEGORIES, FAQ_REVIEW_STATUSES, GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS, RISK_LEVELS, ROLES, TREATMENT_GROUPS, TREATMENT_ICONS } from "@/lib/validators";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "lines" | "image" | "date" | "password" | "repeater" | "richtext";
  options?: readonly string[];
  /** For type "repeater": the fields of each row, the label for a new row, and its default values. */
  itemFields?: FieldDef[];
  itemLabel?: string;
  itemDefaults?: Record<string, unknown>;
  hint?: string;
  rows?: number;
  readOnly?: boolean;
  required?: boolean;
};

export type ResourceConfig = {
  key: string;
  title: string;
  singular: string;
  description?: string;
  canCreate: boolean;
  /** Field used for the list title, plus extra columns shown in the table. */
  titleField: string;
  columns: { name: string; label: string; format?: "date" | "bool" | "consult" | "image" }[];
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  readOnlyInfo?: { name: string; label: string }[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterChips?: { field: string; label: string; options: { value: string; label: string }[] }[];
  reorderable?: boolean;
};

const opts = (values: readonly string[], labels?: Record<string, string>) => values.map((v) => ({ value: v, label: labels?.[v] ?? v.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()) }));
const BRANCH_OPTS = [{ value: "bhavnagar", label: "Bhavnagar" }, { value: "ahmedabad", label: "Ahmedabad" }];

const seoFields: FieldDef[] = [
  { name: "seoTitle", label: "SEO title", type: "text", hint: "Up to 70 characters. Leave blank to use the page title." },
  { name: "seoDescription", label: "SEO description", type: "textarea", rows: 2, hint: "Up to 170 characters shown in search results." },
];

export const CONFIGS: Record<string, ResourceConfig> = {
  appointments: {
    key: "appointments", title: "Appointment enquiries", singular: "appointment enquiry", canCreate: false, titleField: "name",
    description: "Requests are not confirmed until you contact the patient. To approve a request, agree a date and time with the patient, enter them below and set the status to Confirmed. Every status change is recorded in the history.",
    columns: [{ name: "reference", label: "Reference" }, { name: "branch", label: "Branch" }, { name: "preferredDate", label: "Preferred" }, { name: "consultationType", label: "Type", format: "consult" }, { name: "status", label: "Status" }],
    searchable: true, searchPlaceholder: "Search name, email, phone or reference",
    filterChips: [{ field: "status", label: "Status", options: opts(APPOINTMENT_STATUSES) }, { field: "branch", label: "Branch", options: BRANCH_OPTS }],
    readOnlyInfo: [
      { name: "reference", label: "Reference" }, { name: "name", label: "Name" }, { name: "phone", label: "Phone" }, { name: "email", label: "Email" },
      { name: "branch", label: "Preferred branch" }, { name: "preferredDate", label: "Preferred date" }, { name: "preferredTime", label: "Preferred time" },
      { name: "consultationType", label: "Consultation type" }, { name: "message", label: "Message" }, { name: "createdAt", label: "Received" }, { name: "statusHistory", label: "Status history" },
    ],
    fields: [
      { name: "status", label: "Status", type: "select", options: APPOINTMENT_STATUSES, hint: "pending → contacted → confirmed → completed (or cancelled)." },
      { name: "confirmedDate", label: "Agreed date", type: "date", hint: "Required to mark as Confirmed." },
      { name: "confirmedTime", label: "Agreed time", type: "text", hint: "Example: 11:30 AM. Required to mark as Confirmed." },
      { name: "internalNote", label: "Internal note", type: "textarea", rows: 3, hint: "Only visible to staff." },
    ],
    defaults: { status: "pending", confirmedDate: "", confirmedTime: "", internalNote: "" },
  },
  contacts: {
    key: "contacts", title: "Contact enquiries", singular: "enquiry", canCreate: false, titleField: "name",
    columns: [{ name: "email", label: "Email" }, { name: "phone", label: "Phone" }, { name: "createdAt", label: "Received", format: "date" }, { name: "status", label: "Status" }],
    searchable: true, searchPlaceholder: "Search name, email, phone or message",
    filterChips: [{ field: "status", label: "Status", options: opts(CONTACT_STATUSES) }],
    readOnlyInfo: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "phone", label: "Phone" }, { name: "branch", label: "Branch" }, { name: "message", label: "Message" }, { name: "createdAt", label: "Received" }, { name: "statusHistory", label: "Status history" }],
    fields: [
      { name: "status", label: "Status", type: "select", options: CONTACT_STATUSES },
      { name: "internalNote", label: "Internal note", type: "textarea", rows: 3 },
    ],
    defaults: { status: "new", internalNote: "" },
  },
  treatments: {
    key: "treatments", title: "Treatments", singular: "treatment", canCreate: true, titleField: "title",
    description: "Treatment categories are educational 'areas of interest', not claims of effectiveness. Mark a category 'specialist' when it includes serious conditions; its safety notice is then shown prominently at the top of the page.",
    columns: [{ name: "group", label: "Group" }, { name: "riskLevel", label: "Risk" }, { name: "order", label: "Order" }, { name: "isPublished", label: "Published", format: "bool" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, hint: "Lowercase letters, numbers and hyphens. Example: skin-disease" },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true },
      { name: "conditions", label: "Conditions (one per line)", type: "lines", hint: "Shown as tags and used by the search on /treatments." },
      { name: "group", label: "Filter group", type: "select", options: TREATMENT_GROUPS },
      { name: "icon", label: "Icon", type: "select", options: TREATMENT_ICONS },
      { name: "riskLevel", label: "Risk level", type: "select", options: RISK_LEVELS, hint: "specialist = includes serious conditions (cancer, heart, pregnancy complications…)." },
      { name: "safetyNotice", label: "Safety notice", type: "textarea", rows: 4, hint: "Shown at the top of the category page. Say when to seek medical or emergency care." },
      { name: "body", label: "Content", type: "textarea", rows: 12, required: true, hint: "Blank line = new paragraph. ## Heading, ### Subheading, - list item, **bold**." },
      { name: "highlights", label: "Key points (one per line)", type: "lines" },
      { name: "originalTitle", label: "Original title (previous website)", type: "text", hint: "Migration record. Not shown on the site." },
      { name: "originalConditions", label: "Original condition text (previous website)", type: "textarea", rows: 2, hint: "Verbatim from drneetahomeohealing.com. Not shown on the site." },
      { name: "image", label: "Image", type: "image" },
      { name: "imageAlt", label: "Image description (alt text)", type: "text" },
      { name: "order", label: "Display order", type: "number" },
      { name: "isFeatured", label: "Show on homepage", type: "checkbox" },
      { name: "isPublished", label: "Published", type: "checkbox" },
      ...seoFields,
    ],
    defaults: { title: "", slug: "", summary: "", body: "", highlights: [], conditions: [], originalTitle: "", originalConditions: "", group: "body-systems", icon: "leaf", riskLevel: "standard", safetyNotice: "", image: "", imageAlt: "", order: 0, isFeatured: false, isPublished: true, seoTitle: "", seoDescription: "" },
  },
  conditions: {
    key: "conditions", title: "Health conditions", singular: "health condition", canCreate: true, titleField: "title",
    columns: [{ name: "isPublished", label: "Published", format: "bool" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true },
      { name: "seeDoctorFirst", label: "When to see a doctor first", type: "textarea", rows: 4, required: true, hint: "Required. List warning signs and when to seek urgent or conventional care." },
      { name: "body", label: "Content", type: "textarea", rows: 12, required: true, hint: "Educational only. Do not claim homeopathy cures or treats this condition." },
      { name: "order", label: "Display order", type: "number" },
      { name: "isPublished", label: "Published", type: "checkbox" },
      ...seoFields,
    ],
    defaults: { title: "", slug: "", summary: "", body: "", seeDoctorFirst: "", relatedTreatments: [], order: 0, isPublished: true, seoTitle: "", seoDescription: "" },
  },
  articles: {
    key: "articles", title: "Health articles", singular: "article", canCreate: true, titleField: "title",
    description: "Articles stay as drafts until 'Published' is ticked. Health articles can be published only after a medical reviewer and review date are recorded. Do not attribute an article to Dr. Neeta unless she wrote it. A medical disclaimer is added to every article automatically.",
    columns: [{ name: "image", label: "", format: "image" }, { name: "category", label: "Category" }, { name: "authorSlug", label: "Author" }, { name: "publishedAt", label: "Date" }, { name: "isPublished", label: "Published", format: "bool" }],
    searchable: true, searchPlaceholder: "Search title, excerpt or tags",
    filterChips: [{ field: "isPublished", label: "State", options: [{ value: "true", label: "Published" }, { value: "false", label: "Draft" }] }, { field: "category", label: "Category", options: opts(ARTICLE_CATEGORIES, ARTICLE_CATEGORY_LABELS) }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, required: true },
      { name: "body", label: "Article body", type: "richtext", required: true, hint: "Use the toolbar for headings, bold, lists, links and images." },
      { name: "category", label: "Category", type: "select", options: ["", ...ARTICLE_CATEGORIES] },
      { name: "tags", label: "Tags (one per line)", type: "lines" },
      { name: "authorSlug", label: "Author (slug from Authors)", type: "text", hint: "Must match an author in Admin → Authors." },
      { name: "reviewerSlug", label: "Medical reviewer (slug from Authors)", type: "text", hint: "Required to publish health articles. Must be an author marked as medical reviewer." },
      { name: "reviewedAt", label: "Medical review date", type: "date" },
      { name: "publishedAt", label: "Publish date", type: "date" },
      { name: "image", label: "Cover image", type: "image" },
      { name: "imageAlt", label: "Image description (alt text)", type: "text" },
      { name: "isPublished", label: "Published", type: "checkbox" },
      ...seoFields,
    ],
    defaults: { title: "", slug: "", excerpt: "", body: "", category: "", tags: [], authorSlug: "", reviewerSlug: "", reviewedAt: "", image: "", imageAlt: "", publishedAt: "", isPublished: false, seoTitle: "", seoDescription: "" },
  },
  authors: {
    key: "authors", title: "Authors & reviewers", singular: "author", canCreate: true, titleField: "name",
    description: "People who write or medically review articles. Only add real people, with their permission, and only credentials they hold.",
    columns: [{ name: "slug", label: "Slug" }, { name: "credentials", label: "Credentials" }, { name: "isMedicalReviewer", label: "Medical reviewer", format: "bool" }, { name: "isActive", label: "Active", format: "bool" }],
    searchable: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, hint: "Used to link articles to this author." },
      { name: "credentials", label: "Credentials", type: "text", hint: "Only verified qualifications." },
      { name: "bio", label: "Short bio", type: "textarea", rows: 3 },
      { name: "photo", label: "Photo", type: "image" },
      { name: "isMedicalReviewer", label: "Qualified to medically review articles", type: "checkbox" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ],
    defaults: { name: "", slug: "", credentials: "", bio: "", photo: "", isMedicalReviewer: false, isActive: true },
  },
  gallery: {
    key: "gallery", title: "Gallery", singular: "image", canCreate: true, titleField: "caption",
    description: "Only upload real photographs the clinic owns, with consent from anyone pictured. Never use generated or stock images of people, and never substitute a generated face for the doctor's photograph. Use the arrows to reorder.",
    columns: [{ name: "src", label: "", format: "image" }, { name: "category", label: "Category" }, { name: "alt", label: "Description" }, { name: "isPublished", label: "Published", format: "bool" }],
    searchable: true, searchPlaceholder: "Search descriptions",
    filterChips: [{ field: "category", label: "Category", options: opts(GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS) }, { field: "isPublished", label: "State", options: [{ value: "true", label: "Published" }, { value: "false", label: "Hidden" }] }],
    reorderable: true,
    readOnlyInfo: [{ name: "sourceUrl", label: "Original source" }],
    fields: [
      { name: "src", label: "Image", type: "image", required: true },
      { name: "alt", label: "Description (alt text)", type: "text", required: true, hint: "Describe what is in the photo for screen readers." },
      { name: "caption", label: "Caption", type: "text" },
      { name: "category", label: "Category", type: "select", options: GALLERY_CATEGORIES },
      { name: "sourceNote", label: "Ownership / consent note", type: "textarea", rows: 2, hint: "Internal. Example: Photo taken by clinic staff; consent from people pictured on file." },
      { name: "isPublished", label: "Published", type: "checkbox" },
    ],
    defaults: { src: "", alt: "", caption: "", category: "clinic-interior", width: 0, height: 0, sourceNote: "", isPublished: true },
  },
  testimonials: {
    key: "testimonials", title: "Testimonials", singular: "testimonial", canCreate: true, titleField: "name",
    description: "A testimonial appears on the website only if it is published, marked verified and patient consent is recorded. Only add real testimonials you have permission to publish.",
    columns: [{ name: "isVerified", label: "Verified", format: "bool" }, { name: "consentGiven", label: "Consent", format: "bool" }, { name: "isPublished", label: "Published", format: "bool" }],
    fields: [
      { name: "name", label: "Patient name or initials", type: "text", required: true },
      { name: "location", label: "Location (optional)", type: "text" },
      { name: "quote", label: "Testimonial", type: "textarea", rows: 5, required: true },
      { name: "verificationNote", label: "How was this verified?", type: "textarea", rows: 2, hint: "For your records. Example: written consent received by email on 12 Nov." },
      { name: "isVerified", label: "I have verified this is a genuine patient", type: "checkbox" },
      { name: "consentGiven", label: "The patient gave consent to publish", type: "checkbox" },
      { name: "isPublished", label: "Published", type: "checkbox" },
    ],
    defaults: { name: "", location: "", quote: "", verificationNote: "", isVerified: false, consentGiven: false, isPublished: false },
  },
  faqs: {
    key: "faqs", title: "FAQs", singular: "FAQ", canCreate: true, titleField: "question",
    description: "Answers marked 'pending-review' are proposed rewrites of the previous website's answers with unsupported claims removed. A clinician should approve or edit them, then set Review status to 'clinically-reviewed'. The original text is kept below each FAQ for reference and is never shown on the site. Never state that homeopathy is scientifically proven to cure medical conditions.",
    columns: [{ name: "category", label: "Topic" }, { name: "reviewStatus", label: "Review" }, { name: "order", label: "Order" }, { name: "isPublished", label: "Published", format: "bool" }],
    readOnlyInfo: [{ name: "originalQuestion", label: "Original question (previous website)" }, { name: "originalAnswer", label: "Original answer (previous website)" }, { name: "sourceUrl", label: "Source" }],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "slug", label: "Link anchor (slug)", type: "text", required: true, hint: "Used in /faq#slug links and for related questions. Lowercase letters, numbers and hyphens." },
      { name: "answer", label: "Answer", type: "textarea", rows: 7, required: true, hint: "Blank line = new paragraph." },
      { name: "category", label: "Topic", type: "select", options: FAQ_CATEGORIES },
      { name: "relatedSlugs", label: "Related questions (one slug per line, max 5)", type: "lines" },
      { name: "reviewStatus", label: "Review status", type: "select", options: FAQ_REVIEW_STATUSES },
      { name: "reviewedBy", label: "Reviewed by", type: "text", hint: "Name of the clinician who approved the answer." },
      { name: "reviewedAt", label: "Review date", type: "date" },
      { name: "reviewNote", label: "Review note", type: "textarea", rows: 3, hint: "Internal. Not shown on the site." },
      { name: "order", label: "Display order", type: "number" },
      { name: "isPublished", label: "Published", type: "checkbox" },
    ],
    defaults: { question: "", slug: "", answer: "", category: "about-homeopathy", relatedSlugs: [], reviewStatus: "pending-review", reviewedBy: "", reviewedAt: "", reviewNote: "", order: 0, isPublished: true },
  },
  seo: {
    key: "seo", title: "SEO metadata", singular: "SEO entry", canCreate: true, titleField: "path",
    description: "Override the title, description and social image for any page path, such as / or /about. Detail pages (treatments, conditions, articles) have their own SEO fields.",
    columns: [{ name: "title", label: "Title" }, { name: "noIndex", label: "No index", format: "bool" }],
    fields: [
      { name: "path", label: "Page path", type: "text", required: true, hint: "Example: / or /about or /faq" },
      { name: "title", label: "Title", type: "text", required: true, hint: "Up to 70 characters" },
      { name: "description", label: "Description", type: "textarea", rows: 3, required: true, hint: "20 to 170 characters" },
      { name: "ogImage", label: "Social sharing image", type: "image" },
      { name: "noIndex", label: "Hide this page from search engines", type: "checkbox" },
    ],
    defaults: { path: "", title: "", description: "", ogImage: "", noIndex: false },
  },
  users: {
    key: "users", title: "Admin users", singular: "user", canCreate: true, titleField: "email",
    description: "Admin: full access. Editor: manages website content. Staff: manages appointment and contact enquiries only.",
    columns: [{ name: "name", label: "Name" }, { name: "role", label: "Role" }],
    fields: [
      { name: "email", label: "Email", type: "text", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "select", options: ROLES },
      { name: "password", label: "Password", type: "password", hint: "At least 12 characters. When editing, leave blank to keep the current password." },
    ],
    defaults: { email: "", name: "", role: "staff", password: "" },
  },
};

export const CONSULT_LABELS = CONSULTATION_LABELS as Record<string, string>;

export const SINGLETONS: Record<string, { title: string; description: string; fields: FieldDef[]; defaults: Record<string, unknown> }> = {
  doctor: {
    title: "Doctor profile",
    description: "Only enter information you can verify. The doctor page is published only when you tick Published and a name is set. Qualifications and registration numbers are shown exactly as you type them.",
    fields: [
      { name: "name", label: "Full name", type: "text" },
      { name: "title", label: "Title / specialty", type: "text" },
      { name: "photo", label: "Photo", type: "image", hint: "Use only a real photograph of the doctor provided by the clinic." },
      { name: "photoAlt", label: "Photo description (alt text)", type: "text" },
      { name: "bio", label: "Biography", type: "textarea", rows: 8, hint: "Blank line = new paragraph." },
      {
        name: "entries", label: "Education, certifications, experience and teaching", type: "repeater", itemLabel: "entry",
        hint: "Each entry appears in its section on the About and Doctor pages, in the order listed. Tick 'Achievement' to also feature it under Achievements. Add only verified information.",
        itemFields: [
          { name: "category", label: "Section", type: "select", options: DOCTOR_ENTRY_CATEGORIES },
          { name: "year", label: "Year / period", type: "text", hint: "e.g. 2016, June 2016, Since July 2017, Present" },
          { name: "title", label: "Title", type: "text", required: true },
          { name: "institution", label: "Institution / place", type: "text" },
          { name: "description", label: "Details", type: "textarea", rows: 2 },
          { name: "highlight", label: "Achievement", type: "checkbox" },
        ],
        itemDefaults: { category: "education", year: "", title: "", institution: "", description: "", highlight: false },
      },
      { name: "mission", label: "Mission", type: "textarea", rows: 4 },
      { name: "vision", label: "Vision (one point per line)", type: "lines" },
      {
        name: "approach", label: "Our approach", type: "repeater", itemLabel: "approach point",
        itemFields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "text", label: "Description", type: "textarea", rows: 2 },
        ],
        itemDefaults: { title: "", text: "" },
      },
      { name: "registrationNumber", label: "Registration number", type: "text", hint: "Add only if verified. Not published on the previous website." },
      { name: "languages", label: "Languages (one per line)", type: "lines" },
      { name: "isPublished", label: "Published", type: "checkbox" },
    ],
    defaults: { name: "", title: "", bio: "", entries: [], mission: "", vision: [], approach: [], registrationNumber: "", languages: [], photo: "", photoAlt: "", isPublished: false },
  },
  settings: {
    title: "Clinic settings",
    description: "Contact details, opening hours and social links shown across the website and in search-engine data.",
    fields: [
      { name: "clinicName", label: "Clinic name", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Public email", type: "text" },
      { name: "addressLine", label: "Street address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State / region", type: "text" },
      { name: "postalCode", label: "Postal code", type: "text" },
      { name: "country", label: "Country", type: "text" },
      {
        name: "branches", label: "Clinic branches", type: "repeater", itemLabel: "branch",
        hint: "Shown on the Contact page and homepage. Opening hours are displayed only when 'Hours verified' is ticked.",
        itemFields: [
          { name: "key", label: "Branch", type: "select", options: BRANCHES },
          { name: "name", label: "Name", type: "text", required: true },
          { name: "address", label: "Address", type: "textarea", rows: 2 },
          { name: "phone", label: "Phone", type: "text" },
          { name: "mapEmbedUrl", label: "Google Maps embed URL", type: "text", hint: "Google Maps → Share → Embed a map → copy the https://www.google.com/maps/embed?… link." },
          { name: "mapLinkUrl", label: "Directions link (optional)", type: "text", hint: "If empty, a Google Maps search for the address is used." },
          { name: "hours", label: "Opening hours (one per line)", type: "lines" },
          { name: "hoursVerified", label: "Hours verified by the clinic", type: "checkbox" },
        ],
        itemDefaults: { key: "bhavnagar", name: "", address: "", phone: "", mapEmbedUrl: "", mapLinkUrl: "", hours: [], hoursVerified: false },
      },
      { name: "otherAddresses", label: "Other clinic addresses (legacy, one per line)", type: "lines" },
      { name: "mapUrl", label: "Map link (https)", type: "text" },
      { name: "openingHours", label: "Opening hours (legacy, one per line)", type: "lines", hint: "Prefer per-branch hours above." },
      { name: "instagramUrl", label: "Instagram URL", type: "text" },
      { name: "facebookUrl", label: "Facebook URL", type: "text" },
      { name: "youtubeUrl", label: "YouTube URL", type: "text" },
      { name: "verifiedStats", label: "Verified statistics (one per line, max 4)", type: "lines", hint: "Format: value|suffix|label. Example: 1200|+|Consultations completed. Only enter figures you can substantiate. Leave empty to hide the counter section." },
    ],
    defaults: { clinicName: "Dr. Neeta's Homeo Health Care", phone: "", email: "", addressLine: "", branches: [], otherAddresses: [], city: "", state: "", postalCode: "", country: "", mapUrl: "", openingHours: [], instagramUrl: "", facebookUrl: "", youtubeUrl: "", verifiedStats: [] },
  },
};
