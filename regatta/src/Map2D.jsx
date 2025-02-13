import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import BoatMarker from "./BoatMarker"; // 📌 Componente para mostrar barcos
import io from "socket.io-client";
import "./Map2D.css";

const socket = io("https://server-production-c33c.up.railway.app/");

// 📌 Componente para ajustar la vista del mapa
const MapUpdater = ({ boats }) => {
  const map = useMap();

  useEffect(() => {
    if (boats.length > 0) {
      const bounds = boats.map((boat) => boat.position);
      map.fitBounds(bounds, { padding: [50, 50] }); 
    }
  }, [boats, map]);

  return null;
};

const Map2D = () => {
  const navigate = useNavigate();
  const [boats, setBoats] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("updateLocation", (data) => {
      console.log("Datos de ubicación recibidos:", data);
      setBoats((prevBoats) => {
        const now = Date.now();
        const boatIndex = prevBoats.findIndex((boat) => boat.id === data.id);
        if (boatIndex !== -1) {
          prevBoats[boatIndex] = {
            ...prevBoats[boatIndex],
            position: [data.latitude, data.longitude],
            azimuth: data.azimuth,
            lastUpdate: now,
          };
        } else {
          prevBoats.push({
            id: data.id,
            name: data.name,
            position: [data.latitude, data.longitude],
            speed: data.speed,
            color: data.color,
            azimuth: data.azimuth,
            lastUpdate: now,
          });
        }
        return [...prevBoats];
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setBoats((prevBoats) =>
        prevBoats.filter((boat) => now - boat.lastUpdate <= 10000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "You" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="map">
      <MapContainer center={[42.234, -8.755]} zoom={13} style={{ width: "100%", height: "100vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
        <MapUpdater boats={boats} />
        {boats.map((boat, index) => (
          <BoatMarker key={index} position={boat.position} name={boat.name} speed={boat.speed} color={boat.color} azimuth={boat.azimuth} />
        ))}
      </MapContainer>

      <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
      <button className="help-btn" onClick={() => setShowHelp(true)}>Help</button>
      <button className="chat-btn" onClick={() => setShowChat(!showChat)}>Chat</button>
      <button className="threeD-btn" onClick={() => navigate("/scene")}>3D</button>

      {showHelp && (
        <div className="help-modal">
          <h2>Help Information</h2>
          <p>Here is some information about how to use the application...</p>
          <button onClick={() => setShowHelp(false)}>Close</button>
        </div>
      )}

      {showChat && (
        <div className="chat-popup">
          <h3>Chat</h3>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <strong>{msg.sender}: </strong>{msg.text}
              </div>
            ))}
          </div>
          <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Map2D;
