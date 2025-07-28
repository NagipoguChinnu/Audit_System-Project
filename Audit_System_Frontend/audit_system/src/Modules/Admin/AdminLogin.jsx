import React, { useState } from "react";
import axios from "axios";
import PasswordInput from "../../Components/PasswordInput";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email and password");

    try {
      setSendingOtp(true);
      const res = await axios.post("http://localhost:9191/admin/send-otp", {
        email,
        password,
      });
      alert("OTP sent to your registered email!");
      setGeneratedOtp(res.data.otp);
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) return alert("Invalid OTP");

    try {
      const res = await axios.post("http://localhost:9191/admin/verify-otp", null, {
        params: { email, otp: enteredOtp },
      });
      if (res.status === 200) {
        alert(res.data);
        setOtpVerified(true);
      }
    } catch (err) {
      alert(err.response?.data || "OTP verification failed");
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  if (!otpVerified) return alert("Please verify OTP first");

  try {
    // ✅ Login
    const loginRes = await axios.post("http://localhost:9191/admin/login", {
      email,
      password,
    });
    alert(loginRes.data);

   
    const usersRes = await axios.get("http://localhost:9191/admin/users-with-files");

   
    const auditorsRes = await axios.get("http://localhost:9191/auditor/all");

    navigate('/admindashboard', {
      state: {
        usersData: usersRes.data,
        auditorsData: auditorsRes.data,
      },
    });
  } catch (err) {
    alert(err.response?.data || "Login failed");
  }
};


  return (
    <div className="container mt-0" style={{paddingRight:'200px'}}>
      <div className="row justify-content-center mt-4 ">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
          <div className="card shadow-sm p-3" style={{backgroundColor:"#e7d8aeff",width:'500px'}}>
            <h3 className="card-title text-center text-dark mt-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Admin Login</h3>

            <form onSubmit={handleLogin}>
              <label className="form-label mt-2">Email</label>
              <input
                className="form-control custom-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email"
              />

              <label className="form-label mt-2">Password</label>
              <PasswordInput
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="d-flex align-items-center gap-2 mt-2">
                <button
                  className="btn btn-sm btn-outline-success w-25"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? "Sending..." : "Send OTP"}
                </button>

                {otpSent && (
                  <>
                    <input
                      className="form-control"
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-outline-primary w-25"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </button>
                  </>
                )}
              </div>

              <button
                className="btn btn-sm btn-outline-primary d-block mx-auto mt-4 mb-2 px-4"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
