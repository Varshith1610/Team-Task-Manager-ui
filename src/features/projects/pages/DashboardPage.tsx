import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, ArrowRight, Loader, X, Hash } from 'lucide-react';
import { useCreateProject, useProjects } from '../useProjects';
import { useDashboardStats } from '../../tasks/hooks';
import { PROJECT_COLORS } from '../../tasks/constants';

export default function DashboardPage() {
  const { projects = [], loading, error, refetch } = useProjects();
  const { createProject, loading: creating, error: createError } = useCreateProject();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const { stats, loading: statsLoading } = useDashboardStats(selectedProjectId || projects[0]?.id);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createProject({ name: name.trim(), description: description.trim() || undefined });
      setShowModal(false);
      setName('');
      setDescription('');
      refetch();
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) handleCreate();
    if (e.key === 'Escape') { setShowModal(false); setName(''); setDescription(''); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #f9fafb;
          letter-spacing: -0.5px;
          font-family: 'DM Sans', sans-serif;
        }

        .page-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
          font-family: 'DM Sans', sans-serif;
        }

        .new-project-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(139,92,246,0.35);
          font-family: 'DM Sans', sans-serif;
        }
        .new-project-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139,92,246,0.45);
        }
        .new-project-btn:active { transform: translateY(0); }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 32px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 18px;
          margin-bottom: 28px;
        }
        @media (max-width: 980px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .metric-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px;
        }
        .metric-label {
          font-size: 11px;
          color: #6b7280;
          font-family: 'DM Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .metric-value {
          margin-top: 8px;
          font-size: 20px;
          font-weight: 700;
          color: #f3f4f6;
        }
        .assignee-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .assignee-chip {
          font-size: 12px;
          color: #c4b5fd;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.24);
          border-radius: 999px;
          padding: 4px 10px;
        }

        .project-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: inherit;
          background: rgba(255,255,255,0.03);
        }
        .project-card:hover {
          border-color: rgba(139,92,246,0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .project-card:hover::before { opacity: 1; }

        .project-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          position: relative;
        }

        .project-name {
          font-size: 16px;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 6px;
          letter-spacing: -0.2px;
        }

        .project-desc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .open-label {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.3px;
        }

        .arrow-icon {
          color: #6b7280;
          transition: all 0.2s;
        }
        .project-card:hover .arrow-icon {
          color: #8b5cf6;
          transform: translateX(3px);
        }

        /* Empty state */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }

        .empty-icon-wrap {
          width: 72px;
          height: 72px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-box {
          background: #1a1a24;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          width: 100%;
          max-width: 440px;
          overflow: hidden;
          animation: slideUp 0.2s ease;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
        }

        .modal-header {
          padding: 24px 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.3px;
        }

        .modal-close {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: none;
          color: #9ca3af;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          font-family: inherit;
        }
        .modal-close:hover {
          background: rgba(255,255,255,0.1);
          color: #f1f5f9;
        }

        .modal-body { padding: 20px 24px; }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
          font-family: 'DM Mono', monospace;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 14px;
          color: #f1f5f9;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
          color-scheme: dark;
        }
        .field-input:focus {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.05);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        select.field-input option {
          background: #111827;
          color: #f3f4f6;
        }
        .field-input::placeholder { color: #4b5563; }

        textarea.field-input {
          resize: none;
          height: 80px;
        }

        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn-cancel {
          padding: 9px 18px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          color: #9ca3af;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-cancel:hover {
          background: rgba(255,255,255,0.08);
          color: #f1f5f9;
        }

        .btn-create {
          padding: 9px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 12px rgba(139,92,246,0.3);
        }
        .btn-create:hover:not(:disabled) {
          box-shadow: 0 6px 16px rgba(139,92,246,0.45);
          transform: translateY(-1px);
        }
        .btn-create:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          color: #a78bfa;
          font-family: 'DM Mono', monospace;
          margin-bottom: 32px;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage and track all your team projects</p>
        </div>
        <button className="new-project-btn" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          New Project
        </button>
      </div>

      {!loading && !error && projects.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <div className="stat-chip" style={{ marginBottom: 0 }}>
              <Hash size={11} />
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </div>
            <select
              className="field-input"
              style={{ maxWidth: 280, height: 32 }}
              value={selectedProjectId || projects[0]?.id}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((project: any) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Total tasks</div>
              <div className="metric-value">{statsLoading ? '...' : stats?.total ?? 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">To Do</div>
              <div className="metric-value">{statsLoading ? '...' : (stats?.byStatus || []).find((item: any) => item.status === 'todo')?.count ?? 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">In Progress</div>
              <div className="metric-value">{statsLoading ? '...' : (stats?.byStatus || []).find((item: any) => item.status === 'in_progress')?.count ?? 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Overdue</div>
              <div className="metric-value">{statsLoading ? '...' : stats?.overdue ?? 0}</div>
            </div>
          </div>
          <div className="metric-card" style={{ marginBottom: 24 }}>
            <div className="metric-label">Tasks per user</div>
            <div className="assignee-list">
              {(stats?.perUser || []).length === 0 && <span className="assignee-chip">No assignees yet</span>}
              {(stats?.perUser || []).map((entry: any) => (
                <span key={`${entry.name || 'unassigned'}-${entry.taskCount}`} className="assignee-chip">
                  {(entry.name || 'Unassigned')}: {entry.taskCount}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* States */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Loader size={28} color="#8b5cf6" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '20px 24px', color: '#f87171', fontSize: 14 }}>
          Unable to load projects. Please try again.
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Folder size={30} color="#8b5cf6" />
          </div>
          <p style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No projects yet</p>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Create your first project to get started</p>
          <button className="new-project-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Project
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project: any, i: number) => {
            const color = PROJECT_COLORS[i % PROJECT_COLORS.length];
            return (
              <div
                key={project.id}
                className="project-card"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="project-icon" style={{ background: color.gradient, boxShadow: `0 4px 14px ${color.glow}` }}>
                  <Folder size={20} color="white" />
                </div>
                <div className="project-name">{project.name}</div>
                {project.description && (
                  <div className="project-desc">{project.description}</div>
                )}
                <div className="project-footer">
                  <span className="open-label">view project</span>
                  <ArrowRight size={16} className="arrow-icon" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && (setShowModal(false), setName(''), setDescription(''))}>
          <div className="modal-box" onKeyDown={handleKeyDown}>
            <div className="modal-header">
              <div className="modal-title">New Project</div>
              <button className="modal-close" onClick={() => { setShowModal(false); setName(''); setDescription(''); }}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="field-label">Project Name *</label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Website Redesign"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Description <span style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'DM Sans', fontWeight: 400, color: '#4b5563' }}>(optional)</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                  className="field-input"
                />
              </div>
              {createError && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>
                  Failed to create project. Please try again.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => { setShowModal(false); setName(''); setDescription(''); }}>
                Cancel
              </button>
              <button className="btn-create" disabled={creating || !name.trim()} onClick={handleCreate}>
                {creating ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
                {creating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
