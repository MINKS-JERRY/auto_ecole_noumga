// Enhanced navigation mobile toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (hamburger.classList.contains('active')) {
            bar.style.transform = index === 1 ? 'rotate(45deg)' : index === 0 ? 'rotate(-45deg) translateY(6px)' : 'rotate(45deg) translateY(-6px)';
        } else {
            bar.style.transform = 'none';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
        });
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
        });
    }
});

// Add mouse trail effect
let mouseTrail = [];
document.addEventListener('mousemove', (e) => {
    mouseTrail.push({x: e.clientX, y: e.clientY, time: Date.now()});
    
    // Keep only recent trail points
    mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 1000);
    
    // Create trail effect on hero section
    if (e.target.closest('.hero')) {
        createTrailDot(e.clientX, e.clientY);
    }
});

function createTrailDot(x, y) {
    const dot = document.createElement('div');
    dot.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: rgba(255,255,255,0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: trailFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(dot);
    
    setTimeout(() => {
        if (dot.parentNode) {
            dot.parentNode.removeChild(dot);
        }
    }, 1000);
}

// Enhanced mobile menu with animations
document.querySelectorAll('.nav-link').forEach((n, index) => {
    n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
    
    // Add staggered animation to menu items
    n.style.animationDelay = `${index * 0.1}s`;
    
    // Add hover effects
    n.addEventListener('mouseenter', () => {
        n.style.transform = 'translateX(10px)';
        n.style.color = '#e67e22';
    });
    
    n.addEventListener('mouseleave', () => {
        n.style.transform = 'translateX(0)';
        n.style.color = '#333';
    });
});

// Enhanced smooth scrolling with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Add ripple effect to clicked link
            createRipple(this, e);
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Ripple effect function
function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Enhanced form submission with animations
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Enhanced validation with smooth error display
    if (!data.nom || !data.email || !data.telephone || !data.formation) {
        showNotification('Il nous manque quelques informations importantes. Merci de remplir tous les champs marqués d\'une étoile (*).', 'error');
        highlightEmptyFields(this);
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Votre adresse email ne semble pas correcte. Pouvez-vous la vérifier s\'il vous plaît ?', 'error');
        highlightField(this.querySelector('#email'));
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[+]?[0-9\s-()]{8,}$/;
    if (!phoneRegex.test(data.telephone)) {
        showNotification('Votre numéro de téléphone ne semble pas correct. Pouvez-vous le vérifier s\'il vous plaît ?', 'error');
        highlightField(this.querySelector('#telephone'));
        return;
    }
    
    // Animate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    submitBtn.style.animation = 'pulse 1s infinite';
    
    // Simulate form processing
    setTimeout(() => {
        showNotification('Parfait ! Nous avons bien reçu votre demande et nous vous contacterons très rapidement. Merci de votre confiance ! 😊', 'success');
        this.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.animation = '';
        
        // Add success animation to form
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    }, 2000);
});

// Function to highlight empty required fields
function highlightEmptyFields(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            highlightField(field);
        }
    });
}

// Function to highlight a specific field
function highlightField(field) {
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
    
    setTimeout(() => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }, 3000);
    
    // Focus on the field
    field.focus();
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #27ae60, #2ecc71);' : 'background: linear-gradient(135deg, #e74c3c, #c0392b);'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to get formation details by number
function getFormationDetails(numero) {
    const formations = {
        '01': {
            designation: 'Formation Normale',
            duree: '2 mois',
            plageHoraire: '30min de cours, 3 cours pratiques par semaine',
            prix: '205 000 FCFA'
        },
        '02': {
            designation: 'Formation Accélérée',
            duree: '30 jours',
            plageHoraire: '30min de cours, 5 cours par semaine',
            prix: '300 000 FCFA'
        },
        '03': {
            designation: 'Formation au Forfait',
            duree: '1 mois',
            plageHoraire: '1h de cours, 6 cours pratiques par semaine',
            prix: '360 000 FCFA'
        },
        '04': {
            designation: 'Recyclage Théorique & Pratique',
            duree: '10 jours',
            plageHoraire: '30min de cours pratique',
            prix: '70 000 FCFA'
        },
        '05': {
            designation: 'Conduite Accompagnée',
            duree: 'Pas de durée',
            plageHoraire: '1h de cours',
            prix: '7 000 FCFA'
        },
        '06': {
            designation: 'Formation avec Permis International',
            duree: '45 jours',
            plageHoraire: '1h de cours, 5 cours pratiques par semaine',
            prix: '240 000 FCFA'
        },
        '07': {
            designation: 'Capacité',
            duree: '1 mois',
            plageHoraire: '3 cours pratiques par semaine',
            prix: '100 000 FCFA'
        },
        '08': {
            designation: 'Permis Moto (A)',
            duree: '1 mois',
            plageHoraire: '2 cours pratiques par semaine',
            prix: '75 000 FCFA'
        },
        '09': {
            designation: 'Formation Prestige',
            duree: '1 mois',
            plageHoraire: '30min de cours théorique et cours pratiques par semaine',
            prix: '300 000 FCFA'
        }
    };
    
    return {
        numero: numero,
        ...formations[numero]
    };
}

