import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "./DocumentManager.css";

const DocumentManager = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : {};
  const empId = decoded?.employeeId || decoded?.id;

  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [contentType, setContentType] = useState("RESUME");
  const [loaded, setLoaded] = useState(false);

  const BASE = "api/documents";

  const handleUpload = async () => {
    if (!file || !empId) {
      toast.warning("File Required");
      return;
    }

    const formData = new FormData();

    const docDto = {
      employeeId: empId,
      docName: docName,
      docType: "GENERAL",
      contentType: contentType,
    };

    formData.append(
      "docDto",
      new Blob([JSON.stringify(docDto)], { type: "application/json" }),
    );
    formData.append("file", file);

    try {
      await api.post(`${BASE}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Upload Successfully");
      fetchDocuments(); 
      setDocName("");
      setFile(null);
      setContentType("RESUME");
    } catch (error) {
      const msg = error.response?.data?.message || "Error while uploading document";
     toast.error(msg);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`${BASE}/emp/${empId}`);
      setDocuments(res.data);
      setLoaded(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Unable to load documents";
     toast.error(msg);
    }
  };

  

  const handleView = async (id) => {
    try {
      const res = await api.get(`${BASE}/view/${id}`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);

      window.open(url); 
    } catch (error) {
      const msg = error.response?.data?.message || "Unable to view";
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

   
      if (!fileName.includes(".")) {
        if (contentType.includes("pdf")) fileName += ".pdf";
        else if (contentType.includes("image")) fileName += ".png";
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const msg = error.response?.data?.message || "Download Failed";
     toast.error(msg);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Document Manager</h2>

    
      <div className="section">
        <input
          className="input"
          type="text"
          placeholder="Document Name"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
        />

        <select
          className="input"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="RESUME">Resume</option>
          <option value="MERITCERTIFICATE">Merit Certificate</option>
          <option value="OTHERS">Others</option>
        </select>

        <input
          className="input"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="button" onClick={handleUpload} disabled={!file}>
          Upload
        </button>
      </div>

     
      <button className="button" onClick={fetchDocuments}>
        Load Employee Documents
      </button>

      
      <div className="section">
        <h3>Documents</h3>

        {loaded && documents.length === 0 && (
          <p className="empty">No documents found</p>
        )}

        {documents.map((doc, index) => (
          <div key={`${doc.id}-${index}`} className="card">
            <p className="text">
              <b>Name:</b> {doc.docName}
            </p>
            <p className="text">
              <b>Type:</b> {doc.docType}
            </p>
            <p className="text">
              <b>Category:</b> {doc.contentType}
            </p>

            <button className="button" onClick={() => handleView(doc.id)}>
              View
            </button>

            <button className="button" onClick={() => handleDownload(doc.id)}>
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentManager;
