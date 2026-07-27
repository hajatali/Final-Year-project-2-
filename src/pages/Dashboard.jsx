import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Users, 
  Activity, 
  Bell,
  LogOut 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock Data aligned with Data-Guard AI Risk Engine
  const [userRisks] = useState([
    { id: 1, name: 'Anis Akram', role: 'Manager', score: 88, status: 'High Risk', action: 'Mass File Download' },
    { id: 2, name: 'Muhammad Wahaj', role: 'Developer', score: 12, status: 'Low Risk', action: 'Normal Login' },
    { id: 3, name: 'Parshant Raja', role: 'Analyst', score: 45, status: 'Medium Risk', action: 'Odd Login Time' },
    { id: 4, name: 'Hajat Ali', role: 'Admin', score: 5, status: 'Low Risk', action: 'System Config Update' },
  ]);

  const [alerts] = useState([
    { id: 101, time: '10:42 AM', msg: 'Anis Akram downloaded 50 encrypted blobs in 1 min.', level: 'Critical' },
    { id: 102, time: '09:15 AM', msg: 'New AES-256 session key generated for PostgreSQL Vault.', level: 'Info' },
    { id: 103, time: '08:30 AM', msg: 'Unusual access attempt from unregistered IP.', level: 'Warning' },
  ]);

  // Logout Function
  const handleLogout = () => {
    alert("Logging out from Data-Guard...");
    navigate("/"); // Login page par redirect kar dega
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Navigation / Header */}
      <header style={{ 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        borderBottom: '2px solid #334155', 
        paddingBottom: '15px', 
        marginBottom: '25px' 
      }}>
        
        {/* Title Section */}
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <ShieldCheck color="#38bdf8" size={32} /> Data-Guard | The Hub
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px', marginBottom: 0 }}>
            Real-time Behavioral Threat & Encryption Monitoring
          </p>
        </div>

        {/* Right Side Controls & LOGOUT BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          <Bell color="#94a3b8" style={{ cursor: 'pointer' }} />
          
          <div style={{ backgroundColor: '#1e293b', padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>Admin Mode</span>
          </div>

          {/* PROMINENT LOGOUT BUTTON */}
          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: '#dc2626', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.4)'
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>
      </header>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Total Users Monitored</span>
            <Users color="#38bdf8" />
          </div>
          <h2 style={{ fontSize: '28px', marginTop: '10px', marginBottom: 0 }}>24</h2>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Active High Risk Threats</span>
            <AlertTriangle color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '28px', marginTop: '10px', color: '#ef4444', marginBottom: 0 }}>01</h2>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Smart Vault Status</span>
            <Lock color="#22c55e" />
          </div>
          <h2 style={{ fontSize: '20px', marginTop: '15px', color: '#22c55e', marginBottom: 0 }}>AES-256 Encrypted</h2>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>AI Anomaly Engine</span>
            <Activity color="#a855f7" />
          </div>
          <h2 style={{ fontSize: '20px', marginTop: '15px', color: '#a855f7', marginBottom: 0 }}>Active & Scoring</h2>
        </div>

      </div>

      {/* Main Content: Behavioral Table & Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* User Risk Score Table */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity color="#38bdf8" size={20} /> AI Behavioral Brain (User Risk Scores)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Risk Score</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Last Action</th>
              </tr>
            </thead>
            <tbody>
              {userRisks.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.role}</td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 'bold', color: user.score > 70 ? '#ef4444' : user.score > 30 ? '#f59e0b' : '#22c55e' }}>
                      {user.score} / 100
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      backgroundColor: user.score > 70 ? '#450a0a' : user.score > 30 ? '#451a03' : '#052e16',
                      color: user.score > 70 ? '#fca5a5' : user.score > 30 ? '#fcd34d' : '#86efac'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: '#94a3b8' }}>{user.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Alerts Feed */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle color="#ef4444" size={20} /> Live Security Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${alert.level === 'Critical' ? '#ef4444' : alert.level === 'Warning' ? '#f59e0b' : '#38bdf8'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                  <span>{alert.level.toUpperCase()}</span>
                  <span>{alert.time}</span>
                </div>
                <p style={{ fontSize: '13px', margin: 0 }}>{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

// Reusable Inline Styles
const cardStyle = {
  backgroundColor: '#1e293b',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #334155'
};

const sectionStyle = {
  backgroundColor: '#1e293b',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #334155'
};

const thStyle = { padding: '12px', fontSize: '14px' };
const tdStyle = { padding: '12px', fontSize: '14px' };

export default Dashboard;