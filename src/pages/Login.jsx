import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend ne error bheja (jaise "Invalid credentials")
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // 🟢 Real JWT token aur user info save karein
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', data.user.role);

      navigate('/dashboard');
    } catch (err) {
      setError('Server se connect nahi ho paya. Backend chal raha hai?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '30px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <ShieldCheck color="#38bdf8" size={48} />
          </div>
          <h2 style={{ color: '#f8fafc', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
            Data-Guard | Access Portal
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>
            Enter your credentials to access the security hub
          </p>
        </div>

        {/* 🔴 Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#7f1d1d',
            color: '#fecaca',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail color="#64748b" size={18} style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="email" 
                placeholder="admin@dataguard.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock color="#64748b" size={18} style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#334155' : '#0284c7',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.4)'
            }}
          >
            <LogIn size={18} /> {loading ? 'Logging in...' : 'Login to Hub'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;