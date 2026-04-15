import { useState } from "react";
import styles from "./FileUploadManager.module.css";
import { toast } from "react-toastify";
import api from "../api/api";

const API_URL = "/api/adminDocument/upload";

export default function FileUploadManager() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("ATTENDANCE");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      setLoading(true);

      const res = await api.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(res.data);
      toast.success("File uploaded successfully");
    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bulk Data Upload</h2>

      <form className={styles.form} onSubmit={handleUpload}>
        
        <div className={styles.formGroup}>
          <label>Upload Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="ATTENDANCE">Attendance</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="PROJECT">Project</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Select File</label>
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading} className={styles.buttons}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

  
      {response && (
        <div className={styles.result}>
          <h3>Upload Summary</h3>

          <div className={styles.summary}>
            <p>Total: {response.total}</p>
            <p className={styles.success}>Success: {response.success}</p>
            <p className={styles.failed}>Failed: {response.failed}</p>
          </div>

          {/* Errors */}
          {response.errors && response.errors.length > 0 && (
            <div className={styles.errorBox}>
              <h4>Error Details</h4>
              <ul>
                {response.errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}