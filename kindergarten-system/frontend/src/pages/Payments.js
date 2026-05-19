import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    student_id: '', amount: '', payment_type: 'Naqd', month: '', note: ''
  });

  useEffect(() => {
    loadPayments();
    loadStudents();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await api.get('/api/payments');
      setPayments(res.data);
    } catch (err) { console.error(err); }
  };

  const loadStudents = async () => {
    try {
      const res = await api.get('/api/students');
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/payments', {
        ...form,
        student_id: parseInt(form.student_id),
        amount: parseFloat(form.amount)
      });
      loadPayments();
      setShowModal(false);
      setForm({ student_id: '', amount: '', payment_type: 'Naqd', month: '', note: '' });
    } catch (err) { alert(err.response?.data?.detail || 'Xatolik'); }
  };

  const downloadReceipt = async (paymentId) => {
    try {
      const res = await api.get(`/api/payments/${paymentId}/receipt`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `chek_${paymentId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { alert('Chekni yuklab olishda xatolik'); }
  };

  const currentMonth = () => {
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  return (
    <div>
      <h1 style={{marginBottom: '24px'}}>💰 To'lovlar</h1>

      <div className="card">
        <div className="card-header">
          <h2>To'lovlar ro'yxati</h2>
          <button className="btn btn-primary btn-sm" onClick={() => { setForm({...form, month: currentMonth()}); setShowModal(true); }}>
            + Yangi to'lov
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="empty-state">
            <p>Hech qanday to'lov topilmadi</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>O'quvchi</th>
                <th>Summa</th>
                <th>Turi</th>
                <th>Oy</th>
                <th>Sana</th>
                <th>Chek</th>
              </tr>
            </thead>
            <tbody>
              {[...payments].reverse().map((p, i) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><strong>{p.student_name}</strong></td>
                  <td>{p.amount.toLocaleString()} so'm</td>
                  <td><span className="badge badge-success">{p.payment_type}</span></td>
                  <td>{p.month}</td>
                  <td>{p.date}</td>
                  <td>
                    <button className="btn btn-sm btn-accent" onClick={() => downloadReceipt(p.id)}>📄 Chek</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Yangi to'lov qo'shish</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>O'quvchi</label>
                <select value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required>
                  <option value="">Tanlang...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} - {s.group}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Summa (so'm)</label>
                <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>To'lov turi</label>
                <select value={form.payment_type} onChange={e => setForm({...form, payment_type: e.target.value})}>
                  <option>Naqd</option>
                  <option>Plastik karta</option>
                  <option>Bank o'tkazmasi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Oy</label>
                <input value={form.month} onChange={e => setForm({...form, month: e.target.value})} placeholder="Yanvar 2024" required />
              </div>
              <div className="form-group">
                <label>Izoh (ixtiyoriy)</label>
                <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} rows="2" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary">To'lovni saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
