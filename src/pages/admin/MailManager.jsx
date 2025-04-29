import React, { useEffect, useState } from 'react';

const MailManager = () => {
  const [mails, setMails] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    content: '',
    sender_email: '',
    receiver_email: ''
  });

  useEffect(() => {
    fetchMails();
  }, []);

  const fetchMails = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/mails/get-mails.php');
    const data = await res.json();
    setMails(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = form.id ? 'update-mail.php' : 'add-mail.php';

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/mails/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    fetchMails();
    setForm({ id: null, title: '', content: '', sender_email: '', receiver_email: '' });
  };

  const handleEdit = (mail) => {
    setForm(mail);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá mail này không?')) return;

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/mails/delete-mail.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    fetchMails();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Mails</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Tiêu đề" className="border p-2" required />
          <input name="sender_email" value={form.sender_email} onChange={handleChange} placeholder="Email người gửi" className="border p-2" required />
          <input name="receiver_email" value={form.receiver_email} onChange={handleChange} placeholder="Email người nhận" className="border p-2" required />
        </div>
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Nội dung" className="w-full border p-2" required></textarea>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {form.id ? 'Cập nhật' : 'Gửi mail'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tiêu đề</th>
            <th className="border p-2">Nội dung</th>
            <th className="border p-2">Người gửi</th>
            <th className="border p-2">Người nhận</th>
            <th className="border p-2">Ngày nhận</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {mails.map(mail => (
            <tr key={mail.id}>
              <td className="border p-2 text-center">{mail.id}</td>
              <td className="border p-2">{mail.title}</td>
              <td className="border p-2">{mail.content}</td>
              <td className="border p-2">{mail.sender_email}</td>
              <td className="border p-2">{mail.receiver_email}</td>
              <td className="border p-2 text-center">{mail.received_at}</td>
              <td className="border p-2 text-center">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(mail)}>Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(mail.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MailManager;
