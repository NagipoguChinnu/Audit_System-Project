import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";


function AuditorDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scores, setScores] = useState({});
  const [auditorName, setAuditorName] = useState("");
  const location = useLocation();
  const auditorEmail = location.state?.auditorEmail;
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("dashboard"); // "assigned" or "action"
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  
const [editMode, setEditMode] = useState(false);

  const [updateData, setUpdateData] = useState({
    name: "",
    mobile: "",
    email: auditorEmail || "",
    password: "",
  });


const handleNavbarToggle = () => {
  setNavbarOpen(!navbarOpen);
};

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9191/assignments/${auditorEmail}`
      );
      setAssignments(response.data);

      // Set scores from backend if they exist
      const newScores = {};
      response.data.forEach((assignment) => {
        if (assignment.score !== null && assignment.score !== undefined) {
          newScores[assignment.id] = assignment.score;
        }
      });
      setScores(newScores);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchAuditorProfile = async () => {
  try {
    const response = await axios.get("http://localhost:9191/auditor/get", {
      params: { email: auditorEmail },
    });
    const { name, mobile, email, password } = response.data;

    setAuditorName(name); // for greeting
    setUpdateData({ name, mobile, email, password }); // fill update form
  } catch (error) {
    console.error("Failed to fetch auditor details:", error);
  }
};

  const fetchAuditorName = async () => {
  try {
    const response = await axios.get(`http://localhost:9191/auditor/name`, {
      params: { email: auditorEmail }
    });
    setAuditorName(response.data);
    setUpdateData((prev) => ({ ...prev, name: response.data }));
  } catch (error) {
    console.error("Failed to fetch auditor name:", error);
  }
};

