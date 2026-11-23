import { LegalPage } from "@/components/LegalPage";
import { PRIVACY } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = () => buildMetadata({ path: PRIVACY.path, title: PRIVACY.title, description: PRIVACY.description });
export default function Page() { return <LegalPage doc={PRIVACY} />; }
