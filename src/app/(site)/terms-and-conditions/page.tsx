import { LegalPage } from "@/components/LegalPage";
import { TERMS } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = () => buildMetadata({ path: TERMS.path, title: TERMS.title, description: TERMS.description });
export default function Page() { return <LegalPage doc={TERMS} />; }
