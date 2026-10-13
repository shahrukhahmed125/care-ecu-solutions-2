/**
 * Car ECU Solutions - Interactive Engine
 * Vanilla JavaScript implementation for navigation, service filtering, and multi-step booking
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCategoryFilters();
  initBookingForm();
  highlightActiveNav();
  initScrollAnimations();
  initCursorEffect();
});

function initScrollAnimations() {
  const sections = document.querySelectorAll('main > section');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!sections.length || reducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  sections.forEach((section) => {
    section.classList.add('scroll-reveal');
    observer.observe(section);
  });
}

function initCursorEffect() {
  const supportsCustomCursor = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  ).matches;

  if (!supportsCustomCursor) return;

  const ring = document.createElement('span');
  const dot = document.createElement('span');
  ring.className = 'cursor-ring';
  dot.className = 'cursor-dot';
  ring.setAttribute('aria-hidden', 'true');
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);

  document.addEventListener('pointermove', (event) => {
    ring.style.left = `${event.clientX}px`;
    ring.style.top = `${event.clientY}px`;
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    ring.classList.add('is-visible');
    dot.classList.add('is-visible');

    const target = event.target instanceof Element ? event.target : null;
    ring.classList.toggle('is-hovering', Boolean(target && target.closest(
      'a, button, input, select, textarea, label, [role="button"]'
    )));
  });

  document.addEventListener('pointerleave', () => {
    ring.classList.remove('is-visible', 'is-hovering');
    dot.classList.remove('is-visible');
  });

  document.addEventListener('pointerdown', () => ring.classList.add('is-clicking'));
  document.addEventListener('pointerup', () => ring.classList.remove('is-clicking'));
}

/* ==========================================================================
   1. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('nav.main-nav');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggleBtn.contains(e.target) && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
    }
  });
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav.main-nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   2. SERVICE CATEGORY FILTER (Services Grid)
   ========================================================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.category-filter .filter-btn');
  const serviceCards = document.querySelectorAll('.service-grid .service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. BOOKING FORM & DYNAMIC SERVICE SELECTION
   ========================================================================== */
const SERVICE_CATALOG = {
  diagnostics: [
    { value: 'car-diagnostics', label: 'Car Diagnostics (Dealer-Level Scan & Live Data)' },
    { value: 'adblue-system-malfunction', label: 'AdBlue System Malfunction & SCR Fault Analysis' }
  ],
  security: [
    { value: 'immobiliser', label: 'Immobiliser Repair & Transponder Sync' },
    { value: 'car-spare-keys', label: 'Car Spare Keys & All Keys Lost Emergency Service' }
  ],
  performance: [
    { value: 'ecu-remapping', label: 'ECU Remapping (Stage 1 / Economy / Custom Torque)' }
  ],
  electronics: [
    { value: 'online-offline-coding', label: 'Online & Offline ECU / BCM / TCU Coding' },
    { value: 'retrofit', label: 'OEM Retrofit (Digital Cockpits, Lighting, Modules)' }
  ],
  module_repair: [
    { value: 'ecu-repair-data-recovery', label: 'ECU Repair, Cloning & Microcontroller Data Recovery' },
    { value: 'airbag-module-repairs', label: 'Airbag Module Crash Data Reset & Repair' }
  ]
};

