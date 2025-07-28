import React, { useState } from 'react';
import '../../src/App.css';

function PasswordInput({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div style={{ position: 'relative'}}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Enter password"
        className="form-control custom-input"
        style={{ paddingRight: "40px", backgroundColor:'#f6e6d1' }}
      />
      <i
        className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
        onClick={togglePassword}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          color: '#555'
        }}
      />
    </div>
  );
}
export default PasswordInput;
