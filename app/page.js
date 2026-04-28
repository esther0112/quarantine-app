"use client";
import { useState } from "react";

export default function App() {
  const [role, setRole] = useState("doctor");
  const [page, setPage] = useState("dashboard");

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Arjun Mehta",
      room: 102,
      age: 52,
      temps: [98.2, 98.4],
      visited: false,
      discharged: false
    },
    {
      id: 2,
      name: "Vikram Patel",
      room: 104,
      age: 45,
      temps: [100.2],
      visited: false,
      discharged: false
    }
  ]);

  const [tempInput, setTempInput] = useState("");
  const [newPatient, setNewPatient] = useState("");

  // ✅ AUTO DISCHARGE (3 days no fever)
  const isReady = (temps) =>
    temps.length >= 3 &&
    temps.slice(-3).every(t => parseFloat(t) < 99);

  // Stats
  const critical = patients.filter(p => p.temps.slice(-1)[0] > 101).length;
  const fever = patients.filter(p => p.temps.slice(-1)[0] >= 99).length;
  const improving = patients.filter(p => p.temps.slice(-1)[0] < 99).length;
  const ready = patients.filter(p => isReady(p.temps)).length;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#f5f5f5", padding: 20 }}>
        <h3>{role.toUpperCase()}</h3>

        <p onClick={() => setPage("dashboard")}>Dashboard</p>
        <p onClick={() => setPage("patients")}>Patient Review</p>

        {role === "nurse" && (
          <p onClick={() => setPage("visits")}>Visit Tracker</p>
        )}
        {role === "doctor" && (
          <p onClick={() => setPage("discharge")}>Discharge</p>
        )}
        {role === "staff" && (
          <p onClick={() => setPage("rooms")}>Rooms</p>
        )}

        <hr />
        <p>Occupancy: {patients.length}/74</p>

        <button onClick={() => setRole(null)}>Logout</button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20, background: "#fafafa" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h2>Good morning, Doctor</h2>

            {/* STAT CARDS */}
            <div style={{ display: "flex", gap: 20 }}>
              {[["CRITICAL", critical], ["FEVER", fever],
                ["IMPROVING", improving], ["DISCHARGE", ready]]
                .map(([title, val], i) => (
                  <div key={i} style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 10,
                    width: 150
                  }}>
                    <p>{title}</p>
                    <h2>{val}</h2>
                  </div>
                ))}
            </div>

            {/* ALERT */}
            <div style={{
              marginTop: 20,
              padding: 10,
              background: "#fee2e2",
              borderRadius: 8
            }}>
              {patients.filter(p => !p.visited).length} patients not visited
            </div>
          </>
        )}

        {/* PATIENT LIST */}
        {page === "patients" && (
          <>
            <h2>Patient Review</h2>

            {role === "staff" && (
              <>
                <input
                  placeholder="Add patient"
                  value={newPatient}
                  onChange={e => setNewPatient(e.target.value)}
                />
                <button onClick={() => {
                  setPatients([...patients, {
                    id: Date.now(),
                    name: newPatient,
                    room: Math.floor(Math.random() * 74),
                    age: 30,
                    temps: [],
                    visited: false,
                    discharged: false
                  }]);
                  setNewPatient("");
                }}>Add</button>
              </>
            )}

            {patients.map(p => (
              <div key={p.id} style={{
                background: "white",
                padding: 15,
                margin: 10,
                borderRadius: 10
              }}>
                <b>{p.name}</b> (Room {p.room})<br />
                Temps: {p.temps.join(", ") || "No data"}

                {/* NURSE */}
                {role === "nurse" && (
                  <>
                    <input
                      value={tempInput}
                      onChange={e => setTempInput(e.target.value)}
                      placeholder="Temp"
                    />
                    <button onClick={() => {
                      p.temps.push(tempInput);
                      p.visited = true;
                      setPatients([...patients]);
                      setTempInput("");
                    }}>
                      Add Temp
                    </button>
                  </>
                )}

                {/* DOCTOR */}
                {role === "doctor" && (
                  isReady(p.temps)
                    ? <button onClick={() => {
                        p.discharged = true;
                        setPatients([...patients]);
                      }}>Approve Discharge</button>
                    : <p>Not eligible</p>
                )}

                <p>Status: {p.discharged ? "Discharged" : "Admitted"}</p>
                <p>Visited: {p.visited ? "Yes" : "No"}</p>
              </div>
            ))}
          </>
        )}

        {/* VISITS */}
        {page === "visits" && role === "nurse" && (
          <>
            <h2>Visit Tracker</h2>
            {patients.map(p => (
              <div key={p.id}>
                {p.name} → {p.visited ? "Visited" : "Pending"}
              </div>
            ))}
          </>
        )}

        {/* DISCHARGE */}
        {page === "discharge" && role === "doctor" && (
          <>
            <h2>Discharge Queue</h2>
            {patients.filter(p => isReady(p.temps)).map(p => (
              <div key={p.id}>{p.name} ready</div>
            ))}
          </>
        )}

        {/* ROOMS */}
        {page === "rooms" && role === "staff" && (
          <>
            <h2>Room Occupancy</h2>
            <p>{patients.length}/74 occupied</p>
          </>
        )}

      </div>
    </div>
  );
}
