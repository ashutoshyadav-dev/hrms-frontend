import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import styles from "./LeaveApply.module.css";

const LeaveApply = () => {

  const [leave, setLeave] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    daysRequested: 0,
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate" || name === "endDate") {
      const updatedLeave = { ...leave, [name]: value };

      updatedLeave.daysRequested = calculateDays(
        name === "startDate" ? value : leave.startDate,
        name === "endDate" ? value : leave.endDate
      );

      setLeave(updatedLeave);
    } else {
      setLeave({ ...leave, [name]: value });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage("");
  //   setErrorMsg("");

  //   try {
  //     await api.post("/leaves/apply", leave); 
  //     setMessage("Leave Request Submitted Successfully");

  //     setLeave({
  //       leaveType: "",
  //       startDate: "",
  //       endDate: "",
  //       daysRequested: 0,
  //       reason: "",
  //     });
  //   } catch (error) {
  //     setErrorMsg("Error submitting leave request");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setErrorMsg("");

  try {
    await api.post("/leaves/apply", leave);

    // setMessage("Leave Request Submitted Successfully");
     toast.success("Leave applied successfully ✅");

    setLeave({
      leaveType: "",
      startDate: "",
      endDate: "",
      daysRequested: 0,
      reason: "",
    });

  } catch (error) {
    console.log("errorbacken",error.response?.data?.message);
    
    // const msg = error.response?.data?.message || "Error submitting leave request";

    // setErrorMsg(msg);

      const msg =error.response?.data?.message || "Error while applying leave";

    toast.error(msg );
  }
};

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Apply Leave</h2>

      {message && <p className={styles.success}>{message}</p>}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.formGroup}>
          <label>Leave Type</label>
          <select
            name="leaveType"
            value={leave.leaveType}
            onChange={handleChange}
          >
            <option value="">Select Leave type</option>
            <option value="SICK">SICK</option>
            <option value="VACATION">VACATION</option>
            <option value="PERSONAL">PERSONAL</option>
            <option value="EMERGENCY">EMERGENCY</option>
            <option value="MATERNITY">MATERNITY</option>
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={leave.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={leave.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Days Requested</label>
          <input
            type="number"
            value={leave.daysRequested}
            readOnly
            className={styles.readOnlyField}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Reason</label>
          <textarea
            name="reason"
            rows="3"
            value={leave.reason}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.button}>
          Submit Leave
        </button>
      </form>
    </div>
  );
};

export default LeaveApply;



