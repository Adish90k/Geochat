import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const navigate = useNavigate();
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      // alert("called");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude);
          setLatitude(position.coords.latitude);
          alert(position.coords.longitude,position.coords.latitude);
        },
        (error) => {
          alert(error.message);
          console.log("Error getting current location:", error);
        }
      );

    } else {
      alert("Geolocation is not supported by this browser.");
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!longitude || !latitude) {
      console.log("Latitude or longitude is null. Request not sent.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      });

      // console.log(response.data);
      // localStorage.removeItem("user"); 
      localStorage.setItem("user",JSON.stringify(response.data.name)); 
      // localStorage.removeItem("user"); 
      localStorage.setItem("token", JSON.stringify(response.data.token)); 
      setEmail("");
      setPassword("");
      setLongitude("");
      setLatitude("");
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleGetLocation}>Get Location</button>
        <button type="submit" onClick={handleSubmit} disabled={!longitude || !latitude}>
          Register
        </button>
      </form>
      <div>
        <label>Longitude:</label>
        <input type="text" value={longitude} disabled />
      </div>
      <div>
        <label>Latitude:</label>
        <input type="text" value={latitude} disabled />
      </div>
    </div>
  );
};

export default Login;
