import React, { useEffect, useState } from 'react';
import BASE_URL from '../../components/BaseURL';

const HeroSkillManager = () => {
  const [heroSkills, setHeroSkills] = useState([]);
  const [form, setForm] = useState({
    id: null,
    hero_id: '',
    name: '',
    description: '',
    type: ''
  });
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    fetchHeroSkills();
    fetchHeroes();
  }, []);

  const fetchHeroSkills = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/hero-skills/get-hero-skills.php`);
    const data = await res.json();
    setHeroSkills(data);
  };

  const fetchHeroes = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/heroes/get-heroes-byID.php`);
    const data = await res.json();
    setHeroes(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = form.id ? 'update-hero-skill.php' : 'add-hero-skill.php';

    await fetch(`${BASE_URL}/src/includes/admin/hero-skills/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    fetchHeroSkills();
    setForm({ id: null, hero_id: '', name: '', description: '', type: '' });
  };

  const handleEdit = (skill) => {
    setForm(skill);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá kỹ năng này không?')) return;

    await fetch(`${BASE_URL}/src/includes/admin/hero-skills/delete-hero-skill.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    fetchHeroSkills();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Kỹ năng Hero</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <select 
            name="hero_id" 
            value={form.hero_id} 
            onChange={handleChange} 
            className="border p-2" 
            required
          >
            <option value="" disabled>Chọn Hero</option>
            {heroes.map(hero => (
              <option key={hero.id} value={hero.id}>{hero.name}</option>
            ))}
          </select>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Tên kỹ năng" 
            className="border p-2" 
            required 
          />
          <select name="type" value={form.type} onChange={handleChange} className="border p-2" required>
            <option value="" disabled>Chọn loại</option>
            <option value="passive">Passive</option>
            <option value="awakening">Awakening</option>
            <option value="ultimate">Ultimate</option>
          </select>
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
          {form.id ? 'Cập nhật' : 'Thêm Kỹ năng'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Hero</th>
            <th className="border p-2">Tên kỹ năng</th>
            <th className="border p-2">Loại</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {heroSkills.map(skill => (
            <tr key={skill.id}>
              <td className="border p-2 text-center">{skill.id}</td>
              <td className="border p-2">{skill.hero_name || skill.hero_id}</td>
              <td className="border p-2">{skill.name}</td>
              <td className="border p-2">{skill.type}</td>
              <td className="border p-2">{skill.description}</td>
              <td className="border p-2 text-center">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(skill)}>Sửa</button>
                <button className="text-red-600" onClick={() => handleDelete(skill.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeroSkillManager;