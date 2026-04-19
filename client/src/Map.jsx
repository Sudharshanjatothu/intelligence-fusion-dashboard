import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";

import AddData from "./AddData";
import UploadData from "./UploadData";
import UploadJSON from "./UploadJSON";
import DragDropUpload from "./DragDropUpload";

import "./styles.css";

// 🎯 Marker Icons
const icons = {
  IMINT: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [25, 41],
  }),
  OSINT: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [25, 41],
  }),
  HUMINT: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [25, 41],
  }),
};

export default function MapView() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("ALL");

  // 📡 Fetch data from backend
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/all");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 Filter logic
  const filteredData =
    filter === "ALL"
      ? data
      : data.filter((item) => item.source === filter);

  return (
    <div style={{ display: "flex" }}>
      
      {/* 📊 SIDEBAR */}
      <div className="sidebar">
        <h2>🛰️ Intelligence Dashboard</h2>
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          Multi-source intelligence view
        </p>

        {/* 🔘 FILTERS */}
        <div>
          {["ALL", "IMINT", "OSINT", "HUMINT"].map((type) => (
            <button
              key={type}
              className="filter-btn"
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <hr />

        {/* 📋 DATA LIST */}
        {filteredData.map((item, i) => (
          <div key={i} className="card">
            <strong>{item.title}</strong>
            <p style={{ fontSize: "12px" }}>{item.description}</p>
            <span
              style={{
                fontSize: "11px",
                padding: "2px 6px",
                background: "#0ea5e9",
                borderRadius: "6px",
              }}
            >
              {item.source}
            </span>
          </div>
        ))}

        {/* ➕ ADD DATA */}
        <div className="form">
          <AddData onAdd={fetchData} />
        </div>

        {/* 📂 UPLOAD SECTION */}
        <div className="form">
          <UploadData onUpload={fetchData} />
          <UploadJSON onUpload={fetchData} />
          <DragDropUpload onUpload={fetchData} />
        </div>
      </div>

      {/* 🗺️ MAP */}
      <div style={{ position: "relative", flex: 1 }}>
        
        {/* 🌍 MAP LABEL */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 20,
            zIndex: 1000,
            background: "rgba(0,0,0,0.6)",
            padding: "8px 12px",
            borderRadius: "8px",
            color: "white",
          }}
        >
          🌍 Live Intelligence Map
        </div>

        <MapContainer center={[20, 78]} zoom={5} className="map">
          
          {/* 🛰️ Satellite Map */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri"
          />

          {/* 📍 MARKERS */}
          {filteredData.map((item, i) =>
            item.latitude && item.longitude ? (
              <Marker
                key={i}
                position={[
                  Number(item.latitude),
                  Number(item.longitude),
                ]}
                icon={icons[item.source] || icons.OSINT}
                eventHandlers={{
                  mouseover: (e) => e.target.openPopup(),
                  mouseout: (e) => e.target.closePopup(),
                }}
              >
                <Popup>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <img
                    className="popup-img"
                    src={item.imageUrl}
                    width="140"
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/150")
                    }
                  />
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
}