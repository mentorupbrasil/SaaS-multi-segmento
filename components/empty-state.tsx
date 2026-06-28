import { Icon } from "@/components/icon";

interface EmptyStateProps {
  title?: string;
  description: string;
  action?: React.ReactNode;
  icon?: string;
}

export function EmptyState({ title, description, action, icon = "FolderOpen" }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center p-10 text-center">
      <Icon name={icon} className="mb-3 h-10 w-10 text-slate-300" />
      {title && <p className="mb-1 font-medium text-slate-700">{title}</p>}
      <p className="text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
