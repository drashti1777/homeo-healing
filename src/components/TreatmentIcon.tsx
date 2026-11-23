import { Activity, Baby, Bean, Bone, Brain, Droplets, FlaskConical, Hand, HeartPulse, Leaf, PersonStanding, Ribbon, Soup, Stethoscope, Venus, Wind, Wine, Zap, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  leaf: Leaf, wine: Wine, ribbon: Ribbon, brain: Brain, baby: Baby, hand: Hand, venus: Venus,
  pregnancy: Activity, elderly: PersonStanding, lungs: Wind, endocrine: FlaskConical, heart: HeartPulse,
  neuro: Zap, kidney: Bean, bone: Bone, gut: Soup, liver: Droplets, stethoscope: Stethoscope,
};

export function TreatmentIcon({ name, className = "size-6" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Leaf;
  return <Icon className={className} aria-hidden="true" />;
}
