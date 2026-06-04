import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, Plus, Trash2, Copy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import usePullToRefresh from '@/hooks/usePullToRefresh';

export default function Chatbots() {
  const [showCreate, setShowCreate] = useState(false);
  const [newBot, setNewBot] = useState({ name: '', description: '', welcome_message: 'Hi! How can I help you today?' });
  const queryClient = useQueryClient();

  const { data: chatbots = [], isLoading, refetch } = useQuery({
    queryKey: ['chatbots'],
    queryFn: () => base44.entities.Chatbot.list('-created_date'),
  });

  const { containerRef, pullDistance, refreshing } = usePullToRefresh(async () => {
    await refetch();
    toast.success('Refreshed');
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Chatbot.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbots'] });
      setShowCreate(false);
      setNewBot({ name: '', description: '', welcome_message: 'Hi! How can I help you today?' });
      toast.success('Chatbot created!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Chatbot.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chatbots'] }); toast.success('Chatbot deleted'); },
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Chatbot.update(id, { status: status === 'active' ? 'inactive' : 'active' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chatbots'] }),
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
          <h1 className="font-heading font-bold text-2xl mb-1">Chatbots</h1>
          <p className="text-sm text-muted-foreground">Create and manage your AI chatbots.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />New Chatbot
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-2xl bg-card/30 border border-border/40 animate-pulse" />)}
        </div>
      ) : chatbots.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-border/40 bg-card/30">
          <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No chatbots yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create your first AI chatbot to get started.</p>
          <Button onClick={() => setShowCreate(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />Create Chatbot
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chatbots.map((bot, i) => (
            <motion.div key={bot.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="p-5 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <button onClick={() => toggleStatus.mutate({ id: bot.id, status: bot.status })}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all ${
                    bot.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' :
                    bot.status === 'training' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}>{bot.status}</button>
              </div>
              <h3 className="font-heading font-semibold mb-1">{bot.name}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{bot.description || 'No description'}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground flex-1"
                  onClick={() => { navigator.clipboard.writeText(`<script src="/widget.js" data-chatbot-uid="${bot.id}"></script>`); toast.success('Embed code copied!'); }}>
                  <Copy className="w-3 h-3 mr-1.5" />Embed
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive"
                  onClick={() => deleteMutation.mutate(bot.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader><DialogTitle className="font-heading">Create New Chatbot</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newBot); }} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input placeholder="My Support Bot" value={newBot.name} onChange={(e) => setNewBot({ ...newBot, name: e.target.value })} required className="bg-secondary/50 border-border/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea placeholder="Describe what this chatbot does..." value={newBot.description} onChange={(e) => setNewBot({ ...newBot, description: e.target.value })} className="bg-secondary/50 border-border/50 h-20" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Welcome Message</label>
              <Input placeholder="Hi! How can I help you?" value={newBot.welcome_message} onChange={(e) => setNewBot({ ...newBot, welcome_message: e.target.value })} className="bg-secondary/50 border-border/50" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Chatbot'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}