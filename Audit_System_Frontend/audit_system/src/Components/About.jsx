import React from "react";

function About() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      <section className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 inline-block pb-2">
          About Us
        </h1>

        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mx-3">
          Welcome to our <strong className="text-blue-600">Audit Management System</strong> – a powerful platform
          designed to streamline and simplify the auditing process for organizations of all sizes. Our goal is to
          bring <span className="font-medium text-gray-800">transparency</span>,{" "}
          <span className="font-medium text-gray-800">efficiency</span>, and{" "}
          <span className="font-medium text-gray-800">accountability</span> to every step of your audit workflow.
          <br /><br />
          We provide a centralized system where <strong>administrators, auditors, and users</strong> can collaborate
          seamlessly. From document submission to auditor assignment and final report generation, our system ensures
          that every action is <span className="text-green-600 font-medium">traceable</span> and{" "}
          <span className="text-green-600 font-medium">secure</span>.
          <br /><br />
          With <span className="text-purple-600 font-medium">real-time updates</span>,{" "}
          <span className="text-purple-600 font-medium">status tracking</span>, and{" "}
          <span className="text-purple-600 font-medium">role-based access</span>, we make it easy to manage and monitor
          the entire auditing lifecycle.
          <br /><br />
          Whether you are tracking compliance, reviewing internal processes, or conducting routine checks, our
          audit system empowers teams to stay organized, reduce manual efforts, and improve decision-making through
          <span className="font-semibold text-indigo-600"> data-driven insights</span>.
        </p>
      </section>
    </main>
  );
}

export default About;
