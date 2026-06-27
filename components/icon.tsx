import {
  Users,
  Calendar,
  Tag,
  Wallet,
  UserCog,
  Package,
  ClipboardList,
  FileText,
  Scissors,
  Sparkles,
  Stethoscope,
  Wrench,
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  Check,
  ArrowRight,
  Building2,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Users,
  Calendar,
  Tag,
  Wallet,
  UserCog,
  Package,
  ClipboardList,
  FileText,
  Scissors,
  Sparkles,
  Stethoscope,
  Wrench,
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  Check,
  ArrowRight,
  Building2,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Tag;
  return <Cmp className={className} />;
}
