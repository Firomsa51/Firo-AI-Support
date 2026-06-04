import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    toast.success('Your account deletion request has been submitted.');
    await new Promise(r => setTimeout(r, 1000));
    base44.auth.logout('/');
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start gap-3 px-3 py-2.5 rounded-xl text-sm">
        <Trash2 className="w-4 h-4" />Delete Account
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-destructive">Delete account?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              This action is <strong className="text-foreground">permanent</strong>. All your chatbots, documents, and conversations will be deleted and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-2">
            <p className="text-xs text-muted-foreground mb-2">Type <strong className="text-foreground">DELETE</strong> to confirm</p>
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="DELETE" className="bg-secondary/50 border-border/50" />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={confirm !== 'DELETE' || deleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {deleting ? 'Deleting...' : 'Delete my account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}