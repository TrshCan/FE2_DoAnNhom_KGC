import React, { useEffect, useState } from 'react';

const HeroManager = () => {
  const [heroes, setHeroes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    region_id: '',
    class_id: '',
    title: '',
    description: ''
  });
  const [regions, setRegions] = useState([]);
  const [classes, setClasses] = useState([]);

  const fetchHeroes = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/heroes/get-heroes.php');
    const data = await res.json();
    setHeroes(data);
  };

  const fetchRegions = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/heroes/get-regions.php');
    const data = await res.json();
    setRegions(data);
  };

  const fetchClasses = async () => {
    const res = await fetch('http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/heroes/get-classes.php');
    const data = await res.json();
    setClasses(data);
  };

  useEffect(() => {
    fetchHeroes();
    fetchRegions();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = form.id
      ? 'update-hero.php'
      : 'add-hero.php';

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/heroes/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    await fetchHeroes();
    setForm({ id: null, name: '', region_id: '', class_id: '', title: '', description: '' });
  };

  const handleEdit = (hero) => {
    setForm(hero);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xoá hero?')) return;

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/heroes/delete-hero.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    fetchHeroes();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Heroes</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Tên Hero" className="border p-2" required />
          <input name="title" value={form.title} onChange={handleChange} placeholder="Danh hiệu" className="border p-2" required />
          <select name="region_id" value={form.region_id} onChange={handleChange} className="border p-2">
            <option value="">-- Vùng --</option>
            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select name="class_id" value={form.class_id} onChange={handleChange} className="border p-2">
            <option value="">-- Lớp nhân vật --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" className="w-full border p-2"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {form.id ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Danh hiệu</th>
            <th className="border p-2">Vùng</th>
            <th className="border p-2">Lớp</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {heroes.map(hero => (
            <tr key={hero.id}>
              <td className="border p-2 text-center">{hero.id}</td>
              <td className="border p-2">{hero.name}</td>
              <td className="border p-2">{hero.title}</td>
              <td className="border p-2">{hero.region_name}</td>
              <td className="border p-2">{hero.class_name}</td>
              <td className="border p-2">{hero.description}</td>
              <td className="border p-2 text-center">
                <button onClick={() => handleEdit(hero)} className="text-blue-600 mr-2">Sửa</button>
                <button onClick={() => handleDelete(hero.id)} className="text-red-600">Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeroManager;
