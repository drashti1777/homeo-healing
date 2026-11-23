# Reference website audit: drneetahomeohealing.com

- **Audited:** 20 November 2026
- **Method:** fetched all 7 pages (rendered and raw HTML, saved in `docs/raw/`), parsed text including collapsed tabs, accordions and slider slides, and HTTP-probed every image (56 images, plus 1 video and 1 widget avatar).
- **Blocked pages:** none. The plain fetch failed on the home page, so it was retried with a rendered browser fetch and with `curl`. All pages returned HTTP 200.

## 1. Pages

| Page | URL | Content |
|---|---|---|
| Home | `/` and `/index.php` | 3-slide hero, intro, "Myths and Facts", "Why to go with Homeopathy", counters, 5 testimonials, CTA |
| About Us | `/about.php` | Doctor education, experience and achievements timeline (8 entries); "What Makes Us Best" and 3 tabs **(Lorem Ipsum)**; Vision & Mission tab; 5 testimonials |
| Treatments | `/treatment.php` | Intro and **16 categories** with condition lists and icons |
| FAQ | `/faq.php` | **8 Q&A** in an accordion |
| Gallery | `/gallery.php` | Team (3), Consultation Room (4), Dispensing Area (4), Reception (1), Success Story (1), Video Testimonials (1 YouTube) |
| Pay Now | `/paynow.php` | Static Paytm UPI QR, UPI ID `7623913175@paytm` |
| Contact Us | `/contact.php` | Intro, form (name, email, phone, message), 2 addresses, phone, email, 2 Google Maps embeds |

**On every page:**
- **Header:** opening hours, a 3rd address variant, a tagline, and Practo/Justdial icons that link to `#`.
- **Footer:** both addresses, phone, email, Facebook and Instagram links, Justdial/Paytm/GPay icons (also `#`), and a QR code.
- **Widget:** Elfsight WhatsApp chat.
- **Meta:** all pages share the same title, description and keywords.

There are no blog pages, downloadable files (PDFs) or booking system. The only internal links are the 7 pages.

## 2. Business information

| Item | Value | Status |
|---|---|---|
| Name | Dr. Neeta's Homeo Health Care | 6+ spelling variants; see verification doc |
| Tagline | Our Mission Of Compassion. Our Vision Of Excellence. | source |
| Mission / Vision | About page, Vision & Mission tab (see `doctor-profile.md`) | source; Vision contains "cure" |
| Introduction | Home intro (contains claims) | clinical review |
| History | "one and half decade old" (Contact) vs "decades of experience" (Home) | conflict |
| Branches | Bhavnagar; Ahmedabad (Motera) | Bhavnagar address conflicts |
| Phone | +91 81606 02060 | source |
| Email | drneetahomeohealing@gmail.com | source (decoded from Cloudflare obfuscation) |
| Hours | Monday to Saturday, 8 AM to 8 PM | source; branch not specified |
| Social | Facebook, Instagram, one YouTube video | source |
| Payment | Paytm UPI QR, 7623913175@paytm | owner verification |

Full detail: `contact-information.json`.

## 3. Doctor

Dr. Neeta Parmar is the Chief Homoeopathic Consultant at the Bhavnagar clinic and at Homeo Health Care & Pharmacy, Ahmedabad.

| Year | Credential or role |
|---|---|
| 2011 | Graduated, Swami Vivekananda Homoeopathic Medical College, Bhavnagar |
| 2014 | Post Graduate Certificate in Hospital & Healthcare Management, New Delhi |
| June 2016 | Post-graduation in Repertory, Ahmedabad Homoeopathic Medical College (HNGU, Patan) |
| 2016 | Certificate in Advance Homoeopathy, MUHS Nashik |
| July 2016 | Master Course in Advance Homoeopathy, The Other Song, Mumbai |
| 2017 | Visiting consultant, Jivraj Mehta Hospital, Ahmedabad |
| July 2017 – present | HOD & Associate Professor, Hom. Pharmacy, Shree Swaminarayan Homoeopathy Medical College, Kalol |

Not published on the source site: registration number, degree titles and a portrait. Full detail: `doctor-profile.md`.

## 4. Treatments (16 categories, source order)

