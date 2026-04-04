import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import styles from "./MySkillForm.module.css";

const MySkillForm = () => {

  const [formData, setFormData] = useState({
    technologyId: "",
    experienceInMonths: "",
    proficiency: "",
    usageDescription: ""
  });

  const [technologies, setTechnologies] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);


  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await api.get("/technologies");
        setTechnologies(res.data);
      } catch (err) {
        toast.error("Failed to fetch technologies");
      }
    };

    fetchTechnologies();
  }, []);

  
  useEffect(() => {
    const fetchMySkills = async () => {
      try {
        const res = await api.get("/employee/getEmpTechnology");
        setMySkills(res.data);
      } catch (err) {
        toast.error("Failed to fetch your skills");
      }
    };

    fetchMySkills();
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;

   
    if (name === "experienceInMonths") {
      if (value < 0 || value > 300) return;
    }

    if (name === "technologyId") {

      const existingSkill = mySkills.find(
        s => s.technologyId === Number(value)
      );

      if (existingSkill) {
        toast.info("Skill already exists. You can update it.");

        setIsUpdate(true);

        setFormData({
          technologyId: value,
          experienceInMonths: existingSkill.experienceInMonths,
          proficiency: existingSkill.proficiency,
          usageDescription: existingSkill.usageDescription || ""
        });

        return;
      } else {
        setIsUpdate(false);

        setFormData({
          technologyId: value,
          experienceInMonths: "",
          proficiency: "",
          usageDescription: ""
        });

        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   const handleSubmit = async (e) => {
  e.preventDefault();

  const experienceMonths = Number(formData.experienceInMonths);

  if (experienceMonths <= 0) {
    toast.warn("Experience must be greater than 0");
    return;
  }

  try {
    
    await api.post("/employee/empTechnology", formData);

    toast.success(
      isUpdate ? "Skill updated successfully" : "Skill added successfully"
    );

    
    const res = await api.get("/employee/getEmpTechnology");
    setMySkills(res.data);

    
    setIsUpdate(false);
    setFormData({
      technologyId: "",
      experienceInMonths: "",
      proficiency: "",
      usageDescription: ""
    });

  } catch (err) {
    const msg = err.response?.data?.message || "Error while saving skill";
    toast.error(msg);
  }
};
  
  const experienceMonths = Number(formData.experienceInMonths);
  const experienceYears = (experienceMonths / 12).toFixed(2);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>
        {isUpdate ? "Update Skill" : "Add Skill"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>

     
        <div className={styles.formGroup}>
          <label>Technology *</label>
          <select
            name="technologyId"
            value={formData.technologyId}
            onChange={handleChange}
            required
          >
            <option value="">Select Technology</option>
            {technologies.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>

       
        <div className={styles.formGroup}>
          <label>Experience (Months) *</label>
          <input
            type="number"
            name="experienceInMonths"
            value={formData.experienceInMonths}
            onChange={handleChange}
            min="0"
            max="600"
            required
          />

          {experienceMonths > 0 && experienceMonths < 24 && (
            <p className={styles.info}>
              Experience: {experienceMonths} month{experienceMonths !== 1 && "s"}
            </p>
          )}

          {experienceMonths >= 24 && (
            <p className={styles.highlight}>
              Experience in years: {experienceYears} year{experienceYears !== 1 && "s"}
            </p>
          )}
        </div>

      
        <div className={styles.formGroup}>
          <label>Proficiency *</label>
          <select
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>

      
        <div className={styles.formGroup}>
          <label>Usage Description</label>
          <textarea
            name="usageDescription"
            value={formData.usageDescription}
            onChange={handleChange}
          />
        </div>

     
        <button type="submit" className={styles.button}>
          {isUpdate ? "Update Skill" : "Add Skill"}
        </button>

      </form>
    </div>
  );
};

export default MySkillForm;