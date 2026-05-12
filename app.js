const CURRENT_VERSION = 1;
const APK_URL =
  "https://github.com/reinkdesigns/tripsheet-app/releases/download/v1/Tripsheet.apk";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const tripNumber = document.getElementById("tripNumber");
const truckNumber = document.getElementById("truckNumber");
const trailerNumber = document.getElementById("trailerNumber");
const cusName = document.getElementById("cusName");
const orginState = document.getElementById("orginState");
const destState = document.getElementById("destState");
const todayDate = document.getElementById("todayDate");
const deliveryDate = document.getElementById("deliveryDate");
const lumperFee = document.getElementById("lumperFee");
const downloadBtn = document.getElementById("downloadBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveTruckBtn = document.getElementById("saveTruckBtn");
const notesBtn = document.getElementById("notesBtn");
const notesModal = document.getElementById("notesModal");
const closeNotesBtn = document.getElementById("closeNotesBtn");
const clearNotesBtn = document.getElementById("clearNotesBtn");
const saveNotesBtn = document.getElementById("saveNotesBtn");
let textX = 0;

document.addEventListener("deviceready", function () {
  console.log("Running in Cordova app ✔");
  checkForUpdate();
  window.IS_CORDOVA = true;
});

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("apkDownloadBtn");
  const isCordova = typeof cordova !== "undefined";
  document.getElementById("versionLabel").textContent = "v" + CURRENT_VERSION;

  if (!isCordova) {
    btn.style.display = "block"; // show in browser
  }

  btn.addEventListener("click", function () {
    window.location.href = APK_URL;
  });
});

window.addEventListener("load", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("todayDate").value = today;
});

window.addEventListener("load", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("deliveryDate").value = today;
});

// Open/close modal
settingsBtn.addEventListener(
  "click",
  () => (closeAllModals(), (settingsModal.style.display = "block")),
);
closeSettingsBtn.addEventListener("click", () => closeAllModals());

notesBtn.addEventListener(
  "click",
  () => (closeAllModals(), (notesModal.style.display = "block")),
);
closeNotesBtn.addEventListener("click", () => closeAllModals());

window.addEventListener("load", () => {
  const savedTruck = localStorage.getItem("truckNumber");
  const savedDOneName = localStorage.getItem("dOneName");
  const savedDOneCode = localStorage.getItem("dOneCode");
  const savedDTwoName = localStorage.getItem("dTwoName");
  const savedDTwoCode = localStorage.getItem("dTwoCode");

  const savedPickUpTimeNotes = localStorage.getItem("pickUpTimeNotes");
  const savedPickUpNotes = localStorage.getItem("pickUpNotes");
  const savedDropOffTimeNotes = localStorage.getItem("dropOffTimeNotes");
  const savedDropOffNotes = localStorage.getItem("dropOffNotes");

  if (savedTruck) truckNumber.value = savedTruck;
  if (savedDOneName) dOneName.value = savedDOneName;
  if (savedDOneCode) dOneCode.value = savedDOneCode;
  if (savedDTwoName) dTwoName.value = savedDTwoName;
  if (savedDTwoCode) dTwoCode.value = savedDTwoCode;

  if (savedPickUpTimeNotes) pickUpTimeNotes.value = savedPickUpTimeNotes;

  if (savedPickUpNotes) pickUpNotes.value = savedPickUpNotes;

  if (savedDropOffTimeNotes) dropOffTimeNotes.value = savedDropOffTimeNotes;

  if (savedDropOffNotes) dropOffNotes.value = savedDropOffNotes;
});

// Save truck number
saveTruckBtn.addEventListener("click", () => {
  // Clean & save each input
  localStorage.setItem("truckNumber", truckNumber.value.toUpperCase());
  localStorage.setItem("dOneName", dOneName.value);
  localStorage.setItem("dOneCode", dOneCode.value);
  localStorage.setItem("dTwoName", dTwoName.value);
  localStorage.setItem("dTwoCode", dTwoCode.value);
  settingsModal.style.display = "none";
});

saveNotesBtn.addEventListener("click", () => {
  localStorage.setItem("pickUpTimeNotes", pickUpTimeNotes.value);
  localStorage.setItem("pickUpNotes", pickUpNotes.value);
  localStorage.setItem("dropOffTimeNotes", dropOffTimeNotes.value);
  localStorage.setItem("dropOffNotes", dropOffNotes.value);
  notesModal.style.display = "none";
});

clearNotesBtn.addEventListener("click", () => {
  pickUpTimeNotes.value = "";
  pickUpNotes.value = "";
  dropOffTimeNotes.value = "";
  dropOffNotes.value = "";
  localStorage.removeItem("pickUpTimeNotes");
  localStorage.removeItem("pickUpNotes");
  localStorage.removeItem("dropOffTimeNotes");
  localStorage.removeItem("dropOffNotes");
});

const img = new Image();
img.src = "BlankSheet.png"; // your image file

const scale = Math.min(
  window.innerWidth / img.width,
  window.innerHeight / img.height,
  1, // never scale up beyond original size
);
redrawImageWithText(scale);

