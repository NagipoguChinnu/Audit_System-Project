import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const UploadedFilesTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [assignments, setAssignments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState("uploaded"); 
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [updateData, setUpdateData] = useState({
    name: "",
    mobile: "",
    email: email || "",
    password: ""
  });


const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);


  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get(`http://localhost:9191/uploaded-files/user?email=${email}`);
      setUploadedFiles(res.data);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  const handleDelete = async (fileName) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete ${fileName}?`);
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:9191/delete-file/${fileName}`);
    alert("File deleted successfully.");
    fetchUploadedFiles(); // Refresh the list after deletion
  } catch (error) {
    console.error("Error deleting file:", error);
    alert("Failed to delete the file.");
  }
};

  const fetchAssignments = async () => {
    try {
      
      const res = await axios.get(`http://localhost:9191/assignments/user?email=${email}`);
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
  if (viewMode === "dashboard") {
    fetchUserDetails(email);  
  }
}, [viewMode]);

const fetchUserDetails = async (email) => {  
  try {
    console.log("email is ", email);
    const res = await axios.get(`http://localhost:9191/user/details?email=${email}`);
    const { name, mobile, email: userEmail, password } = res.data;
    setUserName(name);
    setUpdateData(prev => ({ ...prev, name, mobile, password }));
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

useEffect(() => {
  if (!email) {
    navigate("/userlogin");
  }
}, []);


const fetchUserName = async () => {
  try {
    const res = await axios.get("http://localhost:9191/user/name", {
      params: { email: email }  
    });
    setUserName(res.data);
  } catch (error) {
    console.error("Error fetching user name:", error);
  }
};


  useEffect(() => {
    if (!email) return;
    fetchUserDetails(email);
    fetchUploadedFiles();
    fetchAssignments();
    fetchUserName();

    const intervalId = setInterval(() => {
      fetchUploadedFiles();
      fetchAssignments();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [email]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !email) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", email);

    try {
      await axios.post("http://localhost:9191/upload", formData);
      alert("File uploaded successfully.");
      setSelectedFile(null);
      fetchUploadedFiles();
    } catch (error) {
      alert("Upload failed : File already exists.");
    }
  };

  const handleUpdateUser = async (e) => {
  try {
    e.preventDefault();

    // Regex validations
    const validName = /^[a-zA-Z ]{5,20}$/;
    const validMobile = /^[6-9][0-9]{9}$/;
    const validPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!validName.test(userName)) return alert("Invalid name");

    await axios.put("http://localhost:9191/user/update", updateData);
    alert("User updated successfully.");
    setShowUpdateForm(false);
    fetchUserDetails(); // Refresh after update
  } catch (error) {
    console.error("Update failed:", error);
    alert("Failed to update user.");
  }
};

  const handleLogout = () => {
    navigate("/userlogin");
  };

  const mergedData = uploadedFiles.map((file) => {
    const matchedAssignment = assignments.find((a) => a.fileName === file.fileName);
    return {
      fileName: file.fileName,
      status: matchedAssignment ? matchedAssignment.status : "Not Assigned",
      auditorName: matchedAssignment?.auditorName || "",
      score: matchedAssignment?.score || "",
    };
  });

  return (
    <div className="container mt-4 pt-3 px-4 pb-2"  style={{ maxWidth: "95%", backgroundColor:"#060606"}}>
      {/* Navbar */}
      <h4 className="text-center">User Dashboard</h4>
      <h5>Welcome, {userName} 👋</h5>
 <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 rounded">
  <div className="container-fluid">
    <button
        className={`btn btn-sm me-2 ${viewMode === "dashboard" ? "btn-light" : "btn-outline-info"}`}
        onClick={() => setViewMode("dashboard")}
      >
        Dashboard
      </button>


    {/* Toggle button */}
    <button
      className="navbar-toggler"
      type="button"
      onClick={handleNavCollapse}
      aria-controls="navbarNav"
      aria-expanded={!isNavCollapsed}
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* Toggleable content */}
    <div className={`collapse navbar-collapse ${!isNavCollapsed ? "show" : ""}`} id="navbarNav">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-lg-flex flex-lg-row gap-2">
        <li className="nav-item">
          <button
            className={`btn btn-sm ${viewMode === "uploaded" ? "btn-light" : "btn-outline-light"}`}
            onClick={() => setViewMode("uploaded")}
          >
            Uploaded Files
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-sm ${viewMode === "report" ? "btn-light" : "btn-outline-light"}`}
            onClick={() => setViewMode("report")}
          >
            Reports
          </button>
        </li>
      </ul>
      <div className="d-flex">
        

        <button className="btn btn-sm btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>
{viewMode === "dashboard" && (
  <div className="card mx-auto p-4 mb-4 " style={{ maxWidth: "500px", backgroundColor: "#f8f4f0" }}>
    <h5 className="text-center text-dark ">User Details</h5>
    {showUpdateForm ? (
  <form onSubmit={handleUpdateUser}>
    <div className="mb-2">
      <input
        type="text"
        className="form-control"
        placeholder="Name"
        value={updateData.name}
        onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
        required
      />
    </div>
    <div className="mb-2">
      <input
        type="text"
        className="form-control"
        placeholder="Mobile"
        value={updateData.mobile}
        onChange={(e) => setUpdateData({ ...updateData, mobile: e.target.value })}
        required
      />
    </div>
    <div className="mb-2">
      <input
        type="email"
        className="form-control"
        value={updateData.email}
        readOnly
      />
    </div>
    <div className="mb-3">
      <input
        type="password"
        className="form-control"
        placeholder="Password"
        value={updateData.password}
        onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
        required
      />
    </div>
    <div className="d-flex justify-content-end gap-2">
      <button type="submit" className="btn btn-success">Save</button>
      <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateForm(false)}>Cancel</button>
    </div>
  </form>
) : (
  <>
    <p><strong>Name:</strong> {updateData.name}</p>
    <p><strong>Mobile:</strong> {updateData.mobile}</p>
    <p><strong>Email:</strong> {updateData.email}</p>
    <p><strong>Password:</strong> {updateData.password}</p>
    <div className="d-flex justify-content-center mt-3">
      <button className="btn btn-outline-warning" onClick={() => setShowUpdateForm(true)}>
        Update Details
      </button>
    </div>
  </>
)}

  </div>
)}
  {viewMode !== "dashboard" && (
  <>
      <div className="mb-3 d-flex justify-content-center gap-2">
        <input type="file" className="form-control" style={{ maxWidth: "250px" }} onChange={handleFileChange} />
        <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
      </div>
      <div className="table-responsive">
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            {viewMode === "uploaded" ? (
              <>
                <th>File Name</th>
                <th>Uploaded At</th>
                <th>File</th>
                <th>Action</th>
              </>
            ) : (
              <>
                <th>File Name</th>
                <th>Status</th>
                <th>Score</th>
                <th>Auditor</th>
                <th>File</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {viewMode === "uploaded" ? (
            uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, idx) => (
                <tr key={idx}>
                  <td>{file.fileName}</td>
                  <td>{file.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : "N/A"}</td>
                  <td>
                    <a
                      href={`http://localhost:9191/files/view/${file.fileName}`}
                      className="btn btn-sm btn-outline-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger "
                      onClick={() => handleDelete(file.fileName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center">No files uploaded yet.</td></tr>
            )
          ) : (
            mergedData.length > 0 ? (
              mergedData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fileName}</td>
                  <td>
                    <span className={`badge ${
                      item.status === "Completed" ? "bg-success" :
                      item.status === "Assigned" ? "bg-info text-dark" :
                      "bg-warning text-dark"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === "Completed"
                      ? (item.score ? `${item.score}%` : "N/A")
                      : "N/A"}
                  </td>
                  <td>{item.auditorName || "Not Assigned"}</td>
                  <td>
                    <a
                      href={`http://localhost:9191/files/view/${item.fileName}`}
                      className="btn btn-sm btn-outline-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center">No reports available yet.</td></tr>
            )
          )}
        </tbody>
      </table>
    </div>
    </>
    )}
    </div>  
  );
};

UploadedFilesTable.hideLayout = true;
export default UploadedFilesTable;
