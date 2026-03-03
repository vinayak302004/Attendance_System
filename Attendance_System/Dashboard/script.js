let count = 0;
let attendanceInterval = null;
let qrInterval = null;
let sessionActive = false;

function toggleSession() {
  if (!sessionActive) {
    startSession();
  } else {
    stopSession();
  }
}

function startSession() {

  sessionActive = true;

  const btn = document.getElementById("attendanceBtn");
  btn.innerText = "Stop Attendance";

  document.getElementById("status").innerText = "Active";

  count = 0;
  document.getElementById("count").innerText = count;

  // Attendance counter
  attendanceInterval = setInterval(() => {
    count++;
    document.getElementById("count").innerText = count;
  }, 3000);

  // QR refresh
  qrInterval = setInterval(() => {
    const newSession = Math.random().toString(36).substring(2,8).toUpperCase();
    document.getElementById("sessionId").innerText = newSession;
    document.getElementById("qrImage").src =
      `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${newSession}`;
  }, 5000);
}

function stopSession() {

  sessionActive = false;

  const btn = document.getElementById("attendanceBtn");
  btn.innerText = "Start Attendance";

  document.getElementById("status").innerText = "Inactive";

  clearInterval(attendanceInterval);
  clearInterval(qrInterval);
}

function logout() {
  localStorage.clear();
  window.location.href = "../Login/Frontend/index.html";
}
