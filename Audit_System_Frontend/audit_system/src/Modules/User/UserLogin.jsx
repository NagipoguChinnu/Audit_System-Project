import React, { useState } from "react";
import axios from "axios";
import PasswordInput from "../../Components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";

function UserLogin() {
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

    if (!email || !password) {
      alert("Please enter email and password first");
      return;
    }

    try {
      setSendingOtp(true);
      const response = await axios.post("http://localhost:9191/user/send-otp", {
        email,
        password,
      });

      alert("OTP sent to your registered email.");
      setGeneratedOtp(response.data.otp); 
      setOtpSent(true);
    } catch (error) {
      alert("Failed to send OTP. Please check email/password.");
    } finally {
      setSendingOtp(false);
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (enteredOtp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }

    try {
      const response = await axios.post("http://localhost:9191/user/verify-otp", null, {
        params: {
          email,
          otp: enteredOtp,
        },
      });

      alert(response.data);
      setOtpVerified(true);
    } catch (error) {
      alert(error.response?.data || "OTP verification failed");
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify OTP before logging in.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:9191/user/login", {
        email,
        password,
      });

      alert(response.data);
      
      
      navigate("/uploadedfiles", { state: { email } });


    } catch (error) {
      alert(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="container mt-0 " style={{paddingRight:'200px'}}>
      <div className="row justify-content-center mt-4 mb-5">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
          <div className="card shadow-sm p-3 mx-auto" style={{backgroundColor:"#e7d8aeff", width:"500px"}}>
            <div className="card-head text-center mt-2">
              <h3 className="card-title text-dark" style={{ fontFamily: 'Roboto, sans-serif' }}>
                User Login
              </h3>
            </div>

            <form onSubmit={handleLogin}>
              <label className="form-label mt-2">Email</label>
              <input
                className="form-control custom-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />

              <label className="form-label mt-2">Password</label>
              <PasswordInput
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />

              <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                <button
                  className="btn btn-sm btn-outline-success w-auto"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  type="button"
                >
                  {sendingOtp ? "Sending..." : "Send OTP"}
                </button>

                {otpSent && (
                  <>
                    <input
                      className="form-control w-auto"
                      type="text"
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-outline-primary w-auto"
                      onClick={handleVerifyOtp}
                      type="button"
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

              <p className="text-center mt-2 pb-0">
                Don't have an account?{" "}
                <Link to="/userregistration">
                  <i>Register</i>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