// Also fetch mobile and password
const fetchAuditorDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:9191/auditor/details`, {
      params: { email: auditorEmail }
    });
    setUpdateData({
      name: response.data.name,
      mobile: response.data.mobile,
      email: response.data.email,
      password: response.data.password
    });
  } catch (error) {
    console.error("Error fetching auditor details:", error);
  }
};


  useEffect(() => {
    if (auditorEmail) {
      fetchAssignments();
      fetchAuditorName();
      fetchAuditorDetails();
      fetchAuditorProfile();
    }
  }, [auditorEmail]);

  const handleTogglePreview = (assignment) => {
  setSelectedFile((prev) =>
    prev && prev.id === assignment.id ? null : assignment
  );
};


  const handleScoreChange = (assignmentId, value) => {
    const score = Number(value);
    if (score >= 0 && score <= 100) {
      setScores({ ...scores, [assignmentId]: score });
    }
  };

  const handleComplete = async (assignmentId) => {
    const score = scores[assignmentId];
    setEditingId(null);
    if (score === undefined || score === "") {
      alert("Please enter a score between 0 and 100 before completing.");
      return;
    }

    const confirmComplete = window.confirm(
      `Are you sure you want to mark this document as completed with a score of ${score}%?`
    );
    if (confirmComplete) {
      try {
        await axios.put(
          `http://localhost:9191/assignments/${assignmentId}/complete`,
          { score },
          { headers: { "Content-Type": "application/json" } }
        );
        await fetchAssignments();
      } catch (error) {
        console.error("Error marking assignment as completed:", error);
      }
    }
  };

  const handleUpdateAuditor = async (e) => {
  try {
    const { name, mobile, email, password } = updateData;

    if (!name || !mobile || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    e.preventDefault();

    // Regex validations
    
    await axios.put("http://localhost:9191/auditor/update", {
      name,
      mobile,
      email,
      password,
    });

    alert("Profile updated successfully.");
    setShowUpdateForm(false);
    fetchAuditorDetails(); // refresh
  } catch (error) {
    console.error("Error updating auditor:", error);
    alert("Failed to update profile.");
  }
};


  return (
  
    <div className="container mt-3 d-flex justify-content-center pt-3" style={{ maxWidth: "95%", backgroundColor:"#060606"}}>
      <div style={{ width: "90%" }}>
        <div className="text-center mb-4">
          <h2 style={{ fontFamily: "Roboto, sans-serif", fontWeight: "bold" }} >
            🛡️ Auditor Dashboard
          </h2>
          <hr />
        </div>
        <h4><i>Welcome, {auditorName} 👋</i></h4>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded mb-4">
          <div className="container-fluid">
            <button
          className="btn btn-outline-info btn-sm navbar-brand"
          onClick={() => {
            setViewMode("dashboard");
            setNavbarOpen(false);

          }}
        >
          Dashboard
        </button>


    <button
      className="navbar-toggler"
      type="button"
      onClick={handleNavbarToggle}
      aria-controls="navbarNav"
      aria-expanded={navbarOpen}
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`} id="navbarNav">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <button
            className={`btn me-2 ${viewMode === "assigned" ? "btn-light" : "btn-outline-light"} my-1`}
            onClick={() => {
              setViewMode("assigned");
              setNavbarOpen(false); // Close menu after click
            }}
          >
            Assigned Documents
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn ${viewMode === "action" ? "btn-light" : "btn-outline-light"} my-1`}
            onClick={() => {
              setViewMode("action");
              setNavbarOpen(false); // Close menu after click
            }}
          >
            Reports
          </button>
        </li>
      </ul>
      
      <button
        className="btn btn-danger btn-sm"
        onClick={() => {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = "/auditorlogin";
        }}
      >
        Logout
      </button>
    </div>
  </div>
</nav>
{showUpdateForm &&  (
  <div className="card p-3 mb-3 bg-light">
    <h5>Update Profile</h5>
    <div className="row g-3">
      <div className="col-md-6">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          value={updateData.name}
          onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
        />
      </div>
      <div className="col-md-6">
        <label>Mobile</label>
        <input
          type="text"
          className="form-control"
          value={updateData.mobile}
          onChange={(e) => setUpdateData({ ...updateData, mobile: e.target.value })}
        />
      </div>
      <div className="col-md-6">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={updateData.email}
          readOnly
        />
      </div>
      <div className="col-md-6">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={updateData.password}
          onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
        />
      </div>
    </div>
    <div className="mt-3 d-flex justify-content-end">
      <button className="btn btn-success me-2" onClick={handleUpdateAuditor}>
        Update
      </button>
      <button className="btn btn-secondary" onClick={() => setShowUpdateForm(false)}>
        Cancel
      </button>
    </div>
  </div>
)}

  

  {viewMode === "assigned" && (
  <div className="table-responsive mt-3 px-2">
    <h5 className="mb-1">📂 Assigned Documents</h5>
    {assignments.length === 0 ? (
      <p>No documents assigned.</p>
    ) : (
      <table className="table table-bordered table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th>File Name</th>
            <th>Assigned At</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.fileName}</td>
              <td>
                {assignment.assignedAt
                  ? new Date(assignment.assignedAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <a
                  href={`http://localhost:9191/auditor/view-by-id/${assignment.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

  {viewMode === "action" && (
  <div className="table-responsive mt-4 px-2">
    <h5 className="">📂 Reports</h5>
    {assignments.length === 0 ? (
      <p>No documents assigned.</p>
    ) : (
      <table className="table table-bordered table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th>File Name</th>
            <th>Preview</th>
            <th>Status</th>
            <th>Score (%)</th>
            <th>Action</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.fileName}</td>
              <td>
                <button
                  className={`btn btn-sm ${
                    selectedFile?.id === assignment.id
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  onClick={() => handleTogglePreview(assignment)}
                >
                  {selectedFile?.id === assignment.id ? "Hide" : "View"}
                </button>
              </td>
              <td>{assignment.status}</td>
              <td>
                {assignment.status === "Completed" && editingId !== assignment.id ? (
                  <span>{assignment.score || "N/A"}</span>
                ) : (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control form-control-sm"
                    value={scores[assignment.id] || ""}
                    onChange={(e) => handleScoreChange(assignment.id, e.target.value)}
                    placeholder="0 - 100"
                  />
                )}
              </td>
              <td>
                {assignment.status === "Completed" && editingId !== assignment.id ? (
                  <button className="btn btn-success btn-sm" disabled>
                    Completed
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleComplete(assignment.id)}
                    disabled={
                      scores[assignment.id] === undefined ||
                      scores[assignment.id] === "" ||
                      isNaN(scores[assignment.id]) ||
                      scores[assignment.id] < 0 ||
                      scores[assignment.id] > 100
                    }
                  >
                    Complete
                  </button>
                )}
              </td>
              <td>
                {assignment.status === "Completed" && editingId !== assignment.id ? (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setEditingId(assignment.id)}
                  >
                    Update
                  </button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

 
{viewMode === "dashboard" && (
  <div className="card p-4 bg-light mb-4 w-75 mx-auto align-center" >
    <h5 className="mb-3 text text-center">👤 Auditor Profile</h5>

    {!editMode ? (
      <>
        <div className="mb-2"><strong>Name:</strong> {updateData.name}</div>
        <div className="mb-2"><strong>Mobile:</strong> {updateData.mobile}</div>
        <div className="mb-2"><strong>Email:</strong> {updateData.email}</div>
        <div className="mb-4"><strong>Password:</strong> {updateData.password}</div>

        <div className="d-flex justify-content-end">
          <button
            className="btn btn-success"
            onClick={() => setEditMode(true)}
          >
            Update Details
          </button>
        </div>
      </>
    ) : (
      <>
        <div className="row g-3">
          <div className="col-md-6">
            <label><strong>Name:</strong></label>
            <input
              type="text"
              className="form-control"
              value={updateData.name}
              onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label><strong>Mobile:</strong></label>
            <input
              type="text"
              className="form-control"
              value={updateData.mobile}
              onChange={(e) => setUpdateData({ ...updateData, mobile: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label><strong>Email:</strong></label>
            <input
              type="email"
              className="form-control"
              value={updateData.email}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label><strong>Password:</strong></label>
            <input
              type="password"
              className="form-control"
              value={updateData.password}
              onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-end">
          <button
            className="btn btn-primary me-2"
            onClick={handleUpdateAuditor}
          >
            Save Changes
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      </>
    )}
  </div>
)}

          {selectedFile && selectedFile.fileName && (
            <div className="mt-4">
              <h5>📄 Preview: {selectedFile.fileName}</h5>

              {selectedFile.fileName.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={`http://localhost:9191/auditor/view-by-id/${selectedFile.id}`}
                  width="100%"
                  height="600px"
                  title="PDF Preview"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px"
                  }}
                ></iframe>
              ) : selectedFile.fileName.toLowerCase().endsWith(".txt") ? (
                <iframe
                  src={`http://localhost:9191/auditor/view-by-id/${selectedFile.id}`}
                  width="100%"
                  height="400px"
                  title="Text Preview"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa"
                  }}
                ></iframe>
              ) : (
                <img
                  src={`http://localhost:9191/auditor/view-by-id/${selectedFile.id}`}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    border: "1px solid #ccc",
                    borderRadius: "8px"
                  }}
                />
              )}
            </div>
          )}
          
      </div>
     
    </div> 
    
  );
}

AuditorDashboard.hideLayout = true;
export default AuditorDashboard;
