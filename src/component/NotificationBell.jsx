import { useEffect, useState } from "react";
import api from "../api/api";
import { FaBell } from "react-icons/fa";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const fetchNotifications = async () => {
       
     try {
        const response = await api.get("/notifications");
        setNotifications(response.data);  
        console.log("noti",response.data);
      } catch (error) {
        console.error(error);
      } 
      
  };
  
  const markAsRead = async (id) => {
  try {
    await api.put(`/notifications/mark-read/${id}`);

    
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000000); 
    return () => clearInterval(interval);
  }, []);

 



  return (
    <div style={{ position: "relative" }}>
      
     

      <FaBell 
  size={24} 
  onClick={() => {
    console.log("clicked", show);
    setShow(!show);
  }} 
/>

     
      {notifications.filter(n => !n.read).length > 0 && (
        <span style={{
          position: "absolute",
          top: -5,
          right: -5,
          background: "red",
          color: "white",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "12px"
        }}>
          {notifications.filter(n => !n.read).length}
        </span>
      )}

   

        {show && (
  <div style={{
    position: "absolute",
    top: "35px",
    right: "0",
    width: "300px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    maxHeight: "300px",
    overflowY: "auto",
    zIndex: 9999
  }}>
          {notifications.length === 0 ? (
            <p style={{ padding: "10px" }}>No notifications</p>
          ) : (
            notifications.map((n, index) => (
              <div key={index}  onClick={() => markAsRead(n.id)}  style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                background: n.read ? "#fff" : "#f5f5f5",
                color: "#333",
                fontSize: "14px"
              }}>
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;