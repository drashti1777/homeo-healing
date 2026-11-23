"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section grid min-h-[70vh] place-items-center bg-beige-100 pt-40 text-center">
      <div className="wrap-narrow">
        <h1 className="text-4xl font-normal md:text-5xl">Something went wrong</h1>
        <p className="mt-5 text-ink-soft">We could not load this page. Please try again in a moment.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-ghost">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
