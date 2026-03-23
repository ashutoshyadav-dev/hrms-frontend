// import { jwtDecode } from "jwt-decode";
// import { useEffect, useState } from "react";
// import "./Dashboard.css";


// const Dashboard = () => {
// const token = localStorage.getItem("token");

// let decoded = null;

// if (token) {
//   try {
//     decoded = jwtDecode(token);
//   } catch (error) {
//     console.error("Invalid token");
//   }
// }

// console.log("decoded user data:", decoded);

// const name =
//   decoded?.name ||
//   decoded?.employeeName ||
//   User;

// const role = decoded?.role || "Employee";

//   const [animate, setAnimate] = useState(false);

//   useEffect(() => {
//     setAnimate(true);
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <div className={`dashboard-card ${animate ? "show" : ""}`}>
//         <div className="text-section">
//           <h1 className="welcome-text">
//             Hello, <span>{name}</span> 👋
//           </h1>

//           <p className="role-text">
//             Logged in as <strong>{role.replace("ROLE_", "")}</strong>
//           </p>

//           <p className="sub-text">
//             Welcome to your HRMS Dashboard. Manage your work efficiently.
//           </p>
//         </div>

//         <div className="image-section">
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//             alt="dashboard"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { jwtDecode } from "jwt-decode";
import EmployeeService from "../service/EmployeeService";
import "./Dashboard.css";

const STATUS_META = {
  present:  { label: "Present",  color: "#16a34a", bg: "#dcfce7" },
  late:     { label: "Late",     color: "#d97706", bg: "#fef9c3" },
  half:     { label: "Half Day", color: "#db2777", bg: "#fce7f3" },
  absent:   { label: "Absent",   color: "#dc2626", bg: "#fee2e2" },
  leave:    { label: "Leave",    color: "#7c3aed", bg: "#ede9fe" },
  holiday:  { label: "Holiday",  color: "#0369a1", bg: "#e0f2fe" },
  upcoming: { label: "Upcoming", color: "#9ca3af", bg: "transparent" },
  weekend:  { label: "Weekend",  color: "#d1d5db", bg: "transparent" },
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const today = new Date();

function getInitials(name = "") {
  return name.trim().split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

function StatPill({ label, count, color, bg }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", borderRadius:30, background:bg }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0 }} />
      <span style={{ fontSize:13, color, fontWeight:600 }}>{count}</span>
      <span style={{ fontSize:12, color, opacity:0.8 }}>{label}</span>
    </div>
  );
}

const Dashboard = () => {
  const token   = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : {};
  const empId   = decoded?.employeeId || decoded?.id;
  const name    = decoded?.employeeName || decoded?.name || "Employee";
  const role    = (decoded?.role || "ROLE_EMPLOYEE").replace("ROLE_", "");

  const [calDate,     setCalDate]     = useState(today);
  const [attendance,  setAttendance]  = useState([]);
  const [leaves,      setLeaves]      = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    loadData(calDate);
  }, [calDate.getFullYear(), calDate.getMonth()]);

  const loadData = async (d) => {
    setLoading(true);
    try {
      const year    = d.getFullYear();
      const month   = String(d.getMonth() + 1).padStart(2, "0");
      const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
      const [attRes, leaveRes] = await Promise.all([
        EmployeeService.getAttendance(empId, `${year}-${month}-01`, `${year}-${month}-${lastDay}`),
        EmployeeService.getLeaves(),
      ]);
      setAttendance(attRes.data || []);
      setLeaves(leaveRes.data || []);
    } catch (e) {
      console.error("Failed to load attendance", e);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (date) => {
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return "weekend";
    const d = date.toISOString().split("T")[0];
    const onLeave = leaves.find(l => d >= l.fromDate && d <= l.toDate && l.status === "APPROVED");
    if (onLeave) return "leave";
    const record = attendance.find(a => a.date === d);
    if (!record) return date > today ? "upcoming" : "absent";
    const s = record.status?.toLowerCase();
    if (s === "present")  return "present";
    if (s === "late")     return "late";
    if (s === "half_day") return "half";
    if (s === "absent")   return "absent";
    if (s === "holiday")  return "holiday";
    return "upcoming";
  };

 
  const summary = { present:0, late:0, half:0, absent:0, leave:0 };
  const daysInMonth = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(calDate.getFullYear(), calDate.getMonth(), i);
    if (d > today) break;
    const s = getStatus(d);
    if (summary[s] !== undefined) summary[s]++;
  }

  const leaveUsed  = leaves.filter(l => l.status === "APPROVED").length;
  const leaveTotal = 10;
  const leavePct   = Math.min(Math.round((leaveUsed / leaveTotal) * 100), 100);

  return (
    <div className="dash-root">

      {/* header */}
      <div className="dash-header">
        <div className="dash-avatar">{getInitials(name)}</div>
        <div className="dash-hinfo">
          <h2>Hello, {name} 👋</h2>
          <p>
            <span className="dash-badge role-badge">{role}</span>
            <span className="dash-badge shift-badge">Morning Shift</span>
          </p>
        </div>
      </div>

      {/* stat pills */}
      <div className="dash-stats">
        {["present","late","half","absent","leave"].map(s => (
          <StatPill
            key={s}
            label={STATUS_META[s].label}
            count={s === "leave" ? leaveUsed : summary[s]}
            color={STATUS_META[s].color}
            bg={STATUS_META[s].bg}
          />
        ))}
      </div>

      <div className="dash-body">

        {/* calendar */}
        <div className="dash-card dash-card-cal">
          <div className="dash-card-title">
            Attendance — {MONTHS[calDate.getMonth()]} {calDate.getFullYear()}
            {loading && <span className="dash-loading">loading…</span>}
          </div>

          <Calendar
            value={calDate}
            onActiveStartDateChange={({ activeStartDate }) => setCalDate(activeStartDate)}
            tileClassName={({ date, view }) =>
              view === "month" ? `tile-${getStatus(date)}` : null
            }
          />

          <div className="dash-legend">
            {["present","late","half","absent","leave","holiday"].map(s => (
              <div key={s} className="leg-item">
                <span className="leg-dot" style={{ background: STATUS_META[s].color }} />
                <span>{STATUS_META[s].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* right panel */}
        <div className="dash-side">

          {/* leave balance */}
          <div className="dash-card">
            <div className="dash-card-title">Leave Balance</div>
            <div className="leave-summary-row">
              <span>{leaveUsed} used</span>
              <span className="leave-remaining">{leaveTotal - leaveUsed} remaining</span>
            </div>
            <div className="leave-track">
              <div className="leave-fill" style={{ width: leavePct + "%" }} />
            </div>
            <div className="leave-types">
              {[
                { label: "Casual", used: 1, total: 4 },
                { label: "Sick",   used: 2, total: 4 },
                { label: "Earned", used: 0, total: 2 },
              ].map(lt => (
                <div key={lt.label} className="leave-type-row">
                  <span>{lt.label} Leave</span>
                  <span>{lt.used} / {lt.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* shift details */}
          <div className="dash-card">
            <div className="dash-card-title">Shift Details</div>
            {[
              ["Shift",    "Morning Shift"],
              ["Start",    "09:00 AM"],
              ["End",      "06:00 PM"],
              ["Hours",    "8 hrs / day"],
              ["Flexible", "No"],
            ].map(([k, v]) => (
              <div key={k} className="shift-row">
                <span className="shift-key">{k}</span>
                <span className="shift-val">{v}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;