/**
 * Contact, gallery, appointment and payment migration from https://drneetahomeohealing.com (audited 20 Nov 2026).
 *
 * - Branches: addresses and phone exactly as supplied in the brief (which match contact.php).
 *   Bhavnagar map = the original site's own Google Maps embed ("R K Travels", the landmark in the address).
 *   Ahmedabad: the original site has no map, so no embed is invented; a Google Maps search link is used instead.
 *   Hours: the old header says "Monday To Saturday - 8AM To 8PM" but it is unverified and branch-unspecific,
 *   so it is stored with hoursVerified=false (not displayed).
 * - Payment: the old Pay Now page is a static Paytm UPI QR (7623913175@paytm) with no gateway, merchant
 *   account, amount or callbacks. Stored as a DISABLED placeholder only.
 * - Gallery: imports the clinic-room photos already copied to public/gallery (see scripts/import-gallery.ts).
 *   Team and success-story photos are NOT imported (people unidentified / patient consent unknown).
 * - Appointments: gives existing records a reference number.
 * Run: npm run migrate:contact   (idempotent)
 */
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { Appointment, GalleryImage, Settings } from "../src/lib/models";

const BHAVNAGAR_MAP =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14821.671548612372!2d72.1251679!3d21.764082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5088c1de118f%3A0x185ddd7bebb1acec!2sR%20K%20Travels!5e0!3m2!1sen!2sin!4v1601705010239!5m2!1sen!2sin";

const BRANCHES = [
  {
    key: "bhavnagar",
    name: "Dr. Neeta's Homeo Health Care",
    address: "2nd Floor, Ratna Plaza Complex, R.T.O, Vithalwadi Road, Above R.K Travels, Opposite Madhav Complex, Shastrinagar, Bhavnagar, Gujarat",
    phone: "+91 81606 02060",
    mapEmbedUrl: BHAVNAGAR_MAP,
    mapLinkUrl: "",
    hours: ["Monday to Saturday, 8 AM to 8 PM"],
    hoursVerified: false,
  },
  {
    key: "ahmedabad",
    name: "Homeo Health Care & Pharmacy",
    address: "32_FF, 1st Floor, 4D Square, Opposite IIT Engineering College, Near Visat Petrol Pump, Gandhinagar Highway, Motera, Ahmedabad, Gujarat",
    phone: "+91 81606 02060",
    mapEmbedUrl: "",
    mapLinkUrl: "",
    hours: [],
    hoursVerified: false,
  },
];

const GALLERY = [
  { src: "/gallery/reception-1.webp", alt: "Reception area of Dr. Neeta's Homeo Health Care", caption: "Reception area", category: "clinic-interior", width: 1800, height: 1600, file: "reception-area/reception.jpg" },
  ...[1, 2, 3, 4].map((n) => ({ src: `/gallery/consultation-${n}.webp`, alt: `Consultation room at Dr. Neeta's Homeo Health Care, view ${n}`, caption: "Consultation room", category: "clinic-interior", width: 450, height: 300, file: `consultation-room/consultation room${n}.jpg` })),
  ...[1, 2, 3, 4].map((n) => ({ src: `/gallery/dispensing-${n}.webp`, alt: `Homoeopathic medicine dispensing area, view ${n}`, caption: "Dispensing area", category: "medical-facilities", width: 1800, height: 1350, file: `dispensing-area/dispencing area${n}.jpg` })),
];

const ref = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `HH-${ymd}-${randomBytes(3).toString("hex").toUpperCase().slice(0, 4)}`;
};

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(process.env.MONGODB_URI);

  await Settings.updateOne(
    { key: "main" },
    {
      $set: {
        phone: "+91 81606 02060",
        email: "drneetahomeohealing@gmail.com",
        branches: BRANCHES,
        // Keep legacy fields in sync for components that still read them.
        addressLine: "2nd Floor, Ratna Plaza Complex, R.T.O, Vithalwadi Road, Above R.K Travels, Opposite Madhav Complex, Shastrinagar",
        city: "Bhavnagar",
        state: "Gujarat",
        otherAddresses: [BRANCHES[1].address],
        openingHours: [],
      },
      $setOnInsert: { key: "main" },
    },
    { upsert: true },
  );
  const s = await Settings.findOne({ key: "main" }).lean<{ payment?: { enabled?: boolean } }>();
  if (!s?.payment || s.payment.enabled === undefined) {
    await Settings.updateOne(
      { key: "main" },
      {
        $set: {
          payment: {
            enabled: false,
            provider: "Paytm UPI (static QR on previous website)",
            upiId: "7623913175@paytm",
            merchantVerified: false,
            amountAndPurposeVerified: false,
            callbacksVerified: false,
            notes: "Found on https://drneetahomeohealing.com/paynow.php: a static QR image (assets/img/scan.jpg) and UPI ID 7623913175@paytm. No gateway, merchant account, amount, order ID or callbacks exist. The UPI number differs from the clinic phone. Keep disabled until the owner verifies the provider account, payment purpose/amount and success/failure handling.",
          },
        },
      },
    );
  }
  console.log("Settings: 2 branches (Bhavnagar map from original site; Ahmedabad has no original map), hours unverified, payment disabled placeholder");

  let order = 0;
  for (const g of GALLERY) {
    order += 10;
    const { file, ...img } = g;
    await GalleryImage.updateOne(
      { src: img.src },
      { $setOnInsert: { ...img, order, isPublished: true, sourceNote: "Original clinic photograph migrated from the previous website's gallery.", sourceUrl: `https://drneetahomeohealing.com/assets/img/gallery/${file}` } },
      { upsert: true },
    );
  }
  console.log(`Gallery: ${await GalleryImage.countDocuments()} images (clinic-interior + medical-facilities)`);

  const missing = await Appointment.find({ $or: [{ reference: { $exists: false } }, { reference: null }] }).select("_id").lean<{ _id: unknown }[]>();
  for (const a of missing) await Appointment.updateOne({ _id: a._id }, { $set: { reference: ref(), branch: "bhavnagar" } });
  console.log(`Appointments: ${missing.length} existing record(s) given a reference number`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
