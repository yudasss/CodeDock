document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ANIMASI REVEAL (Premium Scroll Effect) ---
    const animateElements = document.querySelectorAll('[data-animate]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Memberikan delay stagger untuk elemen yang muncul bersamaan
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 120);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animateElements.forEach(el => revealObserver.observe(el));

    // --- 2. NAVBAR SCROLL EFFECT & MOBILE MENU ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Menambah bayangan dan mengecilkan padding saat scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.style.padding = '0.8rem 0';
            navbar.style.boxShadow = 'var(--shadow-premium)';
        } else {
            navbar.style.padding = '1.2rem 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // Toggle menu mobile menggunakan class 'active' dari CSS
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon font-awesome (bars ke times)
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // --- 3. CEK STATUS LOGIN (AUTH CHECK) ---
    checkAuth();

    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('codedock_user'));
        const authBtn = document.getElementById('auth-btn');

        if (authBtn) {
            const isInMateri = window.location.pathname.includes('/materi/');
            const profileLink = isInMateri ? '../profile.html' : 'profile.html';
            const loginLink = isInMateri ? '../login.html' : 'login.html';

            if (user) {
                authBtn.innerHTML = '<i class="fas fa-user-circle"></i> Dashboard';
                authBtn.href = profileLink;
                authBtn.classList.add('logged-in');
            } else {
                authBtn.innerHTML = 'Mulai Belajar';
                authBtn.href = loginLink;
            }
        }
    }

    // --- 4. FITUR INTERAKTIF: SHOW/HIDE CODE (Materi) ---
    const toggleButtons = document.querySelectorAll('.toggle-code-btn');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.bento-card');
            const codeWindow = card.querySelector('.code-window');
            
            if (codeWindow) {
                if (codeWindow.style.display === 'none' || codeWindow.style.display === '') {
                    codeWindow.style.display = 'block';
                    this.innerHTML = '<i class="fas fa-eye-slash"></i> Sembunyikan Kode';
                } else {
                    codeWindow.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-code"></i> Lihat Kode';
                }
            }
        });
    });

    // --- 5. LOGIC TANDAI SELESAI (Gamification) ---
    const markBtn = document.getElementById('mark-complete');
    if (markBtn) {
        const user = JSON.parse(localStorage.getItem('codedock_user'));
        const currentBab = markBtn.dataset.bab;

        // Cek status awal saat halaman dimuat
        if (user && user.completedChapters.includes(currentBab)) {
            setAsCompleted(markBtn);
        }

        markBtn.addEventListener('click', function() {
            if (!user) {
                alert("Silakan login terlebih dahulu untuk menyimpan progress belajar Anda!");
                const isInMateri = window.location.pathname.includes('/materi/');
                window.location.href = isInMateri ? '../login.html' : 'login.html';
                return;
            }

            if (!user.completedChapters.includes(currentBab)) {
                user.completedChapters.push(currentBab);
                user.xp += 50;
                
                // Logic Level Up (Per 100 XP)
                user.level = Math.floor(user.xp / 100) + 1;

                localStorage.setItem('codedock_user', JSON.stringify(user));
                
                // Feedback visual premium
                this.innerHTML = '<i class="fas fa-sparkles"></i> +50 XP Berhasil!';
                this.style.backgroundColor = '#059669'; // Emerald 600

                setTimeout(() => {
                    setAsCompleted(this);
                    alert(`Selamat! Anda telah menyelesaikan ${currentBab}. Teruslah berkarya!`);
                }, 1000);
            }
        });
    }

    function setAsCompleted(btn) {
        btn.innerHTML = '<i class="fas fa-check-double"></i> Materi Selesai';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
        btn.disabled = true;
        btn.style.cursor = 'default';
        btn.style.opacity = '0.7';
    }

});