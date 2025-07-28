import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [users, setUsers] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [assignedDocs, setAssignedDocs] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchAuditors();
    fetchAssignedDocuments();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAssignedDocuments();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

 const fetchUsers = async () => {
  try {
    const [usersRes, assignedDocsRes] = await Promise.all([
      axios.get("http://localhost:9191/admin/users-with-files"),
      axios.get("http://localhost:9191/assigned-documents"),
    ]);

    const assignedMap = new Map();
    assignedDocsRes.data.forEach((doc) => {
      assignedMap.set(doc.fileName, doc.status); // use fileName or fileId if available
    });

    const usersWithStatus = usersRes.data.map((user) => ({
      ...user,
      files: user.files?.map((file) => ({
        ...file,
        status: assignedMap.get(file.fileName) || "Pending", // fallback
      })),
    }));

    const sorted = usersWithStatus.sort((a, b) => a.username.localeCompare(b.username));
    setUsers(sorted);
  } catch (err) {
    console.error("Failed to fetch users or assigned docs", err);
  }
};

  const fetchAuditors = async () => {
    try {
      const res = await axios.get("http://localhost:9191/auditor/all");
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setAuditors(sorted);
    } catch (err) {
      console.error("Failed to fetch auditors", err);
    }
  };

  const fetchAssignedDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:9191/assigned-documents");
      setAssignedDocs(res.data);
    } catch (err) {
      console.error("Failed to fetch assigned documents", err);
    }
  };

  const handleAssignDoc = async (auditor) => {
  if (!selectedFile) return;

  try {
    const user = users.find((u) => u.files?.some((f) => f.id === selectedFile.id));
    if (!user) {
      alert("User not found for this file");
      return;
    }

    // Step 1: Fetch the file blob from server
    const fileResponse = await axios.get(
      `http://localhost:9191/get-uploaded-file/${selectedFile.id}`,
      { responseType: "blob" }
    );

    // Step 2: Create a File object with correct name and type
    const fileBlob = new File([fileResponse.data], selectedFile.fileName, {
      type: fileResponse.data.type || "application/octet-stream",
    });

    // ✅ Step 3: Create FormData WITHOUT fileId
    const formData = new FormData();
    formData.append("auditorEmail", auditor.email);
    formData.append("userEmail", user.email);
    formData.append("auditorName", auditor.name);
    formData.append("userName", user.username);
    formData.append("fileName", selectedFile.fileName);
    formData.append("file", fileBlob);

    // Step 4: Post to backend
    await axios.post("http://localhost:9191/assign-document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("File assigned successfully!");
    await fetchUsers();
    setShowModal(false);
    setSelectedFile(null);
  } catch (err) {
    console.error("❌ Assignment failed", err);
    alert("Failed to assign file");
  }
};

  const handleLogout = () => {
    navigate("/adminlogin");
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

  return (
    <>
      <nav className="navbar navbar-dark bg-dark shadow px-3 mb-4 rounded-3">
      <div className="container-fluid">
        <button
      className="navbar-toggler d-lg-none"
      type="button"
      onClick={() => setShowNav(!showNav)}
    >
      <span className="navbar-toggler-icon"></span>
    </button>    
    <div className="d-none d-lg-flex gap-2">
      <button className="btn btn-outline-light" onClick={() => setActiveTab("users")}>
        Users
      </button>
      <button className="btn btn-outline-light" onClick={() => setActiveTab("auditors")}>
        Auditors
      </button>
      <button className="btn btn-outline-light" onClick={() => setActiveTab("documents")}>
        Documents
      </button>
      <button className="btn btn-outline-light" onClick={() => setActiveTab("reports")}>
        Reports
      </button>
    </div>

    <button className="btn btn-danger ms-auto" onClick={handleLogout}>
      Logout
    </button>
  </div>

  
  {showNav && (
    <div className="d-lg-none d-flex flex-column bg-dark p-2">
      <button className="btn btn-outline-light mb-2" onClick={() => setActiveTab("users")}>
        Users
      </button>
      <button className="btn btn-outline-light mb-2" onClick={() => setActiveTab("auditors")}>
        Auditors
      </button>
      <button className="btn btn-outline-light mb-2" onClick={() => setActiveTab("documents")}>
        Documents
      </button>
      <button className="btn btn-outline-light mb-2" onClick={() => setActiveTab("reports")}>
        Reports
      </button>
    </div>
  )}
</nav>


      <div className="container">
        {activeTab === "users" && (
          <div>
            <h4>Users</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th> 
                  <th>Uploaded Files</th>
                  <th>Action</th> 
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile || "N/A"}</td> 
                    <td>{user.files?.length || 0}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.email)} 
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {activeTab === "auditors" && (
          <div>
            <h4>Auditors</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {auditors.map((auditor, index) => (
                  <tr key={index}>
                    <td>{auditor.name}</td>
                    <td>{auditor.email}</td>
                    <td>{auditor.mobile || "N/A"}</td>
                    <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteAuditor(auditor.email)} 
                >
                  Delete
                </button>
              </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="container mt-4">
            <h4>All User Documents</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Uploaded Document</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.flatMap((user, userIndex) => 
                  user.files?.length > 0 ? (
                    user.files.map((file, fileIndex) => (
                      <tr key={`${userIndex}-${fileIndex}`}>
                        <td>{user.username}</td>
                        <td>
                          <a
                            href={`http://localhost:9191/files/view/${file.fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.fileName}
                          </a>
                        </td>
                        <td>
                          {file.status === "Assigned" || file.status === "Completed" ? (
                            <button className="btn btn-sm btn-success" disabled>
                              Assigned
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setSelectedFile(file);
                                setShowModal(true);
                              }}
                            >
                              Assign
                            </button>
                          )}
                        </td>
                        <td>
                          <span className={`fw-bold ${file.status === "Completed" ? "text-success" : ""}`}>
                            {file.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={`nofiles-${userIndex}`}>
                      <td>{user.username}</td>
                      <td className="text-muted">No files</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            <h4>Audit Reports</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>File</th>
                  <th>Auditor</th>
                  <th>Status</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {assignedDocs.length > 0 ? (
                  assignedDocs.map((doc, index) => (
                    <tr key={index}>
                      <td>{doc.userName}</td>
                      <td>
                        <a
                          href={`http://localhost:9191/files/view/${doc.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.fileName}
                        </a>
                      </td>
                      <td>{doc.auditorName}</td>
                      <td>
                        <span
                          className={`badge ${
                            doc.status?.toLowerCase() === "completed"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {doc.status || "Pending"}
                        </span>
                      </td>
                      <td>{doc.status?.toLowerCase() === "completed" ? `${doc.score}%` : "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No reports available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showModal && selectedFile && (
        <div className="modal d-block" style={{zIndex:'10000'}}onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign File: {selectedFile.fileName}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {auditors.map((auditor, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-primary w-100 mb-2"
                    onClick={() => handleAssignDoc(auditor)}
                  >
                    ✅ {auditor.name}
                  </button>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
