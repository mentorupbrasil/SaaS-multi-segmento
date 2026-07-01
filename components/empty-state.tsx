import { Icon } from "@/components/icon";
import { FadeIn } from "@/components/motion/fade-in";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description: string;
  action?: React.ReactNode;
  icon?: string;
}

export function EmptyState({ title, description, action, icon = "FolderOpen" }: EmptyStateProps) {
  return (
    <FadeIn>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center p-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Icon name={icon} className="h-7 w-7 text-muted-foreground" />
          </div>
          {title && <p className="mb-1 font-semibold text-foreground">{title}</p>}
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
          {action && <div className="mt-5">{action}</div>}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
