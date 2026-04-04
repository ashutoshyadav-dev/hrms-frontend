import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import styles from "./Designation.module.css";

const DesignationForm = () => {
  const [designation, setDesignation] = useState({
    title: "",
    description: "",
    baseSalary: "",
  });

  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setDesignation({
      ...designation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setErrorMsg("");

    try {
      await api.post("/designations", {
        ...designation,
        baseSalary: parseFloat(designation.baseSalary),
      });
      toast.success("Designation Created Successfully");
      setDesignation({
        title: "",
        description: "",
        baseSalary: "",
      });
    } catch (error) {
     const msg = error.response?.data?.message || "error while creating designation";
     toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Create Designation</h2>

      {message && <p className={styles.success}>{message}</p>}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>
            Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={designation.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            value={designation.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            Base Salary (₹) <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            name="baseSalary"
            value={designation.baseSalary}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={styles.button}
        >
          {submitting ? "Creating..." : "Create Designation"}
        </button>
      </form>
    </div>
  );
};

export default DesignationForm;