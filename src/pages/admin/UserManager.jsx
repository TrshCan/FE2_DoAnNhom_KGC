import React, { useEffect, useState } from "react";
import BASE_URL from "../../components/BaseURL";
import BASE_URL_upload_image from "../../components/BaseURL-upload_image";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ id: null, email: "", password: "", username: "", role: "", icon: "" });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const userRoles = ["user", "admin"];

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/users/get-users.php`);
    const data = await res.json();
    setUsers(data);
    setFilteredUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
      setForm({ ...form, icon: file.name });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (isEdit = false) => {
    const url = isEdit ? "update-user.php" : "add-user.php";
    const formData = new FormData();
    formData.append("id", form.id || "");
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("role", form.role);
    if (form.password) {
      formData.append("password", form.password);
    }
    if (iconFile) {
      formData.append("icon", iconFile);
    } else {
      formData.append("icon", form.icon);
    }

    await fetch(`${BASE_URL}/src/includes/admin/users/${url}`, {
      method: "POST",
      body: formData,
    });

    setForm({ id: null, email: "", password: "", username: "", role: "", icon: "" });
    setIconFile(null);
    setIconPreview(null);
    setShowAddModal(false);
    setShowEditModal(false);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: "" }); // Clear password for security
    setIconPreview(user.icon ? `${BASE_URL_upload_image}/users/${user.icon}` : null);
    setIconFile(null);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    await fetch(`${BASE_URL}/src/includes/admin/users/delete-user.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    setShowDeleteModal(false);
    setDeleteId(null);
    fetchUsers();
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setForm({ id: null, email: "", password: "", username: "", role: "", icon: "" });
                setIconFile(null);
                setIconPreview(null);
                setShowAddModal(true);
              }}
            >
              Thêm User Mới
            </button>
            <input
              type="text"
              className="form-control form-control-sm w-50"
              placeholder="Tìm kiếm theo email, username hoặc vai trò..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="text-center">ID</th>
                  <th scope="col" className="text-center name-column">Email</th>
                  <th scope="col" className="text-center">Username</th>
                  <th scope="col" className="text-center">Vai trò</th>
                  <th scope="col" className="text-center">Icon</th>
                  <th scope="col" className="text-center action-column">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="text-center align-middle">{user.id}</td>
                    <td className="text-center align-middle name-cell">{user.email}</td>
                    <td className="text-center align-middle">{user.username}</td>
                    <td className="text-center align-middle">{user.role}</td>
                    <td className="text-center align-middle">
                      {user.icon ? (
                        <img
                          src={`${BASE_URL_upload_image}/users/${user.icon}`}
                          alt={user.username}
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="text-center align-middle">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-outline-primary btn-sm action-btn"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(user.id);
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
                  <h5 className="modal-title">Thêm User Mới</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập username"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vai trò</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="" disabled>
                        Chọn vai trò
                      </option>
                      {userRoles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Icon (tuỳ chọn)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control form-control-sm"
                    />
                    {iconPreview && (
                      <div className="mt-2">
                        <img
                          src={iconPreview}
                          alt="Preview"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                      </div>
                    )}
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
                  <h5 className="modal-title">Sửa User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập username"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu mới (tuỳ chọn)</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vai trò</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="" disabled>
                        Chọn vai trò
                      </option>
                      {userRoles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Icon (tuỳ chọn)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control form-control-sm"
                    />
                    {iconPreview && (
                      <div className="mt-2">
                        <img
                          src={iconPreview}
                          alt="Preview"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                      </div>
                    )}
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
                  <p>Bạn có chắc muốn xóa user này?</p>
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
          padding-left: 15px; /* Adjust for sidebar */
          padding-right: 15px;
        }
        .card {
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
          width: 180px; /* Wider action column */
        }
        .name-column {
          width: 200px; /* Wider name column */
        }
        .name-cell {
          padding-left: 15px; /* Add padding to both sides */
          padding-right: 15px;
        }
        .action-btn {
          margin: 0 8px; /* Spacing between buttons */
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
            width: 140px; /* Adjusted for smaller screens */
          }
          .name-column {
            width: 150px; /* Adjusted for smaller screens */
          }
          .name-cell {
            padding-left: 10px; /* Adjusted padding for smaller screens */
            padding-right: 10px;
          }
        }
      `}</style>
    </div>
  );
}