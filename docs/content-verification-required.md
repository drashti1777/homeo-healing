# Content requiring verification before the redesign goes live

Audit of https://drneetahomeohealing.com, 20 Nov 2026. Each item says who must act and what is needed.
Nothing below should be published until it is resolved.

## 1. Conflicts on the source site (owner)

| # | Conflict | Where | Needed |
|---|---|---|---|
| 1 | Bhavnagar address: header says "**3rd floor**, Ratna Plaza complex, **Vishwakarma circle, Vijayraj Nagar**"; footer and Contact say "**2nd Floor**, Ratna Plaza complex, R.T.O, Vithalwadi Road, Above R.K Travels, Opp. Madhav Complex, **Shastrinagar**" | All pages | The one correct address and a Google Maps pin. The two map embeds point at different places. |
| 2 | Experience: "**decades** of experience" (home) vs "**one and half decade** old clinic" (contact) vs graduation in **2011** | Home, Contact, About | Verified years of practice and the clinic's founding year |
| 3 | Clinic name appears in 6+ spellings ("Homeo Health Care", "Homoeo health care", "Homeo Healthcare", "Homeopathy Clinic", "Homeopathy Hospital") | All pages | One official name. The new brief also uses "**Homeo-Healing**". Confirm whether that is a new brand or the domain name only. |
| 4 | Counters "5+ locations, 80+ Doctors, 10+ Apartments" | Home | Remove (template filler) or give real verified numbers |
| 5 | "Hospital" vs "Clinic" | Home, Contact | Confirm the facility type (affects how it is described in local SEO) |

## 2. Missing information (owner)

- State homoeopathic council **registration number** for Dr. Neeta Parmar.
- Exact **degree titles** (BHMS? MD (Hom.) in Repertory?).
- A real **doctor portrait** (none is identifiable on the site).
- **WhatsApp number**. It sits inside the Elfsight widget and is not in the page HTML.
- **Opening hours per branch**. The site shows one line: "Monday To Saturday - 8AM To 8PM".
- **Ahmedabad branch** details: is it "Homeo Health Care & Pharmacy"? Phone number? Hours?
- **Practo and Justdial profile URLs**. The icons link to `#`.
- **Consultation fees and online consultation**. The meta description promises "Consult Online, View Doctor Fees", but no page offers them.
- Whether **infertility, hair loss and autism** should be categories. They are mentioned on the home page and in meta keywords but are not on the Treatments page.
- What **"First aid free services"** means.
- Real content for the About tabs **What Makes Us Best, Medicine Services, Practice Experience, Achievements**. All four are Lorem Ipsum.
- Where contact-form submissions go today, so nothing is lost at switch-over.

## 3. Doctor credentials (owner, with documents)

All 8 entries in `doctor-profile.md` must be confirmed, especially:
- The Jivraj Mehta Hospital visiting consultant role (2017). It is a named hospital affiliation.
- Whether the HOD & Associate Professor role at Shree Swaminarayan Homoeopathy Medical College, Kalol, is still current.
- "PDCC" vs "PCHM" naming and the issuing institution in New Delhi.

## 4. Medical claims (clinical review; not to be published as written)

| Source | Claim |
|---|---|
| Home intro | "highly effective", "boosts immune system", "cure the complete body" |
| Home, Myths section | acts "faster than other treatments"; diabetes and blood pressure "eradicate the disease completely"; "medicine free life after treatment"; "everything is cured"; "one stop solution for all your health related problems" |
| Home, Why section | "It is proven that it has no side effect"; "no interaction with any other pathy like modern medicine"; modern medicine "just temporary relief"; "permanent cure"; "harmless"; "suitable even to newborn babies" |
| Contact | "non-toxic and highly effective treatment" |
| Hero slides / Treatments heading | "best treatments", "one of the best", "Best Homeopathy Consultancy Services in India", "BEST HOMEOPATHIC TREATMENT" |
| About, Vision | "To give cure/relief of disease" |
| FAQ 2, 3, 6, 7, 8 | "solution for every sort of disease", "No side effects", "permanent cure", "boost up the immune system", nutrient absorption "without supplementation", "cures a disease without any side-effects", "not known to cause any interaction", "millions of people" |
| Treatments | 13 of 16 categories include serious or emergency conditions: oncology, pneumonia, chest pain and heart disease, epilepsy, GI bleeding, cirrhosis, schizophrenia, renal tumours, high-risk pregnancy and others. See `treatment-categories.json` → `clinicalReview`. These need safety wording and must not imply homeopathy replaces specialist care. |

Proposed neutral rewrites are in `faq-content.json` and `content-inventory.json` (`revisedProposal`). They are proposals only.

## 5. Testimonials (owner, documented permission)

Six testimonials are in `content-inventory.json → testimonials` and marked **private**:
- Kiya Chapaneri, Dr. Chandrika Pandya, Mr. Rakesh Soni, Dr. K.R. Zanzrukiya (Gujarati), Mr. Ullas Rathod, and one YouTube video.
- Each needs written consent from the person.
- Dr. Chandrika Pandya's testimonial includes her children's health details and names Dr. Mehul Gosai, who also needs to consent.
- **Dr. K.R. Zanzrukiya's testimonial describes stopping prescribed allopathic medicine.** It must not be published as written.

## 6. Images (owner, ownership/licence)

