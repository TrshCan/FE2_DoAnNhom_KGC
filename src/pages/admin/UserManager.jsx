import React, { useEffect, useState } from 'react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    email: '',
    password: '',
    username: '',
    role: '',
    icon: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/users/get-users.php');
    const data = await res.json();
    setUsers(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = form.id ? 'update-user.php' : 'add-user.php';

    // Remove password from payload if empty during update
    const payload = { ...form };
    if (form.id && !form.password) {
      delete payload.password;
    }

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/users/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    fetchUsers();
    setForm({ id: null, email: '', password: '', username: '', role: '', icon: '' });
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: '' }); // Clear password field for security
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá user này không?')) return;

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/users/delete-user.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    fetchUsers();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Users</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2" required />
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="border p-2" required />
          <input 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            placeholder={form.id ? "Mật khẩu mới (tuỳ chọn)" : "Mật khẩu"} 
            className="border p-2" 
            required={!form.id}
          />
          <select name="role" value={form.role} onChange={handleChange} className="border p-2" required>
            <option value="" disabled>Chọn vai trò</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (tuỳ chọn)" className="border p-2" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {form.id ? 'Cập nhật' : 'Thêm User'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Vai trò</th>
            <th className="border p-2">Icon</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-2 text-center">{user.id}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.icon || 'N/A'}</td>
              <td className="border p-2 text-center">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(user)}>Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(user.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;