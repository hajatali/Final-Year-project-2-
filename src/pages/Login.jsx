import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      // 🟢 1. Protected Route ke liye Session Save karein
      localStorage.setItem('isAuthenticated', 'true');
      
      // 🟢 2. User info agar save karni ho
      localStorage.setItem('userEmail', email);

      // 🟢 3. Dashboard par redirect karein
      navigate('/dashboard');
    } else {
      alert('Lutfean Email aur Password dono enter karein!');
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
        
        {/* Header Branding */}
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

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          
          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Submit Button */}
          <button 
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#0284c7',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.4)'
            }}
          >
            <LogIn size={18} /> Login to Hub
          </button>
        </form>

        {/* Signup Redirect Link */}
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