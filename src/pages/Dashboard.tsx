import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Users, FileCheck, CheckCircle, Clock, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [engineers, setEngineers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getEngineers();
        setEngineers(data);
      } catch (error) {
        console.error("Failed to fetch engineers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalEngineers = engineers.length;
  const pendingCount = engineers.filter((e) => e.status !== "verified").length;

  const approvedCount = engineers.filter(
    (e) => e.status === "approved" || e.status === "verified"
  ).length;

  const stats = [
    {
      label: "Total Engineers",
      value: isLoading ? "..." : totalEngineers.toString(),
      icon: Users,
      trend: "All registered",
    },
    {
      label: "Pending Reviews",
      value: isLoading ? "..." : pendingCount.toString(),
      icon: Clock,
      trend: "Awaiting action",
    },
    {
      label: "Approved",
      value: isLoading ? "..." : approvedCount.toString(),
      icon: CheckCircle,
      trend: "Verified engineers",
    },
    {
      label: "KYC Submissions",
      value: isLoading ? "..." : totalEngineers.toString(),
      icon: FileCheck,
      trend: "Total submissions",
    },
  ];

  return (
    <AdminLayout>
      <div className="animate-slide-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of engineer verification activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-xs text-primary mt-2">{stat.trend}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Engineers</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : engineers.length > 0 ? (
              <div className="space-y-4">
                {engineers.slice(0, 5).map((eng, i) => (
                  <Link
                    key={eng.id || i}
                    to={`/engineers/${eng.user_id}`}
                    className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        eng.status === "approved" || eng.status === "verified"
                          ? "bg-success"
                          : eng.status === "rejected"
                          ? "bg-destructive"
                          : "bg-warning"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {eng.name || eng.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {eng.user?.email || eng.email}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {eng.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">
                No engineers found
              </p>
            )}
          </div>

         <div className="glass-card p-6">
  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
  <div className="grid grid-cols-2 gap-4">
    <div className="p-4 rounded-xl bg-secondary text-left">
      <Users className="w-5 h-5 text-primary mb-2" />
      <p className="font-medium text-sm">View Engineers</p>
      <p className="text-xs text-muted-foreground">Manage all engineers</p>
    </div>

    <div className="p-4 rounded-xl bg-secondary text-left">
      <Clock className="w-5 h-5 text-warning mb-2" />
      <p className="font-medium text-sm">Pending Reviews</p>
      <p className="text-xs text-muted-foreground">{pendingCount} awaiting action</p>
    </div>

    <div className="p-4 rounded-xl bg-secondary text-left">
      <FileCheck className="w-5 h-5 text-success mb-2" />
      <p className="font-medium text-sm">KYC Queue</p>
      <p className="text-xs text-muted-foreground">Review submissions</p>
    </div>

    <div className="p-4 rounded-xl bg-secondary text-left">
      <CheckCircle className="w-5 h-5 text-primary mb-2" />
      <p className="font-medium text-sm">Approved</p>
      <p className="text-xs text-muted-foreground">{approvedCount} verified</p>
    </div>
  </div>
</div>

        </div>
      </div>
    </AdminLayout>
  );
}
