import React from "react";

function Home() {
  return (
    <main className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-5">
      <div className="container">
       
        <h1 className="display-5 fw-bold text-center mb-2">
          🛡️ Secure File Auditing System
        </h1>
        <p className="lead text-center text-light mb-4">
          Enhancing Cybersecurity with Smart Auditing & Real-Time Insights 🔍
        </p>

        {/* 🔐 Importance of Cybersecurity Auditing */}
         <section className="">
          <h2 className="h4 fw-semibold text-center mb-3">
            🔐 Importance of Cybersecurity Auditing
          </h2>
          <p className="mx-3 ">
            &nbsp;&nbsp;&nbsp;Cybersecurity auditing at the industry level has become increasingly
            vital, especially when it comes to managing and protecting sensitive
            file systems and digital assets. One effective approach that
            organizations are now adopting is the{" "}
            <strong>CyberSecurity Audit Model (CSAM 2.0)</strong>. This advanced
            framework is designed to assess the maturity, assurance, and
            readiness of cybersecurity practices, specifically focusing on
            critical areas such as:
          </p>
          <ul className="ms-4">
            <li>File Access Controls</li>
            <li>Audit Trails</li>
            <li>Compliance & Regulations</li>
            <li>Data Integrity</li>
          </ul>
   

        {/* 🏢 CSAM 2.0 for Enterprise Environments */}
        
          <h2 className="h4 fw-semibold text-center mb-3 mt-5">
            🏢 CSAM 2.0 for Enterprise Environments
          </h2>
          <p className="mx-3">
            &nbsp;&nbsp;&nbsp;In enterprise environments, traditional file auditing methods often
            fall short due to the complexity and volume of data handled daily.{" "}
            <strong>CSAM 2.0</strong> addresses these gaps by offering a
            structured, scalable, and comprehensive model tailored for medium to
            large organizations. It helps evaluate the effectiveness of security
            controls across multiple domains, such as:
          </p>
          <ul className="ms-4">
            <li>Governance and Compliance</li>
            <li>Real-Time Monitoring</li>
            <li>Incident Response</li>
            <li>Encryption and Secure Data Sharing</li>
          </ul>
      
        {/* 📂 Real-World Implementation */}
        
          <h2 className="h4 fw-semibold text-center mb-3 mt-5">
            📂 Real-World Implementation
          </h2>
          <p className="mx-3">
            &nbsp;&nbsp;&nbsp;Through real-world implementation across various industry scenarios,
            CSAM 2.0 has proven to be adaptable and impactful. It has been
            applied in audits focusing on:
          </p>
          <ul className="ms-4">
            <li>File Access and User Behavior</li>
            <li>Cross-Departmental Cybersecurity Policy Enforcement</li>
            <li>Full-Scale Audits — from Cloud Storage to Insider Threat Detection</li>
          </ul>
          <p className="mx-3">
            &nbsp;&nbsp;The flexibility of the model allows it to be tailored to an
            organization’s specific regulatory and operational needs.
          </p>


        {/* 🧠 Key Benefits */}
        
          <h2 className="h4 fw-semibold text-center mb-3 mt-5">
            🧠 Key Benefits of CSAM 2.0
          </h2>
          <p className="mx-3">
            &nbsp;&nbsp;&nbsp;One of the key benefits of using CSAM 2.0 is its ability to reveal
            blind spots in existing security frameworks. Many organizations,
            despite having baseline protections, lack a comprehensive view of
            how files are accessed, modified, or shared—especially across
            distributed or hybrid environments.
          </p>
          <p className="mx-3">
            &nbsp;&nbsp; &nbsp;CSAM 2.0 brings clarity by mapping these activities to risk levels
            and recommending actionable improvements.
          </p>

        {/* ✅ Conclusion */}
        
          <h2 className="h4 fw-semibold text-center mb-3 mt-5">✅ Conclusion</h2>
          <p className="mx-3">
            &nbsp;&nbsp;&nbsp;Overall, integrating CSAM 2.0 into industry-level file auditing not
            only enhances compliance and control but also empowers organizations
            to make data-driven cybersecurity decisions. It helps build a
            proactive defense posture—one that evolves with emerging threats and
            technological advancements.
          </p>
          <p className="mx-3">
            &nbsp;&nbsp;&nbsp;Ultimately, CSAM 2.0 ensures that business-critical data remains
            protected, traceable, and secure.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Home;
