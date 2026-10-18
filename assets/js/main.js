import { executeQuery, initDb } from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar Banco de Dados se não existir
    try {
        await initDb();
    } catch (e) {
        console.error("Falha ao iniciar DB:", e);
    }
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('nav');
    const backToTop = document.getElementById('backToTop');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Hamburguer animation
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu on click link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            // reset toggle animation
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Modal Logic
    const bookingModal = document.getElementById('bookingModal');
    const openBookingBtns = document.querySelectorAll('.open-booking');
    const closeModalBtn = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('bookingForm');

    const openModal = () => {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeModal = () => {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    };

    if (openBookingBtns) {
        openBookingBtns.forEach(btn => btn.addEventListener('click', openModal));
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });

    // Booking Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;

            // Format Date (YYYY-MM-DD to DD/MM/YYYY)
            const dateParts = date.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

            // Create Message
            const message = `Olá! Gostaria de agendar um horário:
            
👤 *Nome:* ${name}
💅 *Serviço:* ${service}
📅 *Data:* ${formattedDate}
⏰ *Horário:* ${time}

Aguardo confirmação!`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/5519933008727?text=${encodedMessage}`;

            // Salvar no Banco de Dados (Turso)
            try {
                await executeQuery(
                    "INSERT INTO bookings (name, service, date, time, phone, status) VALUES (?, ?, ?, ?, ?, 'pending')",
                    [name, service, date, time, whatsapp]
                );
                console.log("Agendamento salvo no Turso!");
            } catch (err) {
                console.error("Erro ao salvar no banco:", err);
                alert("Erro ao salvar agendamento, mas abriremos o WhatsApp mesmo assim.");
            }

            // Redirect
            window.open(whatsappUrl, '_blank');
            closeModal();
            bookingForm.reset();
        });
    }

    // Simple reveal animation on scroll
    const revealElements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-image');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.9;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    setTimeout(revealOnScroll, 100); // Trigger once on load
});
