import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get('/api/statistics');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div style={{textAlign:'center', padding:'40px'}}>Yuklanmoqda...</div>;

  return (
    <div>
      <h1 style={{marginBottom: '24px'}}>📊 Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Jami o'quvchilar</h3>
          <div className="value">{stats?.total_students || 0}</div>
        </div>
        <div className="stat-card danger">
          <h3>Qarzdorlar</h3>
          <div className="value">{stats?.total_debtors || 0}</div>
        </div>
        <div className="stat-card accent">
          <h3>Oylik tushum</h3>
          <div className="value">{(stats?.monthly_income || 0).toLocaleString()} so'm</div>
        </div>
        <div className="stat-card">
          <h3>Guruhlar</h3>
          <div className="value">{Object.keys(stats?.groups || {}).length}</div>
        </div>
      </div>

      {/* Groups breakdown */}
      {stats?.groups && Object.keys(stats.groups).length > 0 && (
        <div className="card" style={{marginBottom: '20px'}}>
          <div className="card-header">
            <h2>Guruhlar bo'yicha</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Guruh nomi</th>
                <th>O'quvchilar soni</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.groups).map(([name, count]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td><span className="badge badge-success">{count}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Debtors */}
      {stats?.debtors && stats.debtors.length > 0 && (
        <div className="card" style={{marginBottom: '20px'}}>
          <div className="card-header">
            <h2>⚠️ Qarzdorlar</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ism</th>
                <th>Oylik to'lov</th>
              </tr>
            </thead>
            <tbody>
              {stats.debtors.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td><span className="badge badge-danger">{d.fee.toLocaleString()} so'm</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent payments */}
      {stats?.recent_payments && stats.recent_payments.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>So'nggi to'lovlar</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>O'quvchi</th>
                <th>Summa</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.student_name}</td>
                  <td>{p.amount.toLocaleString()} so'm</td>
                  <td>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
