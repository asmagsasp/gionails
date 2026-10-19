import { executeQuery, getSalonBySlug, getServicesBySalon, getGalleryBySalon } from './db.js';

let currentSalon = null;

// Função global de Scroll Reveal dinâmica
export function revealOnScroll() {
    const revealElements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-image');
    const triggerBottom = window.innerHeight * 0.95;
    revealElements.forEach(el => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop < triggerBottom) {
            el.classList.add('visible');
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Identificar qual salão carregar pela URL (ex: ?salon=gionails ou /s/gionails)
    const urlParams = new URLSearchParams(window.location.search);
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    let slug = urlParams.get('salon');
    if (!slug && pathSegments[0] === 's' && pathSegments[1]) {
        slug = pathSegments[1];
    }
    if (!slug) slug = 'gionails'; // Salão padrão

    try {
        currentSalon = await getSalonBySlug(slug);
        if (!currentSalon && slug !== 'gionails') {
            currentSalon = await getSalonBySlug('gionails');
        }
        if (currentSalon) {
            await renderSalonData(currentSalon);
        }
    } catch (err) {
        console.error("Erro ao carregar dados do salão:", err);
    }

    // 2. Comportamentos de UI (Navbar, Scroll, Menu)
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('nav');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        revealOnScroll();
    }, { passive: true });

    window.addEventListener('resize', revealOnScroll, { passive: true });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

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
    }

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) {
                const spans = navToggle.querySelectorAll('span');
                if (spans.length >= 3) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });

    // 3. Modal de Agendamento
    const bookingModal = document.getElementById('bookingModal');
    const openBookingBtns = document.querySelectorAll('.open-booking');
    const closeModalBtn = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('bookingForm');

    const openModal = () => {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (openBookingBtns) {
        openBookingBtns.forEach(btn => btn.addEventListener('click', openModal));
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });

    // 4. Envio do Agendamento
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;

            const dateParts = date.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

            const salonName = currentSalon ? currentSalon.name : 'Gio Nails';
            const message = `Olá ${salonName}! Gostaria de agendar um horário:
            
👤 *Nome:* ${name}
💅 *Serviço:* ${service}
📅 *Data:* ${formattedDate}
⏰ *Horário:* ${time}

Aguardo confirmação!`;

            const cleanSalonPhone = currentSalon && currentSalon.phone ? currentSalon.phone.replace(/\D/g, '') : '5519999995149';
            const finalSalonPhone = cleanSalonPhone.startsWith('55') ? cleanSalonPhone : '55' + cleanSalonPhone;
            const whatsappUrl = `https://wa.me/${finalSalonPhone}?text=${encodeURIComponent(message)}`;

            // Salvar no Turso associado ao salão atual
            try {
                const salonId = currentSalon ? currentSalon.id : 1;
                await executeQuery(
                    "INSERT INTO bookings (salon_id, name, service, date, time, phone, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
                    [salonId, name, service, date, time, whatsapp]
                );
            } catch (err) {
                console.error("Erro ao salvar no banco:", err);
            }

            window.open(whatsappUrl, '_blank');
            closeModal();
            bookingForm.reset();
        });
    }

    // Scroll reveal inicial
    revealOnScroll();
    setTimeout(revealOnScroll, 100);
});

