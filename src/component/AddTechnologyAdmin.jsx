import { useState } from "react";
import { toast } from "react-toastify";
import TechnologyService from "../service/technologyService";
import styles from "./AddTechnologyAdmin.module.css";

const AddTechnologyAdmin = () => {

  const [formData, setFormData] = useState({
    name: "",
    technologyType: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    TechnologyService.createTechnology(formData)
      .then(() => {
        toast.success("Technology Added Successfully")
        setFormData({ name: "", technologyType: "" });
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Error while adding technology";
        toast.error(msg);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Add Technology</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Technology Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter technology name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Technology Type</label>
            <select
              name="technologyType"
              value={formData.technologyType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="FRONTEND">Frontend</option>
              <option value="BACKEND">Backend</option>
              <option value="DATABASE">Database</option>
              <option value="DEVOPS">DevOps</option>
            </select>
          </div>

          <button type="submit" className={styles.button}>
            Add Technology
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTechnologyAdmin;
