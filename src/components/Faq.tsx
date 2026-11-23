"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="divide-y divide-sage-200 border-y border-sage-200">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3 className="!font-sans !text-base">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                id={`${base}-btn-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-medium text-forest-800"
              >
                {item.question}
                <Plus className={`size-5 shrink-0 transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`${base}-${i}`}
              role="region"
              aria-labelledby={`${base}-btn-${i}`}
              className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-10 text-ink-soft">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
