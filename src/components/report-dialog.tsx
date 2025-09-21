'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ShieldCheck, FileText } from 'lucide-react';

interface ReportDialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onTextReport: (reason: string) => void;
  onCodeReport: (code: string) => void;
}

export function ReportDialog({
  children,
  isOpen,
  onOpenChange,
  onTextReport,
  onCodeReport
}: ReportDialogProps) {
  const [reportType, setReportType] = useState<'text' | 'code' | null>(null);
  const [reason, setReason] = useState('');
  const [code, setCode] = useState('');

  const handleTextReportSubmit = () => {
    if (reason.trim()) {
      onTextReport(reason);
      resetAndClose();
    }
  };

  const handleCodeReportSubmit = () => {
    if (code.trim()) {
      onCodeReport(code);
      // Don't close here, parent will close on success
    }
  };
  
  const resetAndClose = () => {
    setReportType(null);
    setReason('');
    setCode('');
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetAndClose();
      }
      onOpenChange(open);
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
          <DialogDescription>
            Choose how you would like to report this post.
          </DialogDescription>
        </DialogHeader>

        {!reportType ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" className="h-20" onClick={() => setReportType('text')}>
              <FileText className="mr-2 h-5 w-5" />
              Report with Text
            </Button>
            <Button variant="outline" className="h-20" onClick={() => setReportType('code')}>
              <ShieldCheck className="mr-2 h-5 w-5" />
              Report with Code
            </Button>
          </div>
        ) : reportType === 'text' ? (
          <div className="grid gap-4 py-4">
            <Label htmlFor="reason">Reason for reporting</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide details about why you are reporting this post."
            />
            <DialogFooter>
              <Button variant="secondary" onClick={() => setReportType(null)}>Back</Button>
              <Button onClick={handleTextReportSubmit} disabled={!reason.trim()}>Submit Report</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <Label htmlFor="code">Enter Report Code</Label>
            <Input
              id="code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the special report code"
            />
             <DialogFooter>
              <Button variant="secondary" onClick={() => setReportType(null)}>Back</Button>
              <Button onClick={handleCodeReportSubmit} disabled={!code.trim()}>Submit Code</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
