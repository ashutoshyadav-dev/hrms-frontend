import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import "./DocumentAdmin.css";

const DocumentAdmin = () => {
  const [documents, setDocuments] = useState([]);
 


  const BASE = "api/documents";

  const fetchAllDocuments = async () => {
    try {
      const res = await api.get(`${BASE}`);
      console.log(res.data);
      setDocuments(res.data);
    } catch (error) {
      console.error("Document fetch Error",error);
      const msg = error.response?.data?.message || "Failed to load documents";
     toast.error(msg);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  
  const handleView = async (id) => {
    try {
      const res = await api.get(`${BASE}/view/${id}`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      window.open(url);

    } catch (error) {
      console.error("View Error",error);
      const msg = error.response?.data?.message || "Unable to view document";
     toast.error(msg);
    }
  };

  
  const handleDownload = async (id) => {
    try {
      const res = await api.get(`${BASE}/download/${id}`, {
        responseType: "blob",
      });

      const contentType = res.headers["content-type"];
      const blob = new Blob([res.data], { type: contentType });

      const url = window.URL.createObjectURL(blob);

      const disposition = res.headers["content-disposition"];
      let fileName = "document";

      if (disposition && disposition.includes("filename=")) {
        fileName = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download Error",error);
      const msg = error.response?.data?.message || "Download failed";
     toast.error(msg);
    }
  };

  
  const handleDelete = async (id) => {
    try {
      await api.delete(`${BASE}/${id}`);

      toast.success("Document Delete successfully");
      fetchAllDocuments();

    } catch (error) {
      console.error("Delete Error",error);
      const msg = error.response?.data?.message || "Failed to delete document";
     toast.error(msg);
    }
  };

  return (
    <div className="admin-container">
      <h2>Document Management (Admin)</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Employee Designation</th>
            <th>Document Name</th>
            <th>Content Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan="4">No documents found</td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.employeeId}</td>
                <td>{doc.employeeName}</td>
                <td>{doc.designationTitle}</td>
                <td>{doc.docName}</td>
                <td>{doc.contentType}</td>

                <td>
                  <button className="Button view" onClick={() => handleView(doc.id)}>View</button>
                  <button className="Button down" onClick={() => handleDownload(doc.id)}>Download</button>
                  <button className="Button delete" onClick={() => handleDelete(doc.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentAdmin;