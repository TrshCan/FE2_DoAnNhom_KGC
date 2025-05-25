import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";

import "../assets/css/Friend.css";
import BASE_URL from "../components/BaseURL";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

const FriendList = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(
    parseInt(localStorage.getItem("userId")) || null
  );
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState({});
  const [newFriendId, setNewFriendId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceivedModal, setShowReceivedModal] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef(null);

  // List of common emojis for the picker
  const emojis = [
    "😊", "😂", "😍", "😎", "🥳", "😢", "😡", "👍", "👎", "🙌",
    "❤️", "🔥", "🌟", "🚀", "🎉", "🍎", "🍕", "🌈", "☀️", "🌙"
  ];

  const fetchFriends = async () => {
    if (!currentUserId) return;
    try {
      const res = await fetch(
        `/api/friend.php?user_id=${currentUserId}&type=friends`
      );
      const data = await res.json();
      console.log("Friends response:", data);
      if (Array.isArray(data)) {
        setFriends(data);
      } else {
        toast.error("🚫 Lỗi khi tải danh sách bạn bè!");
      }
    } catch (error) {
      console.error("Fetch friends error:", error);
      toast.error("❌ Lỗi kết nối khi tải danh sách bạn bè!");
    }
  };

  const fetchSentRequests = async () => {
    if (!currentUserId) return;
    try {
      const res = await fetch(
        `/api/friend.php?user_id=${currentUserId}&type=sent_requests`
      );
      const data = await res.json();
      console.log("Sent requests response:", data);
      if (Array.isArray(data)) {
        setSentRequests(data);
      } else {
        toast.error("🚫 Lỗi khi tải danh sách lời mời đã gửi!");
      }
    } catch (error) {
      console.error("Fetch sent requests error:", error);
      toast.error("❌ Lỗi kết nối khi tải lời mời đã gửi!");
    }
  };

  const fetchReceivedRequests = async () => {
    if (!currentUserId) return;
    try {
      const res = await fetch(
        `/api/friend.php?user_id=${currentUserId}&type=received_requests`
      );
      const data = await res.json();
      console.log("Received requests response:", data);
      if (Array.isArray(data)) {
        setReceivedRequests(data);
      } else {
        toast.error("🚫 Lỗi khi tải danh sách lời mời nhận được!");
      }
    } catch (error) {
      console.error("Fetch received requests error:", error);
      toast.error("❌ Lỗi kết nối khi tải lời mời nhận được!");
    }
  };

  const fetchMessages = async (friend) => {
    try {
      const res = await fetch(
        `/api/messages.php?user1=${currentUserId}&user2=${friend.id}`
      );
      const data = await res.json();
      console.log("Messages response:", data);
      if (Array.isArray(data)) {
        const formatted = data.map((msg) => ({
          sender: msg.sender_id === currentUserId ? "NGƯƠI" : friend.name,
          text: msg.content,
          timestamp: new Date(msg.sent_at).toLocaleTimeString("vi-VN"),
        }));
        setMessages((prev) => ({ ...prev, [friend.id]: formatted }));
      } else {
        if (data.error?.includes("Chỉ có thể xem tin nhắn")) {
          setSelectedFriend(null);
          toast.error("🚫 Bạn chưa là bạn bè với người này!");
        } else {
          toast.error("🚫 Lỗi khi tải tin nhắn: " + (data.error || "Không xác định"));
        }
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
      toast.error("❌ Lỗi kết nối khi tải tin nhắn!");
    }
  };

  const handleSelectFriend = async (friend) => {
    setSelectedFriend(friend);
    await fetchMessages(friend);
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!newFriendId.trim() || isNaN(parseInt(newFriendId))) {
      setErrorMessage("ID bạn bè không hợp lệ!");
      return;
    }
    try {
      const friendId = parseInt(newFriendId);
      const res = await fetch(`/api/friend.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id: friendId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.error) {
        setErrorMessage("");
        setNewFriendId("");
        setShowAddModal(false);
        fetchSentRequests();
        toast.success("📨 Gửi lời mời kết bạn thành công!");
      } else {
        setErrorMessage(data.error || "Lỗi khi gửi lời mời kết bạn!");
      }
    } catch (error) {
      console.error("Add friend error:", error);
      setErrorMessage("Lỗi kết nối: " + error.message);
    }
  };

  const handleAcceptRequest = async (friendId) => {
    if (!friendId || isNaN(friendId)) {
      toast.error("🚫 ID bạn bè không hợp lệ!");
      return;
    }
    try {
      const res = await fetch(`/api/friend.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id: friendId,
          action: "accept",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP error! Status: ${res.status}`);
      }

      await Promise.all([fetchFriends(), fetchReceivedRequests()]);

      const acceptedFriend = receivedRequests.find(
        (request) => request.id === friendId
      );

      if (acceptedFriend) {
        const friendToSelect = { id: acceptedFriend.id, name: acceptedFriend.name };
        setSelectedFriend(friendToSelect);
        await fetchMessages(friendToSelect);
      }

      setReceivedRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== friendId)
      );

      toast.success("🎉 Chấp nhận lời mời kết bạn thành công!");
    } catch (error) {
      console.error("Accept request error:", error);
      toast.error("❌ Lỗi khi chấp nhận lời mời kết bạn: " + error.message);
      await fetchFriends();
      await fetchReceivedRequests();
    }
  };

  const handleRejectRequest = async (friendId) => {
    if (!friendId || isNaN(friendId)) {
      toast.error("🚫 ID bạn bè không hợp lệ!");
      return;
    }
    try {
      const res = await fetch(`/api/friend.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id: friendId,
          action: "reject",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP error! Status: ${res.status}`);
      }

      await fetchReceivedRequests();

      setReceivedRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== friendId)
      );

      toast.success("🗑️ Từ chối lời mời kết bạn thành công!");
    } catch (error) {
      console.error("Reject request error:", error);
      toast.error("❌ Lỗi khi từ chối lời mời kết bạn: " + error.message);
      await fetchReceivedRequests();
    }
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      const res = await fetch(`/api/friend.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, friend_id: friendId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }

      if (selectedFriend?.id === friendId) {
        setSelectedFriend(null);
        setMessages((prev) => {
          const updatedMessages = { ...prev };
          delete updatedMessages[friendId];
          return updatedMessages;
        });
      }

      await fetchFriends();

      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      );

      toast.success("🗑️ Xóa bạn thành công!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete friend error:", error);
      toast.error("❌ Lỗi khi xóa bạn: " + error.message);
    }
  };

  const handleOpenDeleteModal = (friend) => {
    setFriendToDelete(friend);
    setShowDeleteModal(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;
    try {
      const res = await fetch(`/api/messages.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: currentUserId,
          receiver_id: selectedFriend.id,
          content: newMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes("Chỉ có thể nhắn tin")) {
          setSelectedFriend(null);
          toast.error("🚫 Bạn chưa là bạn bè với người này!");
        } else {
          throw new Error(data.error || `HTTP error! Status: ${res.status}`);
        }
      } else {
        setNewMessage("");
        await fetchMessages(selectedFriend);
        toast.success("📨 Gửi tin nhắn thành công!");
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("❌ Lỗi khi gửi tin nhắn: " + error.message);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiModal(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedFriend]);

  useEffect(() => {
    if (!currentUserId) {
      toast.error("🚫 Vui lòng đăng nhập để truy cập danh sách bạn bè!");
      navigate("/login");
      return;
    }

    fetchFriends();
    fetchSentRequests();
    fetchReceivedRequests();

    const handleStorageChange = () => {
      const newUserId = parseInt(localStorage.getItem("userId"));
      if (newUserId !== currentUserId) {
        setCurrentUserId(newUserId || null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    let intervalId;
    if (selectedFriend) {
      intervalId = setInterval(() => {
        fetchMessages(selectedFriend);
      }, 5000);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUserId, selectedFriend, navigate]);

  return (
    <div className="app-container">
      <ToastContainer />
      <button
        onClick={() => navigate("/mainhall")}
        className="close-button wax-seal-button"
        style={{ position: "fixed", top: "10px", right: "10px", zIndex: 1001 }}
        aria-label="Đóng cửa sổ bạn bè"
      >
        ĐÓNG
      </button>
      <div
        className={`sidebar parchment-sidebar ${
          showAddModal || showReceivedModal || showSentModal || showDeleteModal || showEmojiModal
            ? "sidebar-blur"
            : ""
        }`}
      >
        <div className="header parchment-header">
          <h3 className="header-title">DANH SÁCH BẠN BÈ</h3>
          <div className="header-buttons">
            <button
              onClick={() => {
                console.log("Opening Add Friend Modal");
                setShowAddModal(true);
              }}
              className="add-friend-button"
              title="Thêm bạn bè"
              aria-label="Mở modal thêm bạn bè"
            >
              <i className="fas fa-user-plus add-friend-icon"></i>
              THÊM BẠN
            </button>
          </div>
        </div>

        <Modal
          isOpen={showAddModal}
          onRequestClose={() => {
            setShowAddModal(false);
            setErrorMessage("");
          }}
          className="modal parchment-modal"
          overlayClassName="modal-overlay"
          contentLabel="Thêm bạn bè"
        >
          <div className="modal-content parchment-form">
            <h2 className="modal-title">THÊM BẠN BÈ</h2>
            <form onSubmit={handleAddFriend}>
              <div className="add-friend-input-container">
                <input
                  type="text"
                  value={newFriendId}
                  onChange={(e) => setNewFriendId(e.target.value)}
                  placeholder="ID BẠN BÈ..."
                  className="input-field"
                  aria-label="Nhập ID bạn bè"
                />
                <div className="modal-buttons">
                  <button type="submit" className="button wax-seal-button" aria-label="Gửi lời mời kết bạn">
                    GỬI LỜI MỜI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setErrorMessage("");
                    }}
                    className="button cancel-button"
                    aria-label="Hủy thêm bạn bè"
                  >
                    HỦY
                  </button>
                </div>
              </div>
              {errorMessage && (
                <p className="error-message" aria-live="polite">{errorMessage}</p>
              )}
            </form>
          </div>
        </Modal>

        <Modal
          isOpen={showReceivedModal}
          onRequestClose={() => setShowReceivedModal(false)}
          className="modal parchment-modal"
          overlayClassName="modal-overlay"
          contentLabel="Lời mời nhận được"
        >
          <div className="modal-content parchment-form">
            <h2 className="modal-title">LỜI MỜI NHẬN ĐƯỢC</h2>
            <ul className="friend-list">
              {receivedRequests.length > 0 ? (
                receivedRequests.map((request) => (
                  <li key={request.id} className="friend-item">
                    <div className="friend-details">
                      <span className="status-indicator pending"></span>
                      <div className="friend-info">
                        <span className="friend-name">{request.name}</span>
                        <p className="friend-last-message">Lời mời kết bạn</p>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="button wax-seal-button"
                        style={{ marginRight: "5px" }}
                        aria-label={`Chấp nhận lời mời từ ${request.name}`}
                      >
                        CHẤP NHẬN
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="delete-button wax-seal-button"
                        aria-label={`Từ chối lời mời từ ${request.name}`}
                      >
                        TỪ CHỐI
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-friends">KHÔNG CÓ LỜI MỜI NHẬN ĐƯỢC!</li>
              )}
            </ul>
            <div className="modal-buttons">
              <button
                onClick={() => setShowReceivedModal(false)}
                className="button cancel-button"
                aria-label="Đóng modal lời mời nhận được"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showSentModal}
          onRequestClose={() => setShowSentModal(false)}
          className="modal parchment-modal"
          overlayClassName="modal-overlay"
          contentLabel="Lời mời đã gửi"
        >
          <div className="modal-content parchment-form">
            <h2 className="modal-title">LỜI MỜI ĐÃ GỬI</h2>
            <ul className="friend-list">
              {sentRequests.length > 0 ? (
                sentRequests.map((request) => (
                  <li key={request.id} className="friend-item">
                    <div className="friend-details">
                      <span className="status-indicator pending"></span>
                      <div className="friend-info">
                        <span className="friend-name">{request.name}</span>
                        <p className="friend-last-message">Đang chờ chấp nhận</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-friends">CHƯA GỬI LỜI MỜI NÀO!</li>
              )}
            </ul>
            <div className="modal-buttons">
              <button
                onClick={() => setShowSentModal(false)}
                className="button cancel-button"
                aria-label="Đóng modal lời mời đã gửi"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          className="modal parchment-modal"
          overlayClassName="modal-overlay"
          contentLabel="Xác nhận xóa bạn"
        >
          <div className="modal-content parchment-form">
            <h2 className="modal-title">XÁC NHẬN XÓA BẠN</h2>
            <p>
              Bạn có chắc chắn muốn xóa <strong>{friendToDelete?.name}</strong> khỏi danh sách bạn bè không?
            </p>
            <div className="modal-buttons">
              <button
                onClick={() => handleDeleteFriend(friendToDelete?.id)}
                className="button wax-seal-button"
                aria-label={`Xóa bạn ${friendToDelete?.name}`}
              >
                XÓA BẠN
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="button cancel-button"
                aria-label="Hủy xóa bạn"
              >
                HỦY
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showEmojiModal}
          onRequestClose={() => setShowEmojiModal(false)}
          className="modal parchment-modal"
          overlayClassName="modal-overlay"
          contentLabel="Chọn Emoji"
        >
          <div className="modal-content parchment-form">
            <h2 className="modal-title">CHỌN EMOJI</h2>
            <div className="emoji-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="emoji-button"
                  style={{
                    fontSize: "24px",
                    padding: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  aria-label={`Chọn emoji ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="modal-buttons">
              <button
                onClick={() => setShowEmojiModal(false)}
                className="button cancel-button"
                aria-label="Đóng modal chọn emoji"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </Modal>

        <div className="sidebar-actions">
          <button
            onClick={() => {
              console.log("Opening Received Requests Modal");
              setShowReceivedModal(true);
            }}
            className="received-requests-button"
            aria-label="Xem lời mời nhận được"
          >
            <i className="fas fa-envelope add-friend-icon"></i>
            LỜI MỜI NHẬN
          </button>
          <button
            onClick={() => {
              console.log("Opening Sent Requests Modal");
              setShowSentModal(true);
            }}
            className="sent-requests-button"
            aria-label="Xem lời mời đã gửi"
          >
            <i className="fas fa-paper-plane add-friend-icon"></i>
            LỜI MỜI ĐÃ GỬI
          </button>
        </div>

        <h4>Bạn bè</h4>
        <ul className="friend-list">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <li
                key={friend.id}
                className={`friend-item ${
                  selectedFriend?.id === friend.id ? "friend-item-selected" : ""
                }`}
                aria-label={`Chọn bạn ${friend.name}`}
              >
                <div
                  className="friend-details"
                  onClick={() => handleSelectFriend(friend)}
                >
                  <span className="status-indicator online"></span>
                  <div className="friend-info">
                    <span className="friend-name">{friend.name}</span>
                    <p className="friend-last-message">...</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenDeleteModal(friend)}
                  className="delete-button wax-seal-button"
                  aria-label={`Xóa bạn ${friend.name}`}
                >
                  XÓA BẠN
                </button>
              </li>
            ))
          ) : (
            <li className="no-friends">CHƯA CÓ BẠN BÈ!</li>
          )}
        </ul>
      </div>

      <div className={`chat-container parchment-chat ${selectedFriend ? "chat-active" : ""}`}>
        {selectedFriend ? (
          <>
            <div className="header parchment-header">
              <h3 className="header-title">{selectedFriend.name}</h3>
            </div>
            <div className="chat-messages">
              {(messages[selectedFriend.id] || []).map((msg, i) => (
                <div
                  key={i}
                  className={`chat-message ${
                    msg.sender === "NGƯƠI" ? "justify-end" : "justify-start"
                  } unroll-animation`}
                >
                  <div
                    className={
                      msg.sender === "NGƯƠI"
                        ? "chat-bubble-you parchment-bubble"
                        : "chat-bubble-friend parchment-bubble"
                    }
                  >
                    <span>{msg.text}</span>
                    <div className="message-timestamp">({msg.timestamp})</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container flex items-center">
              <button
                onClick={() => {
                  console.log("Opening Emoji Modal");
                  setShowEmojiModal(true);
                }}
                className="emoji-picker-button wax-seal-button mr-2"
                title="Chọn Emoji"
                aria-label="Mở modal chọn emoji"
              >
                😊
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="VIẾT TIN NHẮN..."
                className="input-field flex-grow"
                aria-label="Nhập tin nhắn"
              />
              <button
                onClick={handleSendMessage}
                className="button wax-seal-button ml-2"
                aria-label="Gửi tin nhắn"
              >
                GỬI
              </button>
            </div>
          </>
        ) : (
          <div className="welcome-container">
            <h2 className="welcome-title">CHÀO MỪNG ĐẾN SỔ TRÒ CHUYỆN!</h2>
            <p className="welcome-text">HÃY CHỌN MỘT BẠN ĐỂ BẮT ĐẦU!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;