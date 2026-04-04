import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";

const ModuleDetails = () => {
  const [projectId, setProjectId] = useState("");
  const [modules, setModules] = useState([]);

  const fetchModules = async () => {
    const res = await api.get(`/projects/${projectId}/modules`);
    setModules(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Project Modules</h2>

      <div className="flex gap-3 mb-4">
        <input
          type="number"
          placeholder="Project ID"
          className="border p-2 rounded"
          onChange={(e) => setProjectId(e.target.value)}
        />
        <button
          onClick={fetchModules}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      <ul className="bg-white shadow rounded p-4">
        {modules.map(mod => (
          <li key={mod.id} className="border-b py-2">
            {mod.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleDetails;
