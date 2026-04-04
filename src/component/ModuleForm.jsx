import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import styles from "./ModuleForm.module.css";

const ModuleForm = () => {
  const [module, setModule] = useState({
    name: "",
    description: "",
    projectId: "",
    employeeId: "",
  });

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, employeesRes] = await Promise.all([
          api.get("/projects"),
          api.get("/admin/employees/dropdown"),
        ]);
        // console.log("emp",employeesRes);
        // console.log("project",projectsRes);
        
        const activeProjects = projectsRes.data.filter(
          (p) => p.status === "ACTIVE"
        );
        setProjects(activeProjects);

        const activeEmployees = employeesRes.data;
        setEmployees(activeEmployees);
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to load projects or employees.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setModule({
      ...module,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const moduleData = {
        ...module,
        projectId: parseInt(module.projectId),
        employeeId: parseInt(module.employeeId),
      };

      await api.post("/projects/modules", moduleData);

      toast.success("Module created successfully");

      setModule({
        name: "",
        description: "",
        projectId: "",
        employeeId: "",
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Error creating module";
           toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.loaderContainer}>Loading data...</div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Create New Module</h2>

      {message && (
        <div className={styles.messageBox}>
          {message}
        </div>
      )}

      {projects.length === 0 && (
        <div className={styles.warningBox}>
          ⚠️ No active projects available. Please create a project first.
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>
            Module Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={module.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            Description <span className={styles.required}>*</span>
          </label>
          <textarea
            name="description"
            rows="4"
            value={module.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            Select Project <span className={styles.required}>*</span>
          </label>
          <select
            name="projectId"
            value={module.projectId}
            onChange={handleChange}
            required
            disabled={projects.length === 0}
          >
            <option value="">-- Choose a project --</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>
            Assign Module Owner <span className={styles.required}>*</span>
          </label>
          <select
            name="employeeId"
            value={module.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select an employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting || projects.length === 0}
          className={styles.button}
        >
          {submitting ? "Creating Module..." : "Create Module"}
        </button>
      </form>
    </div>
  );
};

export default ModuleForm;