import React, { useEffect, useState } from 'react';
import BASE_URL from '../../components/BaseURL';

const RegionManager = () => {
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    icon: ''
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/regions/get-regions.php`);
    const data = await res.json();
    setRegions(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = form.id ? 'update-region.php' : 'add-region.php';

    await fetch(`${BASE_URL}/src/includes/admin/regions/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    fetchRegions();
    setForm({ id: null, name: '', description: '', icon: '' });
  };

  const handleEdit = (region) => {
    setForm(region);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá region này không?')) return;

    await fetch(`${BASE_URL}/src/includes/admin/regions/delete-region.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    fetchRegions();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Regions</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Tên" 
            className="border p-2" 
            required 
          />
          <input 
            name="icon" 
            value={form.icon} 
            onChange={handleChange} 
            placeholder="Icon (tuỳ chọn)" 
            className="border p-2" 
          />
        </div>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          placeholder="Mô tả" 
          className="w-full border p-2" 
          required 
        ></textarea>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {form.id ? 'Cập nhật' : 'Thêm Region'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Icon</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {regions.map(region => (
            <tr key={region.id}>
              <td className="border p-2 text-center">{region.id}</td>
              <td className="border p-2">{region.name}</td>
              <td className="border p-2">{region.description}</td>
              <td className="border p-2">{region.icon || 'N/A'}</td>
              <td className="border p-2 text-center">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(region)}>Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(region.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegionManager;