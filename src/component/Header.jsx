import styles from "./Header.module.css";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import { FaCalendarAlt, FaClock, FaUserCircle } from "react-icons/fa";

// const Header = ({ source, title, date, time, options }) => {
//   return (
//     <header className={styles.header}>
      
//       <div className={styles.left}>
//         <img src={source} alt="Logo" className={styles.logo} />
//         <span className={styles.title}>{title}</span>
//       </div>

      
//       <div className={styles.right}>
//         <div className={`${styles.infoBox} ${styles.calendar}`}>
//           <FaCalendarAlt />
//           <span>{date}</span>
//         </div>

//         <div className={`${styles.infoBox} ${styles.clock}`}>
//           <FaClock />
//           <span>{time}</span>
//         </div>

//         <div className={styles.userBox}>
//           <FaUserCircle />
//           <select className={styles.userSelect}>
//             {options.map((opt, i) => (
//               <option key={i}>{opt}</option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </header>
//   );
// };



import { useNavigate } from "react-router-dom";

const Header = ({ source, title, date, time }) => {


const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
const employeeId = decoded.employeeId;

  const navigate = useNavigate();
   const [attendanceType, setAttendanceType] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };
   
   const handleAttendance = async (e) => {

    const type = e.target.value;
    setAttendanceType(type);

    try {

      await axios.post( "http://localhost:8080/api/attendance/log",
        {
          employeeId: employeeId,
          type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(`${type} successful`);

    } catch (error) {
      console.error(error);
      alert("Attendance failed");
    }
  };

  return (
    <header className={styles.header}>

      <div className={styles.left}>
        <img src={source} alt="Logo" className={styles.logo} />
        <span className={styles.title}>{title}</span>
      </div>

      <div className={styles.right}>
        <div className={styles.infoBox}>
          <span>{date}</span>
        </div>

        <div className={styles.infoBox}>
          <span>{time}</span>
        </div>
        
         <div className={styles.userSelect}>
          <select value={attendanceType} onChange={handleAttendance}>
            <option value="">Attendance</option>
            <option value="CHECK_IN">CHECK_IN</option>
            <option value="CHECK_OUT">CHECK_OUT</option>
          </select>
        </div>

        <div className={styles.userBox}>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

    </header>
  );
};

 export default Header;