
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import '../App.css';
import Header from '../component/Header';
import SideBar from '../component/Sidebar';

import {
  FaBook,
  FaBuilding,
  FaClipboardCheck,
  FaCommentDots,
  FaComments,
  FaFileAlt,
  FaLink,
  FaPhotoVideo,
  FaSignOutAlt,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";

export const DivContent = [
  { id: 1, title: "Manage Profile", icon: <FaUserCog /> },
  { id: 2, title: "User Management", icon: <FaUsers /> },
  { id: 3, title: "CMS Page", icon: <FaFileAlt /> },
  { id: 4, title: "Manage Feedback", icon: <FaCommentDots /> },
  { id: 5, title: "Manage Discussion Forum", icon: <FaComments /> },
  { id: 6, title: "Manage Organization Setup", icon: <FaBuilding /> },
  { id: 7, title: "Manage Glossary Forum", icon: <FaBook /> },
  { id: 8, title: "Manage Important Link Logo", icon: <FaLink /> },
  { id: 9, title: "Manage Media Center", icon: <FaPhotoVideo /> },
  { id: 10, title: "Manage Audit", icon: <FaClipboardCheck /> },
  { id: 11, title: "Logout", icon: <FaSignOutAlt /> },
];



// const SIDEBAR_LINKS = [
//   {
//     id: 1,
//     label: "Dashboard",
//     path: "/dashboard",
//     roles: ["SUPER ADMIN","ADMIN", "USER"],
//     children: []
//   },
//   {
//     id: 2,
//     label: "View Profile",
//     path: "/dashboard/profile",  
//     roles: ["SUPER ADMIN","ADMIN", "USER"],
//     children: []
//   },
//   {
//     id: 3,
//     label: "User Management",
//     path: "/dashboard/users",   
//     roles: ["SUPER ADMIN","ADMIN"],
//     children: [
//       {
//         id: 31,
//         label: "Manage User",
//         path: "/dashboard/users/usermanage",   
//         roles: ["SUPER ADMIN","ADMIN"]
//       },
//       {
//         id: 32,
//         label: "Manage Employee",
//         path: "/dashboard/users/manageEmployee", 
//         roles: ["SUPER ADMIN","ADMIN"]
//       },
//       {
//         id: 33,
//         label: "Manage Role",
//         path: "/dashboard/users/manageRole",   
//         roles: ["SUPER ADMIN"]
//       }
//     ]
//   }
// ];

export const SIDEBAR_LINKS = [

  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard",
    roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"]
  },

  {
    id: 2,
    label: "Profile",
    path: "/dashboard/profile",
    roles: ["ROLE_EMPLOYEE"]
  },

    {
    id: 3,
    label: "Update Profile",
    path: "/dashboard/upProfile",
    roles: ["ROLE_EMPLOYEE"]
  },

  {
    id: 4,
    label: "Employees",
    roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    children: [
      {
        id: 31,
        label: "Employee List",
        path: "/dashboard/employees"
      }
      // {
      //   id: 32,
      //   label: "Search Employee",
      //   path: "/dashboard/employees/search"
      // }
    ]
  },

  {
    id: 5,
    label: "Projects",
    roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    children: [
      {
        id: 41,
        label: "Project List",
        path: "/dashboard/projects"
      },
      {
        id: 42,
        label: "Create Project",
        path: "/dashboard/projects/create"
      },
      {
        id: 43,
        label: "Modules",
        path: "/dashboard/projects/modules"
      },
      {
        id:76,
        label: "Assign Project",
        path: "/dashboard/projects/assignProject"
      }
    ]
  },

  // {
  //   id: 6,
  //   label: "Leave",
  //   roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"],
  //   children: [
  //     {
  //       id: 51,
  //       label: "Apply Leave",
  //       path: "/dashboard/leave/apply"
  //     },
  //     {
  //       id: 52,
  //       label: "Approve / Reject",
  //       path: "/dashboard/leave/approval"
  //     }
  //   ]
  // },

  {
  id: 6,
  label: "Leave",
  roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"],

  children: [
    {
      id: 51,
      label: "Apply Leave",
      path: "/dashboard/leave/apply",
      roles: ["ROLE_EMPLOYEE"]   
    },
    {
      id: 52,
      label: "Approve / Reject",
      path: "/dashboard/leave/approval",
      roles: ["ROLE_ADMIN"]     
    }
  ]
},


  {
    id: 7,
    label: "Add Technology",
    path: "/dashboard/addTechnologyAdmin",
    roles: ["ROLE_ADMIN"]
  },

   {
    id: 8,
    label: "My Project",
    path: "/dashboard/myProject",
    roles: ["ROLE_EMPLOYEE"]
  },

   {
    id: 9,
    label: "My Skills",
    path: "/dashboard/mySkills",
    roles: ["ROLE_EMPLOYEE"]
  },
   {
    id: 10,
    label: "Add Designation",
    path: "/dashboard/addDesignationAdmin",
    roles: ["ROLE_ADMIN"]
  },
  
   {
    id: 11,
    label: "Document Management",
    path: "/dashboard/myDocs",
    roles: ["ROLE_EMPLOYEE"]
  },

  {
    id: 12,
    label: "Document Management",
    path: "/dashboard/myDocsAdmin",
    roles: ["ROLE_ADMIN"]
  }
];


// const role = localStorage.getItem("role");

// const filteredLinks = SIDEBAR_LINKS.filter(menu =>
//   menu.roles.includes(role)
// );



// const MainLayout=()=>{
//     return(
//         <div className="app">
//        <Header
//         source="https://i.pinimg.com/564x/d2/c1/6d/d2c16d99034f9407fd708dfc3356c688.jpg"
//         title="Human Resouse And Project Management"
//         date="29 Dec 2025"
//         time="12:18 PM"
//         options={["Super Admin", "Admin", "User"]}
//       />
//         <div className="bodyLayout">
//         <SideBar Linkvalue={filteredLinks} />
//         <main className="content">
//           <Outlet />
//         </main>
//       </div>

//     </div>
//     )
// }


const MainLayout = () => {

  // I used this filter when Leave's children does not contain any role 
  
  const token = localStorage.getItem("token");

  let role = null;
  let lastLogin=null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded?.role;
      lastLogin = decoded?.lastLogin;
    } catch (error) {
      console.error("Invalid token");
    }
  }


  //working but it show time in neno seconds which is not looking good so I change it
  //  const [date, time] = lastLogin ? lastLogin.split("T") : ["First Time Login", ""];

  let date = "First Time Login";
let time = "";

if (lastLogin) {
  const d = new Date(lastLogin);
  date = d.toLocaleDateString();
  time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
  
  const filteredLinks = SIDEBAR_LINKS.filter(menu =>
    menu.roles.includes(role)
  );



  return (
    <div className="app">
      <Header
        source="https://i.pinimg.com/564x/d2/c1/6d/d2c16d99034f9407fd708dfc3356c688.jpg"
        title="Human Resource And Project Management"
        date={date}
        time={time}
      />

      <div className="bodyLayout">
        <SideBar Linkvalue={filteredLinks} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default MainLayout;