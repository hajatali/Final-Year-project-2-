import React, { useState, useEffect } from 'react';
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

  // Dynamic State variables connected to Backend API
  const [userRisks, setUserRisks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proposal Phase 4: Fetch Real-time Risk Scores & Security Alerts from Backend API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT authentication token

        // API Call for Risk Scores (FastAPI Endpoint)
        const responseRisks = await fetch('http://localhost:8000/api/users/risk-scores', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (responseRisks.ok) {
          const data = await responseRisks.json();
          setUserRisks(data);
        }

        // API Call for Live Security Alerts
        const responseAlerts = await fetch('http://localhost:8000/api/alerts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (responseAlerts.ok) {
          const alertData = await responseAlerts.json();
          setAlerts(alertData);
        }

      } catch (error) {
        console.error("Error connecting to Data-Guard Backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate("/"); // Redirect to Login page
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Navigation / Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
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

        {/* Dynamic Logged-in User Badge & Logout Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          <Bell color="#94a3b8" style={{ cursor: 'pointer' }} />
          
          <div style={{ backgroundColor: '#1e293b', padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>
              {localStorage.getItem('userEmail') || 'User'} · {localStorage.getItem('userRole') || 'Role'}
            </span>
          </div>

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

      {/* Dynamic Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Total Users Monitored</span>
            <Users color="#38bdf8" />
          </div>
          <h2 style={{ fontSize: '28px', marginTop: '10px', marginBottom: 0 }}>{userRisks.length}</h2>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Active High Risk Threats</span>
            <AlertTriangle color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '28px', marginTop: '10px', color: '#ef4444', marginBottom: 0 }}>
            {userRisks.filter(u => u.score > 70).length}
          </h2>
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

      {/* Main Section: Risk Table & Security Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* User Risk Table */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity color="#38bdf8" size={20} /> AI Behavioral Brain (User Risk Scores)
          </h3>

          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading users from database...</p>
          ) : userRisks.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No users monitored yet.</p>
          ) : (
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
                        {user.status || (user.score > 70 ? 'High Risk' : user.score > 30 ? 'Medium Risk' : 'Low Risk')}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: '#94a3b8' }}>{user.action || 'Logged in'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Security Alerts Feed */}
        <div style={sectionStyle}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle color="#ef4444" size={20} /> Live Security Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>No active security alerts.</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${alert.level === 'Critical' ? '#ef4444' : alert.level === 'Warning' ? '#f59e0b' : '#38bdf8'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>{alert.level?.toUpperCase()}</span>
                    <span>{alert.time}</span>
                  </div>
                  <p style={{ fontSize: '13px', margin: 0 }}>{alert.msg}</p>
                </div>
              ))
            )}
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