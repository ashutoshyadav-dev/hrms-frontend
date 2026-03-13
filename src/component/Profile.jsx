import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./Profile.module.css";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
 

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/employee/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEmployee(res.data);
      console.log("Emp",res.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  

  if (!employee) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>

     
      <div className={styles.card}>
        <h2 className={styles.title}>Employee Profile</h2>

        <div className={styles.grid}>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone:</strong> {employee.phoneNumber}</p>
          <p><strong>Education:</strong> {employee.education}</p>
          <p><strong>Hire Date:</strong> {employee.hireDate}</p>
             <p><strong>Date of Birth:</strong> {employee.dateOfBirth}</p>
          <p><strong>Status:</strong> {employee.status}</p>
          <p><strong>Designation:</strong> {employee.designation?.title}</p>
        </div>
      </div>

      
      <div className={styles.card}>
        <h3 className={styles.subtitle}>Address</h3>

        <div className={styles.grid}>
          <div>
            <h4>Current Address</h4>
            <p>{employee.currentAddress?.addressLine1}</p>
            <p>{employee.currentAddress?.addressLine2}</p>
            <p>{employee.currentAddress?.city}</p>
            <p>{employee.currentAddress?.district}</p>
            <p>{employee.currentAddress?.state}</p>
            <p>{employee.currentAddress?.country}</p>
            <p>{employee.currentAddress?.pincode}</p>
          </div>

          <div>
            <h4>Permanent Address</h4>
            <p>{employee.permanentAddress?.addressLine1}</p>
            <p>{employee.permanentAddress?.addressLine2}</p>
            <p>{employee.permanentAddress?.city}</p>
            <p>{employee.permanentAddress?.district}</p>
            <p>{employee.permanentAddress?.state}</p>
            <p>{employee.permanentAddress?.country}</p>
            <p>{employee.permanentAddress?.pincode}</p>
          </div>
        </div>
      </div>

      
      <div className={styles.card}>
        <h3 className={styles.subtitle}>Technologies</h3>

        {employee.technologies?.length === 0 ? (
          <p>No Technologies Added</p>
        ) : (
          <div className={styles.techGrid}>
            {employee.technologies.map((tech) => (
              <div key={tech.id} className={styles.techCard}>
                <h4>{tech.technologyName}</h4>
                <p>Experience: {tech.experienceInMonths} months</p>
                <p>Proficiency: {tech.proficiency}</p>
                <p>{tech.usageDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    
      <div className={styles.card}>
  <h3 className={styles.subtitle}>Assigned Projects</h3>

  {employee.assignments?.length === 0 ? (
    <p>No Projects Assigned</p>
  ) : (
    employee.assignments.map((assignment) => (
      <div key={assignment.id} className={styles.projectCard}>
        <h4 className={styles.projectTitle}>
          {assignment.project?.projectName}
        </h4>

        <div className={styles.projectGrid}>
          <p>
            <strong>Project ID:</strong>{" "}
            {assignment.project?.projectId}
          </p>

          <p>
            <strong>Module:</strong>{" "}
            {assignment.module?.name}
          </p>

          <p>
            <strong>Assigned Date:</strong>{" "}
            {assignment.assignedDate}
          </p>

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
      </div>
    ))
  )}
</div>

      <div className={styles.card}>
        <h3 className={styles.subtitle}>Leave History</h3>

        {employee.leaveRequests?.length === 0 ? (
          <p>No Leave Taken</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employee.leaveRequests.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.leaveStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default Profile;
