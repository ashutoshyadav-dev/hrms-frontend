// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";

// const EmployeeList = () => {
//   const [employees, setEmployees] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await api.get("/admin/employees");
//         console.log("API RESPONSE:", res.data);

//         setEmployees(Array.isArray(res.data) ? res.data : []);
//       } catch (error) {
//         console.error("Error fetching employees", error);
//         setEmployees([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const filteredEmployees = Array.isArray(employees)
//     ? employees.filter((emp) => {
//         const lowerSearch = search.toLowerCase();
//         return (
//           emp.name?.toLowerCase().includes(lowerSearch) ||
//           emp.email?.toLowerCase().includes(lowerSearch) ||
//           (emp.phoneNumber || "").includes(lowerSearch)
//         );
//       })
//     : [];

//   if (loading) {
//     return (
//       <div className="text-center mt-10 text-lg font-semibold">
//         Loading employees...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="bg-white shadow-xl rounded-2xl p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Employee List</h1>
//           <input
//             type="text"
//             placeholder="Search by name, email, or phone..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border px-4 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
//                 <th className="p-4">Employee</th>
//                 <th className="p-4">Designation</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Phone</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredEmployees.length > 0 ? (
//                 filteredEmployees.map((emp) => (
//                   <tr
//                     key={emp.id}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     <td className="p-4 flex items-center gap-3">
//                       <img
//                         src={emp.profileImage || "https://i.pravatar.cc/40"}
//                         alt="avatar"
//                         className="w-10 h-10 rounded-full object-cover"
//                       />
//                       <div>
//                         <p className="font-semibold text-gray-800">{emp.name}</p>
//                         <p className="text-sm text-gray-500">
//                           {emp.designation?.title || "-"}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {emp.designation?.title || "-"}
//                     </td>
//                     <td className="p-4 text-gray-600">{emp.email}</td>
//                     <td className="p-4 text-gray-600">{emp.phoneNumber || "-"}</td>
//                     <td className="p-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           emp.status === "ACTIVE"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {emp.status === "ACTIVE" ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="p-4 text-center">
//                      <button
//   onClick={() => navigate(`/dashboard/viewAndUpdate/${emp.id}`)}
//   className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
// >
//   View And Edit
// </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-6 text-gray-500">
//                     No employees found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeList;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [pageData, setPageData] = useState({
    totalElements: "",
    totalPages: "",
    size: "",
    number: "",
  });

  const [page, setPage] = useState(0);
  const [size] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/admin/employees", {
          params: {
            page,
            size,
            search  
          }
        });

        setEmployees(res.data.content);
        setPageData(res.data);
      } catch (error) {
        console.error("Error fetching employees", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [page, search]); 

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Employee List
          </h1>

          <input
            type="text"
            placeholder="Search by name, email, phone, status..."
            value={search}
            onChange={(e) => {
              setPage(0);        
              setSearch(e.target.value);
            }}
            className="border px-4 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
                <th className="p-4">Employee</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={emp.profileImage || "https://i.pravatar.cc/40"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {emp.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {emp.designation?.title || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-gray-700">
                      {emp.designation?.title || "-"}
                    </td>

                    <td className="p-4 text-gray-600">{emp.email}</td>

                    <td className="p-4 text-gray-600">
                      {emp.phoneNumber || "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          emp.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.status === "ACTIVE"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/viewAndUpdate/${emp.id}`)
                        }
                        className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        View And Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>

        <span>
          Page {pageData.number + 1} of {pageData.totalPages}
        </span>

        <button
          disabled={page + 1 >= pageData.totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;