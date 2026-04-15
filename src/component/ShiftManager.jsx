import { useState } from "react";
import styles from "./ShiftManager.module.css";
import { toast } from "react-toastify";
import api from "../api/api";

const API_URL = "/api/shifts";

export default function ShiftManager() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [flexibleStartLimit, setFlexibleStartLimit] = useState("");
  const [requiredWorkHours, setRequiredWorkHours] = useState("");
  const [flexible, setFlexible] = useState(false);

  const [shifts, setShifts] = useState([]);
  const [showList, setShowList] = useState(false);
  const [editId, setEditId] = useState(null);

  const resetForm = () => {
    setName("");
    setStartTime("");
    setEndTime("");
    setFlexibleStartLimit("");
    setRequiredWorkHours("");
    setFlexible(false);
    setEditId(null);
  };

  const calculateHours = (start, end) => {
    if (!start || !end) return "";

    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    let startTotal = startHour + startMin / 60;
    let endTotal = endHour + endMin / 60;

    let diff = endTotal - startTotal;

    // handle night shift
    if (diff < 0) {
      diff += 24;
    }

    return diff.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        startTime,
        endTime,
        flexibleStartLimit,
        requiredWorkHours: Number(requiredWorkHours),
        flexible,
      };

      if (editId) {
        await api.put(`${API_URL}/${editId}`, payload);
        toast.success("Shift updated");
      } else {
        await api.post(API_URL, payload);
        toast.success("Shift created");
      }

      resetForm();
      if (showList) fetchShifts();
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      toast.error(msg);
    }
  };

  const fetchShifts = async () => {
    try {
      const res = await api.get(API_URL);
      setShifts(res.data);
      setShowList(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch shifts");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_URL}/${id}`);
      setShifts(shifts.filter((s) => s.id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Operation failed";
      toast.error(msg);
    }
  };

  const handleEdit = (shift) => {
    setEditId(shift.id);
    setName(shift.name);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setFlexibleStartLimit(shift.flexibleStartLimit);
    setRequiredWorkHours(shift.requiredWorkHours);
    setFlexible(shift.flexible);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Shift Management</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Shift Name</label>
          <input
            type="text"
            placeholder="Enter shift name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => {
              const value = e.target.value;
              setStartTime(value);
              setRequiredWorkHours(calculateHours(value, endTime));
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => {
              const value = e.target.value;
              setEndTime(value);
              setRequiredWorkHours(calculateHours(startTime, value));
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Flexible Start Limit</label>
          <input
            type="time"
            value={flexibleStartLimit}
            onChange={(e) => setFlexibleStartLimit(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Required Work Hours</label>
          <input type="number" value={requiredWorkHours} readOnly />
        </div>

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            checked={flexible}
            onChange={(e) => setFlexible(e.target.checked)}
          />
          <label>Flexible Shift</label>
        </div>

        <button className={styles.addBtn}>
          {editId ? "Update Shift" : "Add Shift"}
        </button>
      </form>

      <button className={styles.listBtn} onClick={fetchShifts}>
        Show Shifts
      </button>

      {showList && (
        <div className={styles.list}>
          {shifts.map((s) => (
            <div key={s.id} className={styles.card}>
              <div>
                <strong>{s.name}</strong>
                <p>
                  {s.startTime} - {s.endTime}
                </p>
                <p>Hours: {s.requiredWorkHours}</p>
                <span className={s.flexible ? styles.active : styles.inactive}>
                  {s.flexible ? "Flexible" : "Fixed"}
                </span>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(s)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
