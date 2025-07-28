import React, { useState } from "react";
import axios from "axios";
import PasswordInput from "../../Components/PasswordInput";
import '../../App.css';
import { Link } from "react-router-dom";

function UserRegistration() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Send OTP to email and display in console (for development)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setSendingOtp(true);
      const response = await axios.post("http://localhost:9191/api/send-otp", {
        email: email,
      });

      const otp = response.data.otp;
      console.log("Generated OTP (for testing):", otp); // ✅ log in console

      setGeneratedOtp(otp);
      alert("If the email exists, you should receive OTP shortly.");
    } catch (error) {
      console.error(error);
      alert("Invalid Email. Please check email address.");
    }finally{
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      setVerified(true);
      alert("OTP Verified Successfully");
    } else {
      alert("Incorrect OTP. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regex validations
    const validName = /^[a-zA-Z ]{5,20}$/;
    const validMobile = /^[6-9][0-9]{9}$/;
    const validEmail = /^[a-zA-Z0-9._%+-]{5,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!validName.test(name)) return alert("Invalid name");
    if (!validMobile.test(mobile)) return alert("Invalid mobile number");
    if (!validEmail.test(email)) return alert("Invalid email format");
    if (!validPassword.test(password)) return alert("Weak password");
    if (!verified) return alert("Please verify OTP before submitting");

    try {
      const response = await axios.post(
        "http://localhost:9191/user/register",
        {
          name,
          mobile,
          email,
          password,
          otp: enteredOtp,
        }
      );

      alert("Registration successful");

      // Reset form
      setName("");
      setMobile("");
      setEmail("");
      setPassword("");
      setEnteredOtp("");
      setVerified(false);
    } catch (err) {
      console.error(err);
      alert("Error during registration");
    }
  };

  return (
    <div className="container mt-2 mx-auto" style={{paddingRight:'200px'}}> 
      <div className="row justify-content-center mt-4 mb-5">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
          <div className="card shadow-sm p-3" style={{backgroundColor:"#e7d8aeff",width:'500px'}}>
            <div className="card-head text-center mt-2">
              <h3 className="card-title text-dark" style={{ fontFamily: 'Roboto, sans-serif' }}>
                User Registration
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <label className="form-label mt-2">Name</label>
              <input
                className="form-control custom-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter the Name"
              />
  
              <label className="form-label mt-2">Mobile</label>
              <input
                className="form-control custom-input"
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter the mobile number"
              />
  
              <label className="form-label mt-2 ">Email</label>
              <input
                className="form-control custom-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email"
              />
  
              <div className="d-flex align-items-center gap-2 mt-2 ">
              <button
                className="btn btn-sm btn-outline-success w-25"
                onClick={handleSendOtp}
                disabled={sendingOtp}>
                {sendingOtp ? "Sending..." : "Send OTP"}              
                
              </button>
  
                {generatedOtp && (
                  <>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-outline-primary w-25 w-sm-auto"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </button>
                  </>
                )}
              </div>
  
              <label className="form-label mt-3">Password</label>
              <PasswordInput
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the password"
                id="passwordstyle"
              />
  
              <button
                className="btn btn-sm btn-outline-primary d-block mx-auto mt-4 mb-2 px-4"
                type="submit"
              >
                Submit
              </button>
              <p className="text-center mt-2 pb-0">Already have an account ? <Link to='/userlogin' > <i>Login</i></Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserRegistration;  