| # | Category | Conditions |
|---|---|---|
| 1 | Alcoholism | none listed |
| 2 | Oncology | Various malignancies, lymphoma, leukaemia |
| 3 | Psychiatric | 6 |
| 4 | Pediatric | 3 |
| 5 | Skin Disease | 8 |
| 6 | Women's Health | 5 |
| 7 | During Pregnancy | 7 |
| 8 | Geriatric | 4 |
| 9 | Respiratory Disease | 6 |
| 10 | Endocrine | 8 |
| 11 | Cardiac Disease | 6 |
| 12 | Neurological Problems | 5 |
| 13 | Kidney & Urinary Tract | 4 |
| 14 | Disorders of Joints & Muscle | 5 |
| 15 | GI System | 11 |
| 16 | Liver, Spleen, Gallbladder, Pancreas | 6 |

The source site has no per-category descriptions; each category is only a title and a condition list. 13 of the 16 categories are flagged for clinical review. Full lists, original spellings and corrections are in `treatment-categories.json`.

## 5. FAQ

There are 8 questions. Full answers were read from the collapsed accordion HTML. 3 questions are factual; 5 contain claims that need clinical review. See `faq-content.json`.

## 6. Images

| Group | Count | Notes |
|---|---|---|
| Logo | 1 | 483×184 WebP, transparent. Already in `public/logo.webp`. |
| Treatment icons | 16 | 256×256 PNG. Licence unknown. |
| Clinic gallery | 13 | Team 3 (4500×3000), consultation 4 (450×300, low resolution), dispensing 4 (5184×3888, about 5 MB each), reception 1, success story 1 |
| About-tab images | 4 | 869×384. Source unknown. |
| Section heading icons | 13 | 64×64 template icons. Not migrated. |
| Third-party icons | 5 | Practo, Justdial ×2, Paytm, GPay. Not migrated. |
| Payment QR | 2 | Owner verification |
| External | 1 | ImgBB-hosted `team.jpg` |
| Broken | 1 | `gallery/success.jpg` returns 404 |

There is also 1 YouTube video and 1 WhatsApp widget avatar ("Dr. Neeta"). No doctor portrait is clearly identified. Full detail: `image-inventory.json`.

**Images were not downloaded for reuse** in this audit; they were only probed. An earlier import did copy the 16 treatment icons into `uploads/`.

## 7. Contact form and payment

- **Contact form:** Full Name (optional), Email (required), Phone (required, numeric), Message (required). Success text: "Your message was sent successfully." The PHP form's delivery destination is unknown.
- **Home CTA:** "Booked an appointment" is a fieldless form that only goes to the Contact page. There is **no appointment booking** on the source site.
- **Pay Now:** Paytm UPI. It is a static QR image with no gateway integration.

## 8. SEO observations

- All pages share one title ("Dr Neeta's Homeo Health Care") and one meta description. The description reads like a directory listing.
- Keywords target Bhavnagar homeopathy searches: arthritis, hair loss, autism, asthma, depression, skin, spondylitis.
- The canonical tag points every page to the home page. This hides the inner pages from search.
- There is no structured data, `og:image` is a relative path, and `twitter:image` is the home URL.
- Image alt text is generic ("doctor img", "reception img").

## 9. Recommended sitemap for the new site

| URL | Content source | Notes |
|---|---|---|
| `/` | Hero, intro (revised), doctor highlight, featured categories, FAQ preview, CTA | |
| `/about` | Clinic story, Mission & Vision (revised) | Replaces Lorem Ipsum tabs |
| `/doctor` | Dr. Neeta Parmar: education and experience timeline | After owner verification |
| `/treatments` | 16 categories | |
| `/treatments/[slug]` | One page per category: conditions, consultation process, safety note | Better for local SEO than one long list |
| `/about-homeopathy` | Educational page (FAQ 1, 4, 5 and treatment intro) | |
| `/faq` | 8 Q&A (revised after clinical review) | |
| `/gallery` | Team, Consultation Room, Dispensing, Reception | **New page needed**; not in the current project |
| `/clinics/bhavnagar`, `/clinics/ahmedabad` | Address, map, hours, phone per branch | Local SEO; after addresses are confirmed |
| `/contact` | Form, addresses, phone, email, map | |
| `/book-appointment` | Appointment request form | |
| `/pay` | UPI QR and ID | Only if the owner confirms the details |
| `/testimonials` | Only consented testimonials | Hidden until consent is documented |
| `/privacy-policy`, `/terms-and-conditions`, `/medical-disclaimer` | Legal | |

**301 redirects:** `/index.php` → `/`, `/about.php` → `/about`, `/treatment.php` → `/treatments`, `/faq.php` → `/faq`, `/gallery.php` → `/gallery`, `/contact.php` → `/contact`, `/paynow.php` → `/pay`.

## 10. Next step

Resolve `content-verification-required.md`, especially the address conflict, the experience figures, the doctor credentials, testimonial permissions and payment details. Then the redesign can be built on the confirmed content.
