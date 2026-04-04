import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EmployeeTechnologyForm = () => {

  const [employees, setEmployees] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    technologyId: "",
    experienceInMonths: "",
    proficiency: "BEGINNER"
  });

  useEffect(() => {
    fetchEmployees();
    fetchTechnologies();
  }, []);

  const fetchEmployees = async () => {
    try{
      const res = await axios.get("http://localhost:8080/employee");
    setEmployees(res.data);
    }
    catch(error){
       const msg =error.response?.data?.message || "Error while fetching employee";
       toast.error(msg );
    }
  };

  const fetchTechnologies = async () => {
    try{
      const res = await axios.get("http://localhost:8080/technologie");
    setTechnologies(res.data);
    }
    catch(error){
       const msg =error.response?.data?.message || "Error while fetching technology";
       toast.error(msg );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      employee: { id: formData.employeeId },
      technology: { id: formData.technologyId },
      experienceInMonths: formData.experienceInMonths,
      proficiency: formData.proficiency
    };

    try {
      await axios.post(
        "http://localhost:8080/api/employee-technologies",
        payload
      );
      toast.success("Technology Assigned Successfully");

      setFormData({
        employeeId: "",
        technologyId: "",
        experienceInMonths: "",
        proficiency: "BEGINNER"
      });

    } catch (error) {
      const msg = error.response?.data?.message || "Error assigning technology";
     toast.error(msg);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        Assign Technology to Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

 
        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

     
        <select
          name="technologyId"
          value={formData.technologyId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Technology</option>
          {technologies.map(tech => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="experienceInMonths"
          placeholder="Experience (Months)"
          value={formData.experienceInMonths}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

      
        <select
          name="proficiency"
          value={formData.proficiency}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="BEGINNER">BEGINNER</option>
          <option value="INTERMEDIATE">INTERMEDIATE</option>
          <option value="ADVANCED">ADVANCED</option>
          <option value="EXPERT">EXPERT</option>
        </select>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Assign Technology
        </button>

      </form>
    </div>
  );
};

export default EmployeeTechnologyForm;