// Function to handle formation selection
function choisirFormation(numero, designation, duree, plageHoraire, prix) {
    // Get formation details
    const formationData = getFormationDetails(numero);
    
    // Store in localStorage for later use
    localStorage.setItem('formationChoisie', JSON.stringify(formationData));
    
    // Pre-fill contact form with formation details
    updateContactForm(formationData);
    
    // Scroll to contact section
    document.getElementById('contact').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // Show success notification
    showNotification(`Parfait ! Nous avons noté votre intérêt pour la "${designation}". Remplissez le formulaire pour être contacté(e).`, 'success');
    
    // Highlight the contact form briefly
    highlightContactForm();
}

// Function to update contact form with formation details
function updateContactForm(formationData) {
    const messageTextarea = document.getElementById('message');
    const formationSelect = document.getElementById('formation');
    
    if (messageTextarea) {
        const message = `Bonjour,\n\nJe suis intéressé(e) par la formation suivante chez Auto-École Noumga :\n\n` +
                       `📚 Formation N° ${formationData.numero} : ${formationData.designation}\n` +
                       `⏰ Durée : ${formationData.duree}\n` +
                       `📅 Plage horaire : ${formationData.plageHoraire}\n` +
                       `💰 Prix : ${formationData.prix}\n\n` +
                       `Pourriez-vous me recontacter pour discuter de cette formation et répondre à mes questions ?\n\n` +
                       `Je vous remercie par avance.\n\nCordialement.`;
        messageTextarea.value = message;
    }
    
    if (formationSelect) {
        // Set the formation in the dropdown if it matches any option
        for (let i = 0; i < formationSelect.options.length; i++) {
            if (formationSelect.options[i].text.toLowerCase().includes(formationData.designation.toLowerCase())) {
                formationSelect.selectedIndex = i;
                break;
            }
        }
    }
}

// Function to highlight contact form
function highlightContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.style.boxShadow = '0 0 20px rgba(230, 126, 34, 0.5)';
        contactForm.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            contactForm.style.boxShadow = '';
            contactForm.style.transform = '';
        }, 2000);
    }
}

// Function to send formation details via WhatsApp (for specific formations)
function envoyerWhatsApp(numero, designation, duree, plageHoraire, prix) {
    let message;
    
    if (numero && designation) {
        message = `Bonjour Auto-École Noumga ! 👋\n\nJe suis intéressé(e) par votre formation :\n\n` +
                 `📚 Formation N° ${numero} : ${designation}\n` +
                 `⏰ Durée : ${duree}\n` +
                 `📅 Plage horaire : ${plageHoraire}\n` +
                 `💰 Prix : ${prix}\n` +
                 `📝 Frais d'inscription : 10 000 FCFA\n\n` +
                 `Pourriez-vous me contacter pour me donner plus d'informations et répondre à mes questions ?\n\nMerci beaucoup ! 😊`;
    } else {
        message = `Bonjour Auto-École Noumga ! 👋\n\nJe souhaite obtenir des informations sur vos formations de conduite.\n\n` +
                 `Pourriez-vous me contacter pour me présenter vos différentes formules et répondre à mes questions ?\n\n` +
                 `Je vous remercie par avance ! 😊\n\nÀ bientôt.`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/237675922286?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    showNotification('Redirection vers WhatsApp...', 'success');
}

// Function to send general WhatsApp message (for contact section)
function envoyerWhatsAppGeneral() {
    const message = `Bonjour Auto-École Noumga ! 👋\n\nJe suis intéressé(e) par vos formations de conduite et j'aimerais en savoir plus.\n\n` +
                   `Pourriez-vous me contacter pour me présenter vos différentes formules, les tarifs et répondre à mes questions ?\n\n` +
                   `Je vous remercie par avance pour votre aide ! 😊\n\nÀ bientôt.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/237675922286?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    showNotification('Redirection vers WhatsApp...', 'success');
}

// Function to send formation details via Email
function envoyerEmail(numero, designation, duree, plageHoraire, prix) {
    let subject, body;
    
    if (numero && designation) {
        subject = `Demande d'information - Formation ${designation}`;
        body = `Bonjour,\n\nJe suis intéressé(e) par la formation suivante chez Auto-École Noumga :\n\n` +
              `📚 Formation N° ${numero} : ${designation}\n` +
              `⏰ Durée : ${duree}\n` +
              `📅 Plage horaire : ${plageHoraire}\n` +
              `💰 Prix : ${prix}\n` +
              `📝 Frais d'inscription : 10 000 FCFA\n\n` +
              `Pourriez-vous me recontacter pour me donner plus d'informations et répondre à mes questions ?\n\nJe vous remercie par avance.\n\nCordialement.`;
    } else {
        subject = 'Demande d\'information - Auto-École Noumga';
        body = `Bonjour,\n\nJe suis intéressé(e) par vos formations de conduite et j'aimerais en savoir plus.\n\n` +
              `Pourriez-vous me contacter pour me présenter vos différentes formules, les tarifs et répondre à mes questions ?\n\n` +
              `Je vous remercie par avance pour votre aide.\n\nCordialement.`;
    }
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const emailUrl = `mailto:albertnoumga@yahoo.fr?subject=${encodedSubject}&body=${encodedBody}`;
    
    window.location.href = emailUrl;
    showNotification('Nous ouvrons votre messagerie pour vous faciliter le contact ! 📧', 'success');
}

