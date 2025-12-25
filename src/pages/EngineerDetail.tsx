import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DocumentPreview } from "@/components/engineers/DocumentPreview";
import { ActionButtons } from "@/components/engineers/ActionButtons";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, User, Shield, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EngineerDetails } from "@/types/engineer";

// Mock data - replace with API call
const mockEngineerDetails: EngineerDetails = {
  user: {
    id: "user1",
    email: "rajesh.kumar@email.com",
    role: "engineer",
  },
  profile: {
    id: "profile1",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    status: "pending",
  },
  kyc: {
    id: "kyc1",
    status: "pending",
    remarks: null,
    photo_file: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    address_proof_file: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
  },
  bank: {
    id: "bank1",
    status: "pending",
    remarks: null,
    proof_file: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
  },
};

export default function EngineerDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // In real app, fetch data based on userId
  const engineer = mockEngineerDetails;

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Engineer Approved",
        description: "The engineer has been approved and synced successfully.",
      });
      navigate("/engineers");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve engineer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (remarks?: string) => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Engineer Rejected",
        description: "The engineer application has been rejected.",
      });
      navigate("/engineers");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject engineer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!engineer) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Engineer not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-slide-up">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/engineers")}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">
              {engineer.profile?.name || "Unknown Engineer"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage engineer verification
            </p>
          </div>
          <ActionButtons
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Profile</h2>
                <StatusBadge status={engineer.profile?.status} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{engineer.user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{engineer.profile?.phone || "Not provided"}</span>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1">User ID</p>
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {engineer.user.id}
                </code>
              </div>
            </div>
          </div>

          {/* KYC Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">KYC Verification</h2>
                <StatusBadge status={engineer.kyc?.status} />
              </div>
            </div>

            {engineer.kyc ? (
              <div className="space-y-4">
                <DocumentPreview
                  url={engineer.kyc.photo_file}
                  label="Photo ID"
                />
                <DocumentPreview
                  url={engineer.kyc.address_proof_file}
                  label="Address Proof"
                />
                {engineer.kyc.remarks && (
                  <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                    <p className="text-sm">{engineer.kyc.remarks}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No KYC submitted</p>
              </div>
            )}
          </div>

          {/* Bank Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Bank Details</h2>
                <StatusBadge status={engineer.bank?.status} />
              </div>
            </div>

            {engineer.bank ? (
              <div className="space-y-4">
                <DocumentPreview
                  url={engineer.bank.proof_file}
                  label="Bank Proof"
                />
                {engineer.bank.remarks && (
                  <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                    <p className="text-sm">{engineer.bank.remarks}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No bank details submitted</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
