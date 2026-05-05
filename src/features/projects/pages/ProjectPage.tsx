import { useParams } from 'react-router-dom';
import { useCreateTask, useDeleteTask, useProject, useTasks, useUpdateTask } from '../../tasks/hooks';
import { TaskPriority, TaskStatus } from '../../../shared/types';
import {
  Loader, ChevronRight, Plus, Trash2, User2, Flag, Calendar
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { TASK_COLUMNS } from '../../tasks/constants';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { tasks = [], loading, refetch } = useTasks(id!);
  const { project } = useProject(id!);
  const { updateTask } = useUpdateTask();
  const { createTask, loading: creatingTask } = useCreateTask();
  const { deleteTask } = useDeleteTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const members = useMemo(
    () => (project?.members || []).map((member: any) => member.user).filter(Boolean),
    [project],
  );

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTask({ taskId, data: { status } });
    refetch();
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    refetch();
  };

  const handleCreate = async () => {
    if (!id || !title.trim()) return;
    await createTask(id, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      assignee_id: assigneeId || undefined,
    });
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    setDueDate('');
    setAssigneeId('');
    refetch();
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <Loader size={28} color="#8b5cf6" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t: any) => t.status === TaskStatus.DONE).length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }

        .page-title {
          font-size: 26px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.4px;
          font-family: 'DM Sans', sans-serif;
        }
        .create-wrap {
          margin-top: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px;
          display: grid;
          gap: 10px;
        }
        .create-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 10px;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 9px 12px;
          color: #f1f5f9;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          color-scheme: dark;
        }
        .field-input:focus {
          border-color: rgba(139,92,246,0.5);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        select.field-input option {
          background: #111827;
          color: #f3f4f6;
        }
        .create-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
        }

        .kanban-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 28px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .kanban-grid { grid-template-columns: 1fr; }
        }

        .column-wrap {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .column-header {
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .column-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .col-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .col-label {
          font-size: 14px;
          font-weight: 600;
          color: #e5e7eb;
          letter-spacing: -0.1px;
        }

        .col-count {
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
          padding: 2px 9px;
          border-radius: 100px;
          background: rgba(255,255,255,0.06);
          color: #9ca3af;
        }

        .column-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 120px;
        }

        .task-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
          cursor: default;
        }
        .task-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        }

        .task-title {
          font-size: 14px;
          font-weight: 600;
          color: #e5e7eb;
          margin-bottom: 4px;
          letter-spacing: -0.1px;
        }

        .task-desc {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .task-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          align-items: center;
        }

        .move-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .move-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #e5e7eb;
          border-color: rgba(255,255,255,0.15);
        }
        .meta-chip {
          font-size: 11px;
          color: #a1a1aa;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          padding: 3px 8px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .delete-btn {
          margin-left: auto;
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          background: rgba(239,68,68,0.08);
        }

        .empty-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          text-align: center;
          gap: 8px;
        }

        .progress-bar-wrap {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 100px;
          overflow: hidden;
          flex: 1;
          max-width: 160px;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #10b981);
          border-radius: 100px;
          transition: width 0.5s ease;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: '#6b7280', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', marginBottom: 6 }}>PROJECT BOARD</p>
          <h1 className="page-title">Task Board</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>
            {totalTasks} task{totalTasks !== 1 ? 's' : ''} · {doneTasks} completed
          </p>
        </div>

        {totalTasks > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', fontFamily: "'DM Mono', monospace" }}>
              {progress}%
            </span>
          </div>
        )}
      </div>

      <div className="create-wrap">
        <input
          className="field-input"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="field-input"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="create-grid">
          <select className="field-input" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value={TaskPriority.LOW}>Low priority</option>
            <option value={TaskPriority.MEDIUM}>Medium priority</option>
            <option value={TaskPriority.HIGH}>High priority</option>
          </select>
          <input className="field-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <select className="field-input" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {members.map((member: any) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <button className="create-btn" onClick={handleCreate} disabled={creatingTask || !title.trim()}>
            {creatingTask ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={13} />}
            {creatingTask ? 'Creating...' : 'Add Task'}
          </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="kanban-grid">
        {TASK_COLUMNS.map((col) => {
          const Icon = col.icon;
          const columnTasks = tasks.filter((t: any) => t.status === col.key);

          return (
            <div key={col.key} className="column-wrap">
              {/* Column Header */}
              <div className="column-header" style={{ background: col.headerBg }}>
                <div className="column-header-left">
                  <div className="col-dot" style={{ background: col.accent, boxShadow: `0 0 6px ${col.accent}` }} />
                  <span className="col-label">{col.label}</span>
                </div>
                <span className="col-count">{columnTasks.length}</span>
              </div>

              {/* Tasks */}
              <div className="column-body">
                {columnTasks.length === 0 ? (
                  <div className="empty-col">
                    <Icon size={22} color={col.accent} style={{ opacity: 0.4 }} />
                    <p style={{ fontSize: 12, color: '#4b5563', fontFamily: 'DM Sans, sans-serif' }}>No tasks here</p>
                  </div>
                ) : (
                  columnTasks.map((task: any) => (
                    <div key={task.id} className="task-card">
                      <div className="task-title">{task.title}</div>
                      {task.description && (
                        <div className="task-desc">{task.description}</div>
                      )}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span className="meta-chip"><Flag size={10} /> {task.priority || 'medium'}</span>
                        {task.assignee?.name && <span className="meta-chip"><User2 size={10} /> {task.assignee.name}</span>}
                        {task.dueDate && <span className="meta-chip"><Calendar size={10} /> {task.dueDate}</span>}
                      </div>
                      <div className="task-actions">
                        {TASK_COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                          <button
                            key={c.key}
                            className="move-btn"
                            onClick={() => handleStatusChange(task.id, c.key)}
                          >
                            <ChevronRight size={10} />
                            {c.label}
                          </button>
                        ))}
                        <button className="move-btn delete-btn" onClick={() => handleDelete(task.id)}>
                          <Trash2 size={10} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
