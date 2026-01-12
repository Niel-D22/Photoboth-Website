// Global State Management
const PhotoBooth = {
    state: {
        selectedLayout: null,
        capturedPhotos: [],
        currentFrame: 'white',
        appliedStickers: [],
    },

    saveSession() {
        localStorage.setItem('pb_session', JSON.stringify(this.state));
    },

    loadSession() {
        const saved = localStorage.getItem('pb_session');
        if (saved) this.state = JSON.parse(saved);
    },

    resetSession() {
        localStorage.removeItem('pb_session');
        window.location.href = 'index.html';
    }
};
function updateCountdown() {
    // 1. Tentukan tanggal target (14 Februari 2026)
    const targetDate = new Date("February 14, 2026 00:00:00").getTime();
    
    // Update setiap 1 detik
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // 2. Perhitungan waktu untuk Hari, Jam, Menit, dan Detik
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 3. Format angka agar selalu dua digit (misal: 09 bukannya 9)
        const format = (num) => num.toString().padStart(2, '0');

        // 4. Tampilkan hasil ke elemen HTML
        const timerElement = document.getElementById("valentineTimer");
        if (timerElement) {
            timerElement.innerText = `${format(days)} : ${format(hours)} : ${format(minutes)} : ${format(seconds)}`;
        }

        // 5. Jika waktu habis
        if (distance < 0) {
            clearInterval(timerInterval);
            timerElement.innerText = "HAPPY VALENTINE'S DAY!";
        }
    }, 1000);
}

// Jalankan fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", updateCountdown);