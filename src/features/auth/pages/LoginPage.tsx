import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/user.store';
import { Mail, Lock, Loader, Zap, Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoginError(null);
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.token);
      navigate('/');
    } catch (error: any) {
      setLoginError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f13',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }

        /* Ambient background blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .blob-1 {
          width: 400px; height: 400px;
          background: rgba(139,92,246,0.12);
          top: -100px; left: -100px;
        }
        .blob-2 {
          width: 300px; height: 300px;
          background: rgba(99,102,241,0.08);
          bottom: -80px; right: -60px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
          animation: slideUp 0.35s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px;
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }

        .logo-mark {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 6px 20px rgba(139,92,246,0.35);
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .card-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 28px;
        }

        .error-banner {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          color: #f87171;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .field-group {
          margin-bottom: 16px;
        }

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

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #4b5563;
          pointer-events: none;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 11px 14px 11px 42px;
          color: #f1f5f9;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
        }
        .field-input:focus {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.05);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        .field-input::placeholder { color: #374151; }

        .field-error {
          font-size: 12px;
          color: #f87171;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #4b5563;
          cursor: pointer;
          padding: 4px;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #9ca3af; }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          box-shadow: 0 4px 14px rgba(139,92,246,0.35);
          letter-spacing: -0.1px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139,92,246,0.45);
        }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 28px 0 20px;
        }

        .footer-text {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
        }

        .footer-link {
          color: #a78bfa;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #c4b5fd; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Ambient */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="login-card">
        <div className="card-box">
          <div className="logo-mark">
            <Zap size={22} color="white" fill="white" />
          </div>

          <h1 className="card-title">Welcome back</h1>
          <p className="card-subtitle">Sign in to your TaskFlow account</p>

          {loginError && (
            <div className="error-banner">{loginError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="field-group">
              <label className="field-label">Email</label>
              <div className="field-wrap">
                <Mail size={16} className="field-icon" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="field-input"
                />
              </div>
              {errors.email && <p className="field-error">{errors.email.message as string}</p>}
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="field-input"
                  style={{ paddingRight: 42 }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message as string}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <hr className="divider" />

          <p className="footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="footer-link">Create one</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#374151', marginTop: 20, fontFamily: "'DM Mono', monospace" }}>
          🔒 Secured with JWT authentication
        </p>
      </div>
    </div>
  );
}