// Initialize contact buttons
document.addEventListener('DOMContentLoaded', function() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    const emailBtn = document.getElementById('emailBtn');
    const callBtn = document.getElementById('callBtn');
    
    // Handle WhatsApp button click
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            envoyerWhatsAppGeneral();
        });
    }
    
    // Handle Email button click
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            const formationData = JSON.parse(localStorage.getItem('formationChoisie')) || 
                                getFormationDetails('01'); // Default to first formation
            
            envoyerEmail(
                formationData.numero,
                formationData.designation,
                formationData.duree,
                formationData.plageHoraire,
                formationData.prix
            );
        });
    }
    
    // Handle Call button click
    if (callBtn) {
        callBtn.addEventListener('click', function() {
            const phoneNumber = '+237696022054';
            window.location.href = `tel:${phoneNumber}`;
            showNotification('Nous vous mettons en relation avec notre équipe ! 📞', 'success');
        });
    }
    
    // Check if we have a formation in the URL hash
    const hash = window.location.hash;
    if (hash.startsWith('#formation-')) {
        const formationNum = hash.replace('#formation-', '');
        const formationData = getFormationDetails(formationNum);
        if (formationData) {
            choisirFormation(
                formationData.numero,
                formationData.designation,
                formationData.duree,
                formationData.plageHoraire,
                formationData.prix
            );
        }
    }
});

// Enhanced navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        navbar.style.transform = 'translateY(0)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    // Add progress bar
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 70px;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #e67e22, #27ae60, #2c5aa0);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }
    progressBar.style.width = (scrollPercent * 100) + '%';
});

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation delay
            const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
            entry.target.style.animationDelay = delay + 'ms';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Enhanced animations on load
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll (excluding contact elements that should be visible immediately)
    const animatedElements = document.querySelectorAll('.service-card, .advantage-item, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
    
    // Animate hero content
    const heroTitle = document.querySelector('.hero-content h1');
    const heroText = document.querySelector('.hero-content p');
    const heroButtons = document.querySelector('.hero-buttons');
    
    setTimeout(() => {
        if (heroTitle) {
            heroTitle.style.animation = 'slideInLeft 1s ease-out';
        }
    }, 300);
    
    setTimeout(() => {
        if (heroText) {
            heroText.style.animation = 'slideInLeft 1s ease-out';
        }
    }, 600);
    
    setTimeout(() => {
        if (heroButtons) {
            heroButtons.style.animation = 'slideInLeft 1s ease-out';
        }
    }, 900);
    
    // Add floating animation to contact icons
    const contactIcons = document.querySelectorAll('.contact-item i');
    contactIcons.forEach((icon, index) => {
        icon.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
        icon.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Ensure contact elements are visible immediately
    const contactElements = document.querySelectorAll('.btn-quick-contact, .info-card, .contact-form');
    contactElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
    
    // Add hover effects to form inputs
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'translateY(0)';
        });
    });
    
    // Add pulse animation to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            const price = card.querySelector('.price');
            if (price) {
                price.style.animation = 'pulse 0.6s ease-in-out';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const price = card.querySelector('.price');
            if (price) {
                price.style.animation = '';
            }
        });
    });
});

// Enhanced navigation with smooth transitions
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            link.style.transform = 'scale(1.1)';
        } else {
            link.style.transform = 'scale(1)';
        }
    });
});

// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image i');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px) rotate(${scrolled * 0.1}deg)`;
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect
setTimeout(() => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
}, 1500);

// Add contact section entrance animation
function animateContactSection() {
    const contactSection = document.getElementById('contact');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate contact title
                const title = contactSection.querySelector('h2');
                const subtitle = contactSection.querySelector('.contact-subtitle');
                
                if (title) {
                    title.style.animation = 'fadeInUp 1s ease-out';
                }
                
                if (subtitle) {
                    setTimeout(() => {
                        subtitle.style.animation = 'fadeInUp 1s ease-out';
                    }, 200);
                }
                
                // Animate quick contact buttons
                const quickBtns = contactSection.querySelectorAll('.btn-quick-contact');
                quickBtns.forEach((btn, index) => {
                    setTimeout(() => {
                        btn.style.animation = 'slideInUp 0.8s ease-out';
                    }, 400 + (index * 150));
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(contactSection);
}

// Initialize contact section animation
document.addEventListener('DOMContentLoaded', animateContactSection);

// Hero Background Slideshow
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');

function initHeroSlideshow() {
    if (slides.length > 0) {
        // Show first slide
        slides[0].classList.add('active');
        
        // Start slideshow
        setInterval(() => {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            
            // Move to next slide
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Add active class to new slide
            slides[currentSlide].classList.add('active');
        }, 4000); // Change image every 4 seconds
    }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', initHeroSlideshow);
