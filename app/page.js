"use client";
import { useState } from "react";

export default function App() {
  const [role, setRole] = useState(null);
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe", temp: [], discharged: false }
  ]);
  const [temp, setTemp] = useState("");

  const check = (temps) => {
    if (temps.length < 3) return false;
    return temps.slice(-3).every(t => parseFloat(t) < 99);
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer"
  };

  if (!role) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>🦠 Quarantine System</h1>
        <button style={buttonStyle} onClick={() => setRole("doctor")}>Doctor</button>
        <button style={buttonStyle} onClick={() => setRole("nurse")}>Nurse</button>
        <button style={buttonStyle} onClick={() => setRole("staff")}>Staff</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Role: {role}</h2>
      <button style={{ ...buttonStyle, background: "red" }} onClick={() => setRole(null)}>Logout</button>

      {patients.map(p => (
        <div key={p.id} style={{
          border: "1px solid #ccc",
          padding: 15,
          margin: 10,
          borderRadius: 10,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h3>{p.name}</h3>
          <p>Temps: {p.temp.join(", ") || "No data"}</p>

          {role === "nurse" && (
            <>
              <input
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                style={{ padding: 5, marginRight: 10 }}
              />
              <button style={buttonStyle} onClick={() => {
                p.temp.push(temp);
                setPatients([...patients]);
                setTemp("");
              }}>Add Temp</button>
            </>
          )}

          {role === "doctor" && (
            check(p.temp)
              ? <button style={buttonStyle} onClick={() => {
                  p.discharged = true;
                  setPatients([...patients]);
                }}>Approve Discharge</button>
              : <p style={{ color: "red" }}>Not eligible</p>
          )}

          <p>Status: <b>{p.discharged ? "Discharged" : "Admitted"}</b></p>
        </div>
      ))}
    </div>
  );
}
