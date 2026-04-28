"use client";
import React, { useState } from "react";

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

  if (!role) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <button onClick={() => setRole("doctor")}>Doctor</button>
        <button onClick={() => setRole("nurse")}>Nurse</button>
        <button onClick={() => setRole("staff")}>Staff</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Role: {role}</h2>
      <button onClick={() => setRole(null)}>Logout</button>

      {patients.map(p => (
        <div key={p.id} style={{ border: "1px solid", margin: 10, padding: 10 }}>
          <p>{p.name}</p>
          <p>Temps: {p.temp.join(", ")}</p>

          {role === "nurse" && (
            <>
              <input value={temp} onChange={e => setTemp(e.target.value)} />
              <button onClick={() => {
                p.temp.push(temp);
                setPatients([...patients]);
                setTemp("");
              }}>Add</button>
            </>
          )}

          {role === "doctor" && (
            check(p.temp) ? (
              <button onClick={() => {
                p.discharged = true;
                setPatients([...patients]);
              }}>Discharge</button>
            ) : <p>Not eligible</p>
          )}

          <p>Status: {p.discharged ? "Discharged" : "Admitted"}</p>
        </div>
      ))}
    </div>
  );
}