function initBookingForm() {
  const bookingForm = document.getElementById('appointmentBookingForm');
  if (!bookingForm) return;

  const categoryTabs = bookingForm.querySelectorAll('.category-tab-btn');
  const serviceSelect = bookingForm.querySelector('#serviceSelect');
  const step1 = bookingForm.querySelector('#bookingStep1');
  const step2 = bookingForm.querySelector('#bookingStep2');
  const btnNext = bookingForm.querySelector('#btnToStep2');
  const btnBack = bookingForm.querySelector('#btnBackToStep1');
  const feedbackBox = bookingForm.querySelector('#formFeedback');
  const successBox = bookingForm.querySelector('#bookingSuccessBox');
  const stepIndicator = bookingForm.querySelectorAll('.step-indicator span');

  let activeCategory = 'diagnostics';

  // Set minimum date to today
  const dateInput = bookingForm.querySelector('#preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Populate services dropdown based on category
  function updateServicesDropdown(categoryKey) {
    if (!serviceSelect) return;
    serviceSelect.innerHTML = '<option value="">-- Choose Specialist Service --</option>';

    const services = SERVICE_CATALOG[categoryKey] || [];
    services.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.label;
      serviceSelect.appendChild(opt);
    });

    // Auto-select first service
    if (services.length > 0) {
      serviceSelect.selectedIndex = 1;
    }
  }

  // Category Tab Click Handler
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeCategory = tab.getAttribute('data-cat');
      updateServicesDropdown(activeCategory);
    });
  });

  // Initial dropdown population
  updateServicesDropdown(activeCategory);

  // Check URL query parameters (e.g. ?service=ecu-remapping)
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedService = urlParams.get('service');
  if (preselectedService) {
    for (const [catKey, services] of Object.entries(SERVICE_CATALOG)) {
      const match = services.find(s => s.value === preselectedService);
      if (match) {
        categoryTabs.forEach(t => {
          if (t.getAttribute('data-cat') === catKey) {
            categoryTabs.forEach(tab => tab.classList.remove('active'));
            t.classList.add('active');
            activeCategory = catKey;
            updateServicesDropdown(catKey);
            serviceSelect.value = preselectedService;
          }
        });
        break;
      }
    }
  }

  // Step 1 -> Step 2 Navigation
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      clearFeedback();

      const service = serviceSelect.value;
      const vehicleMake = bookingForm.querySelector('#vehicleMake').value.trim();
      const vehicleModel = bookingForm.querySelector('#vehicleModel').value.trim();
      const preferredDate = bookingForm.querySelector('#preferredDate').value;
      const preferredTime = bookingForm.querySelector('#preferredTime').value;

      if (!service) {
        showError('Please select a specific automotive electronics service.');
        serviceSelect.focus();
        return;
      }

      if (!vehicleMake) {
        showError('Please provide your vehicle manufacturer (e.g. BMW, Audi, Ford, Mercedes).');
        bookingForm.querySelector('#vehicleMake').focus();
        return;
      }

      if (!vehicleModel) {
        showError('Please specify the vehicle model and year (e.g. 320d 2019, A4 2018).');
        bookingForm.querySelector('#vehicleModel').focus();
        return;
      }

      if (!preferredDate) {
        showError('Please select a preferred date for the workshop assessment.');
        bookingForm.querySelector('#preferredDate').focus();
        return;
      }

      if (!preferredTime) {
        showError('Please select a preferred arrival timeslot.');
        bookingForm.querySelector('#preferredTime').focus();
        return;
      }

      // Transition to Step 2
      step1.style.display = 'none';
      step2.style.display = 'block';

      if (stepIndicator.length >= 2) {
        stepIndicator[0].classList.remove('active');
        stepIndicator[1].classList.add('active');
      }

      bookingForm.querySelector('#customerName').focus();
    });
  }

  // Step 2 -> Step 1 (Back)
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      clearFeedback();
      step2.style.display = 'none';
      step1.style.display = 'block';

      if (stepIndicator.length >= 2) {
        stepIndicator[1].classList.remove('active');
        stepIndicator[0].classList.add('active');
      }
    });
  }

  // Form Submit Handler
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFeedback();

    const name = bookingForm.querySelector('#customerName').value.trim();
    const phone = bookingForm.querySelector('#customerPhone').value.trim();
    const email = bookingForm.querySelector('#customerEmail').value.trim();
    const consent = bookingForm.querySelector('#privacyConsent').checked;

    if (!name) {
      showError('Please enter your full name.');
      bookingForm.querySelector('#customerName').focus();
      return;
    }

    if (!phone || phone.length < 9) {
      showError('Please enter a valid telephone number for booking confirmation.');
      bookingForm.querySelector('#customerPhone').focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError('Please enter a valid email address for receiving your booking quotation.');
      bookingForm.querySelector('#customerEmail').focus();
      return;
    }

    if (!consent) {
      showError('Please confirm your consent to be contacted regarding this workshop booking.');
      return;
    }

    // Capture complete submitted data
    const selectedServiceText = serviceSelect.options[serviceSelect.selectedIndex].text;
    const vehicleMake = bookingForm.querySelector('#vehicleMake').value.trim();
    const vehicleModel = bookingForm.querySelector('#vehicleModel').value.trim();
    const vehicleReg = bookingForm.querySelector('#vehicleReg').value.trim() || 'Not provided';
    const date = bookingForm.querySelector('#preferredDate').value;
    const time = bookingForm.querySelector('#preferredTime').value;

    // Render success state
    step2.style.display = 'none';
    const panelHeader = bookingForm.querySelector('.booking-panel-header');
    if (panelHeader) panelHeader.style.display = 'none';

    if (successBox) {
      successBox.style.display = 'block';
      const summaryElem = successBox.querySelector('.booking-summary-strip');
      if (summaryElem) {
        summaryElem.innerHTML = `
          <strong>Service Requested:</strong> ${selectedServiceText}<br>
          <strong>Vehicle:</strong> ${vehicleMake} ${vehicleModel} (VRM: ${vehicleReg})<br>
          <strong>Requested Appointment:</strong> ${date} at ${time}<br>
          <strong>Contact:</strong> ${name} · ${phone} · ${email}
        `;
      }
    }
  });

  function showError(msg) {
    if (!feedbackBox) return;
    feedbackBox.className = 'form-feedback error';
    feedbackBox.textContent = msg;
    feedbackBox.style.display = 'block';
    feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearFeedback() {
    if (!feedbackBox) return;
    feedbackBox.style.display = 'none';
    feedbackBox.textContent = '';
  }
}
