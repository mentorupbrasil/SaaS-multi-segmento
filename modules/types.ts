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
  | "records";

export interface ModuleNavItem {
  /** rota da pagina (ex.: "/clientes") */
  href: string;
  /** chave de termo para o rotulo (resolvida pela nomenclatura do segmento) */
  labelKey: string;
  /** rotulo padrao caso o segmento nao defina o termo */
  fallback: string;
  /** nome do icone do lucide-react */
  icon: string;
}

export interface ModuleDef {
  id: ModuleId;
  name: string;
  description: string;
  /** itens de menu que este modulo adiciona */
  nav: ModuleNavItem[];
  /** quando true, o modulo ainda nao tem UI completa (mostra placeholder) */
  comingSoon?: boolean;
}
