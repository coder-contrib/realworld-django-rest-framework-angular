import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    first_name: '', last_name: '', birth_date: '', parent_phone: '',
    group: 'Kichkintoylar', monthly_fee: '', payment_day: 1, telegram_chat_id: ''
  });

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get('/api/students');
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, monthly_fee: parseFloat(form.monthly_fee), payment_day: parseInt(form.payment_day) };
    try {
      if (editStudent) {
        await api.put(`/api/students/${editStudent.id}`, data);
      } else {
        await api.post('/api/students', data);
      }
      loadStudents();
      closeModal();
    } catch (err) { alert(err.response?.data?.detail || 'Xatolik'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O'quvchini o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/students/${id}`);
      loadStudents();
    } catch (err) { alert('Xatolik'); }
  };

  const openEdit = (student) => {
    setEditStudent(student);
    setForm({
      first_name: student.first_name,
      last_name: student.last_name,
      birth_date: student.birth_date,
      parent_phone: student.parent_phone,
      group: student.group,
      monthly_fee: student.monthly_fee.toString(),
      payment_day: student.payment_day,
      telegram_chat_id: student.telegram_chat_id || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditStudent(null);
    setForm({ first_name: '', last_name: '', birth_date: '', parent_phone: '', group: 'Kichkintoylar', monthly_fee: '', payment_day: 1, telegram_chat_id: '' });
  };

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    s.group.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={{marginBottom: '24px'}}>👶 O'quvchilar</h1>

      <div className="card">
        <div className="card-header">
          <input
            className="search-box"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + Yangi o'quvchi
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>Hech qanday o'quvchi topilmadi</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ism Familiya</th>
                <th>Guruh</th>
                <th>Telefon</th>
                <th>To'lov</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td><strong>{s.first_name} {s.last_name}</strong></td>
                  <td><span className="badge badge-success">{s.group}</span></td>
                  <td>{s.parent_phone}</td>
                  <td>{s.monthly_fee.toLocaleString()} so'm</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-sm btn-accent" onClick={() => openEdit(s)}>✏️</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editStudent ? "O'quvchini tahrirlash" : "Yangi o'quvchi qo'shish"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ism</label>
                <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Familiya</label>
                <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tug'ilgan sana</label>
                <input type="date" value={form.birth_date} onChange={e => setForm({...form, birth_date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Ota-ona telefoni</label>
                <input value={form.parent_phone} onChange={e => setForm({...form, parent_phone: e.target.value})} placeholder="+998901234567" required />
              </div>
              <div className="form-group">
                <label>Guruh</label>
                <select value={form.group} onChange={e => setForm({...form, group: e.target.value})}>
                  <option>Kichkintoylar</option>
                  <option>O'rtanchalar</option>
                  <option>Kattalar</option>
                  <option>Tayyorlov</option>
                </select>
              </div>
              <div className="form-group">
                <label>Oylik to'lov (so'm)</label>
                <input type="number" value={form.monthly_fee} onChange={e => setForm({...form, monthly_fee: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>To'lov kuni (har oyning)</label>
                <input type="number" min="1" max="28" value={form.payment_day} onChange={e => setForm({...form, payment_day: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Telegram Chat ID (ixtiyoriy)</label>
                <input value={form.telegram_chat_id} onChange={e => setForm({...form, telegram_chat_id: e.target.value})} placeholder="Telegram Chat ID" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary">{editStudent ? 'Saqlash' : "Qo'shish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
