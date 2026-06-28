import { Breadcrumb, type BreadcrumbItem } from "@/components/breadcrumb";
import { PageHeader } from "@/components/page-header";

export function PageShell({
  breadcrumb,
  title,
  description,
  action,
  children,
}: {
  breadcrumb?: BreadcrumbItem[];
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div>
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
      <PageHeader title={title} description={description} action={action} />
      {children}
    </div>
  );
}
