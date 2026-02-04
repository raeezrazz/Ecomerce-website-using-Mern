import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export function KPICard({ title, value, icon: Icon, color = 'text-blue-500' }: KPICardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}
