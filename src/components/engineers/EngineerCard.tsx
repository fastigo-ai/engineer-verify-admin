import { Link } from "react-router-dom";
import { Engineer } from "@/types/engineer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChevronRight, Mail, Phone, MapPin } from "lucide-react";

interface EngineerCardProps {
  engineer: Engineer;
}

export function EngineerCard({ engineer }: EngineerCardProps) {
  const name = engineer.name || engineer.full_name || "Unknown";
  const phone = engineer.phone || engineer.contact_number;

  return (
    <Link
      to={`/engineers/${engineer.user_id}`}
      className="glass-card p-5 block group hover:border-primary/30 transition-all duration-300 animate-fade-in"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
            <span className="text-lg font-semibold text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {engineer.user?.email || "No email"}
              </span>
              {phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatusBadge status={engineer.status} />
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {engineer.skill_category && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground">
            {engineer.skill_category}
          </span>
          {engineer.specializations?.slice(0, 3).map((spec) => (
            <span key={spec} className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
              {spec}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
