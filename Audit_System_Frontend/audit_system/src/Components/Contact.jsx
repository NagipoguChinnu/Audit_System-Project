import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const validName = /^[a-zA-Z ]{3,30}$/;
    const validMobile = /^[6-9][0-9]{9}$/;
    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!validName.test(formData.name)) return alert("Invalid name");
    if (!validMobile.test(formData.mobile)) return alert("Invalid mobile number");
    if (!validEmail.test(formData.email)) return alert("Invalid email format");
    if (!formData.message.trim()) return alert("Please enter your message");

    try {
      await axios.post("http://localhost:9191/contact/send", formData);
      alert("Thank you for contacting us!");

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center px-4 py-12 bg-gray-100 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
        <p className="text-md text-gray-600 max-w-xl mb-6">
          Have questions, feedback, or need support? Fill out the form below and we’ll get back to you shortly.
        </p>
      </main>

      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card shadow-sm p-4" style={{ backgroundColor: "#f0f2f5" }}>
              <h4 className="text-center text-dark mb-3">Get in Touch</h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your 10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="yourname@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary px-4">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
