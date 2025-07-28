import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Template.css';
import banner from '../Images/Banner_audit.webp';
import image from '../Images/Audit_image.webp'

function Template({ children }) {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);


  const hideHeaderFooterRoutes = ["/admindashboard", "/auditordashboard", "/uploadedfiles"];
  const shouldHideLayout = hideHeaderFooterRoutes.includes(location.pathname);

  
  const toggleDropdown = (name) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  return (
    <div className="fullpage-wrapper" style={{ minHeight: '100vh', backgroundColor: '#060606', color: 'white'}}>
      <div
            className="banner d-flex align-items-center sticky-top"
            style={{
              backgroundImage: `url(${banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '120px',
              width: '100%',
              color: 'white',
              textAlign: 'center',
              zIndex:"9000"
            }}
          >
            <h2 className= "merriweather-title mb-3  "style={{ fontSize: '2.5rem', 
              padding: '10px 20px', borderRadius: '8px', color:'#b1a7c2ff' }}>
              Welcome to Audit System
            </h2>
          </div>
      {!shouldHideLayout && (
        <>
          {/* Banner with Image and Title */}
          
          <header className="header d-flex align-items-center fixed-top w-75 mx-auto rounded-3 pb-4" style={{ zIndex:'20000',
            backgroundColor:'rgba(0, 0, 0, 0.6)', height:'1px' ,marginTop:'77px',boxShadow: "0 6px 12px rgba(0, 0, 0, 0.43)"
, }}>
            <div className="header-container container-fluid container-xl d-flex align-items-center justify-content-between">
              <Link to="/" className="logo d-flex align-items-center me-auto me-xl-0">
                <h1 className="sitename">Audit System</h1>
              </Link>

              <nav className="navmenu navbar d-none d-xl-block">
                <ul>
                  <li><Link to="/" className="active">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li className="dropdown">
                    <a href="#"><span className='btn btn-getstarted text text-dark'>Get Started</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                    <ul>
                      <li className="dropdown">
                        <a href="#"><span>User</span></a>
                        <ul>
                          <li><Link to="/userregistration">Registration</Link></li>
                          <li><Link to="/userlogin">Login</Link></li>
                        </ul>
                      </li>
                      <li className="dropdown">
                        <a href="#"><span>Auditor</span></a>
                        <ul>
                          <li><Link to="/auditorregistration">Registration</Link></li>
                          <li><Link to="/auditorlogin">Login</Link></li>
                        </ul>
                      </li>
                      <li className="dropdown">
                        <a href="#"><span>Admin</span></a>
                        <ul>
                          <li><Link to="/adminlogin">Login</Link></li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav> 
              <i
              className={`mobile-nav-toggle d-xl-none bi ${isNavOpen ? "bi-x" : "bi-list"}`}
              onClick={() => setIsNavOpen(!isNavOpen)}
              style={{
                fontSize: "1.8rem",
                color: "white",
                position: "absolute",
                top: "5px",
                right: "20px",
                zIndex: 1000,
                cursor: "pointer",
              }}
              ></i>
            </div>
          </header>

          {isNavOpen && (
          <div
            className="mobile-dropdown-menu position-absolute"
            style={{
              top: "120px",
              right: "20px",
              backgroundColor: "#121212",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "10px",
              zIndex: 999,
              width: "200px"
            }}
          >
            <DropdownItem title="User" links={[
              { path: "/userregistration", label: "Registration" },
              { path: "/userlogin", label: "Login" }
            ]} />

            <DropdownItem title="Auditor" links={[
              { path: "/auditorregistration", label: "Registration" },
              { path: "/auditorlogin", label: "Login" }
            ]} />

            <DropdownItem title="Admin" links={[
              { path: "/adminlogin", label: "Login" }
            ]} />
          </div>
        )}
            
       </>
      )}

      <main className="container-fluid mt-5">
      <div className="row px-auto">
        {/* Left Card - Common Image */}
        <div className="col-md-4">
          <div
            className="card bg-dark text-white shadow"
            style={{ borderRadius: '15px', height: '440px' }}
          >
            <img
              src={image}
              className="card-img"
              alt="Audit Banner"
              style={{
                borderRadius: '15px',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              className="card-img-overlay d-flex align-items-end"
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '15px',
              }}
            >
              <h5 className="card-title">Audit System</h5>
            </div>
          </div>
        </div>

        {/* Right Card - Dynamic Components */}
        <div className="col-md-8 ">
          <div
            className="card bg-dark text-white shadow "
            style={{ borderRadius: '15px', height: '440px' }}
          >
            <div
              className="card-body "
              style={{
                maxHeight: '100%',
                overflowY: 'auto',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>


      {!shouldHideLayout && (
       
      
        <footer className="footer fixed-bottom" style={{ backgroundColor: "#060606" }}>
          <div className="container text-center text-white py-0" style={{height:'40px'}}>
            <hr className='border border-2'></hr>
            <p>© Copyright <strong>Strategy</strong> All Rights Reserved
            
              by <a href="https://www.rgtech.org.in/ " target='_bl'>RG Tech</a>
            </p>
          </div>
        </footer>
       
      )}
    </div>
  );
}

function DropdownItem({ title, links }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: "white", cursor: "pointer", fontWeight: "bold" }}
      >
        {title}
      </div>
      {isOpen && (
        <ul style={{ paddingLeft: "15px", marginTop: "5px" }}>
          {links.map((link, index) => (
            <li key={index}>
              <Link className='text text-warning'
                to={link.path}
                style={{ color: "white", textDecoration: "none" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Template;
