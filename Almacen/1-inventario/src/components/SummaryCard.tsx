import { type LucideIcon } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: number;
  variant: "default" | "success" | "warning" | "critical";
  icon: LucideIcon;
}

export function SummaryCard({ label, value, variant, icon: Icon }: SummaryCardProps) {
  const styles = {
    default: "border-border",
    success: "border-success/20",
    warning: "border-warning/20",
    critical: "border-critical/20",
  };

  const iconBg = {
    default: "bg-secondary text-muted-foreground",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    critical: "bg-critical-bg text-critical",
  };

  const textStyles = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    critical: "text-critical",
  };

  return (
    <div className={`bg-card rounded-xl border ${styles[variant]} p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-caption text-muted-foreground font-medium">{label}</p>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${iconBg[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className={`text-[28px] font-bold leading-none ${textStyles[variant]}`}>{value}</p>
    </div>
  );
}
