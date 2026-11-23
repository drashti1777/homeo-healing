/**
 * Clinic content taken from https://drneetahomeohealing.com (audited 20 Nov 2026).
 * Sources: docs/content-inventory.json, docs/doctor-profile.md, docs/image-inventory.json.
 * Text is the original wording with grammar corrected; medical claims flagged in the audit were removed.
 */

export const BRAND = "Homeo-Healing";
export const CLINIC = "Dr. Neeta's Homeo Health Care";

/** Source: header tagline on every page. */
export const TAGLINE = "Our Mission of Compassion. Our Vision of Excellence.";

/** Source: home page intro (content-inventory "home-intro", revisedProposal). */
export const CLINIC_INTRO = [
  "Yes! Homeopathy treatment is highly effective. Want to know why? Because it boosts immune system and body’s healing power. The aspect which makes Homeopathy different from other conventional medications is its way of treatment.",
  "A Homeopathy doctor understands the personality and emotions of the patient for knowing the complete nature of his body. The main goal of this treatment is to cure the complete body, instead of emphasizing on any single problem.",
];

/** Source: home page "Myths and Facts about HOMEOPATHY" (content-inventory "home-myths"), original wording. */
export const MYTHS = {
  title: "Myths and Facts about Homeopathy",
  subtitle: "Take advantage of homeopathy for living a healthy life and stop your search for the best Homeopathy Hospital in Bhavnagar.",
  paragraphs: [
    "It is believed that Homeopathy treatment is slowly acting, But in many diseases like diarrhea, minor infection and fever it acts faster than other treatments. In chronic diseases like diabetes, high or low blood pressure etc, Homeopathy medicines may take time to heal, but it can eradicate the disease completely. Unlike other treatments in which patient needs to take lifetime medications, homeopathy will bless you with medicine free life after treatment. Homeopathy treatment never leads to unnatural changes and patient feels healthy and fit through this treatment.",
    "There are wide array of Homeopathy hospitals in Bhavnagar but Dr. Neeta's Homeopathy Clinic run by Dr. Neeta has its own identity. She brings on the table her decades of experience in homeopathy and cures various diseases through her expertise. Whether you are looking for treatment of diabetes, thyroid, women health, arthritis, infertility, sinusitis, hypertension, hair, skin, allergy, asthma, migraine, spondylitis, or children diseases, everything is cured in this homeopathy hospital. Treatment involves complete health evaluation of the patients, thus catering nothing but healthy life to them. You can call this homeopathy hospital as one stop solution for all your health related problems.",
  ],
};

/** Source: home page "Why to go with HOMEOPATHY" (content-inventory "home-why"), original wording. */
export const WHY_HOMEOPATHY = {
  title: "Why to go with Homeopathy",
  subtitle: "Homeopathic medicines are safe and acting very gently!",
  paragraphs: [
    "It is proven that it has no side effect as well no interaction with any other pathy like modern medicine. Homeopathy is a science in which we are giving medicine which affects the whole person not a single disease/problem. In many disease only modern medicine gives just temporary relief on the other hand homeopathy medicine are best work in reversible diseases and gives permanent cure.",
    "Homeopathic medicines are widely acceptable because it is suitable for all age group from pediatric to geriatric and it's sweet taste which gives attraction & acceptance towards this medicines.",
  ],
};

/**
 * Source: home page "Patient's Testimonials", original wording with spelling fixes.
 * Dr. K.R. Zanzrukiya's testimonial is left out: it describes stopping prescribed allopathic medicine
 * (see docs/content-verification-required.md, section 5).
 */
