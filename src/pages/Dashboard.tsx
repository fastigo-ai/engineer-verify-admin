import { AdminLayout } from "@/components/layout/AdminLayout";
import { Users, FileCheck, CheckCircle, Clock } from "lucide-react";

const stats = [
  { label: "Total Engineers", value: "248", icon: Users, trend: "+12 this week" },
  { label: "Pending Reviews", value: "23", icon: Clock, trend: "5 urgent" },
  { label: "Approved Today", value: "8", icon: CheckCircle, trend: "+3 from yesterday" },
  { label: "KYC Submissions", value: "15", icon: FileCheck, trend: "7 awaiting review" },
];

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="animate-slide-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of engineer verification activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
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
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: "Engineer approved", name: "Rajesh Kumar", time: "2 min ago", type: "approved" },
                { action: "KYC submitted", name: "Priya Sharma", time: "15 min ago", type: "pending" },
                { action: "Bank verified", name: "Amit Singh", time: "1 hour ago", type: "approved" },
                { action: "Engineer rejected", name: "Suresh Patel", time: "2 hours ago", type: "rejected" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'approved' ? 'bg-success' :
                    activity.type === 'rejected' ? 'bg-destructive' :
                    'bg-warning'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left">
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-sm">View Engineers</p>
                <p className="text-xs text-muted-foreground">Manage all engineers</p>
              </button>
              <button className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left">
                <Clock className="w-5 h-5 text-warning mb-2" />
                <p className="font-medium text-sm">Pending Reviews</p>
                <p className="text-xs text-muted-foreground">23 awaiting action</p>
              </button>
              <button className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left">
                <FileCheck className="w-5 h-5 text-success mb-2" />
                <p className="font-medium text-sm">KYC Queue</p>
                <p className="text-xs text-muted-foreground">Review submissions</p>
              </button>
              <button className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left">
                <CheckCircle className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-sm">Bulk Approve</p>
                <p className="text-xs text-muted-foreground">Process multiple</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
