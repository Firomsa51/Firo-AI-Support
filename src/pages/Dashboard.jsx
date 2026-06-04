import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bot, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: chatbots = [] } = useQuery({ queryKey: ['chatbots'], queryFn: () => base44.entities.Chatbot.list() });
  const { data: documents = [] } = useQuery({ queryKey: ['documents'], queryFn: () => base44.entities.Document.list() });
  const { data: conversations = [] } = useQuery({ queryKey: ['conversations'], queryFn: () => base44.entities.Conversation.list() });

  const stats = [
    { icon: Bot, label: 'Total Chatbots', value: chatbots.length, delay: 0 },
    { icon: FileText, label: 'Documents', value: documents.length, delay: 0.05 },
    { icon: MessageSquare, label: 'Conversations', value: conversations.length, delay: 0.1 },
    { icon: TrendingUp, label: 'Active Chatbots', value: chatbots.filter(c => c.status === 'active').length, delay: 0.15 },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-8">Welcome back. Here's an overview of your chatbots.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border/40 bg-card/30 p-6">
        <h2 className="font-heading font-semibold text-lg mb-4">Recent Chatbots</h2>
        {chatbots.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No chatbots yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chatbots.slice(0, 5).map((bot) => (
              <div key={bot.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{bot.name}</p>
                    <p className="text-xs text-muted-foreground">{bot.description || 'No description'}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  bot.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                  bot.status === 'training' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-muted text-muted-foreground'
                }`}>{bot.status}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}