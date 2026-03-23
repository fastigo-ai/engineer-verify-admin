import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DocumentPreview } from "@/components/engineers/DocumentPreview";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Mail, Phone, User, Shield, CreditCard, AlertCircle, 
  Loader2, Check, X, MapPin, Building, Hash, Briefcase,
  Edit2, Save, RotateCcw, Upload, Calendar
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SectionType = "kyc" | "bank";
type ActionType = "approve_all" | "reject_all" | "unhold" | "save_profile" | "upload_kyc" | "upload_bank";

export default function EngineerDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingSection, setLoadingSection] = useState<SectionType | null>(null);
  const [loadingAction, setLoadingAction] = useState<ActionType | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [engineer, setEngineer] = useState<EngineerDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const kycPhotoRef = useRef<HTMLInputElement>(null);
  const kycAddressRef = useRef<HTMLInputElement>(null);
  const bankProofRef = useRef<HTMLInputElement>(null);

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
      // Initialize edit data
      if (data.profile) {
        setEditData({
          fullName: data.profile.name || "",
          dob: data.profile.dob || "",
          gender: data.profile.gender || "",
          contactNumber: data.profile.phone || "",
          email: data.profile.email || "",
          skillCategories: data.profile.skills || [],
          specializations: data.profile.specializations || [],
          preferredCity: data.profile.preferred_city || "",
          currentLocation: data.profile.current_location || "",
          pincode: data.profile.pincode || "",
          isAvailable: data.profile.isAvailable || false,
          // KYC numbers
          aadhaarNumber: data.kyc?.aadhaar_number || "",
          panNumber: data.kyc?.pan_number || "",
          addressProofType: data.kyc?.address_proof_type || "Aadhaar Card",
          // Bank details
          bankName: data.bank?.bank_name || "",
          accountNumber: data.bank?.account_number || "",
          ifscCode: data.bank?.ifsc_code || "",
        });
      }
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

  const handleSaveProfile = async () => {
    if (!userId || !editData) return;
    setLoadingAction("save_profile");
    try {
      const payload = {
        full_name: editData.fullName,
        dob: editData.dob,
        gender: editData.gender,
        contact_number: editData.contactNumber,
        email: editData.email,
        skill_category: editData.skillCategories,
        specializations: editData.specializations,
        preferred_city: editData.preferredCity,
        current_location: editData.currentLocation,
        pincode: editData.pincode,
        isAvailable: editData.isAvailable,
      };
      await api.updateEngineerProfile(userId, payload);
      toast({ title: "Profile Updated", description: "Engineer profile has been updated successfully." });
      setIsEditing(false);
      fetchEngineerDetails();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update profile", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUploadKyc = async () => {
    if (!userId || !editData) return;
    setLoadingAction("upload_kyc");
    try {
      const formData = new FormData();
      formData.append("aadhaar_number", editData.aadhaarNumber);
      formData.append("pan_number", editData.panNumber);
      formData.append("address_proof_type", editData.addressProofType);
      
      if (kycPhotoRef.current?.files?.[0]) {
        formData.append("photo_file", kycPhotoRef.current.files[0]);
      }
      if (kycAddressRef.current?.files?.[0]) {
        formData.append("address_proof_file", kycAddressRef.current.files[0]);
      }

      await api.uploadEngineerKyc(userId, formData);
      toast({ title: "KYC Documents Updated", description: "KYC documents have been uploaded successfully." });
      fetchEngineerDetails();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to upload KYC", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUploadBank = async () => {
    if (!userId || !editData) return;
    setLoadingAction("upload_bank");
    try {
      const formData = new FormData();
      formData.append("bank_name", editData.bankName);
      formData.append("account_number", editData.accountNumber);
      formData.append("ifsc_code", editData.ifscCode);
      
      if (bankProofRef.current?.files?.[0]) {
        formData.append("proof_file", bankProofRef.current.files[0]);
      }

      await api.uploadEngineerBank(userId, formData);
      toast({ title: "Bank Details Updated", description: "Bank details have been updated successfully." });
      fetchEngineerDetails();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update bank details", variant: "destructive" });
    } finally {
      setLoadingAction(null);
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
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            ) : (
              <Button variant="outline" onClick={() => { setIsEditing(false); fetchEngineerDetails(); }} className="text-muted-foreground">
                <RotateCcw className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}

            {!isEditing && (
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
                  {isEngineerVerified ? "Re-Approve & Sync" : "Approve All"}
                </Button>
              </>
            )}

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Profile</h2>
                  <StatusBadge status={getProfileStatus()} />
                </div>
              </div>
              {isEditing && (
                <Button size="sm" onClick={handleSaveProfile} disabled={loadingAction === "save_profile"}>
                  {loadingAction === "save_profile" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {engineer.profile ? (
              <div className="space-y-4">
                {!isEditing ? (
                  <>
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
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Full Name</Label>
                      <Input value={editData.fullName} onChange={(e) => setEditData({...editData, fullName: e.target.value})} className="h-8 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1">
                        <Label className="text-xs">Email</Label>
                        <Input value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Phone</Label>
                        <Input value={editData.contactNumber} onChange={(e) => setEditData({...editData, contactNumber: e.target.value})} className="h-8 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1">
                        <Label className="text-xs">DOB</Label>
                        <Input type="date" value={editData.dob} onChange={(e) => setEditData({...editData, dob: e.target.value})} className="h-8 text-sm px-1" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Gender</Label>
                        <Input value={editData.gender} onChange={(e) => setEditData({...editData, gender: e.target.value})} className="h-8 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1">
                        <Label className="text-xs">City</Label>
                        <Input value={editData.preferredCity} onChange={(e) => setEditData({...editData, preferredCity: e.target.value})} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Pincode</Label>
                        <Input value={editData.pincode} onChange={(e) => setEditData({...editData, pincode: e.target.value})} className="h-8 text-sm" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Skills */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(engineer.profile.skills || []).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
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
            {isOnHold && !isEditing && (
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">KYC Verification</h2>
                  <StatusBadge status={engineer.kyc?.status || "pending"} />
                </div>
              </div>
              {isEditing && (
                <Button size="sm" onClick={handleUploadKyc} disabled={loadingAction === "upload_kyc"}>
                  {loadingAction === "upload_kyc" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {engineer.kyc || isEditing ? (
              <div className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Aadhaar: </span>
                      <span className="font-mono">{engineer.kyc?.aadhaar_number}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">PAN: </span>
                      <span className="font-mono">{engineer.kyc?.pan_number}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Address Proof Type: </span>
                      <span>{engineer.kyc?.address_proof_type}</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Aadhaar Number</Label>
                      <Input value={editData.aadhaarNumber} onChange={(e) => setEditData({...editData, aadhaarNumber: e.target.value})} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">PAN Number</Label>
                      <Input value={editData.panNumber} onChange={(e) => setEditData({...editData, panNumber: e.target.value})} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Photo (Upload)</Label>
                      <Input type="file" ref={kycPhotoRef} className="h-8 text-sm py-0.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Address Proof (Upload)</Label>
                      <Input type="file" ref={kycAddressRef} className="h-8 text-sm py-0.5" />
                    </div>
                  </div>
                )}
                
                {!isEditing && engineer.kyc && (
                  <div className="pt-3 border-t border-border/50 space-y-3">
                    <DocumentPreview url={engineer.kyc.photo_file} label="Photo ID" />
                    <DocumentPreview url={engineer.kyc.address_proof_file} label="Address Proof" />
                  </div>
                )}
                
                {engineer.kyc?.remarks && (
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Bank Details</h2>
                  <StatusBadge status={engineer.bank?.status || "pending"} />
                </div>
              </div>
              {isEditing && (
                <Button size="sm" onClick={handleUploadBank} disabled={loadingAction === "upload_bank"}>
                  {loadingAction === "upload_bank" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {engineer.bank || isEditing ? (
              <div className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span>{engineer.bank?.bank_name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Account: </span>
                      <span className="font-mono">{engineer.bank?.account_number}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">IFSC: </span>
                      <span className="font-mono">{engineer.bank?.ifsc_code}</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Bank Name</Label>
                      <Input value={editData.bankName} onChange={(e) => setEditData({...editData, bankName: e.target.value})} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Account Number</Label>
                      <Input value={editData.accountNumber} onChange={(e) => setEditData({...editData, accountNumber: e.target.value})} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">IFSC Code</Label>
                      <Input value={editData.ifscCode} onChange={(e) => setEditData({...editData, ifscCode: e.target.value})} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Bank Proof (Upload)</Label>
                      <Input type="file" ref={bankProofRef} className="h-8 text-sm py-0.5" />
                    </div>
                  </div>
                )}
                
                {!isEditing && engineer.bank && (
                  <div className="pt-3 border-t border-border/50">
                    <DocumentPreview url={engineer.bank.proof_file} label="Bank Proof" />
                  </div>
                )}
                
                {engineer.bank?.remarks && (
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
