import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/user.store';
import { LogOut, LayoutDashboard, Zap } from 'lucide-react';

export default function AppLayout() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {  
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f0f13', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        
        * { box-sizing: border-box; }
        
        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: #f9fafb;
          background: rgba(255,255,255,0.06);
        }
        .nav-link.active {
          color: #c4b5fd;
          background: rgba(139,92,246,0.12);
        }
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          background: #8b5cf6;
          border-radius: 0 4px 4px 0;
        }
        
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(239,68,68,0.08);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.15);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.3);
          color: #fca5a5;
        }
        
        .topbar {
          background: rgba(15,15,19,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo-mark {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(139,92,246,0.35);
        }
        
        .main-content {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 32px;
        }
      `}</style>

      {/* Top Navigation */}
      <header className="topbar">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div className="logo-mark">
              <Zap size={18} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#f9fafb', letterSpacing: '-0.3px' }}>TaskFlow</div>
              <div style={{ fontSize: 11, color: '#6b7280', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px' }}>PROJECT MGMT</div>
            </div>
          </Link>

          {/* Nav + User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)', margin: '0 8px' }} />

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              {user && (
                <div style={{ marginRight: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb' }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{user.email}</div>
                </div>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
