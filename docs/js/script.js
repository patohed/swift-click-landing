// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const contactForm = document.querySelector('.contact-form');
const statNumbers = document.querySelectorAll('.stat-number');
const sections = document.querySelectorAll('section[id]');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-open');
});

// Close mobile nav when clicking on a link
navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active menu items based on scroll position
    updateActiveNavOnScroll();
});

// Update active navigation link based on scroll position
function updateActiveNavOnScroll() {
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Observe process steps for sequential animation
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add a slight delay based on the step index for sequential animation
            const step = entry.target;
            const index = Array.from(processSteps).indexOf(step);
            setTimeout(() => {
                step.classList.add('animate-step');
            }, index * 200); // 200ms delay between each step
            processObserver.unobserve(step);
        }
    });
}, { threshold: 0.2 });

processSteps.forEach(step => {
    processObserver.observe(step);
    step.classList.add('fade-in'); // Also add fade-in class for opacity
});

// Counter animation for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target') || entry.target.textContent.replace(/[^0-9-]/g, ''));
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe all elements with numeric counters
document.querySelectorAll('.stat-number, .metric-number').forEach(stat => {
    statsObserver.observe(stat);
});

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // Animation duration control
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number based on the target
        let displayValue;
        if (target >= 1000000) {
            displayValue = Math.floor(current / 1000000) + 'M';
        } else if (target >= 1000) {
            displayValue = Math.floor(current / 1000) + 'K';
        } else {
            displayValue = Math.floor(current);
        }
        
        // Add plus sign if it's a percentage or increment
        if (element.textContent.includes('+')) {
            displayValue = '+' + displayValue;
        }
        
        // Update the element
        element.textContent = displayValue;
    }, 30);
}

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        let valid = true;
        const nameInput = this.querySelector('[name="name"]');
        const emailInput = this.querySelector('[name="email"]');
        const messageInput = this.querySelector('[name="message"]');
        
        if (nameInput.value.trim() === '') {
            valid = false;
            nameInput.classList.add('error');
        } else {
            nameInput.classList.remove('error');
        }
        
        if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
            valid = false;
            emailInput.classList.add('error');
        } else {
            emailInput.classList.remove('error');
        }
        
        if (messageInput.value.trim() === '') {
            valid = false;
            messageInput.classList.add('error');
        } else {
            messageInput.classList.remove('error');
        }
        
        if (valid) {
            // Here you would normally submit the form via AJAX
            // For demo purposes, we'll just show a success message
            const submitBtn = this.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            // Simulate server request
            setTimeout(() => {
                // Reset form
                this.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
                
                // Show success message
                showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
            }, 1500);
        } else {
            showNotification('Por favor, completa todos los campos correctamente.', 'error');
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Notification helper
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Set auto-close
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    setTimeout(() => {
        notification.remove();
    }, 300);
}
                submitBtn.textContent = 'Enviar Mensaje';
                
                // Show success message
                showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
            }, 1500);
        } else {
            showNotification('Por favor, completa todos los campos correctamente.', 'error');
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Notification helper
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Set auto-close
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Add notification styles if they don't exist
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 400px;
            background: white;
            color: #333;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.hide {
            transform: translateY(100px);
            opacity: 0;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-content i {
            font-size: 20px;
        }
        
        .notification-content p {
            margin: 0;
            font-size: 14px;
        }
        
        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            margin-left: 15px;
        }
        
        .notification-success {
            border-left: 4px solid #38C172;
        }
        
        .notification-success i {
            color: #38C172;
        }
        
        .notification-error {
            border-left: 4px solid #E53E3E;
        }
        
        .notification-error i {
            color: #E53E3E;
        }
        
        .notification-info {
            border-left: 4px solid #3182CE;
        }
        
        .notification-info i {
            color: #3182CE;
        }
        
        .error {
            border-color: #E53E3E !important;
        }
        
        @media (max-width: 480px) {
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to sections for animation
    document.querySelectorAll('section').forEach((section, index) => {
        if (!section.classList.contains('hero')) {
            section.classList.add('fade-in');
            observer.observe(section);
        }
    });
    
    // Initialize active menu item
    updateActiveNavOnScroll();
});
        
        // Add + sign for certain stats
        if (element.parentElement.querySelector('.stat-label').textContent.includes('+') || 
            element.parentElement.querySelector('.stat-label').textContent.includes('%')) {
            if (element.parentElement.querySelector('.stat-label').textContent.includes('%')) {
                displayValue = Math.floor(current) + '%';
            } else {
                displayValue = Math.floor(current) + '+';
            }
        }
        
        element.textContent = displayValue;
    }, 30);
}

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Show error message
            showNotification('Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    // Set colors based on type
    if (type === 'success') {
        notification.style.background = '#d4edda';
        notification.style.color = '#155724';
        notification.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        notification.style.background = '#f8d7da';
        notification.style.color = '#721c24';
        notification.style.border = '1px solid #f5c6cb';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.shape');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    shapes.forEach((shape, index) => {
        const rate = scrolled * (0.1 + index * 0.05);
        shape.style.transform = `translateY(${rate}px) rotate(${rate * 0.5}deg)`;
    });
});

// Add fade-in class to elements that should animate
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = [
        '.brand-promise',
        '.partners',
        '.services-overview',
        '.service-card',
        '.feature-item',
        '.about-section',
        '.stats-section',
        '.contact-section'
    ];
    
    animateElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('fade-in');
        });
    });
});

