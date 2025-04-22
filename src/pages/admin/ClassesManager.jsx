import React, { useEffect, useState } from "react";

export default function ClassesManager() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", description: "" });

  const fetchClasses = async () => {
    const res = await fetch("http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/classes/get-classes.php");
    const data = await res.json();
    setClasses(data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = form.id
      ? "update-class.php"
      : "add-class.php";

    await fetch(`http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/classes/${url}`, {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({ id: null, name: "", description: "" });
    fetchClasses();
  };

  const handleEdit = (cls) => {
    setForm(cls);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    await fetch("http://localhost/FE2_DoAnNhom_KGC/src/includes/admin/classes/delete-class.php", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    fetchClasses();
  };

  return (
    <div>
      <h2>Quản lý Classes</h2>
      <input name="name" placeholder="Tên class" value={form.name} onChange={handleChange} />
      <input name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
      <button onClick={handleSubmit}>{form.id ? "Cập nhật" : "Thêm mới"}</button>

      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.name}</td>
              <td>{cls.description}</td>
              <td>
                <button onClick={() => handleEdit(cls)}>Sửa</button>
                <button onClick={() => handleDelete(cls.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
