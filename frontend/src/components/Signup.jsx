import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // Import CSS file

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/api/signup", {
        email,
        password,
      });

      if (response.data.success) {
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="signup-page">
      <div className="container-wrapper-signup">
        <div className="info-container"> {/* Fixed missing `<` */}
          <img src="/furniture-log.png" alt="Furniture" className="login-image" />
          <h1>Welcome To</h1>
          <p className="logpara">
            Manage your furniture business with ease and efficiency, streamline operations.
          </p>
        </div>
        <div className="signup-container">
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Sign up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
