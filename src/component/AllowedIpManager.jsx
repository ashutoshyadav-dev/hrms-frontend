import { useState } from "react";
import styles from "./AllowedIpManager.module.css";
import { toast } from "react-toastify";
import api from "../api/api";

const API_URL = "/api/ip";

export default function AllowedIpManager() {
  const [ipAddress, setIpAddress] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [ips, setIps] = useState([]);
  const [showList, setShowList] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`${API_URL}/${editId}`, {
          ipAddress,
          description,
          active,
        });
        toast.success("IP updated successfully");
      } else {
        await api.post(API_URL, {
          ipAddress,
          description,
          active,
        });
        toast.success("IP added successfully");
      }

      resetForm();
      if (showList) fetchIps();
    } catch (error) {
      const msg = error.response?.data?.message || "Operation failed";
      toast.error(msg);
    }
  };

  const fetchIps = async () => {
    try {
      const res = await api.get(API_URL);
      setIps(res.data);
      setShowList(true);
    } catch (error) {
      toast.error("Unable to fetch IPs");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_URL}/${id}`);
      setIps(ips.filter((ip) => ip.id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (ip) => {
    setEditId(ip.id);
    setIpAddress(ip.ipAddress);
    setDescription(ip.description);
    setActive(ip.active);
  };

  const toggleActive = async (ip) => {
    try {
      await api.put(`${API_URL}/${ip.id}`, {
        ...ip,
        active: !ip.active,
      });
      fetchIps();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setIpAddress("");
    setDescription("");
    setActive(true);
    setEditId(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Allowed IP Management</h2>

      <form className={styles.form} onSubmit={handleAddOrUpdate}>
        <input
          type="text"
          placeholder="IP Address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active
        </label>

        <button type="submit" className={styles.addBtn}>
          {editId ? "Update IP" : "Add IP"}
        </button>
      </form>

      <button className={styles.listBtn} onClick={fetchIps}>
        Show Allowed IPs
      </button>

      {showList && (
        <div className={styles.list}>
          {ips.map((ip) => (
            <div key={ip.id} className={styles.card}>
              <div>
                <strong>{ip.ipAddress}</strong>
                <p>{ip.description}</p>
                <span className={ip.active ? styles.active : styles.inactive}>
                  {ip.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className={styles.actions}>
                <button onClick={() => handleEdit(ip)} className={styles.editBtn}>
                  Edit
                </button>

                <button onClick={() => toggleActive(ip)} className={styles.toggleBtn}>
                  Toggle
                </button>

                <button
                  onClick={() => handleDelete(ip.id)}
                  className={styles.deleteBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


