import { StatusType } from "@/types/engineer";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: StatusType | string | undefined;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() || "pending";

  const config: Record<string, { class: string; icon: typeof CheckCircle; label: string }> = {
    approved: { class: "status-approved", icon: CheckCircle, label: "Approved" },
    verified: { class: "status-approved", icon: CheckCircle, label: "Verified" },
    rejected: { class: "status-rejected", icon: XCircle, label: "Rejected" },
    pending: { class: "status-pending", icon: Clock, label: "Pending" },
  };

  const { class: className, icon: Icon, label } = config[normalizedStatus] || config.pending;

  return (
    <span className={`status-badge ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
