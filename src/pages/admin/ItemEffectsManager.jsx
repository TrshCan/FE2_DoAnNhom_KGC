import React, { useEffect, useState } from "react";
import BASE_URL from "../../components/BaseURL";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ItemEffectsManager() {
  const [itemEffects, setItemEffects] = useState([]);
  const [filteredItemEffects, setFilteredItemEffects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ id: null, item_id: "", stat_name: "", modifier_type: "flat", value: 0, note: "" });
  const [sundries, setSundries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchItemEffects = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/item-effects/get-item-effects.php`);
    const data = await res.json();
    setItemEffects(data);
    setFilteredItemEffects(data);
  };

  const fetchSundries = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/sundries/get-sundries-byID.php`);
    const data = await res.json();
    setSundries(data);
  };

  useEffect(() => {
    fetchItemEffects();
    fetchSundries();
  }, []);

  useEffect(() => {
    const filtered = itemEffects.filter(
      (ie) =>
        ie.sundry_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ie.stat_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ie.modifier_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ie.value.toString().includes(searchQuery)
    );
    setFilteredItemEffects(filtered);
  }, [searchQuery, itemEffects]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (isEdit = false) => {
    const url = isEdit ? "update-item-effect.php" : "add-item-effect.php";
    const formData = new FormData();
    formData.append("id", form.id || "");
    formData.append("item_id", form.item_id);
    formData.append("stat_name", form.stat_name);
    formData.append("modifier_type", form.modifier_type);
    formData.append("value", form.value);
    formData.append("note", form.note);

    await fetch(`${BASE_URL}/src/includes/admin/item-effects/${url}`, {
      method: "POST",
      body: formData,
    });

    setForm({ id: null, item_id: "", stat_name: "", modifier_type: "flat", value: 0, note: "" });
    setShowAddModal(false);
    setShowEditModal(false);
    fetchItemEffects();
  };

  const handleEdit = (itemEffect) => {
    setForm(itemEffect);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    await fetch(`${BASE_URL}/src/includes/admin/item-effects/delete-item-effect.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    setShowDeleteModal(false);
    setDeleteId(null);
    fetchItemEffects();
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setForm({ id: null, item_id: "", stat_name: "", modifier_type: "flat", value: 0, note: "" });
                setShowAddModal(true);
              }}
            >
              Thêm Item-Effect Mới
            </button>
            <input
              type="text"
              className="form-control form-control-sm w-50"
              placeholder="Tìm kiếm theo tên sundry, stat, loại modifier hoặc giá trị..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="text-center">ID</th>
                  <th scope="col" className="text-center">Sundry</th>
                  <th scope="col" className="text-center">Stat</th>
                  <th scope="col" className="text-center">Loại Modifier</th>
                  <th scope="col" className="text-center">Giá trị</th>
                  <th scope="col" className="text-center">Ghi chú</th>
                  <th scope="col" className="text-center action-column">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredItemEffects.map((ie) => (
                  <tr key={ie.id}>
                    <td className="text-center align-middle">{ie.id}</td>
                    <td className="text-center align-middle">{ie.sundry_name}</td>
                    <td className="text-center align-middle">{ie.stat_name}</td>
                    <td className="text-center align-middle">{ie.modifier_type}</td>
                    <td className="text-center align-middle">{ie.value}</td>
                    <td className="text-center align-middle">{ie.note || '-'}</td>
                    <td className="text-center align-middle">
                      <button
                        onClick={() => handleEdit(ie)}
                        className="btn btn-outline-primary btn-sm action-btn"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(ie.id);
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
                  <h5 className="modal-title">Thêm Item-Effect Mới</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Sundry</label>
                    <select
                      name="item_id"
                      value={form.item_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="">Chọn sundry</option>
                      {sundries.map((sundry) => (
                        <option key={sundry.id} value={sundry.id}>
                          {sundry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stat</label>
                    <input
                      name="stat_name"
                      value={form.stat_name}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập tên stat"
                      required
                      type="text"
                      maxLength="50"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Loại Modifier</label>
                    <select
                      name="modifier_type"
                      value={form.modifier_type}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="flat">Flat</option>
                      <option value="percent">Percent</option>
                      <option value="special">Special</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Giá trị</label>
                    <input
                      name="value"
                      value={form.value}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập giá trị (e.g., 12.34)"
                      required
                      type="number"
                      step="0.01"
                      min="-9999.99"
                      max="9999.99"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ghi chú</label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập ghi chú (tùy chọn)"
                      rows="3"
                    ></textarea>
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
                  <h5 className="modal-title">Sửa Item-Effect</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Sundry</label>
                    <select
                      name="item_id"
                      value={form.item_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="">Chọn sundry</option>
                      {sundries.map((sundry) => (
                        <option key={sundry.id} value={sundry.id}>
                          {sundry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stat</label>
                    <input
                      name="stat_name"
                      value={form.stat_name}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập tên stat"
                      required
                      type="text"
                      maxLength="50"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Loại Modifier</label>
                    <select
                      name="modifier_type"
                      value={form.modifier_type}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="flat">Flat</option>
                      <option value="percent">Percent</option>
                      <option value="special">Special</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Giá trị</label>
                    <input
                      name="value"
                      value={form.value}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập giá trị (e.g., 12.34)"
                      required
                      type="number"
                      step="0.01"
                      min="-9999.99"
                      max="9999.99"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ghi chú</label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập ghi chú (tùy chọn)"
                      rows="3"
                    ></textarea>
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
                  <p>Bạn có chắc muốn xóa item-effect này?</p>
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
          border-radius: 8px;
          overflow: hidden;
          min-width: 100%;
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