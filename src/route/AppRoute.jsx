// import { Route, Routes } from "react-router-dom";
// import MainLayout from "../layout/MainLayout";
// import Home from "../component/Home";
// import Login from "../component/Login";
// import Dashboard from "../component/Dashboard";
// import ProtectedRoute from "../route/ProtectedRoute";
// import EmployeeForm from "../component/EmployeeForm";
// import Register from "../component/Register";

// const UserManage = () => <h2>Manage User</h2>;
// const ManageEmployee = () => <h2>Manage Employee</h2>;
// const ManageRole = () => <h2>Manage Role</h2>;
// const UsersHome = () => <h2>User Management Home</h2>;

// const AppRoutes = () => {
//   return (
//     <Routes>

     
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

      
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <MainLayout />
//           </ProtectedRoute>
//         }
//       >

//         <Route index element={<Dashboard />} />

//         <Route path="profile" element={<EmployeeForm />} />

       
//         <Route path="users">
//           <Route index element={<UsersHome />} />
//           <Route path="usermanage" element={<UserManage />} />
//           <Route path="manageEmployee" element={<ManageEmployee />} />
//           <Route path="manageRole" element={<ManageRole />} />
//         </Route>

//       </Route>

//     </Routes>
//   );
// };

// export default AppRoutes;



import { Route, Routes } from "react-router-dom";
import AddTechnologyAdmin from "../component/AddTechnologyAdmin";
import AssignProject from "../component/AssignProject";
import Dashboard from "../component/Dashboard";
import DesignationForm from "../component/DesignationForm";
import EmployeeForm from "../component/EmployeeForm";
import EmployeeList from "../component/EmployeeList";
import Home from "../component/Home";
import LeaveApply from "../component/LeaveApply";
import LeaveApproval from "../component/LeaveApproval";
import Login from "../component/Login";
import ModuleForm from "../component/ModuleForm";
import MyProject from "../component/MyProject";
import MySkillForm from "../component/MySkillForm";
import Profile from "../component/Profile";
import ProjectForm from "../component/ProjectForm";
import ProjectList from "../component/ProjectList";
import Register from "../component/Register";
import ViewAndUpdate from "../component/ViewAndUpdate";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../route/ProtectedRoute";
import DocumentManager from "../component/DocumentManager";
import DocumentAdmin from "../component/DocumentAdmin";
import AllowedIpManager from "../component/AllowedIpManager";
import ShiftManager from "../component/ShiftManager";
import FileUploadManager from "../component/FileUploadManager";
// const EmployeeList = () => <h2>Employee List</h2>;
// const EmployeeSearch = () => <h2>Search Employee</h2>;


// const ProjectList = () => <h2>Project List</h2>;
// const ProjectForm = () => <h2>Create Project</h2>;
// const ModuleDetails = () => <h2>Module Details</h2>;

// const LeaveApply = () => <h2>Apply Leave</h2>;
// const LeaveApproval = () => <h2>Leave Approval</h2>;


const DepartmentList = () => <h2>Department List</h2>;

const AppRoutes = () => {
  return (
    <Routes>

   
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

     
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        
        <Route path="profile" 
        element={
          <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]}>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="upProfile"
         element={
        <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]}>
           <EmployeeForm />
        </ProtectedRoute>
         }/>
       
        <Route
          path="employees"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <EmployeeList />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="employees/search"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <EmployeeSearch />
            </ProtectedRoute>
          }
        /> */}

       
        <Route
          path="projects"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <ProjectList />
            </ProtectedRoute>
          }
        />

        <Route
          path="projects/create"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <ProjectForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="projects/modules"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <ModuleForm />
            </ProtectedRoute>
          }
        />

         <Route
          path="projects/assignProject"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AssignProject/>
            </ProtectedRoute>
          }
        />

       
        <Route
          path="leave/apply"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]}>
              <LeaveApply />
            </ProtectedRoute>
          }
        />

        <Route
          path="myProject"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]}>
              <MyProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="leave/approval"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <LeaveApproval />
            </ProtectedRoute>
          }
        />

       
        <Route
          path="addTechnologyAdmin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AddTechnologyAdmin />
            </ProtectedRoute>
          }
        />

         <Route
          path="addDesignationAdmin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <DesignationForm/>
            </ProtectedRoute>
          }
        />

        <Route
          path="mySkills"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]}>
              <MySkillForm/>
            </ProtectedRoute>
          }
        />
         
         <Route
          path="viewAndUpdate/:id"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <ViewAndUpdate />
            </ProtectedRoute>
          }
        />

          <Route
          path="myDocs"
          element={
            <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]}>
              <DocumentManager/>
            </ProtectedRoute>
          }
        />

         <Route
          path="myDocsAdmin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <DocumentAdmin/>
            </ProtectedRoute>
          }
        />

        <Route
          path="ipDetails"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AllowedIpManager/>
            </ProtectedRoute>
          }
        />

         <Route
          path="shiftDetails"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <ShiftManager/>
            </ProtectedRoute>
          }
        />

        <Route
          path="fileUpload"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <FileUploadManager/>
            </ProtectedRoute>
          }
        />


      </Route>

    </Routes>
  );
};

export default AppRoutes;

