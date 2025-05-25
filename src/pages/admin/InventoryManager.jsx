import React, { useEffect, useState } from "react";
import BASE_URL from "../../components/BaseURL";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InventoryManager() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ user_id: "", item_id: "", quantity: 0 });
  const [originalKeys, setOriginalKeys] = useState({ user_id: null, item_id: null }); // Store original keys for update
  const [users, setUsers] = useState([]);
  const [sundries, setSundries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteKey, setDeleteKey] = useState({ user_id: null, item_id: null });
  const [errorMessage, setErrorMessage] = useState(""); // For user feedback

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${BASE_URL}/src/includes/admin/inventory/get-inventory.php`);
      if (!res.ok) {
        console.error("Fetch inventory error:", res.status, res.statusText);
        setErrorMessage("Không thể tải danh sách inventory.");
        return;
      }
      const data = await res.json();
      setInventory(data);
      setFilteredInventory(data);
    } catch (error) {
      console.error("Fetch inventory failed:", error);
      setErrorMessage("Lỗi khi tải danh sách inventory.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/src/includes/admin/users/get-users-byID.php`);
      if (!res.ok) {
        console.error("Fetch users error:", res.status, res.statusText);
        setErrorMessage("Không thể tải danh sách người dùng.");
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch users failed:", error);
      setErrorMessage("Lỗi khi tải danh sách người dùng.");
    }
  };

  const fetchSundries = async () => {
    try {
      const res = await fetch(`${BASE_URL}/src/includes/admin/sundries/get-sundries-byID.php`);
      if (!res.ok) {
        console.error("Fetch sundries error:", res.status, res.statusText);
        setErrorMessage("Không thể tải danh sách vật phẩm.");
        return;
      }
      const data = await res.json();
      setSundries(data);
    } catch (error) {
      console.error("Fetch sundries failed:", error);
      setErrorMessage("Lỗi khi tải danh sách vật phẩm.");
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchUsers();
    fetchSundries();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(
      (inv) =>
        inv.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.quantity.toString().includes(searchQuery)
    );
    setFilteredInventory(filtered);
  }, [searchQuery, inventory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (isEdit = false) => {
    const url = isEdit ? "update-inventory.php" : "add-inventory.php";
    const formData = new FormData();
    formData.append("user_id", form.user_id);
    formData.append("item_id", form.item_id);
    formData.append("quantity", form.quantity);
    if (isEdit) {
      formData.append("original_user_id", originalKeys.user_id);
      formData.append("original_item_id", originalKeys.item_id);
    }

    try {
      const res = await fetch(`${BASE_URL}/src/includes/admin/inventory/${url}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.error(`Submit error (${url}):`, res.status, res.statusText, data.error);
        setErrorMessage(data.error || `Lỗi khi ${isEdit ? "cập nhật" : "thêm"} inventory.`);
        return;
      }
      setForm({ user_id: "", item_id: "", quantity: 0 });
      setOriginalKeys({ user_id: null, item_id: null });
      setShowAddModal(false);
      setShowEditModal(false);
      setErrorMessage("");
      fetchInventory();
    } catch (error) {
      console.error(`Submit failed (${url}):`, error);
      setErrorMessage(`Lỗi khi ${isEdit ? "cập nhật" : "thêm"} inventory.`);
    }
  };

  const handleEdit = (inv) => {
    setForm({ user_id: inv.user_id, item_id: inv.item_id, quantity: inv.quantity });
    setOriginalKeys({ user_id: inv.user_id, item_id: inv.item_id }); // Store original keys
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/src/includes/admin/inventory/delete-inventory.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteKey),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.error("Delete error:", res.status, res.statusText, data.error);
        setErrorMessage(data.error || "Lỗi khi xóa inventory.");
        return;
      }
      setShowDeleteModal(false);
      setDeleteKey({ user_id: null, item_id: null });
      setErrorMessage("");
      fetchInventory();
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMessage("Lỗi khi xóa inventory.");
    }
  };

  return (
    <div className="container-fluid py-4">
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMessage("")}
          ></button>
        </div>
      )}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setForm({ user_id: "", item_id: "", quantity: 0 });
                setShowAddModal(true);
              }}
            >
              Thêm Inventory Mới
            </button>
            <input
              type="text"
              className="form-control form-control-sm w-50"
              placeholder="Tìm kiếm theo tên người dùng, tên vật phẩm hoặc số lượng..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="text-center">User ID</th>
                  <th scope="col" className="text-center">Tên Người Dùng</th>
                  <th scope="col" className="text-center">Item ID</th>
                  <th scope="col" className="text-center">Tên Vật Phẩm</th>
                  <th scope="col" className="text-center">Số Lượng</th>
                  <th scope="col" className="text-center action-column">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((inv) => (
                  <tr key={`${inv.user_id}-${inv.item_id}`}>
                    <td className="text-center align-middle">{inv.user_id}</td>
                    <td className="text-center align-middle">{inv.user_name}</td>
                    <td className="text-center align-middle">{inv.item_id}</td>
                    <td className="text-center align-middle">{inv.item_name}</td>
                    <td className="text-center align-middle">{inv.quantity}</td>
                    <td className="text-center align-middle">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="btn btn-outline-primary btn-sm action-btn"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setDeleteKey({ user_id: inv.user_id, item_id: inv.item_id });
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
                  <h5 className="modal-title">Thêm Inventory Mới</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Người Dùng</label>
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
                    <label className="form-label">Vật Phẩm</label>
                    <select
                      name="item_id"
                      value={form.item_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="">Chọn vật phẩm</option>
                      {sundries.map((sundry) => (
                        <option key={sundry.id} value={sundry.id}>
                          {sundry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số Lượng</label>
                    <input
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập số lượng (số nguyên không âm)"
                      required
                      type="number"
                      step="1"
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
                  <h5 className="modal-title">Sửa Inventory</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Người Dùng</label>
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
                    <label className="form-label">Vật Phẩm</label>
                    <select
                      name="item_id"
                      value={form.item_id}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      required
                    >
                      <option value="">Chọn vật phẩm</option>
                      {sundries.map((sundry) => (
                        <option key={sundry.id} value={sundry.id}>
                          {sundry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số Lượng</label>
                    <input
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập số lượng (số nguyên không âm)"
                      required
                      type="number"
                      step="1"
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
                  <p>Bạn có chắc muốn xóa mục inventory này?</p>
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
        .alert {
          margin-bottom: 1rem;
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