// Draw image when loaded
img.onload = function () {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
//debug start location grabber
canvas.addEventListener("mousemove", function (event) {
  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  console.log(`X: ${Math.floor(x)}, Y: ${Math.floor(y)}`);
});

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw background image
  ctx.drawImage(img, 0, 0);
}
function redrawImageWithText(scale = 1) {
  // Full-res size for export
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Scale the canvas context
  ctx.save();
  ctx.scale(scale, scale);

  // Draw background image at original size
  ctx.drawImage(img, 0, 0);

  // --- Draw text (same coordinates as before) ---
  ctx.font = "40px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  let textX = 528;
  let startPoint = 572;

  textX = 528;
  for (let i = 0; i < truckNumber.value.length; i++) {
    ctx.fillText(truckNumber.value[i].toUpperCase(), textX, startPoint);

    ctx.beginPath();
    if (truckNumber.value[i] == 0) {
      tripNudge = startPoint + 440 + 44;
    } else if (isNaN(truckNumber.value[i])) {
      tripNudge = startPoint + 44;
    } else {
      tripNudge = startPoint + truckNumber.value[i] * 44 + 44; //nudge amount
    }
    ctx.arc(textX, tripNudge, 18, 0, Math.PI * 2); // 10px radius
    textX += 48.5;
    ctx.fill();
  }

  textX = 972;
  for (let i = 0; i < tripNumber.value.length; i++) {
    ctx.fillText(tripNumber.value[i], textX, startPoint);
    ctx.beginPath();
    if (tripNumber.value[i] == 0) {
      tripNudge = startPoint + 440;
    } else {
      tripNudge = startPoint + tripNumber.value[i] * 44; //nudge amount
    }
    ctx.arc(textX, tripNudge, 18, 0, Math.PI * 2); // 10px radius
    textX += 47;
    ctx.fill();
  }

  ctx.textAlign = "left";
  ctx.fillText(dOneName.value, 266, 1155);
  ctx.fillText(dOneCode.value.toUpperCase(), 257, 1216);
  ctx.fillText(dTwoName.value, 286, 1281);
  ctx.fillText(dTwoCode.value.toUpperCase(), 280, 1342);

  // Dates
  if (todayDate.value) {
    const [year, month, day] = todayDate.value.split(/[-/]/);
    ctx.fillText(`${month}/${day}/${year}`, 941, 1152);
  }
  if (deliveryDate.value) {
    const [year, month, day] = deliveryDate.value.split(/[-/]/);
    ctx.fillText(`${month}/${day}/${year}`, 1058, 1278);
  }

  ctx.fillText(orginState.value, 231, 1435);
  ctx.fillText(destState.value, 1020, 1435);
  ctx.fillText(trailerNumber.value, 990, 1217);
  ctx.fillText(cusName.value, 1089, 1341);
  ctx.font = "25px Arial";
  ctx.fillText(lumperFee.value, 428, 1660);
  ctx.rotate(Math.PI / 2); // rotate 90 degrees
  let noteHorz = -1600;
  let noteVert = 430;
  const horzMove = 35;

  if (pickUpTimeNotes.value.trim() !== "") {
    ctx.fillText("Pick-up Time: " + pickUpTimeNotes.value, noteVert, noteHorz);
    noteHorz += horzMove;
  }
  if (pickUpNotes.value.trim() !== "") {
    ctx.fillText(pickUpNotes.value, noteVert, noteHorz);
    noteHorz += horzMove;
  }
  if (dropOffTimeNotes.value.trim() !== "") {
    ctx.fillText(
      "Drop-off Time: " + dropOffTimeNotes.value,
      noteVert,
      noteHorz,
    );
    noteHorz += horzMove;
  }
  if (dropOffNotes.value.trim() !== "") {
    ctx.fillText(dropOffNotes.value, noteVert, noteHorz);
  }

  ctx.restore(); // undo scaling
}

//generate tripsheet and show preview
downloadBtn.addEventListener("click", function () {
  redrawImageWithText(1);
  const previewImg = document.getElementById("previewImg");
  if (previewImg) {
    previewImg.src = canvas.toDataURL("image/png");
    previewImg.style.display = "block";
  }
});

// //debug mouse posistion
// const previewImg = document.getElementById("previewImg");

// previewImg.addEventListener("mousemove", function (event) {
//   const rect = previewImg.getBoundingClientRect();

//   // Position on displayed image
//   const displayX = event.clientX - rect.left;
//   const displayY = event.clientY - rect.top;

//   // Convert to REAL canvas coordinates
//   const scaleX = canvas.width / rect.width;
//   const scaleY = canvas.height / rect.height;

//   const realX = displayX * scaleX;
//   const realY = displayY * scaleY;

//   console.log(`Canvas X: ${Math.floor(realX)}, Canvas Y: ${Math.floor(realY)}`);
// });

function closeAllModals() {
  const modals = document.querySelectorAll(".modalWindow");

  modals.forEach((modal) => {
    modal.style.display = "none";
  });
}

function checkForUpdate() {
  fetch(
    "https://raw.githubusercontent.com/reinkdesigns/tripsheet-app/main/version.json",
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Version file loaded:", data);
      if (data.version > CURRENT_VERSION) {
        alert("Update available: v" + data.version);
        downloadUpdate(data.apkUrl);
      }
    })
    .catch((err) => {
      console.error("Update check failed", err);});
}

function downloadUpdate(url) {
  cordova.InAppBrowser.open(url, "_system");
}
