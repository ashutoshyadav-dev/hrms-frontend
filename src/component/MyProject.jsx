import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import styles from "./MyProject.module.css";

const MyProject = () => {

  const [assignments, setAssignments] = useState([]);   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await api.get("/employee-assignments/byEmail");
        setAssignments(response.data);  
        console.log(response.data);
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to load assignment";
             toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, []);

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Projects</h2>

      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <div key={assignment.assignmentId} className={styles.card}>

            <h3>{assignment.projectName}</h3>

            <p><strong>Project Description:</strong> {assignment.projectDescription}</p>

            <p><strong>Module:</strong> {assignment.moduleName}</p>
            <p><strong>Module Description:</strong> {assignment.moduledescription}</p>

            <p><strong>Assigned Date:</strong> {assignment.assignedDate}</p>
            <p><strong>Project Start:</strong> {assignment.projectStartDate}</p>
            <p><strong>Project End:</strong> {assignment.projectEndDate}</p>

            <p><strong>Hours Worked:</strong> {assignment.hoursWorked}</p>
            <p>
  <strong>Status:</strong>{" "}
  <span
    className={`${styles.status} ${
      assignment.projectStatus === "ACTIVE"
        ? styles.active
        : assignment.projectStatus === "COMPLETED"
        ? styles.completed
        : styles.onhold
    }`}
  >
    {assignment.projectStatus}
  </span>
</p>

          </div>
        ))
      ) : (
        <p className={styles.message}>No Assignments Found</p>
      )}
    </div>
  );
};

export default MyProject;