import { LegalPage } from "@/components/LegalPage";
import { DISCLAIMER } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = () => buildMetadata({ path: DISCLAIMER.path, title: DISCLAIMER.title, description: DISCLAIMER.description });
export default function Page() { return <LegalPage doc={DISCLAIMER} />; }
