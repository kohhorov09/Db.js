const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 9090;
const MISSIONS_FILE = "./missions.json";

app.use(cors());
app.use(bodyParser.json());

// 🔁 Read JSON file
function readMissions() {
  const data = fs.readFileSync(MISSIONS_FILE, "utf-8");
  return JSON.parse(data);
}

// 💾 Write JSON file
function writeMissions(data) {
  fs.writeFileSync(MISSIONS_FILE, JSON.stringify(data, null, 2));
}

// 📄 GET all missions
app.get("/missions", (req, res) => {
  try {
    const missions = readMissions();
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: "Failed to read missions" });
  }
});

// ➕ Add new mission
app.post("/missions", (req, res) => {
  const missions = readMissions();
  const newMission = {
    ...req.body,
    id: Date.now(),
  };
  missions.push(newMission);
  writeMissions(missions);
  res.json(newMission);
});

// 🗑 Delete mission
app.delete("/missions/:id", (req, res) => {
  const missions = readMissions();
  const filtered = missions.filter((m) => m.id != req.params.id);
  writeMissions(filtered);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