See `image-inventory.json`:
- Clinic gallery photos (team, consultation room, dispensing, reception): confirm ownership and the consent of anyone pictured.
- Consultation-room photos are only 450×300. Request the originals.
- "Success story" image may contain patient information. Needs consent.
- The 16 treatment illustrations may be stock artwork. Confirm the licence.
- About-tab images and the ImgBB-hosted `team.jpg` have an unknown source.
- `gallery/success.jpg` returns **404**.

## 7. Payment (owner)

The Pay Now page is a **static Paytm UPI QR image** with UPI ID **7623913175@paytm**. There is no gateway, amount, order ID or receipt. The UPI number differs from the clinic phone. The owner must confirm the UPI ID and QR are current. No payment processing will be built without the owner's authorised provider account.

## 7a. About page build (20 Nov 2026)

`npm run migrate:doctor` stored the 8 About-page entries as structured, admin-editable records (Admin → Doctor profile):
- **education:** Graduation 2011, Post-graduation in Repertory 2016, PCHM 2014.
- **certification:** MUHS Advance Homoeopathy 2016, The Other Song Master Course 2016.
- **experience:** Chief Consultant (present), Jivraj Mehta Hospital visiting consultant 2017.
- **teaching:** Shree Swaminarayan, Kalol (since July 2017).

The "Achievements" section shows only entries ticked as **Achievement** in admin; it lists existing entries and adds no awards.
Still open: no doctor photograph is available (a placeholder is shown); degree titles and registration number are not on the source site.

## 7b. FAQ migration (20 Nov 2026)

`npm run migrate:faqs` stored all 8 FAQs from faq.php in MongoDB. Each record keeps `originalQuestion`, `originalAnswer` and `sourceUrl`, verbatim from `faq-content.json`. These fields are admin-only, are shown read-only in the edit form, and are not accepted by the admin API, so they cannot be overwritten.

| FAQ | Published answer | Review status |
|---|---|---|
| What is homoeopathy? | Original, spelling corrected | original-unchanged |
| Who is a homeopath? | Original, grammar corrected | original-unchanged |
| What are homeopathic medicines made up of? | Original | original-unchanged |
| Why homoeopathy? | Rewritten: "every disease", "no side effects", "permanent cure" removed | **pending-review** |
| Other benefits if you connect to us? | Rewritten: immunity and supplement claims removed | **pending-review** |
| Do homeopathic medicines contain steroids? | Rewritten: "cures without side-effects" removed; steroid safety note added | **pending-review** |
| Taken along with other medicines? | Rewritten: "no interaction" removed; inform-your-doctor note added | **pending-review** |
| Is homeopathy scientifically proven? | Rewritten: states it is not proven; evidence vs placebo explained | **pending-review** |

The 4 safety FAQs written for the new site are also marked pending-review.
A clinician should approve each pending answer in Admin → FAQs and set the status to `clinically-reviewed`. Re-running the migration never overwrites a reviewed answer.

## 7c. Contact, gallery, appointments, payment and blog (20 Nov 2026)

`npm run migrate:contact` set up the following.

**Branches** (Admin → Clinic settings → Clinic branches)
- Addresses and phone are as supplied by the owner and match contact.php.
- Bhavnagar uses the previous site's own Google Maps embed, pinned on "R K Travels" (the landmark in the address).
- **Ahmedabad has no map on the previous site**, so none was invented. The page shows a "Open in Google Maps" search link until the clinic pastes the branch's embed URL.

**Opening hours**
- The previous header says "Monday To Saturday - 8AM To 8PM" but does not say which branch it applies to.
- It is stored as **unverified and is not displayed**. Tick "Hours verified" in admin to publish it.

**Payment: disabled placeholder** (Admin → Payment integration)
- The previous Pay Now page was a static Paytm UPI QR image, UPI ID 7623913175@paytm.
- There was no gateway, merchant account, amount or callbacks. The UPI number differs from the clinic phone.
- No payment button exists on the site. `/paynow.php` redirects to `/contact`.
- Payments cannot be enabled until all 4 verification checks are ticked.

**Gallery**
- 9 clinic-room photographs: 5 in Clinic Interior, 4 in Medical Facilities.
- Doctor Profile, Clinic Environment and Events and Activities have **no authorised photographs**, so these filters are hidden until images are uploaded.
- Not migrated: the team photos (people unidentified), the success-story photo (patient consent unknown) and `gallery/success.jpg` (404 on the old site).

**Appointments**
- Every request gets a reference number, for example HH-261120-7K4Q.
- The same email, phone and date submitted within 24 hours returns the existing reference instead of creating a new request.
- "Confirmed" requires an agreed date and time.
- Every status change is logged with the staff member's name.

**Blog**
- The previous site has **no articles**. The blog starts empty.
- Health articles can only be published with a medical reviewer and review date.
- No article is attributed to Dr. Neeta unless she wrote it.

## 8. Already in this project's database that this audit changes

An earlier import (`npm run import:drneeta`) put some of this content into MongoDB, before this audit:
- **Doctor profile is published.** It lists credentials not yet confirmed by the owner, and the Jivraj Mehta Hospital role is left out. Recommend unpublishing until section 3 is confirmed.
- **Settings use the 2nd Floor / Shastrinagar address.** Conflict 1 is unresolved.
- **FAQs** use already-reworded answers. They need clinical review.
- **Testimonials:** only 2 of the 6 were imported, both unpublished. That is correct.
- **Treatment pages** are written as "Homeopathic consultation for…" with safety notes. They need clinical review.
