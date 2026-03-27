import { useEffect, useState } from "react";
import api from "../api/api";
import "./DocumentAdmin.css";

const DocumentAdmin = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BASE = "api/documents";

  const fetchAllDocuments = async () => {
    try {
      setError("");
      const res = await api.get(`${BASE}`);
      setDocuments(res.data);
    } catch (err) {
      setError("Failed to load documents");
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  // 🔹 VIEW
  const handleView = async (id) => {
    try {
      setError("");

      const res = await api.get(`${BASE}/view/${id}`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      window.open(url);

    } catch (err) {
      setError("Unable to view document");
    }
  };

  // 🔹 DOWNLOAD
  const handleDownload = async (id) => {
    try {
      setError("");

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

    } catch (err) {
      setError("Download failed");
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    try {
      setError("");
      setSuccess("");

      await api.delete(`${BASE}/${id}`);

      setSuccess("Document deleted successfully");
      fetchAllDocuments();

    } catch (err) {
      setError("Failed to delete document");
    }
  };

  return (
    <div className="admin-container">
      <h2>Document Management (Admin)</h2>

      {/* ✅ Error & Success Messages */}
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <table className="doc-table">
        <thead>
          <tr>
            <th>ID</th>
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
                <td>{doc.id}</td>
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