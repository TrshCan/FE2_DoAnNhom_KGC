import React, { useEffect, useState } from "react";
import BASE_URL from "../../components/BaseURL";
import BASE_URL_upload_image from "../../components/BaseURL-upload_image";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EnemyManager() {
  const [enemies, setEnemies] = useState([]);
  const [filteredEnemies, setFilteredEnemies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    region_id: "",
    class_id: "",
    title: "",
    description: "",
    icon: "",
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [regions, setRegions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchEnemies = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/enemies/get-enemies.php`);
    const data = await res.json();
    setEnemies(data);
    setFilteredEnemies(data);
  };

  const fetchRegions = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/regions/get-regions-byID.php`);
    const data = await res.json();
    setRegions(data);
  };

  const fetchClasses = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/classes/get-classes-byID.php`);
    const data = await res.json();
    setClasses(data);
  };

  useEffect(() => {
    fetchEnemies();
    fetchRegions();
    fetchClasses();
  }, []);

  useEffect(() => {
    const filtered = enemies.filter(
      (enemy) =>
        enemy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enemy.description && enemy.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enemy.title && enemy.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredEnemies(filtered);
  }, [searchQuery, enemies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
    const url = isEdit ? "update-enemy.php" : "add-enemy.php";
    const formData = new FormData();
    formData.append("id", form.id || "");
    formData.append("name", form.name);
    formData.append("region_id", form.region_id);
    formData.append("class_id", form.class_id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (iconFile) {
      formData.append("icon", iconFile);
    } else {
      formData.append("icon", form.icon);
    }

    await fetch(`${BASE_URL}/src/includes/admin/enemies/${url}`, {
      method: "POST",
      body: formData,
    });

    setForm({
      id: null,
      name: "",
      region_id: "",
      class_id: "",
      title: "",
      description: "",
      icon: "",
    });
    setIconFile(null);
    setIconPreview(null);
    setShowAddModal(false);
    setShowEditModal(false);
    fetchEnemies();
  };

  const handleEdit = (enemy) => {
    setForm(enemy);
    setIconPreview(enemy.icon ? `${BASE_URL_upload_image}//enemies/${enemy.icon}` : null);
    setIconFile(null);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    await fetch(`${BASE_URL}/src/includes/admin/enemies/delete-enemy.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    setShowDeleteModal(false);
    setDeleteId(null);
    fetchEnemies();
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setForm({
                  id: null,
                  name: "",
                  region_id: "",
                  class_id: "",
                  title: "",
                  description: "",
                  icon: "",
                });
                setIconFile(null);
                setIconPreview(null);
                setShowAddModal(true);
              }}
            >
              Thêm Enemy Mới
            </button>
            <input
              type="text"
              className="form-control form-control-sm w-50"
              placeholder="Tìm kiếm theo tên, danh hiệu hoặc mô tả..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="text-center">ID</th>
                  <th scope="col" className="text-center name-column">Tên</th>
                  <th scope="col" className="text-center">Khu vực</th>
                  <th scope="col" className="text-center">Lớp</th>
                  <th scope="col" className="text-center">Danh hiệu</th>
                  <th scope="col" className="text-center">Mô tả</th>
                  <th scope="col" className="text-center">Icon</th>
                  <th scope="col" className="text-center action-column">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnemies.map((enemy) => (
                  <tr key={enemy.id}>
                    <td className="text-center align-middle">{enemy.id}</td>
                    <td className="text-center align-middle name-cell">{enemy.name}</td>
                    <td className="text-center align-middle">{enemy.region_name || enemy.region_id}</td>
                    <td className="text-center align-middle">{enemy.class_name || enemy.class_id}</td>
                    <td className="align-middle">{enemy.title}</td>
                    <td className="align-middle">{enemy.description}</td>
                    <td className="text-center align-middle">
                      {enemy.icon ? (
                        <img
                          src={`${BASE_URL_upload_image}/enemies/${enemy.icon}`}
                          alt={enemy.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="text-center align-middle">
                      <button
                        onClick={() => handleEdit(enemy)}
                        className="btn btn-outline-primary btn-sm action-btn"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(enemy.id);
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
                  <h5 className="modal-title">Thêm Enemy Mới</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên Enemy</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập tên enemy"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Khu vực</label>
                    <select
                      name="region_id"
                      value={form.region_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="" disabled>
                        Chọn khu vực
                      </option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Lớp</label>
                    <select
                      name="class_id"
                      value={form.class_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="" disabled>
                        Chọn lớp
                      </option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Danh hiệu</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập danh hiệu"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập mô tả"
                      required
                    ></textarea>
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
                  <h5 className="modal-title">Sửa Enemy</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên Enemy</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập tên enemy"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Khu vực</label>
                    <select
                      name="region_id"
                      value={form.region_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="" disabled>
                        Chọn khu vực
                      </option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Lớp</label>
                    <select
                      name="class_id"
                      value={form.class_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="" disabled>
                        Chọn lớp
                      </option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Danh hiệu</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập danh hiệu"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập mô tả"
                      required
                    ></textarea>
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
                  <p>Bạn có chắc muốn xóa enemy này?</p>
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