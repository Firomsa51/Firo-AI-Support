import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="p-5 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {trend && <span className="text-xs font-medium text-emerald-400">+{trend}%</span>}
      </div>
      <p className="font-heading font-bold text-2xl">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}