import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Trash2, Upload, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import usePullToRefresh from '@/hooks/usePullToRefresh';

export default function Documents() {
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date'),
  });

  const { containerRef, pullDistance, refreshing } = usePullToRefresh(async () => {
    await refetch();
    toast.success('Refreshed');
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['documents'] }); toast.success('Document deleted'); },
  });

  return (
    <div ref={containerRef}>
      <AnimatePresence>
        {(pullDistance > 0 || refreshing) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: pullDistance > 0 ? pullDistance : 40 }}
            exit={{ opacity: 0, height: 0 }} className="flex items-center justify-center overflow-hidden">
            <RefreshCw className={`w-5 h-5 text-primary ${refreshing ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${pullDistance * 3}deg)` }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl mb-1">Documents</h1>
          <p className="text-sm text-muted-foreground">Upload and manage your knowledge base documents.</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Upload className="w-4 h-4 mr-2" />Upload Document
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-card/30 border border-border/40 animate-pulse" />)}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-border/40 bg-card/30">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No documents yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Upload documents to train your chatbots.</p>
          <Button onClick={() => setShowUpload(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Upload className="w-4 h-4 mr-2" />Upload Document
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="p-4 rounded-xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.file_type.toUpperCase()}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive"
                onClick={() => deleteMutation.mutate(doc.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}