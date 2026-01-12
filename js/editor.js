const canvas = document.getElementById("photoStripCanvas");
const ctx = canvas.getContext("2d");
const photos = JSON.parse(localStorage.getItem("photos") || "[]");

// 1. Konfigurasi Template
const templateConfigs = {
  custom: {
    path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    canvasW: 400,
    canvasH: 1200,
    slots: [
      { x: 30, y: 50, w: 340, h: 320 },
      { x: 30, y: 420, w: 340, h: 320 },
      { x: 30, y: 790, w: 340, h: 320 },
    ],
  },
  sinchan1: {
    path: "assets/patterns/sinchan1.png",
    canvasW: 500,
    canvasH: 800,
    slots: [{ x: 24, y: 24, w: 449, h: 645 }],
  },
  sinchan4: {
    path: "assets/patterns/sinchan4.png",
    slots: [
      { x: 0, y: 32, w: 350, h: 233 },
      { x: 0, y: 288, w: 350, h: 202 },
      { x: 0, y: 507, w: 350, h: 233 },
      { x: 0, y: 725, w: 350, h: 233 },
    ],
  },
  nota: {
    path: "assets/patterns/nota.png",
    slots: [
      { x: 40, y: 75, w: 360, h: 197, rotate: -6 },
      { x: 38, y: 363, w: 460, h: 260, rotate: 0 },
      { x: 87, y: 700, w: 460, h: 260, rotate: -11 },
    ],
  },
  music: {
    path: "assets/patterns/music.png",
    slots: [
      { x: 183, y: 51, w: 240, h: 240, rotate: -14 },
      { x: 319, y: 333, w: 240, h: 240, rotate: 20 },
      { x: 193, y: 660, w: 240, h: 240, rotate: -13 },
    ],
  },
  nct: {
    path: "assets/patterns/photostrips.png",
    slots: [
      { x: -3, y: 43, w: 400, h: 204 },
      { x: -5, y: 276, w: 400, h: 204 },
      { x: -5, y: 512, w: 400, h: 204 },
      { x: -5, y: 747, w: 400, h: 204 },
    ],
  },
  pink_heart: {
    path: "assets/patterns/cutepink.png",
    slots: [
      { x: -5, y: 24, w: 400, h: 204 },
      { x: -5, y: 251, w: 400, h: 204 },
      { x: -5, y: 477, w: 400, h: 204 },
      { x: -5, y: 704, w: 400, h: 204 },
    ],
  },
  pupy: {
    path: "assets/patterns/pupy.png",
    slots: [
      { x: -5, y: 24, w: 420, h: 301 },
      { x: -5, y: 331, w: 420, h: 301 },
      { x: -5, y: 634, w: 420, h: 301 },
    ],
  },
  Strip4: {
    path: "assets/patterns/Strip4.png",
    canvasW: 500,
    canvasH: 800,
    slots: [
      { x: 24, y: 24, w: 249, h: 345 },
      { x: 270, y: 24, w: 249, h: 345 },
      { x: 24, y: 403, w: 249, h: 345 },
      { x: 270, y: 403, w: 249, h: 345 },
    ],
  },
};

const colorOptions = [
  "#ffffff",
  "#000000",
  "#ffb3ba",
  "#baffc9",
  "#bae1ff",
  "#ffffba",
  "#e2b3ff",
  "#ffdfba",
  "#3d3d3d",
  "#4da3ff",
];

const stickerPaths = [
  "assets/Perintilan/anjing.png",
  "assets/Perintilan/domba.png",
  "assets/Perintilan/CSS.png",
  "assets/Perintilan/JS3d.png",
  "assets/Perintilan/PY.png",
  "assets/Perintilan/tagline.png",
  "assets/Perintilan/cari.png",
  "assets/Perintilan/bintang5.png",
  "assets/Perintilan/heboh2.png",
  "assets/Perintilan/pin.png",
  "assets/Perintilan/pita2.png",
  "assets/Perintilan/panahpink.png",
  "assets/Perintilan/lagu.png",
  "assets/Perintilan/panahrol.png",
  "assets/Perintilan/biru.png",
  "assets/Perintilan/pita.png",
  "assets/Perintilan/bintang1.png",
  "assets/Perintilan/heboh.png",
  "assets/Perintilan/merona.png",
  "assets/Perintilan/awan.png",
  "assets/Perintilan/telinga.png",
  "assets/Perintilan/bintang2.png",
  "assets/Perintilan/dinobesaer.png",
  "assets/Perintilan/dinokecil.png",
  "assets/Perintilan/gambar bintang.png",
];

// State Global
let activeStickers = [];
let isDragging = false;
let isRotating = false;
let draggedSticker = null;
let selectedSticker = null;
let offset = { x: 0, y: 0 };
let selectedLayoutId = localStorage.getItem("selectedLayout") || "nct";
let activeColor = "#ffffff";
let useOverlay = true;

