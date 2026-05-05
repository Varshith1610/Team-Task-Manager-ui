import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/user.store';
import { Loader, Zap, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch('password');

  const getStrength = (): { label: string; color: string; width: string } => {
    if (!password) return { label: '', color: '#374151', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (password.length < 10) return { label: 'Fair', color: '#f59e0b', width: '55%' };
    if (password.length < 14) return { label: 'Strong', color: '#10b981', width: '80%' };
    return { label: 'Very Strong', color: '#06b6d4', width: '100%' };
  };

  const strength = getStrength();

  const onSubmit = async (data: FormData) => {
    try {
      setRegisterError(null);
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(res.data.user, res.data.token);
      navigate('/');
    } catch (error: any) {
      setRegisterError(error.response?.data?.message || 'Registration failed. Try again.');
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

        .blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .blob-1 { width: 350px; height: 350px; background: rgba(139,92,246,0.1); top: -80px; right: -60px; }
        .blob-2 { width: 250px; height: 250px; background: rgba(16,185,129,0.07); bottom: -60px; left: -40px; }

        .register-card {
          width: 100%; max-width: 440px;
          position: relative; z-index: 1;
          animation: slideUp 0.35s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

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
          font-size: 24px; font-weight: 700;
          color: #f1f5f9; letter-spacing: -0.5px; margin-bottom: 6px;
        }
        .card-subtitle { font-size: 14px; color: #6b7280; margin-bottom: 28px; }

        .error-banner {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px; padding: 12px 16px;
          color: #f87171; font-size: 13px; margin-bottom: 20px;
        }

        .field-group { margin-bottom: 16px; }

        .field-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px;
          margin-bottom: 8px; font-family: 'DM Mono', monospace;
        }

        .field-wrap { position: relative; }

        .field-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); color: #4b5563; pointer-events: none;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 11px 14px 11px 42px;
          color: #f1f5f9; font-size: 14px;
          font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s;
        }
        .field-input:focus {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.05);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        .field-input::placeholder { color: #374151; }
        .field-input.has-right { padding-right: 42px; }

        .field-error {
          font-size: 12px; color: #f87171;
          margin-top: 6px;
        }

        .eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: #4b5563; cursor: pointer;
          padding: 4px; transition: color 0.15s;
        }
        .eye-btn:hover { color: #9ca3af; }

        .strength-bar-wrap {
          height: 3px; background: rgba(255,255,255,0.06);
          border-radius: 100px; margin-top: 8px; overflow: hidden;
        }
        .strength-bar-fill {
          height: 100%; border-radius: 100px; transition: all 0.3s ease;
        }
        .strength-label {
          font-size: 11px; margin-top: 4px;
          font-family: 'DM Mono', monospace;
        }

        .submit-btn {
          width: 100%; padding: 12px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border: none; border-radius: 12px; color: white;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 24px;
          box-shadow: 0 4px 14px rgba(139,92,246,0.35);
          letter-spacing: -0.1px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139,92,246,0.45);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 28px 0 20px; }

        .footer-text { text-align: center; font-size: 13px; color: #6b7280; }
        .footer-link { color: #a78bfa; font-weight: 600; text-decoration: none; transition: color 0.15s; }
        .footer-link:hover { color: #c4b5fd; }
      `}</style>

      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="register-card">
        <div className="card-box">
          <div className="logo-mark">
            <Zap size={22} color="white" fill="white" />
          </div>

          <h1 className="card-title">Create account</h1>
          <p className="card-subtitle">Join TaskFlow and start managing projects</p>

          {registerError && <div className="error-banner">{registerError}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="field-group">
              <label className="field-label">Full Name</label>
              <div className="field-wrap">
                <User size={16} className="field-icon" />
                <input {...register('name')} type="text" placeholder="Jane Doe" className="field-input" />
              </div>
              {errors.name && <p className="field-error">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="field-group">
              <label className="field-label">Email</label>
              <div className="field-wrap">
                <Mail size={16} className="field-icon" />
                <input {...register('email')} type="email" placeholder="you@example.com" className="field-input" />
              </div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="field-input has-right"
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <>
                  <div className="strength-bar-wrap">
                    <div className="strength-bar-fill" style={{ width: strength.width, background: strength.color }} />
                  </div>
                  <p className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </>
              )}
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="field-group">
              <label className="field-label">Confirm Password</label>
              <div className="field-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  className="field-input has-right"
                />
                <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting && <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <hr className="divider" />

          <p className="footer-text">
            Already have an account?{' '}
            <Link to="/login" className="footer-link">Sign in</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#374151', marginTop: 20, fontFamily: "'DM Mono', monospace" }}>
          🔒 Secured with JWT authentication
        </p>
      </div>
    </div>
  );
}
