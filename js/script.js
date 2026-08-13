document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Split Text Animation for H1 ---
    const targetHeading = document.querySelector('.split-text-target');
    if (targetHeading) {
        // Split by characters, preserving HTML tags (like <em>) and breaks (<br>)
        // A simple approach is just text splitting, but since we have an <em> tag, 
        // we'll split the innerHTML carefully by parsing nodes.
        
        // Simpler approach: Split text nodes only.
        function splitTextNodes(node) {
            if (node.nodeType === 3) { // Text node
                const text = node.nodeValue;
                const chars = text.split('');
                const fragment = document.createDocumentFragment();
                chars.forEach(char => {
                    const span = document.createElement('span');
                    span.classList.add('char');
                    // Use a non-breaking space for actual spaces so they render properly
                    span.innerHTML = char === ' ' ? '&nbsp;' : char;
                    fragment.appendChild(span);
                });
                node.parentNode.replaceChild(fragment, node);
            } else if (node.nodeType === 1 && node.nodeName !== 'BR') { // Element node
                Array.from(node.childNodes).forEach(splitTextNodes);
            }
        }

        // Apply splitting
        Array.from(targetHeading.childNodes).forEach(splitTextNodes);

        // Animate them sequentially once the hero is revealed
        const chars = targetHeading.querySelectorAll('.char');
        // Initial delay for the heading to start animating (e.g., after eyebrow)
        const baseDelay = 200; 
        
        setTimeout(() => {
            chars.forEach((char, index) => {
                setTimeout(() => {
                    char.classList.add('active');
                }, index * 30); // 30ms stagger between letters
            });
        }, baseDelay);
    }

    // --- 2. Magnetic Navigation Links ---
    const magneticLinks = document.querySelectorAll('.magnetic-link');
    
    magneticLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const position = link.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            // Subtle pull
            link.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 3. Hero Text Mouse Parallax ---
    const heroContent = document.getElementById('hero-content');
    window.addEventListener('mousemove', (e) => {
        // Move opposite to mouse slightly
        const x = (window.innerWidth / 2 - e.clientX) * 0.02;
        const y = (window.innerHeight / 2 - e.clientY) * 0.02;
        if(heroContent) {
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        }
    });


    // --- Create Ambient Glow & Scroll Bar (Existing logic) ---
    const glowEl = document.createElement('div');
    glowEl.classList.add('ambient-glow');
    document.body.appendChild(glowEl);

    const scrollBar = document.createElement('div');
    scrollBar.classList.add('scroll-progress');
    document.body.appendChild(scrollBar);

    window.addEventListener('mousemove', (e) => {
        glowEl.style.left = `${e.clientX}px`;
        glowEl.style.top = `${e.clientY}px`;
    });

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollBar.style.width = (winScroll / h) * 100 + "%";
    });

    // --- Intersection Observer (Existing logic) ---
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    revealElements.forEach(el => revealOnScroll.observe(el));
    
    // --- 3D Image Tilt & Parallax (Existing logic) ---
    const treatmentImages = document.querySelectorAll('.treatment-image-container');
    treatmentImages.forEach(container => {
        const img = container.querySelector('img, .abstract-image');
        const mask = document.createElement('div');
        mask.classList.add('image-mask-reveal');
        container.insertBefore(mask, img);
        mask.appendChild(img);

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            mask.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        container.addEventListener('mouseleave', () => {
            mask.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    const parallaxImages = document.querySelectorAll('.treatment-image-container img, .abstract-image');
    window.addEventListener('scroll', () => {
        parallaxImages.forEach(img => {
            const parent = img.closest('.treatment-image-container');
            const parentRect = parent.getBoundingClientRect();
            const parentTop = parentRect.top;
            if (parentTop < window.innerHeight && parentRect.bottom > 0) {
                const yPos = (window.innerHeight - parentTop) * 0.15;
                img.style.transform = `translateY(${-yPos}px)`;
            }
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // --- 6. Custom Bespoke Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    // Smooth trailing variables for the ring
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for the dot
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Animation loop for smooth trailing ring
    function renderCursor() {
        // Lerp (Linear Interpolation) for smooth follow
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover effect on links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing?.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hovered'));
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if(mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const navLinks = navLinksContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // --- FAQ Accordion ---
    const faqHeaders = document.querySelectorAll('.faq-accordion-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.faq-icon');
            
            // Close all others
            document.querySelectorAll('.faq-accordion-content').forEach(c => {
                if(c !== content) {
                    c.style.maxHeight = null;
                    const otherIcon = c.previousElementSibling.querySelector('.faq-icon');
                    if(otherIcon) {
                        otherIcon.textContent = '+';
                        otherIcon.style.transform = 'rotate(0deg)';
                        otherIcon.style.color = 'var(--clr-accent)';
                    }
                }
            });

            // Toggle current
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.textContent = '+';
                icon.style.transform = 'rotate(0deg)';
                icon.style.color = 'var(--clr-accent)';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = '−'; // minus sign
                icon.style.transform = 'rotate(180deg)';
                icon.style.color = 'var(--clr-text-main)';
            }
        });
    });

    // --- Form Submission to Google Apps Script ---
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            const formData = new FormData(this);
            // Replace this URL with your actual deployed Google Apps Script Web App URL
            const appScriptURL = 'https://script.google.com/macros/s/AKfycbyrrbdNSXt2vAqYOCIZ8LoX8dqhY-Sc2oidwlvguIEjgHrRQszxpRX8z3h0YVbWV7U/exec';

            if (appScriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                alert("Please add your Google Apps Script URL in js/script.js to enable form submission.");
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                return;
            }

            fetch(appScriptURL, {
                method: 'POST',
                mode: 'no-cors', // Avoids CORS errors for simple form posts to Apps Script
                body: formData
            })
            .then(() => {
                const popup = document.getElementById('success-popup');
                const overlay = document.getElementById('success-overlay');
                const closeBtn = document.getElementById('close-success-popup');
                
                if (popup && overlay) {
                    popup.classList.add('show');
                    overlay.classList.add('show');
                    
                    const closePopup = () => {
                        popup.classList.remove('show');
                        overlay.classList.remove('show');
                    };
                    
                    closeBtn.addEventListener('click', closePopup, { once: true });
                    overlay.addEventListener('click', closePopup, { once: true });
                    
                    // Auto close after 5 seconds
                    setTimeout(closePopup, 5000);
                }
                
                submitBtn.textContent = 'Request Submitted!';
                this.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.textContent = 'Error. Try Again.';
                submitBtn.style.background = '#d32f2f'; // Red error color
                submitBtn.style.color = '#fff';
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
});