// --- INITIALIZATION ---
function initEditor() {
  const grid = document.getElementById("templateGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const toggleDiv = document.createElement("div");
  toggleDiv.className = "template-circle";
  toggleDiv.innerHTML =
    '<i class="fa-solid fa-ban" style="margin-top:10px"></i>';
  toggleDiv.onclick = () => {
    useOverlay = !useOverlay;
    renderStrip();
  };
  grid.appendChild(toggleDiv);

  colorOptions.forEach((color) => {
    const div = document.createElement("div");
    div.className = "template-circle";
    div.style.backgroundColor = color;
    div.onclick = () => {
      activeColor = color;
      renderStrip();
    };
    grid.appendChild(div);
  });
  renderStrip();
}

function initStickerGrid() {
  const grid = document.getElementById("stickerGrid");
  if (!grid) return;
  stickerPaths.forEach((path) => {
    const div = document.createElement("div");
    div.className = "sticker-item";
    div.style.backgroundImage = `url('${path}')`;
    div.onclick = () => addStickerToCanvas(path);
    grid.appendChild(div);
  });
}

async function addStickerToCanvas(path) {
  const img = await loadImage(path);
  const newSticker = {
    img,
    x: canvas.width / 2 - 50,
    y: canvas.height / 2 - 50,
    w: 100,
    h: 100,
    rotate: 0,
  };
  activeStickers.push(newSticker);
  selectedSticker = newSticker;
  renderStrip();
}

// --- RENDER LOGIC ---
async function renderStrip() {
  const config = templateConfigs[selectedLayoutId];
  const bgImg = await loadImage(config.path);
  canvas.width = config.canvasW || bgImg.naturalWidth;
  canvas.height = config.canvasH || bgImg.naturalHeight;

  ctx.fillStyle = activeColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < config.slots.length; i++) {
    if (photos[i]) {
      const slot = config.slots[i];
      const img = await loadImage(photos[i]);
      ctx.save();
      if (slot.rotate) {
        ctx.translate(slot.x + slot.w / 2, slot.y + slot.h / 2);
        ctx.rotate((slot.rotate * Math.PI) / 180);
        drawImageCover(ctx, img, -slot.w / 2, -slot.h / 2, slot.w, slot.h);
      } else {
        drawImageCover(ctx, img, slot.x, slot.y, slot.w, slot.h);
      }
      ctx.restore();
    }
  }

  if (useOverlay) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Gambar Stiker & Rotation Handle
  activeStickers.forEach((s) => {
    ctx.save();
    ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
    ctx.rotate((s.rotate * Math.PI) / 180);
    ctx.drawImage(s.img, -s.w / 2, -s.h / 2, s.w, s.h);

    if (s === selectedSticker) {
      ctx.strokeStyle = "#4da3ff";
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(-s.w / 2 - 2, -s.h / 2 - 2, s.w + 4, s.h + 4);

      // Draw Rotation Handle (Gagang Putar)
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(0, -s.h / 2);
      ctx.lineTo(0, -s.h / 2 - 30);
      ctx.stroke();
      ctx.fillStyle = "#4da3ff";
      ctx.beginPath();
      ctx.arc(0, -s.h / 2 - 30, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  renderFooterText();
}

// --- MOUSE EVENTS ---
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  let found = false;
  for (let i = activeStickers.length - 1; i >= 0; i--) {
    const s = activeStickers[i];
    const cx = s.x + s.w / 2;
    const cy = s.y + s.h / 2;
    const rad = (s.rotate * Math.PI) / 180;

    // Hitung posisi handle dunia
    const hx = cx + 0 * Math.cos(rad) - (-s.h / 2 - 30) * Math.sin(rad);
    const hy = cy + 0 * Math.sin(rad) + (-s.h / 2 - 30) * Math.cos(rad);

    // Cek klik di handle rotasi
    if (Math.hypot(mx - hx, my - hy) < 15) {
      isRotating = true;
      draggedSticker = s;
      found = true;
      break;
    }
    // Cek klik di badan stiker
    if (mx >= s.x && mx <= s.x + s.w && my >= s.y && my <= s.y + s.h) {
      isDragging = true;
      draggedSticker = s;
      selectedSticker = s;
      offset.x = mx - s.x;
      offset.y = my - s.y;
      found = true;
      break;
    }
  }
  if (!found) selectedSticker = null;
  renderStrip();
});

window.addEventListener("mousemove", (e) => {
  if (!draggedSticker) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  if (isDragging) {
    draggedSticker.x = mx - offset.x;
    draggedSticker.y = my - offset.y;
  } else if (isRotating) {
    const cx = draggedSticker.x + draggedSticker.w / 2;
    const cy = draggedSticker.y + draggedSticker.h / 2;
    const angle = Math.atan2(my - cy, mx - cx);
    draggedSticker.rotate = (angle * 180) / Math.PI + 90; // +90 karena handle di atas
  }
  renderStrip();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  isRotating = false;
  draggedSticker = null;
});

// --- HELPERS ---
function resizeSelected(m) {
  if (selectedSticker) {
    selectedSticker.w *= m;
    selectedSticker.h *= m;
    renderStrip();
  }
}
function deleteSelected() {
  if (selectedSticker) {
    activeStickers = activeStickers.filter((s) => s !== selectedSticker);
    selectedSticker = null;
    renderStrip();
  }
}
function drawImageCover(ctx, img, x, y, w, h) {
  const r = img.width / img.height;
  const sr = w / h;
  let sw, sh, sx, sy;
  if (r > sr) {
    sh = img.height;
    sw = img.height * sr;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = img.width / sr;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
function renderFooterText() {
  /* Logic Footer Text Anda */
}
function loadImage(src) {
  return new Promise((res) => {
    const img = new Image();
    img.src = src;
    img.onload = () => res(img);
  });
}
function downloadPhoto() {
  const link = document.createElement("a");
  link.download = `photo-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}
function printPhoto() {
  /* Logic Print Anda */
}

initEditor();
initStickerGrid();
