import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
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

interface ActionButtonsProps {
  onApprove: () => Promise<void>;
  onReject: (remarks?: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ActionButtons({ onApprove, onReject, isLoading, disabled }: ActionButtonsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [remarks, setRemarks] = useState("");

  const handleApprove = async () => {
    await onApprove();
    setShowApproveDialog(false);
  };

  const handleReject = async () => {
    await onReject(remarks || undefined);
    setShowRejectDialog(false);
    setRemarks("");
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setShowApproveDialog(true)}
          disabled={disabled || isLoading}
          className="bg-success hover:bg-success/90 text-success-foreground"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Approve
        </Button>
        <Button
          onClick={() => setShowRejectDialog(true)}
          disabled={disabled || isLoading}
          variant="destructive"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4 mr-2" />
          )}
          Reject
        </Button>
      </div>

      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Engineer</AlertDialogTitle>
            <AlertDialogDescription>
              This will approve the engineer's KYC, bank details, and profile. They will be synced to the external system and marked as verified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary hover:bg-secondary/80">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Confirm Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Engineer</AlertDialogTitle>
            <AlertDialogDescription>
              This will reject the engineer's application. You can provide remarks explaining the reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary hover:bg-secondary/80">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
