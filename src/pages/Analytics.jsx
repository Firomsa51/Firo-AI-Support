import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BarChart3, MessageSquare, Bot, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

export default function Analytics() {
  const { data: chatbots = [] } = useQuery({ queryKey: ['chatbots'], queryFn: () => base44.entities.Chatbot.list() });
  const { data: conversations = [] } = useQuery({ queryKey: ['conversations'], queryFn: () => base44.entities.Conversation.list() });
  const { data: documents = [] } = useQuery({ queryKey: ['documents'], queryFn: () => base44.entities.Document.list() });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1">Analytics</h1>
        <p className="text-sm text-muted-foreground mb-8">Track your chatbot performance and engagement.</p>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Bot} label="Chatbots" value={chatbots.length} delay={0} />
        <StatCard icon={MessageSquare} label="Conversations" value={conversations.length} delay={0.05} />
        <StatCard icon={BarChart3} label="Documents" value={documents.length} delay={0.1} />
        <StatCard icon={TrendingUp} label="Active" value={chatbots.filter(c => c.status === 'active').length} delay={0.15} />
      </div>
    </div>
  );
}