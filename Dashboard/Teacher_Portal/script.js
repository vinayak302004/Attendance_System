// ===== Combined Attendance + Profile Features =====
document.addEventListener("DOMContentLoaded", () => {
  // Export to CSV functionality
  const exportBtn = document.querySelector(".export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportTableToCSV("attendance_report.csv");
    });
  }

  // Profile photo upload
  const uploadBtn = document.querySelector(".upload-btn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            const avatarImg = document.querySelector(".avatar img");
            if (avatarImg) {
              avatarImg.src = event.target.result;
            }
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    });
  }
});

// ===== Export Table to CSV =====
function exportTableToCSV(filename) {
  const rows = document.querySelectorAll("table tr");
  let csv = [];

  rows.forEach(row => {
    const cols = row.querySelectorAll("td, th");
    let rowData = [];
    cols.forEach(col => rowData.push(col.innerText));
    csv.push(rowData.join(","));
  });

  const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// ===== Attendance Session Management =====
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
  if (btn) {
    btn.innerText = "Stop Attendance";
  }
  document.getElementById("status").innerText = "Active";
  count = 0;
  document.getElementById("count").innerText = count;

  attendanceInterval = setInterval(() => {
    count++;
    document.getElementById("count").innerText = count;
  }, 3000);

  qrInterval = setInterval(() => {
    const newSession = Math.random().toString(36).substring(2,8).toUpperCase();
    document.getElementById("sessionId").innerText = newSession;
    document.getElementById("qrImage").src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${newSession}`;
  }, 5000);
}

function stopSession() {
  sessionActive = false;
  const btn = document.getElementById("attendanceBtn");
  if (btn) {
    btn.innerText = "Start Attendance";
  }
  document.getElementById("status").innerText = "Inactive";
  clearInterval(attendanceInterval);
  clearInterval(qrInterval);
}

// ===== Navigation to attendance.html =====
function goToAttendance() {
  window.location.href = "attendance.html";  // Same folder
  // OR use: window.location.href = "./attendance.html";
}

// ===== Logout Function =====
function logout() {
  localStorage.clear();
  window.location.href = "../Login/Frontend/index.html";
}
