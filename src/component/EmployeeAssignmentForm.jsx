import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EmployeeAssignmentForm = () => {

  const API_URL = "http://localhost:8080/assignments";

  const [assignment, setAssignment] = useState({
    employee: { id: "" },
    project: { projectId: "" },
    modules: { id: "" },
    assignedDate: "",
    hoursWorked: 0,
    projectStatus: "ACTIVE"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "employeeId") {
      setAssignment({
        ...assignment,
        employee: { id: value }
      });
    }
    else if (name === "projectId") {
      setAssignment({
        ...assignment,
        project: { projectId: value }
      });
    }
    else if (name === "moduleId") {
      setAssignment({
        ...assignment,
        modules: { id: value }
      });
    }
    else {
      setAssignment({
        ...assignment,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_URL, assignment);
      toast.success("Employee Assigned Successfully");
      console.log(response.data);

      setAssignment({
        employee: { id: "" },
        project: { projectId: "" },
        modules: { id: "" },
        assignedDate: "",
        hoursWorked: 0,
        projectStatus: "ACTIVE"
      });

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "error while assigning employee";
     toast.error(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-2xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Assign Employee To Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

  
        <div>
          <label className="block font-semibold mb-1">Employee ID</label>
          <input
            type="number"
            name="employeeId"
            value={assignment.employee.id}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>


        <div>
          <label className="block font-semibold mb-1">Project ID</label>
          <input
            type="number"
            name="projectId"
            value={assignment.project.projectId}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Module ID</label>
          <input
            type="number"
            name="moduleId"
            value={assignment.modules.id}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

      
        <div>
          <label className="block font-semibold mb-1">Assigned Date</label>
          <input
            type="date"
            name="assignedDate"
            value={assignment.assignedDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

      
        <div>
          <label className="block font-semibold mb-1">Hours Worked</label>
          <input
            type="number"
            step="0.01"
            name="hoursWorked"
            value={assignment.hoursWorked}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

      
        <div>
          <label className="block font-semibold mb-1">Project Status</label>
          <select
            name="projectStatus"
            value={assignment.projectStatus}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ON_HOLD">ON_HOLD</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300"
        >
          Assign Employee
        </button>

      </form>
    </div>
  );
};

export default EmployeeAssignmentForm;