async function renderSalonData(salon) {
    // 1. Título e Cores
    document.title = `${salon.name} | Arte & Sofisticação`;
    if (salon.primary_color) {
        document.documentElement.style.setProperty('--primary', salon.primary_color);
    }

    // 2. Logo e Textos Principais
    const logoEl = document.getElementById('salonLogo');
    if (logoEl && salon.name) {
        const parts = salon.name.split(' ');
        logoEl.innerHTML = `${parts[0]}<span>${parts.slice(1).join(' ') || ''}</span>`;
    }

    if (salon.subtitle) {
        const sub = document.getElementById('heroSubtitle');
        if (sub) sub.innerText = salon.subtitle;
    }
    if (salon.tagline) {
        const tag = document.getElementById('heroTagline');
        if (tag) tag.innerText = salon.tagline;
    }

    // 3. Imagem Hero
    if (salon.hero_image) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.background = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('${salon.hero_image}') center/cover`;
        }
    }

    // 4. Seção Sobre
    if (salon.about_image) {
        const aboutImg = document.getElementById('aboutImage');
        if (aboutImg) aboutImg.src = salon.about_image;
    }
    if (salon.bio_tag) {
        const bt = document.getElementById('bioTag');
        if (bt) bt.innerText = salon.bio_tag;
    }
    if (salon.bio_title) {
        const bt = document.getElementById('bioTitle');
        if (bt) bt.innerText = salon.bio_title;
    }
    if (salon.bio_text1) {
        const b1 = document.getElementById('bioText1');
        if (b1) b1.innerText = salon.bio_text1;
    }
    if (salon.bio_text2) {
        const b2 = document.getElementById('bioText2');
        if (b2) b2.innerText = salon.bio_text2;
    }
    if (salon.stat1_num) {
        const s1 = document.getElementById('stat1Num');
        if (s1) s1.innerText = salon.stat1_num;
    }
    if (salon.stat1_text) {
        const st1 = document.getElementById('stat1Text');
        if (st1) st1.innerText = salon.stat1_text;
    }
    if (salon.stat2_num) {
        const s2 = document.getElementById('stat2Num');
        if (s2) s2.innerText = salon.stat2_num;
    }
    if (salon.stat2_text) {
        const st2 = document.getElementById('stat2Text');
        if (st2) st2.innerText = salon.stat2_text;
    }

    // 5. Contato & Redes Sociais
    if (salon.phone) {
        const clean = salon.phone.replace(/\D/g, '');
        const finalPhone = clean.startsWith('55') ? clean : '55' + clean;
        const formatted = clean.length >= 10 ? `(${clean.slice(-11, -9)}) ${clean.slice(-9, -4)}-${clean.slice(-4)}` : salon.phone;

        const wLink = document.getElementById('contactWhatsappLink');
        if (wLink) wLink.href = `https://wa.me/${finalPhone}`;
        const wText = document.getElementById('contactWhatsappText');
        if (wText) wText.innerText = formatted;
    }

    if (salon.instagram) {
        const cleanInsta = salon.instagram.replace('@', '');
        const iLink = document.getElementById('contactInstagramLink');
        if (iLink) iLink.href = `https://www.instagram.com/${cleanInsta}`;
        const iText = document.getElementById('contactInstagramText');
        if (iText) iText.innerText = `@${cleanInsta}`;
    }

    if (salon.address) {
        const addrEl = document.getElementById('contactAddress');
        if (addrEl) addrEl.innerText = salon.address;
    }
    if (salon.maps_query) {
        const mapLink = document.getElementById('contactMapsLink');
        if (mapLink) mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.maps_query)}`;
    }

    // 6. Carregar Serviços e Galeria em Paralelo para Velocidade Máxima
    try {
        const [services, photos] = await Promise.all([
            getServicesBySalon(salon.id).catch(e => { console.error("Erro serviços:", e); return []; }),
            getGalleryBySalon(salon.id).catch(e => { console.error("Erro galeria:", e); return []; })
        ]);

        // Renderizar Serviços
        if (services && services.length > 0) {
            const grid = document.getElementById('servicesGrid');
            const select = document.getElementById('service');
            if (grid) {
                grid.innerHTML = '';
                services.forEach((s, idx) => {
                    const card = document.createElement('div');
                    card.className = `service-card ${idx === 1 ? 'active' : ''} visible`;
                    card.innerHTML = `
                        <i class="${s.icon || 'fas fa-gem'}"></i>
                        <h3>${s.name}</h3>
                        <p>${s.description || ''}</p>
                        ${s.price ? `<span class="service-price" style="display:inline-block; margin-top:0.8rem; font-weight:700; color:var(--primary); font-size:1.1rem;">${s.price}</span>` : ''}
                    `;
                    grid.appendChild(card);
                });
            }

            if (select) {
                select.innerHTML = '<option value="" disabled selected>Selecione um serviço</option>';
                services.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.name;
                    opt.textContent = `${s.name}${s.price ? ` (${s.price})` : ''}`;
                    select.appendChild(opt);
                });
            }
        }

        // Renderizar Galeria
        if (photos && photos.length > 0) {
            const galleryGrid = document.getElementById('galleryGrid');
            if (galleryGrid) {
                galleryGrid.innerHTML = '';
                photos.forEach(p => {
                    const item = document.createElement('div');
                    item.className = 'portfolio-item visible';
                    item.innerHTML = `<img src="${p.image_url}" alt="${p.title || 'Trabalho'}" loading="lazy">`;
                    galleryGrid.appendChild(item);
                });
            }
        }

        // Garantir que animações de reveal sejam aplicadas imediatamente aos novos cards
        revealOnScroll();
    } catch (e) {
        console.error("Erro ao renderizar serviços/galeria:", e);
    }
}

