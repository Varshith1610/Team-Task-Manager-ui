import {
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { TaskStatus } from '../../shared/types';

export const PROJECT_COLORS = [
  { gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', glow: 'rgba(139,92,246,0.25)' },
  { gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', glow: 'rgba(6,182,212,0.25)' },
  { gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', glow: 'rgba(16,185,129,0.25)' },
  { gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', glow: 'rgba(245,158,11,0.25)' },
  { gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.25)' },
  { gradient: 'linear-gradient(135deg, #14b8a6, #3b82f6)', glow: 'rgba(20,184,166,0.25)' },
];

export const TASK_COLUMNS = [
  {
    key: TaskStatus.TODO,
    label: 'To Do',
    icon: AlertCircle,
    accent: '#6b7280',
    glow: 'rgba(107,114,128,0.15)',
    headerBg: 'rgba(107,114,128,0.08)',
    dot: '#6b7280',
  },
  {
    key: TaskStatus.IN_PROGRESS,
    label: 'In Progress',
    icon: Clock,
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.15)',
    headerBg: 'rgba(59,130,246,0.08)',
    dot: '#3b82f6',
  },
  {
    key: TaskStatus.DONE,
    label: 'Done',
    icon: CheckCircle2,
    accent: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
    headerBg: 'rgba(16,185,129,0.08)',
    dot: '#10b981',
  },
];
