import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { EngineerCard } from "@/components/engineers/EngineerCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Users, Loader2, RefreshCw } from "lucide-react";
import { Engineer } from "@/types/engineer";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Engineers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEngineers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEngineers();
      // Map API response to Engineer type
      const mappedEngineers: Engineer[] = data.map((eng: any) => ({
        id: eng.id || eng._id,
        user_id: eng.user_id,
        user: {
          email: eng.user?.email || eng.email || "",
          role: eng.user?.role || "engineer",
        },
        name: eng.name || eng.full_name,
        phone: eng.phone || eng.contact_number,
        status: eng.status,
        skill_category: eng.skill_category,
        specializations: eng.specializations || [],
        preferred_city: eng.preferred_city,
      }));
      setEngineers(mappedEngineers);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch engineers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  const filteredEngineers = engineers.filter((eng) => {
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
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEngineers}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{engineers.length} total engineers</span>
            </div>
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
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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
        )}
      </div>
    </AdminLayout>
  );
}
