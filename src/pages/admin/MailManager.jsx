import React, { useEffect, useState } from "react";
import BASE_URL from "../../components/BaseURL";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MailManager() {
  const [mails, setMails] = useState([]);
  const [filteredMails, setFilteredMails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ id: null, title: "", content: "", sender_email: "", receiver_email: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchMails = async () => {
    const res = await fetch(`${BASE_URL}/src/includes/admin/mails/get-mails.php`);
    const data = await res.json();
    setMails(data);
    setFilteredMails(data);
  };

  useEffect(() => {
    fetchMails();
  }, []);

  useEffect(() => {
    const filtered = mails.filter(
      (mail) =>
        mail.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mail.receiver_email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMails(filtered);
  }, [searchQuery, mails]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (isEdit = false) => {
    const url = isEdit ? "update-mail.php" : "add-mail.php";
    const formData = new FormData();
    formData.append("id", form.id || "");
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("sender_email", form.sender_email);
    formData.append("receiver_email", form.receiver_email);

    await fetch(`${BASE_URL}/src/includes/admin/mails/${url}`, {
      method: "POST",
      body: formData,
    });

    setForm({ id: null, title: "", content: "", sender_email: "", receiver_email: "" });
    setShowAddModal(false);
    setShowEditModal(false);
    fetchMails();
  };

  const handleEdit = (mail) => {
    setForm(mail);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    await fetch(`${BASE_URL}/src/includes/admin/mails/delete-mail.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    setShowDeleteModal(false);
    setDeleteId(null);
    fetchMails();
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setForm({ id: null, title: "", content: "", sender_email: "", receiver_email: "" });
                setShowAddModal(true);
              }}
            >
              Thêm Mail Mới
            </button>
            <input
              type="text"
              className="form-control form-control-sm w-50"
              placeholder="Tìm kiếm theo tiêu đề, nội dung, người gửi hoặc người nhận..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="text-center">ID</th>
                  <th scope="col" className="text-center name-column">Tiêu đề</th>
                  <th scope="col" className="text-center">Nội dung</th>
                  <th scope="col" className="text-center">Người gửi</th>
                  <th scope="col" className="text-center">Người nhận</th>
                  <th scope="col" className="text-center">Ngày nhận</th>
                  <th scope="col" className="text-center action-column">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMails.map((mail) => (
                  <tr key={mail.id}>
                    <td className="text-center align-middle">{mail.id}</td>
                    <td className="text-center align-middle name-cell">{mail.title}</td>
                    <td className="align-middle">{mail.content}</td>
                    <td className="text-center align-middle">{mail.sender_email}</td>
                    <td className="text-center align-middle">{mail.receiver_email}</td>
                    <td className="text-center align-middle">{mail.received_at}</td>
                    <td className="text-center align-middle">
                      <button
                        onClick={() => handleEdit(mail)}
                        className="btn btn-outline-primary btn-sm action-btn"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(mail.id);
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
                  <h5 className="modal-title">Thêm Mail Mới</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập tiêu đề"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Người gửi</label>
                    <input
                      name="sender_email"
                      value={form.sender_email}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập email người gửi"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Người nhận</label>
                    <input
                      name="receiver_email"
                      value={form.receiver_email}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập email người nhận"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nội dung</label>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập nội dung"
                      required
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
                  <h5 className="modal-title">Sửa Mail</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập tiêu đề"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Người gửi</label>
                    <input
                      name="sender_email"
                      value={form.sender_email}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập email người gửi"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Người nhận</label>
                    <input
                      name="receiver_email"
                      value={form.receiver_email}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập email người nhận"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nội dung</label>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Nhập nội dung"
                      required
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
                  <p>Bạn có chắc muốn xóa mail này?</p>
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
          min-width: 100%;
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