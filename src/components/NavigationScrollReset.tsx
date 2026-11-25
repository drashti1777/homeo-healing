"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Ensures that on route changes (e.g. clicking Treatments, Gallery, FAQ, Pay Now, Contact
 * from the bottom of About Us or any page), the browser immediately starts at the top
 * without laggy smooth-scrolling upward from the previous page's scroll position.
 */
export function NavigationScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll immediately so the new page renders at top (0, 0)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