// Enhanced scroll-triggered animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe service cards for staggered animation
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    animationObserver.observe(card);
});

// Add dynamic CSS for animations
const style = document.createElement('style');
style.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .navbar.scrolled {
        background: rgba(10, 10, 10, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    body.nav-open {
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px !important;
            left: 10px !important;
            max-width: none !important;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Navbar scroll effect
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active menu item
    updateActiveNavOnScroll();
    
    // Parallax effect with reduced calculations for better performance
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.shape');
    
    if (hero && scrolled < window.innerHeight) {
        const rate = scrolled * -0.2;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    shapes.forEach((shape, index) => {
        if (scrolled < window.innerHeight) {
            const rate = scrolled * (0.05 + index * 0.02);
            shape.style.transform = `translateY(${rate}px) rotate(${rate * 0.3}deg)`;
        }
    });
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    otherAnswer.style.maxHeight = '0';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)';
            }
        });
    });
});

// ROI Calculator Functionality
document.addEventListener('DOMContentLoaded', () => {
    const roiForm = document.getElementById('roi-calculator-form');
    const resultDiv = document.getElementById('roi-result');
    
    if (roiForm) {
        roiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateROI();
        });
        
        // Real-time calculation on input change
        const inputs = roiForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(calculateROI, 500));
        });
    }
    
    function calculateROI() {
        const monthlyRevenue = parseFloat(document.getElementById('monthly-revenue').value) || 0;
        const currentConversion = parseFloat(document.getElementById('current-conversion').value) || 0;
        const marketingBudget = parseFloat(document.getElementById('marketing-budget').value) || 0;
        const businessType = document.getElementById('business-type').value;
        
        if (monthlyRevenue === 0 || currentConversion === 0 || marketingBudget === 0) {
            resultDiv.innerHTML = '<p class="roi-placeholder">Completa todos los campos para ver tu ROI estimado</p>';
            return;
        }
        
        // ROI calculation logic based on industry averages
        let improvementMultiplier = 1.5; // Base improvement
        
        // Adjust based on business type
        switch (businessType) {
            case 'ecommerce':
                improvementMultiplier = 1.8;
                break;
            case 'saas':
                improvementMultiplier = 2.2;
                break;
            case 'services':
                improvementMultiplier = 1.6;
                break;
            case 'healthcare':
                improvementMultiplier = 1.4;
                break;
            case 'education':
                improvementMultiplier = 1.3;
                break;
            default:
                improvementMultiplier = 1.5;
        }
        
        const projectedConversion = currentConversion * improvementMultiplier;
        const projectedRevenue = monthlyRevenue * improvementMultiplier;
        const monthlyIncrease = projectedRevenue - monthlyRevenue;
        const annualIncrease = monthlyIncrease * 12;
        const roi = ((annualIncrease - (marketingBudget * 12)) / (marketingBudget * 12)) * 100;
        
        // Display results with animation
        resultDiv.innerHTML = `
            <div class="roi-results">
                <h4>Tu ROI Estimado con Swift Click</h4>
                <div class="roi-metrics">
                    <div class="roi-metric">
                        <span class="roi-label">Conversión Proyectada</span>
                        <span class="roi-value">${projectedConversion.toFixed(1)}%</span>
                        <span class="roi-improvement">+${((projectedConversion - currentConversion) / currentConversion * 100).toFixed(0)}%</span>
                    </div>
                    <div class="roi-metric">
                        <span class="roi-label">Ingresos Mensuales Proyectados</span>
                        <span class="roi-value">$${projectedRevenue.toLocaleString()}</span>
                        <span class="roi-improvement">+$${monthlyIncrease.toLocaleString()}</span>
                    </div>
                    <div class="roi-metric primary">
                        <span class="roi-label">ROI Anual Estimado</span>
                        <span class="roi-value">${roi.toFixed(0)}%</span>
                        <span class="roi-improvement">$${annualIncrease.toLocaleString()} adicionales</span>
                    </div>
                </div>
                <p class="roi-disclaimer">
                    *Estimación basada en promedios de la industria y casos de éxito previos. 
                    Los resultados reales pueden variar según múltiples factores.
                </p>
                <a href="#contacto" class="btn btn-primary">Solicitar Consulta Gratuita</a>
            </div>
        `;
        
        // Animate the results
        resultDiv.classList.add('show-results');
    }
});

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.parentElement.querySelector('.error-message');
        
        // Remove existing error styling
        input.classList.remove('error');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Validate based on input type
        if (!value) {
            showFieldError(input, 'Este campo es obligatorio');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Por favor ingresa un email válido');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(value)) {
            showFieldError(input, 'Por favor ingresa un teléfono válido');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Swift Click website loaded successfully!');
    console.log('Style system version: 1.0.1 - May 30, 2025');
    
    // Log diagnostic information about the UI components
    const components = {
        'Navigation': document.querySelector('.navbar') !== null,
        'Hero': document.querySelector('.hero') !== null,
        'Services': document.querySelector('.services-overview') !== null,
        'Features': document.querySelector('.features-grid') !== null,
        'Testimonials': document.querySelector('.testimonials-grid') !== null,
        'Contact Form': document.querySelector('.contact-form') !== null
    };
    
    console.table(components);
    
    // Add loading animation completion
    document.body.classList.add('loaded');
    
    // Initialize enhanced contact form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
    });
});
