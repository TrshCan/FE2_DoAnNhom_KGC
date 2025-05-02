// Friend.jsx
import React, { useEffect, useState } from "react"; // Đảm bảo import useEffect, useState
import "../assets/css/Friend.css";
import BASE_URL from "../components/BaseURL";

const FriendList = () => {
  const currentUserId = parseInt(localStorage.getItem("currentUserId")) || 1;
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState({});
  const [newFriendId, setNewFriendId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFriends = async () => {
    const res = await fetch(
      `${BASE_URL}/src/includes/friend.php?user_id=${currentUserId}`
    );
    const data = await res.json();
    setFriends(data);
  };

  const fetchMessages = async (friend) => {
    const res = await fetch(
      `${BASE_URL}/src/includes/messages.php?user1=${currentUserId}&user2=${friend.id}`
    );
    const data = await res.json();
    const formatted = data.map((msg) => ({
      sender: msg.sender_id === currentUserId ? "NGƯƠI" : friend.name,
      text: msg.content,
      timestamp: new Date(msg.sent_at).toLocaleTimeString("vi-VN"),
    }));
    setMessages((prev) => ({ ...prev, [friend.id]: formatted }));
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
      const res = await fetch(`${BASE_URL}/src/includes/friend.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id: friendId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! Status: ${res.status}, Response: ${errorText}`
        );
      }
      const data = await res.json();
      if (res.ok && !data.error) {
        setErrorMessage("");
        setNewFriendId("");
        setShowAddForm(false);
        fetchFriends();
      } else {
        setErrorMessage(data.error || "Lỗi khi thêm bạn!");
      }
    } catch (error) {
      console.error("Add friend error:", error);
      setErrorMessage("Lỗi kết nối: " + error.message);
    }
  };

  const handleDeleteFriend = async (friendId) => {
    await fetch(`${BASE_URL}/src/includes/friend.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUserId, friend_id: friendId }),
    });
    setSelectedFriend(null);
    fetchFriends();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;
    await fetch(`${BASE_URL}/src/includes/messages.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: currentUserId,
        receiver_id: selectedFriend.id,
        content: newMessage,
      }),
    });
    setNewMessage("");
    fetchMessages(selectedFriend);
  };

  // Thêm polling để kiểm tra tin nhắn mới
  useEffect(() => {
    fetchFriends();
    // Nếu có bạn được chọn, thiết lập polling để kiểm tra tin nhắn mới
    let intervalId;
    if (selectedFriend) {
      intervalId = setInterval(() => {
        fetchMessages(selectedFriend);
      }, 5000); // Kiểm tra mỗi 5 giây
    }
    // Dọn dẹp interval khi component unmount hoặc selectedFriend thay đổi
    return () => clearInterval(intervalId);
  }, [selectedFriend]);

  return (
    <div className="app-container">
      <div className="sidebar parchment-sidebar">
        <div className="header parchment-header">
          <h3 className="header-title">DANH SÁCH BẠN BÈ</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="add-friend-button"
          >
            <svg
              className="add-friend-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ imageRendering: "pixelated" }}
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 ****

System: 01112 0v-1z"
              />
            </svg>
          </button>
        </div>

        {showAddForm && (
          <div className="add-friend-form parchment-form">
            <div className="add-friend-input-container">
              <input
                type="text"
                value={newFriendId}
                onChange={(e) => setNewFriendId(e.target.value)}
                placeholder="ID BẠN BÈ..."
                className="input-field"
              />
              <button
                onClick={handleAddFriend}
                className="button wax-seal-button"
              >
                THÊM
              </button>
            </div>
            {errorMessage && (
              <p className="error-message" style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}
          </div>
        )}

        <ul className="friend-list">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <li
                key={friend.id}
                className={`friend-item ${
                  selectedFriend?.id === friend.id ? "friend-item-selected" : ""
                }`}
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
                  onClick={() => handleDeleteFriend(friend.id)}
                  className="delete-button wax-seal-button"
                >
                  XÓA
                </button>
              </li>
            ))
          ) : (
            <li className="no-friends">CHƯA CÓ BẠN BÈ!</li>
          )}
        </ul>
      </div>

      <div className="chat-container parchment-chat">
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
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="VIẾT TIN NHẮN..."
                className="input-field"
              />
              <button
                onClick={handleSendMessage}
                className="button wax-seal-button"
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
