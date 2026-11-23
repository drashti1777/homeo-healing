import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section grid min-h-[70vh] place-items-center bg-beige-100 pt-40 text-center">
      <div className="wrap-narrow">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="mt-5 text-5xl font-normal md:text-6xl">This page could not be found</h1>
        <p className="mt-5 text-ink-soft">The page may have moved or may no longer exist.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/contact" className="btn btn-ghost">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
