import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

function AdminDashboard() {
  const location = useLocation();
  const { usersData = [], auditorsData = [] } = location.state || {};
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAuditorEmail, setSelectedAuditorEmail] = useState("");
  const [assigningFile, setAssigningFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignmentStatusMap, setAssignmentStatusMap] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    fetchAssignmentsStatus();
  }, []);

  const fetchAssignmentsStatus = async () => {
    try {
      const response = await axios.get("http://localhost:9191/admin/assignments");
      const assignments = response.data;
      const statusMap = {};
      assignments.forEach((a) => {
        statusMap[`${a.userEmail}::${a.fileName}`] = a.status;
      });
      setAssignmentStatusMap(statusMap);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleAssignClick = (user, file) => {
    setSelectedUser(user);
    setAssigningFile(file);
    setShowModal(true);
  };

  const handleAssign = async () => {
    if (!selectedAuditorEmail || !assigningFile || !selectedUser) return;

    try {
      const response = await fetch(
        `http://localhost:9191/files/download?email=${encodeURIComponent(
          selectedUser.email
        )}&filename=${encodeURIComponent(assigningFile.fileName)}`
      );
      const blob = await response.blob();

      const fileObj = new File([blob], assigningFile.fileName, {
        type: blob.type,
      });

      const formData = new FormData();
      formData.append("auditorEmail", selectedAuditorEmail);
      formData.append("userEmail", selectedUser.email);
      formData.append("file", fileObj);

      await axios.post("http://localhost:9191/assign-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`File assigned to ${selectedAuditorEmail} successfully!`);
      setShowModal(false);
      setSelectedAuditorEmail("");
      setSelectedUser(null);
      setAssigningFile(null);
      fetchAssignmentsStatus(); // Refresh status
    } catch (error) {
      console.error("Assignment failed", error);
      alert("Failed to assign document.");
    }
  };

  const getFileStatus = (email, fileName) => {
    const key = `${email}::${fileName}`;
    return assignmentStatusMap[key] || "Pending";
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `http://localhost:9191/admin/delete-user?email=${encodeURIComponent(email)}`
      );
      alert("User deleted successfully!");
    } catch (error) {
      console.error("User deletion failed", error);
      alert("Failed to delete user.");
    }
  };

  const handleDeleteAuditor = async (email) => {
    if (!window.confirm("Are you sure you want to delete this auditor?")) return;

    try {
      await axios.delete(
        `http://localhost:9191/admin/delete-auditor?email=${encodeURIComponent(email)}`
      );
      alert("Auditor deleted successfully!");
    } catch (error) {
      console.error("Auditor deletion failed", error);
      alert("Failed to delete auditor.");
    }
  };
  const handleLogout = () => {
  localStorage.clear();
  navigate("/adminlogin"); // or your actual login route
};
  return (
    <div className="container mt-4 pt-3 pb-2 w-100 " style={{ maxWidth: "95%", backgroundColor:"#060606"}}>
      <h4 className="text-center mb-4">Admin Dashboard</h4>  
      <AdminNavbar/>
      
      {/* 
      <div className="mb-5">
        <h5 className="text-primary">Auditors</h5>
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {auditorsData.length > 0 ? (
              auditorsData.map((auditor, index) => (
                <tr key={index}>
                  <td>{auditor.name || "N/A"}</td>
                  <td>{auditor.email || "N/A"}</td>
                  <td>{auditor.mobile || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteAuditor(auditor.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No auditors available</td></tr>
            )}
          </tbody>
        </table>
      </div>

      
      <div className="mb-5">
        <h5 className="text-success">Users</h5>
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Documents</th>
              <th>Assign</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {usersData.length > 0 ? (
              usersData.map((user, index) => (
                <tr key={index}>
                  <td>{user.username || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.mobile || "N/A"}</td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {user?.files?.length > 0 ? (
                        user.files.map((file, i) => (
                          <li key={i}>
                            <a
                              href={`http://localhost:9191/files/download?email=${encodeURIComponent(
                                user.email
                              )}&filename=${encodeURIComponent(file.fileName)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {file.fileName}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>No documents</li>
                      )}
                    </ul>
                  </td>

             
                  <td>
                    {user?.files?.length > 0 ? (
                      user.files.map((file, i) => {
                        const status = getFileStatus(user.email, file.fileName);
                        return (
                          <button
                            key={i}
                            className={`btn btn-sm my-1 d-block ${
                              status === "Completed"
                                ? "btn-success"
                                : status === "Assigned"
                                ? "btn-secondary"
                                : "btn-primary"
                            }`}
                            onClick={() => handleAssignClick(user, file)}
                            disabled={status !== "Pending"}
                          >
                            {status}
                          </button>
                        );
                      })
                    ) : (
                      <span>--</span>
                    )}
                  </td>

                  <td>
                    <ul className="list-unstyled mb-0">
                      {user?.files?.length > 0 ? (
                        user.files.map((file, i) => {
                          const status = getFileStatus(user.email, file.fileName);
                          return (
                            <li
                              key={i}
                              style={{
                                color: status === "Completed" ? "green" : status === "Assigned" ? "orange" : "black",
                                fontWeight: status === "Completed" ? "bold" : "normal",
                              }}
                            >
                              {status}
                            </li>
                          );
                        })
                      ) : (
                        <li>--</li>
                      )}
                    </ul>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7">No users available</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h5 className="modal-title">Assign to Auditor</h5>
              <div className="form-group mt-2">
                <label>Select Auditor</label>
                <select
                  className="form-select"
                  value={selectedAuditorEmail}
                  onChange={(e) => setSelectedAuditorEmail(e.target.value)}
                >
                  <option value="">-- Choose Auditor --</option>
                  {auditorsData.map((auditor, idx) => (
                    <option key={idx} value={auditor.email}>
                      {auditor.name} ({auditor.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 text-end">
                <button className="btn btn-success me-2" onClick={handleAssign}>
                  Assign
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        */}
    </div>
  );
}

AdminDashboard.hideLayout = true;
export default AdminDashboard;

