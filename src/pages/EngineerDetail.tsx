import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DocumentPreview } from "@/components/engineers/DocumentPreview";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Mail, Phone, User, Shield, CreditCard, AlertCircle, 
  Loader2, Check, X, MapPin, Building, Hash, Briefcase 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EngineerDetails } from "@/types/engineer";
import { api } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type SectionType = "kyc" | "bank";
type ActionType = "approve_all" | "reject_all" | "unhold";

export default function EngineerDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingSection, setLoadingSection] = useState<SectionType | null>(null);
  const [loadingAction, setLoadingAction] = useState<ActionType | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [engineer, setEngineer] = useState<EngineerDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; section: SectionType | "all" | null }>({
    open: false,
    section: null,
  });
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (userId) {
      fetchEngineerDetails();
    }
  }, [userId]);

  const fetchEngineerDetails = async () => {
    if (!userId) return;
    
    setIsFetching(true);
    setError(null);
    try {
      const data = await api.getEngineerDetails(userId);
      setEngineer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch engineer details");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch engineer details",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleApproveAll = async () => {
    if (!userId) return;
    
    setLoadingAction("approve_all");
    try {
      const response = await api.approveEngineer(userId);
      toast({
        title: "Engineer Approved",
        description: response.message || "Engineer has been fully approved and synced.",
      });
      fetchEngineerDetails();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve engineer.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectAll = async () => {
    if (!userId) return;
    
    setLoadingAction("reject_all");
    try {
      const response = await api.rejectEngineer(userId, remarks);
      toast({
        title: "Engineer Rejected",
        description: response.message || "Engineer has been rejected.",
      });
      setRejectDialog({ open: false, section: null });
      setRemarks("");
      fetchEngineerDetails();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject engineer.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUnhold = async () => {
    if (!userId) return;
    
    setLoadingAction("unhold");
    try {
      const response = await api.unholdEngineer(userId);
      toast({
        title: "Engineer Unhold",
        description: response.message || "Engineer has been unhold.",
      });
      fetchEngineerDetails();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unhold engineer.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveSection = async (section: SectionType) => {
    if (!userId) return;
    
    setLoadingSection(section);
    try {
      let response;
      if (section === "kyc") {
        response = await api.updateKycStatus(userId, "approved");
      } else {
        response = await api.updateBankStatus(userId, "approved");
      }
      
      toast({
        title: `${section.toUpperCase()} Approved`,
        description: response.message || `The ${section} has been approved.`,
      });
      fetchEngineerDetails();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to approve ${section}.`,
        variant: "destructive",
      });
    } finally {
      setLoadingSection(null);
    }
  };

  const handleRejectSection = async () => {
    if (!userId || !rejectDialog.section || rejectDialog.section === "all") return;
    
    const section = rejectDialog.section;
    setLoadingSection(section);
    try {
      let response;
      if (section === "kyc") {
        response = await api.updateKycStatus(userId, "rejected", remarks);
      } else {
        response = await api.updateBankStatus(userId, "rejected", remarks);
      }
      
      toast({
        title: `${section.toUpperCase()} Rejected`,
        description: response.message || `The ${section} has been rejected.`,
      });
      setRejectDialog({ open: false, section: null });
      setRemarks("");
      fetchEngineerDetails();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to reject ${section}.`,
        variant: "destructive",
      });
    } finally {
      setLoadingSection(null);
    }
  };

  const getProfileStatus = () => {
    if (!engineer?.profile) return "pending";
    return engineer.profile.status || "pending";
  };

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !engineer) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">{error || "Engineer not found"}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/engineers")}
            >
              Go back to Engineers
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const SectionActions = ({ section, status }: { section: SectionType; status: string | undefined }) => {
    const isLoading = loadingSection === section;
    const isApproved = status === "approved";
    
    if (isApproved) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600 mt-4">
          <Check className="w-4 h-4" />
          <span>Approved</span>
        </div>
      );
    }

    return (
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => setRejectDialog({ open: true, section })}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
          Reject
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => handleApproveSection(section)}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
          Approve
        </Button>
      </div>
    );
  };

  const isEngineerVerified = engineer.profile?.status === "verified";
  const isOnHold = engineer.profile?.is_hold;

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {engineer.profile?.name || "Unknown Engineer"}
              </h1>
              {isOnHold && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                  On Hold
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Review and manage engineer verification
            </p>
          </div>
          
          {/* Global Actions */}
          <div className="flex gap-2">
            {!isEngineerVerified && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setRejectDialog({ open: true, section: "all" })}
                  disabled={loadingAction === "reject_all"}
                >
                  {loadingAction === "reject_all" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  Reject All
                </Button>
                <Button
                  onClick={handleApproveAll}
                  disabled={loadingAction === "approve_all"}
                >
                  {loadingAction === "approve_all" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Approve All
                </Button>
              </>
            )}
          </div>
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
                <StatusBadge status={getProfileStatus()} />
              </div>
            </div>

            {engineer.profile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{engineer.profile.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{engineer.profile.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{engineer.profile.preferred_city || engineer.profile.current_location || "Not provided"}</span>
                </div>
                {engineer.profile.pincode && (
                  <div className="flex items-center gap-3 text-sm">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span>Pincode: {engineer.profile.pincode}</span>
                  </div>
                )}
                
                {/* Skills */}
                {engineer.profile.skills && engineer.profile.skills.length > 0 && (
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {engineer.profile.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Specializations */}
                {engineer.profile.specializations && engineer.profile.specializations.length > 0 && (
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Specializations</p>
                    <div className="flex flex-wrap gap-1">
                      {engineer.profile.specializations.map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <Badge variant={engineer.profile.isAvailable ? "default" : "secondary"}>
                      {engineer.profile.isAvailable ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">User ID</p>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
                    {engineer.user.id}
                  </code>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No profile submitted</p>
              </div>
            )}
            
            {/* Profile Unhold Action */}
            {isOnHold && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleUnhold}
                  disabled={loadingAction === "unhold"}
                >
                  {loadingAction === "unhold" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Unhold Profile
                </Button>
              </div>
            )}
          </div>

          {/* KYC Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">KYC Verification</h2>
                <StatusBadge status={engineer.kyc?.status || "pending"} />
              </div>
            </div>

            {engineer.kyc ? (
              <div className="space-y-4">
                {/* Aadhaar & PAN */}
                {engineer.kyc.aadhaar_number && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Aadhaar: </span>
                    <span className="font-mono">{engineer.kyc.aadhaar_number}</span>
                  </div>
                )}
                {engineer.kyc.pan_number && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">PAN: </span>
                    <span className="font-mono">{engineer.kyc.pan_number}</span>
                  </div>
                )}
                {engineer.kyc.address_proof_type && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Address Proof Type: </span>
                    <span>{engineer.kyc.address_proof_type}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-border/50 space-y-3">
                  <DocumentPreview
                    url={engineer.kyc.photo_file}
                    label="Photo ID"
                  />
                  <DocumentPreview
                    url={engineer.kyc.address_proof_file}
                    label="Address Proof"
                  />
                </div>
                
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
                <StatusBadge status={engineer.bank?.status || "pending"} />
              </div>
            </div>

            {engineer.bank ? (
              <div className="space-y-4">
                {engineer.bank.bank_name && (
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>{engineer.bank.bank_name}</span>
                  </div>
                )}
                {engineer.bank.account_number && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Account: </span>
                    <span className="font-mono">{engineer.bank.account_number}</span>
                  </div>
                )}
                {engineer.bank.ifsc_code && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">IFSC: </span>
                    <span className="font-mono">{engineer.bank.ifsc_code}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-border/50">
                  <DocumentPreview
                    url={engineer.bank.proof_file}
                    label="Bank Proof"
                  />
                </div>
                
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

      {/* Reject Dialog */}
      <AlertDialog 
        open={rejectDialog.open} 
        onOpenChange={(open) => setRejectDialog({ open, section: open ? rejectDialog.section : null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {rejectDialog.section === "all" 
                ? "Reject Engineer" 
                : `Reject ${rejectDialog.section?.toUpperCase()}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejection. This will be visible to the engineer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Enter rejection remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setRemarks(""); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={rejectDialog.section === "all" ? handleRejectAll : handleRejectSection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
