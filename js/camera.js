// camera.js
const video = document.getElementById("videoPreview");
const photoList = document.getElementById("photoList");
const counterText = document.getElementById("photoCounter");
const doneBtn = document.getElementById("doneBtn");
const countdownEl = document.getElementById("countdown");
const startBtn = document.getElementById("startCapture");
const timerSelect = document.getElementById("timerSelect");
const fileInput = document.getElementById("fileInput");
const zoomSlider = document.getElementById("zoomSlider");

let capturedPhotos = [];
let zoomLevel = 1; // Default zoom

// 1. Konfigurasi Template
const templateData = {
    custom: { total: 3, w: 340, h: 320 },
    sinchan4: { total: 4, w: 350, h: 233 },
    nota: { total: 3, w: 460, h: 260 },
    music: { total: 3, w: 240, h: 240 },
    nct: { total: 4, w: 400, h: 204 },
    pink_heart: { total: 4, w: 400, h: 204 },
    pupy: { total: 3, w: 420, h: 301 },
    Strip4: { total: 4, w: 249, h: 345 }
};

const selectedLayout = localStorage.getItem("selectedLayout") || "nct";
const config = templateData[selectedLayout];

// --- LOGIKA ZOOM ---
zoomSlider.addEventListener("input", (e) => {
    zoomLevel = parseFloat(e.target.value);
    // Terapkan zoom pada preview kamera (tetap pertahankan mirroring)
    video.style.transform = `scaleX(-1) scale(${zoomLevel})`;
});

// --- CORE LOGIC ---

async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false,
        });
        video.srcObject = stream;
    } catch (err) {
        alert("Akses kamera ditolak!");
    }
}

function captureFrame() {
    if (capturedPhotos.length >= config.total) return;

    video.style.filter = "brightness(3)";
    setTimeout(() => { video.style.filter = "brightness(1)"; }, 100);

    const canvas = document.createElement("canvas");
    canvas.width = config.w || 640;
    canvas.height = config.h || 480;
    const ctx = canvas.getContext("2d");

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    // Logika Pemotongan (Crop) Video dengan Zoom
    const videoRatio = video.videoWidth / video.videoHeight;
    const canvasRatio = canvas.width / canvas.height;
    let sx, sy, sw, sh;

    if (videoRatio > canvasRatio) {
        sh = video.videoHeight; 
        sw = video.videoHeight * canvasRatio;
    } else {
        sw = video.videoWidth; 
        sh = video.videoWidth / canvasRatio;
    }
    
    // Terapkan Zoom pada koordinat sumber (Crop lebih dalam)
    const zoomedSw = sw / zoomLevel;
    const zoomedSh = sh / zoomLevel;
    sx = (video.videoWidth - zoomedSw) / 2;
    sy = (video.videoHeight - zoomedSh) / 2;
    
    ctx.drawImage(video, sx, sy, zoomedSw, zoomedSh, 0, 0, canvas.width, canvas.height);

    capturedPhotos.push(canvas.toDataURL("image/png"));
    updateSidebarPreview();
}

function updateSidebarPreview() {
    photoList.innerHTML = "";
    capturedPhotos.forEach((data, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        const img = document.createElement("img");
        img.src = data;
        img.style.width = "120px";
        img.style.borderRadius = "12px";
        img.style.border = "3px solid var(--primary-blue)";
        
        const badge = document.createElement("div");
        badge.innerText = index + 1;
        badge.style.cssText = "position:absolute; top:-8px; left:-8px; background:var(--primary-blue); color:white; width:24px; height:24px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:800; font-size:12px;";

        wrapper.appendChild(img);
        wrapper.appendChild(badge);
        photoList.appendChild(wrapper);
    });

    counterText.innerText = `${capturedPhotos.length} / ${config.total}`;
    if (capturedPhotos.length >= config.total) {
        doneBtn.disabled = false;
        doneBtn.classList.replace("btn-outline", "btn-blue");
        localStorage.setItem("photos", JSON.stringify(capturedPhotos.slice(0, config.total)));
    }
}

async function startAutoCapture() {
    startBtn.disabled = true;
    capturedPhotos = [];
    updateSidebarPreview();
    const selectedTime = parseInt(timerSelect.value);

    for (let i = 0; i < config.total; i++) {
        for (let count = selectedTime; count > 0; count--) {
            countdownEl.innerText = count;
            await new Promise((res) => setTimeout(res, 1000));
        }
        countdownEl.innerText = "";
        captureFrame();
        await new Promise((res) => setTimeout(res, 500));
    }
    startBtn.disabled = false;
    startBtn.innerText = "RETAKE POSE";
}

fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (capturedPhotos.length < config.total) {
            const reader = new FileReader();
            reader.onload = (event) => {
                capturedPhotos.push(event.target.result);
                updateSidebarPreview();
            };
            reader.readAsDataURL(file);
        }
    });
});

startBtn.addEventListener("click", startAutoCapture);
doneBtn.addEventListener("click", () => {
    if (capturedPhotos.length >= config.total) window.location.href = "customize.html";
});

initCamera();