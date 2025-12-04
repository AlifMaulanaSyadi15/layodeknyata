/* ================================
   BAGIAN 1: CAROUSEL (SLIDER)
   ================================ */
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');

// Cek apakah ada slide di halaman ini (biar gak error di halaman lain)
if (slides.length > 0) {
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        if(indicators[index]) indicators[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto slide every 4 seconds
    setInterval(nextSlide, 4000);

    // Click indicators to change slide
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Optional: Swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (carouselWrapper) {
        carouselWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
    }
}

/* ================================
   BAGIAN 2: DARK MODE (PENGATURAN)
   ================================ */

// 1. CEK STATUS SAAT LOAD (Jalan di SEMUA halaman)
// Kita sepakati kuncinya pakai 'theme' saja biar konsisten
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// 2. LOGIKA TOMBOL (Hanya jalan di halaman yang punya tombol #darkModeToggle)
const toggleBtn = document.getElementById('darkModeToggle');

// Cek dulu: "Apakah tombol ini ada di halaman yang sedang dibuka?"
if (toggleBtn) {
    
    // Sinkronisasi posisi tombol dengan status yang tersimpan
    // Kalau statusnya 'dark', pastikan tombolnya dalam posisi ON (tercentang)
    if (savedTheme === 'dark') {
        toggleBtn.checked = true;
    }

    // Kalau tombol diklik/digeser
    toggleBtn.addEventListener('change', function() {
        if (this.checked) {
            // Aktifkan Dark Mode
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark'); // Simpan ke memori
        } else {
            // Matikan Dark Mode
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light'); // Update memori
        }
    });
}