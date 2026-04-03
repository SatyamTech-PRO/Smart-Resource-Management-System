let requests = [];
let workers = [];
let selectedRequestId = null;

// 🚀 LOAD WORKERS
async function loadWorkers() {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/workers");
    const data = await res.json();

    workers = data.workers || [];
    renderWorkers(workers);
  } catch (err) {
    console.error("Workers load error:", err);
  }
}

// 🚀 SUBMIT FORM
document.getElementById('srm-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;

  const requestData = {
    type: form.serviceType.value,
    description: form.description.value,
    location: form.location.value
  };

  try {
    const res = await fetch("http://127.0.0.1:5000/api/request", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(requestData)
    });

    const data = await res.json();
    console.log("Response:", data);

    // ✅ SAFE HANDLING
    let techName = data.assigned_technician?.name || "Not Assigned";
    let urgency = data.urgency || "LOW";

    document.getElementById('form-msg').textContent =
      `✅ Assigned: ${techName} | Urgency: ${urgency}`;

    // ✅ STORE REQUEST
    requests.push({
      id: data.request_id || Date.now(),
      serviceType: requestData.type,
      description: requestData.description,
      location: requestData.location,
      status: data.status || "ASSIGNED",
      urgency: urgency,
      assignedTo: techName
    });

    renderDashboard();
    form.reset();

  } catch (err) {
    console.error("Submit error:", err);
    document.getElementById('form-msg').textContent = "❌ Error submitting request";
  }
});

// 🎨 STATUS COLOR
function statusColor(status) {
  if (status === 'REQUESTED') return '#f39c12';
  if (status === 'ASSIGNED') return '#3498db';
  if (status === 'IN_PROGRESS') return '#9b59b6';
  if (status === 'COMPLETED') return '#27ae60';
  return '#aaa';
}

// 📊 DASHBOARD
function renderDashboard() {
  const list = document.getElementById('request-list');

  if (requests.length === 0) {
    list.innerHTML = '<p style="color:#999">No requests yet.</p>';
    return;
  }

  list.innerHTML = requests.map(r => `
    <div style="border:1px solid #eee; padding:16px; margin-bottom:12px;">
      <strong>${r.serviceType}</strong>
      <span style="background:${statusColor(r.status)}; color:white; padding:4px 10px; border-radius:10px;">
        ${r.status}
      </span>
      <p>${r.description}</p>
      <p>📍 ${r.location}</p>
      <p>👷 ${r.assignedTo}</p>
      <button onclick="trackRequest('${r.id}')">Track</button>
    </div>
  `).join('');
}

// 🔍 TRACK REQUEST
async function trackRequest(id) {
  try {
    const res = await fetch(`http://127.0.0.1:5000/api/status/${id}`);
    const data = await res.json();

    const req = requests.find(r => r.id == id);
    if (!req) return;

    req.status = data.status;

    selectedRequestId = id;
    renderTracker(req);

  } catch (err) {
    console.error("Track error:", err);
  }
}

// 📌 TRACKER UI
function renderTracker(req) {
  document.getElementById('tracker-content').innerHTML = `
    <h3>${req.serviceType}</h3>
    <p>Status: <strong>${req.status}</strong></p>
    <button onclick="updateStatus('IN_PROGRESS')">Start</button>
    <button onclick="updateStatus('COMPLETED')">Complete</button>
  `;
}

// 🔄 UPDATE STATUS
async function updateStatus(status) {
  try {
    await fetch("http://127.0.0.1:5000/api/update-status", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        request_id: selectedRequestId,
        status: status
      })
    });

    const req = requests.find(r => r.id == selectedRequestId);
    if (req) {
      req.status = status;
      renderDashboard();
      renderTracker(req);
    }

  } catch (err) {
    console.error("Update error:", err);
  }
}

// 👷 WORKERS UI
function renderWorkers(list) {
  const container = document.getElementById('worker-list');

  if (!list.length) {
    container.innerHTML = "<p>No workers available</p>";
    return;
  }

  container.innerHTML = list.map(w => `
    <div style="border:1px solid #eee; padding:12px; margin-bottom:10px;">
      <strong>${w.name}</strong> - ${w.skill}
      <p>⭐ ${w.rating} | Jobs: ${w.jobs}</p>
      <p>${w.available ? "🟢 Available" : "🔴 Busy"}</p>
    </div>
  `).join('');
}

// 🚀 INIT
loadWorkers();
renderDashboard();