export const TESTIMONIALS_INTRO = "Our treatment always speaks louder than us. We have a large number of happy & satisfied patients.";
export const TESTIMONIALS = [
  {
    name: "Kiya Chapaneri",
    location: "",
    quote: "My experience with Dr. Neeta's Homeo Healthcare has been wonderful. I had visited Dr. Neeta's Homeo Healthcare to increase immunity of my little daughter. The treatment given by them was very effective and no side effects. Thank you.",
  },
  {
    name: "Dr. Chandrika Pandya (MD - Anaesthesia)",
    location: "Bhavnagar, Gujarat",
    quote: "My self Dr. Chandrika Pandya and my 2 daughters are on Homeopathic medicines since last 1 and 1/2 years. We all 3 have \"Bronchial Asthma\". My daughters also have milk protein allergy. So both have very frequent episodes of bronchitis and hospitalization at least twice in a month, so we were literally tired of this illness of my children. Then Dr. Mehul Gosai sir gave us guidance to consult Dr. Neeta Parmar madam & take homeopathic medicines as per her expert opinion after her consultation. So, we have started the medicines since last 1 and 1/2 years and after that, I would like to say that really health of all of us have improved drastically. Episodes decreased significantly and my both the daughters are now able to take tea and buttermilk which we have stopped since last 2 years. I am really thankful to Dr. Neeta mam whose medicines along with positive counseling with humane touch & thoughts booster helps us a lot to fight with this battle and finally we have won the battle and now all 3 of us are quite asymptomatic, and also special thanks to our pediatrician, whose guidance about homeopathic medicines helped us to come out from all these panic situations of chronic illness and frequent hospitalization. I express my best wishes to Neeta madam and her team and as an Anaesthetist, I would like to recommend more & more people who are suffering such frequently occurring, recurrent or chronic problems should trust on Homeopathy & meet Dr. Neeta Madam for her expert Homeopathic opinion and its management.",
  },
  {
    name: "Mr. Rakesh Soni",
    location: "",
    quote: "I am suffering from neck pain from last 10 months. I tried various treatments but was not getting any relief. Then a friend suggested me Dr Neeta Parmar's homeo health care. I visited it and am undergoing treatment. Now I am feeling a lot better and almost cured. I had lost all the hopes but due to this treatment now I can enjoy my life as I was doing before. Thanks a lot, Dr Neeta Parmar's homeo health care and team.",
  },
  {
    name: "Mr. Ullas Rathod (MBA)",
    location: "",
    quote: "I had allergic problem like nasal congestion, cold and cough. I tried many doctors and medicines but didn't get any relief. Then I took Homoeopathic medicine from Dr. Neeta by consulting her. She treated me so well, my problem got resolved now. And I must say she is so experienced and humble, after her treatment I am feeling so well in my overall health. I strongly recommend her for effective Homoeopathic treatment.",
  },
];

/** Source: About page, Vision & Mission tab (revisedProposal). */
export const MISSION =
  "In homoeopathy, every person is an individual, a unique and whole being. Dr. Neeta aims to practise without bias, listening attentively to each patient and finding the most suitable remedy, the similimum, by understanding each case in a systematic way.";
export const VISION = [
  "To bring patients to the best possible state of health through careful homoeopathic care.",
  "To spread awareness of the homoeopathic system of medicine.",
];

/** Source: Treatments page intro and FAQ "What is homoeopathy?" (verified-from-source). */
export const ABOUT_HOMEOPATHY = [
  "Homoeopathy is a system of alternative medicine founded by Samuel Hahnemann. It is based on the principle \u201csimilia similibus curentur\u201d, or \u201clike cures like\u201d.",
  "Practitioners use tiny amounts of natural substances, such as plants and minerals, which they believe stimulate the body's own healing process.",
];

/** Source: home "Why to go with Homeopathy" and FAQ "Why Homoeopathy?", factual points only. */
export const WHY_CHOOSE = [
  { title: "Individual assessment", text: "Medicine is prescribed only after a detailed analysis of your personality and the totality of your individual characteristics, physical and mental." },
  { title: "The whole person", text: "Treatment considers you as a whole person rather than a single disease or problem." },
  { title: "For every age", text: "Homoeopathic medicines are used for all age groups, from children to the elderly, and come as easy-to-take sweet pills." },
  { title: "Two clinics in Gujarat", text: "Consultations with Dr. Neeta Parmar in Bhavnagar and at Homeo Health Care & Pharmacy in Ahmedabad." },
];

/** Source: gallery.php. Only photos of clinic rooms; team and success-story photos are excluded until consent is confirmed. */
export type GalleryImage = { src: string; alt: string; width: number; height: number };
export const GALLERY: { title: string; images: GalleryImage[] }[] = [
  {
    title: "Reception Area",
    images: [{ src: "/gallery/reception-1.webp", alt: "Reception area of Dr. Neeta's Homeo Health Care", width: 1800, height: 1600 }],
  },
  {
    title: "Consultation Room",
    images: [1, 2, 3, 4].map((n) => ({ src: `/gallery/consultation-${n}.webp`, alt: `Consultation room, photo ${n}`, width: 450, height: 300 })),
  },
  {
    title: "Dispensing Area",
    images: [1, 2, 3, 4].map((n) => ({ src: `/gallery/dispensing-${n}.webp`, alt: `Dispensing area, photo ${n}`, width: 1800, height: 1350 })),
  },
];

/** Builds a Google Maps search link from the published address (no invented coordinates). */
export const mapsLink = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
