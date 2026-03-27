import api from "../api/api"; // your axios instance

const EmployeeService = {
  // Admin update any employee
   

  updateEmployeeByAdmin: (id, data) => {
    return api.put(`/admin/updateEmp/${id}`, data);
  },

  // Employee update own profile (ID not needed because backend takes from token)
  updateMyProfile: (data) => {
    return api.put(`/employee/upProfile`, data);
  },

  // Get employee by id (admin)
  getEmployeeById: (id) => {
    return api.get(`/admin/empById/${id}`);
  },

  // Get logged in employee profile
  getMyProfile: () => {
    return api.get(`/employee/profile`);
  },

  getDesignations: () => {
    return api.get(`/designations`);
  },

  getShifts: () => {
     return api.get(`/api/shifts`);
  },

  getAttendance: (empId, start, end) => {
    return api.get(`/api/attendance/${empId}?start=${start}&end=${end}`);
  },


  getLeaves: () => {
    return api.get(`/leaves`);
  }


};

export default EmployeeService;
