import { notFound, redirect } from "next/navigation";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { PaymentSettings } from "@/components/admin/PaymentSettings";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { CONFIGS, SINGLETONS } from "@/components/admin/config";
import { RESOURCES } from "@/lib/admin-resources";
import { getSession } from "@/lib/auth";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props) {
  const key = (await params).resource;
  const title = CONFIGS[key]?.title ?? SINGLETONS[key]?.title ?? (key === "media" ? "Images" : key === "payment" ? "Payment integration" : "Admin");
  return { title };
}

export default async function AdminResourcePage({ params }: Props) {
  const key = (await params).resource;
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const isContent = session.role === "admin" || session.role === "editor";

  if (key === "doctor" || key === "settings") {
    if (!isContent) redirect("/admin");
    return <><h1 className="mb-6 text-3xl font-normal">{SINGLETONS[key].title}</h1><SingletonEditor name={key} /></>;
  }
  if (key === "media") {
    if (!isContent) redirect("/admin");
    return <><h1 className="mb-6 text-3xl font-normal">Images</h1><MediaLibrary /></>;
  }
  if (key === "payment") {
    if (session.role !== "admin") redirect("/admin");
    return <><h1 className="mb-6 text-3xl font-normal">Payment integration</h1><PaymentSettings /></>;
  }

  const config = CONFIGS[key];
  const def = RESOURCES[key];
  if (!config || !def) notFound();
  if (!def.read.includes(session.role)) redirect("/admin");

  return (
    <>
      <h1 className="mb-6 text-3xl font-normal">{config.title}</h1>
      <ResourceManager config={config} canWrite={def.write.includes(session.role)} canDelete={def.remove.includes(session.role)} />
    </>
  );
}
