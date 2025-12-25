import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { EngineerCard } from "@/components/engineers/EngineerCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Users } from "lucide-react";
import { Engineer } from "@/types/engineer";

// Mock data - replace with API call
const mockEngineers: Engineer[] = [
  {
    id: "1",
    user_id: "user1",
    user: { email: "rajesh.kumar@email.com", role: "engineer" },
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    status: "pending",
    skill_category: "HVAC",
    specializations: ["AC Repair", "Installation", "Maintenance"],
  },
  {
    id: "2",
    user_id: "user2",
    user: { email: "priya.sharma@email.com", role: "engineer" },
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    status: "approved",
    skill_category: "Electrical",
    specializations: ["Wiring", "Panel Installation"],
  },
  {
    id: "3",
    user_id: "user3",
    user: { email: "amit.singh@email.com", role: "engineer" },
    name: "Amit Singh",
    phone: "+91 76543 21098",
    status: "rejected",
    skill_category: "Plumbing",
    specializations: ["Pipe Fitting", "Leak Repair"],
  },
  {
    id: "4",
    user_id: "user4",
    user: { email: "neha.verma@email.com", role: "engineer" },
    name: "Neha Verma",
    phone: "+91 65432 10987",
    status: "pending",
    skill_category: "Carpentry",
    specializations: ["Furniture", "Cabinet Making"],
  },
];

export default function Engineers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredEngineers = mockEngineers.filter((eng) => {
    const matchesSearch = 
      eng.name?.toLowerCase().includes(search.toLowerCase()) ||
      eng.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || eng.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Engineers</h1>
            <p className="text-muted-foreground mt-1">Manage and verify engineer profiles</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{mockEngineers.length} total engineers</span>
          </div>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEngineers.length > 0 ? (
            filteredEngineers.map((engineer) => (
              <EngineerCard key={engineer.id} engineer={engineer} />
            ))
          ) : (
            <div className="glass-card p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No engineers found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
