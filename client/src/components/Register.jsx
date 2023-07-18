import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude);
          setLatitude(position.coords.latitude);
        },
        (error) => {
          console.log("Error getting current location:", error);
        }
      );
    } else {
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
      const response = await axios.post("http://localhost:5000/api/user/register", {
        name,
        email,
        password,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      });

      console.log(response.data);

      setName("");
      setEmail("");
      setPassword("");
      setLongitude("");
      setLatitude("");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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

export default Register;
