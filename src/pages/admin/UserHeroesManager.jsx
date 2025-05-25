import React, { useEffect, useState } from "react";
import BASE_URL from "../../components/BaseURL";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserHeroesManager() {
  const [userHeroes, setUserHeroes] = useState([]);
  const [filteredUserHeroes, setFilteredUserHeroes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ id: null, user_id: "", hero_id: "", level: 1, xp: 0 });
  const [users, setUsers] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUserHeroes = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/user-heroes/get-user-heroes.php`);
    const data = await res.json();
    setUserHeroes(data);
    setFilteredUserHeroes(data);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/users/get-users-byID.php`);
    const data = await res.json();
    setUsers(data);
  };

  const fetchHeroes = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/heroes/get-heroes-byID.php`);
    const data = await res.json();
    setHeroes(data);
  };

  useEffect(() => {
    fetchUserHeroes();
    fetchUsers();
    fetchHeroes();
  }, []);

  useEffect(() => {
    const filtered = userHeroes.filter(
      (uh) =>
        uh.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uh.hero_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uh.level.toString().includes(searchQuery)
    );
    setFilteredUserHeroes(filtered);
  }, [searchQuery, userHeroes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (isEdit = false) => {
    const url = isEdit ? "update-user-hero.php" : "add-user-hero.php";
    const formData = new FormData();
    formData.append("id", form.id || "");
    formData.append("user_id", form.user_id);
    formData.append("hero_id", form.hero_id);
    formData.append("level", form.level);
    formData.append("xp", form.xp);

    await fetch(`${BASE_URL}/src/includes/admin/user-heroes/${url}`, {
      method: "POST",
      body: formData,
    });

    setForm({ id: null, user_id: "", hero_id: "", level: 1, xp: 0 });
    setShowAddModal(false);
    setShowEditModal(false);
    fetchUserHeroes();
  };

  const handleEdit = (userHero) => {
    setForm(userHero);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    await fetch(`${BASE_URL}/src/includes/admin/user-heroes/delete-user-hero.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    setShowDeleteModal(false);
    setDeleteId(null);
    fetchUserHeroes();
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setForm({ id: null, user_id: "", hero_id: "", level: 1, xp: 0 });
                setShowAddModal(true);
              }}
            >
              Thêm User-Hero Mới
            </button>
            <input
              type="text"
              className="form-control form-control-sm w-50"
              placeholder="Tìm kiếm theo tên người dùng, tên hero hoặc cấp độ..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="text-center">ID</th>
                  <th scope="col" className="text-center">Người dùng</th>
                  <th scope="col" className="text-center">Hero</th>
                  <th scope="col" className="text-center">Cấp độ</th>
                  <th scope="col" className="text-center">XP</th>
                  <th scope="col" className="text-center action-column">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUserHeroes.map((uh) => (
                  <tr key={uh.id}>
                    <td className="text-center align-middle">{uh.id}</td>
                    <td className="text-center align-middle">{uh.username}</td>
                    <td className="text-center align-middle">{uh.hero_name}</td>
                    <td className="text-center align-middle">{uh.level}</td>
                    <td className="text-center align-middle">{uh.xp}</td>
                    <td className="text-center align-middle">
                      <button
                        onClick={() => handleEdit(uh)}
                        className="btn btn-outline-primary btn-sm action-btn"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(uh.id);
                          setShowDeleteModal(true);
                        }}
                        className="btn btn-outline-danger btn-sm action-btn"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Modal */}
          <div
            className={`modal fade ${showAddModal ? "show d-block" : ""}`}
            tabIndex="-1"
            style={{ backgroundColor: showAddModal ? "rgba(0,0,0,0.5)" : "transparent" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm User-Hero Mới</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Người dùng</label>
                    <select
                      name="user_id"
                      value={form.user_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="">Chọn người dùng</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Hero</label>
                    <select
                      name="hero_id"
                      value={form.hero_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="">Chọn hero</option>
                      {heroes.map((hero) => (
                        <option key={hero.id} value={hero.id}>
                          {hero.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cấp độ</label>
                    <input
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập cấp độ"
                      required
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">XP</label>
                    <input
                      name="xp"
                      value={form.xp}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập XP"
                      required
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSubmit(false)}
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          <div
            className={`modal fade ${showEditModal ? "show d-block" : ""}`}
            tabIndex="-1"
            style={{ backgroundColor: showEditModal ? "rgba(0,0,0,0.5)" : "transparent" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Sửa User-Hero</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Người dùng</label>
                    <select
                      name="user_id"
                      value={form.user_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="">Chọn người dùng</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Hero</label>
                    <select
                      name="hero_id"
                      value={form.hero_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="">Chọn hero</option>
                      {heroes.map((hero) => (
                        <option key={hero.id} value={hero.id}>
                          {hero.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cấp độ</label>
                    <input
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập cấp độ"
                      required
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">XP</label>
                    <input
                      name="xp"
                      value={form.xp}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập XP"
                      required
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowEditModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSubmit(true)}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Modal */}
          <div
            className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
            tabIndex="-1"
            style={{ backgroundColor: showDeleteModal ? "rgba(0,0,0,0.5)" : "transparent" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Xác nhận Xóa</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Bạn có chắc muốn xóa user-hero này?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container-fluid {
          padding-left: 15px;
          padding-right: 15px;
        }
        .card {
          min-width: 100%;
          border-radius: 8px;
          overflow: hidden;
        }
        .card-body {
          padding: 1.5rem;
          background-color: #f8f9fa;
        }
        .form-control-sm {
          border-radius: 6px;
          padding: 8px;
          font-size: 0.875rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .form-control-sm:focus {
          border-color: #2c3e50;
          box-shadow: 0 0 6px rgba(44, 62, 80, 0.2);
        }
        .btn-primary {
          background-color: #2c3e50;
          border-color: #2c3e50;
          border-radius: 6px;
          font-size: 0.875rem;
          padding: 6px 12px;
          transition: background-color 0.3s, transform 0.2s;
        }
        .btn-primary:hover {
          background-color: #1a252f;
          transform: scale(1.03);
        }
        .btn-outline-primary {
          border-color: #2c3e50;
          color: #2c3e50;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 5px;
        }
        .btn-outline-primary:hover {
          background-color: #2c3e50;
          color: white;
        }
        .btn-outline-danger {
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 5px;
        }
        .btn-outline-danger:hover {
          background-color: #dc3545;
          color: white;
        }
        .btn-danger {
          border-radius: 6px;
          font-size: 0.875rem;
          padding: 6px 12px;
        }
        .table {
          font-size: 0.875rem;
        }
        .table-dark {
          background-color: #2c3e50;
        }
        .table-hover tbody tr:hover {
          background-color: #e9ecef;
        }
        th,
        td {
          padding: 10px;
          vertical-align: middle;
        }
        .action-column {
          width: 180px;
        }
        .action-btn {
          margin: 0 8px;
        }
        .modal-content {
          border-radius: 8px;
        }
        .modal-header {
          background-color: #2c3e50;
          color: white;
        }
        .modal-title {
          font-size: 1.1rem;
        }
        .modal-footer {
          border-top: none;
        }
        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 10px;
            padding-right: 10px;
          }
          .card-body {
            padding: 1rem;
          }
          .d-flex {
            flex-direction: column;
            gap: 10px;
          }
          .form-control-sm.w-50 {
            width: 100% !important;
          }
          .action-column {
            width: 140px;
          }
        }
      `}</style>
    </div>
  );
}