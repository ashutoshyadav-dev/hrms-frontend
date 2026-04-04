import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import "./ProjectList.css"

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, projects]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      const projectData = res.data;

      const projectsWithModules = await Promise.all(
        projectData.map(async (project) => {
          try {
            const modulesRes = await api.get(
              `/projects/${project.projectId}/modules`,
            );
            

            const modulesWithEmployees = await Promise.all(
              modulesRes.data.map(async (module) => {
                if (module.employeeId) {
                  try {
                    const employeeRes = await api.get(
                      "/employee-assignments/assignments",
                      {
                        params: {
                          projectId: project.projectId,
                          moduleId: module.id,
                        },
                      },
                    );
                    console.log("assignment", employeeRes);
                    return {
                      ...module,
                      employee: employeeRes.data,
                    };
                  } catch (error) {
                    const msg =
                      error.response?.data?.message ||
                      `Error fetching employee ${module.employeeId}`;
                    toast.error(msg);
                    return module;
                  }
                }
                return module;
              }),
            );

            return {
              ...project,
              modules: modulesWithEmployees,
            };
          } catch (error) {
            const msg =
              error.response?.data?.message ||
              `Error fetching modules for project ${project.projectId}`;
            toast.error(msg);
            return {
              ...project,
              modules: [],
            };
          }
        }),
      );

      setProjects(projectsWithModules);
      setFilteredProjects(projectsWithModules);
    } catch (error) {
      const msg = error.response?.data?.message || "Error fetching projects";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search) {
      setFilteredProjects(projects);
      return;
    }

    const lowerSearch = search.toLowerCase();

    const filtered = projects.filter((project) => {
      const matchProject =
        project.projectName?.toLowerCase().includes(lowerSearch) ||
        project.description?.toLowerCase().includes(lowerSearch) ||
        project.status?.toLowerCase().includes(lowerSearch);

      const matchModule = project.modules?.some(
        (module) =>
          module.name?.toLowerCase().includes(lowerSearch) ||
          module.description?.toLowerCase().includes(lowerSearch) ||
          module.employee?.name?.toLowerCase().includes(lowerSearch),
      );

      return matchProject || matchModule;
    });

    setFilteredProjects(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

return (
  <div className="container">
    <div className="header">
      <div>
        <h1>Project Management</h1>
        <p>{filteredProjects.length} projects found</p>
      </div>

      <input
        type="text"
        placeholder="Search project, module, employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {filteredProjects.length === 0 && (
      <div className="empty">No projects found</div>
    )}

    <div className="project-container">
  {filteredProjects.map((project) => (
    <div key={project.projectId} className="project-card">

      {/* PROJECT */}
      <div className="project-header">
        <h2>{project.projectName}</h2>
        <span className={`status ${project.status?.toLowerCase()}`}>
          {project.status}
        </span>
      </div>

      <p className="project-desc">{project.description}</p>

      <div className="project-dates">
        <span>Start: {project.startDate}</span>
        <span>End: {project.endDate}</span>
      </div>

      {/* MODULES */}
      <div className="module-section">
        <h3>Modules ({project.modules?.length || 0})</h3>

        {project.modules?.map((module) => (
          <div key={module.id} className="module-card">

            <h4>{module.name}</h4>
            <p>{module.description}</p>

            {/* EMPLOYEES */}
            <div className="employee-section">
              {module.employee && module.employee.length > 0 ? (
                module.employee.map((emp, i) => (
                  <div key={i} className="employee-card">

                    <div className="emp-header">
                      <strong>{emp.employeeName}</strong>
                      <span>ID: {emp.employeeId}</span>
                    </div>

                    <div className="emp-details">
                      <p>📅 Assigned: {emp.assignedDate}</p>
                      <p>⏱ Hours: {emp.hoursWorked}</p>
                      <p>📌 Status: {emp.projectStatus}</p>
                    </div>

                  </div>
                ))
              ) : (
                <p className="no-emp">No employee assigned</p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  ))}
</div>
  </div>
);
}
export default ProjectList;
