// Sistema de modulos: cada modulo e uma funcionalidade reutilizavel.
// Um segmento liga/desliga modulos. Construido UMA vez, usado em todos os nichos.

export type ModuleId =
  | "clients"
  | "scheduling"
  | "services"
  | "financial"
  | "team"
  | "inventory"
  | "work_orders"
  | "records"
  | "quotes"
  | "suppliers"
  | "vehicles"
  | "pets"
  | "pdv"
  | "rooms"
  | "reservations"
  | "events"
  | "donations"
  | "groups"
  | "education"
  | "housekeeping"
  | "kitchen";

export interface ModuleNavItem {
  href: string;
  labelKey: string;
  fallback: string;
  icon: string;
}

export interface ModuleDef {
  id: ModuleId;
  name: string;
  description: string;
  nav: ModuleNavItem[];
  comingSoon?: boolean;
}
