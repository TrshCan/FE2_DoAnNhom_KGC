import React, { useEffect, useState } from 'react';

const EnemyManager = () => {
  const [enemies, setEnemies] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    region_id: '',
    class_id: '',
    title: '',
    description: '',
    icon: ''
  });
  const [regions, setRegions] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchEnemies();
    fetchRegions();
    fetchClasses();
  }, []);

  const fetchEnemies = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/enemies/get-enemies.php');
    const data = await res.json();
    setEnemies(data);
  };

  const fetchRegions = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/regions/get-regions-byID.php');
    const data = await res.json();
    setRegions(data);
  };

  const fetchClasses = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/classes/get-classes-byID.php');
    const data = await res.json();
    setClasses(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = form.id ? 'update-enemy.php' : 'add-enemy.php';

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/enemies/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    fetchEnemies();
    setForm({ id: null, name: '', region_id: '', class_id: '', title: '', description: '', icon: '' });
  };

  const handleEdit = (enemy) => {
    setForm(enemy);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá enemy này không?')) return;

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/enemies/delete-enemy.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    fetchEnemies();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Enemies</h2>

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
          <select 
            name="region_id" 
            value={form.region_id} 
            onChange={handleChange} 
            className="border p-2" 
            required
          >
            <option value="" disabled>Chọn khu vực</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
          <select 
            name="class_id" 
            value={form.class_id} 
            onChange={handleChange} 
            className="border p-2" 
            required
          >
            <option value="" disabled>Chọn lớp</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="Danh hiệu" 
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
          {form.id ? 'Cập nhật' : 'Thêm Enemy'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Khu vực</th>
            <th className="border p-2">Lớp</th>
            <th className="border p-2">Danh hiệu</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Icon</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {enemies.map(enemy => (
            <tr key={enemy.id}>
              <td className="border p-2 text-center">{enemy.id}</td>
              <td className="border p-2">{enemy.name}</td>
              <td className="border p-2">{enemy.region_name || enemy.region_id}</td>
              <td className="border p-2">{enemy.class_name || enemy.class_id}</td>
              <td className="border p-2">{enemy.title}</td>
              <td className="border p-2">{enemy.description}</td>
              <td className="border p-2">{enemy.icon || 'N/A'}</td>
              <td className="border p-2 text-center">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(enemy)}>Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(enemy.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnemyManager;