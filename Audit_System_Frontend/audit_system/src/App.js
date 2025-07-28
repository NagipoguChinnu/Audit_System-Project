import {React, useEffect, useState} from 'react'
import UserRegistration from './Modules/User/UserRegistration'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import About from './Components/About';
import Contact from './Components/Contact';
import Template from './Components/Template';
import UserLogin from './Modules/User/UserLogin';
import AdminLogin from './Modules/Admin/AdminLogin';
import AuditorRegistration from './Modules/Auditor/AuditorRegistration';
import AuditorLogin from './Modules/Auditor/AuditorLogin';
import AdminDashboard from './Modules/Admin/AdminDashboard';
import AuditorDashboard from './Modules/Auditor/AuditorDashboard';
import UploadedFilesTable from './Components/UploadedFilesTable';

function App() {

  useEffect(()=>{
    document.title="Audit System";
  })

  return (
   
      <>
        <Routes>
          <Route path="/" element={<Template><Home /></Template>} />
        <Route path="/about" element={<Template><About /></Template>} />
        <Route path="/contact" element={<Template><Contact /></Template>} />
        <Route path="/userregistration" element={<Template><UserRegistration /></Template>} />
        <Route path="/userlogin" element={<Template><UserLogin /></Template>} />
        <Route path="/adminlogin" element={<Template><AdminLogin /></Template>} />
        <Route path="/auditorregistration" element={<Template><AuditorRegistration /></Template>} />
        <Route path="/auditorlogin" element={<Template><AuditorLogin /></Template>} />
        <Route path="/admindashboard" element={<Template><AdminDashboard /></Template>} />
        <Route path="/auditordashboard" element={<Template><AuditorDashboard/></Template>}/>
        <Route path="/uploadedfiles" element={<Template><UploadedFilesTable/></Template>}/>
        </Routes>
    </>
  );
}

export default App;
