import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import styles from "./ProjectForm.module.css";

const ProjectForm = () => {
  const [project, setProject] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    try {
      await api.post("/projects", project);
      toast.success("Project Created Successfully");

      setProject({
        projectName: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "",
      });
    } catch (error) {
     const msg = error.response?.data?.message || "Error Creating Project";
     toast.error(msg);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Create Project</h2>

      {message && <p className={styles.success}>{message}</p>}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Project Name</label>
          <input
            type="text"
            name="projectName"
            value={project.projectName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={project.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={project.endDate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>
          <select
            name="status"
            value={project.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Create Project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;