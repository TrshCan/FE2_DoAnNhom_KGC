import React, { useEffect, useState } from 'react';

const SundryManager = () => {
  const [sundries, setSundries] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    type: '',
    description: '',
    icon: ''
  });

  useEffect(() => {
    fetchSundries();
  }, []);

  const fetchSundries = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/sundries/get-sundries.php');
    const data = await res.json();
    setSundries(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = form.id ? 'update-sundry.php' : 'add-sundry.php';

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/sundries/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    fetchSundries();
    setForm({ id: null, name: '', type: '', description: '', icon: '' });
  };

  const handleEdit = (sundry) => {
    setForm(sundry);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá sundry này không?')) return;

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/sundries/delete-sundry.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    fetchSundries();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Sundries</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Tên" className="border p-2" required />
          <select name="type" value={form.type} onChange={handleChange} className="border p-2" required>
            <option value="" disabled>Chọn loại</option>
            <option value="consumable">Consumable</option>
            <option value="armor">Armor</option>
            <option value="weapon">Weapon</option>
            <option value="ammo">Ammo</option>
            <option value="food">Food</option>
            <option value="ingredient">Ingredient</option>
            <option value="material">Material</option>
            <option value="relic">Relic</option>
            <option value="accessory">Accessory</option>
            <option value="legacy">Legacy</option>
            <option value="currency">Currency</option>
          </select>
          <input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (tuỳ chọn)" className="border p-2" />
        </div>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" className="w-full border p-2" required></textarea>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {form.id ? 'Cập nhật' : 'Thêm Sundry'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Loại</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Icon</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sundries.map(sundry => (
            <tr key={sundry.id}>
              <td className="border p-2 text-center">{sundry.id}</td>
              <td className="border p-2">{sundry.name}</td>
              <td className="border p-2">{sundry.type}</td>
              <td className="border p-2">{sundry.description}</td>
              <td className="border p-2">{sundry.icon || 'N/A'}</td>
              <td className="border p-2 text-center">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(sundry)}>Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(sundry.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SundryManager;