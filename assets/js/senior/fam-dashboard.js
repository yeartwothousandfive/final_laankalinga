(function () {

  // offline / session banners 
  const bannerOffline = document.getElementById('banner-offline');
  window.addEventListener('offline', () => { bannerOffline.hidden = false; });
  window.addEventListener('online',  () => { bannerOffline.hidden = true;  });
  if (!navigator.onLine) bannerOffline.hidden = false;

  const params = new URLSearchParams(window.location.search);
  if (params.get('reason') === 'session-expired') {
    document.getElementById('banner-session').hidden = false;
  }


  // zoom controls 
  let zoomLevel = parseInt(localStorage.getItem('zoomLevel') || '100', 10);

  function applyZoom() {
    document.documentElement.style.fontSize = zoomLevel + '%';
    localStorage.setItem('zoomLevel', zoomLevel);
  }

  applyZoom();

  document.getElementById('zoom-in').addEventListener('click', () => {
    if (zoomLevel < 150) { zoomLevel += 10; applyZoom(); }
  });
  document.getElementById('zoom-out').addEventListener('click', () => {
    if (zoomLevel > 80) { zoomLevel -= 10; applyZoom(); }
  });
  document.getElementById('zoom-reset').addEventListener('click', () => {
    zoomLevel = 100; applyZoom();
  });


  // logout 
  document.getElementById('logout-link').addEventListener('click', e => {
    e.preventDefault();
    // TODO: call POST /api/logout, then redirect
    window.location.href = '../../pages/public/login.html';
  });


  // simulated data 
  // Replace with actual fetch from /api/family/me or similar.

  const currentFamily = {
    name: 'Laura Florante',
  };

  const linkedSeniors = [
    {
      id: 's001',
      name: 'Lauro Florante',
      dob: '1948-03-12',         // used to compute age
      lastVisit: '2026-06-08',
      status: 'Maayos / No concerns noted',
      appointment: {
        date: 'Lunes, Hunyo 15, 2026',
        isoDate: '2026-06-15',
        time: '9:00 AM',
        service: 'Pangkalahatang Pagsusuri / General Check-up',
        location: 'Sa tahanan / Home Visit',
        volunteer: 'Maria Santos',
        volunteerPhone: '09171234567',
      },
    },
    {
      id: 's002',
      name: 'Lourdes Reyes',
      dob: '1952-07-25',
      lastVisit: '2026-05-30',
      status: 'May follow-up na kailangan / Follow-up needed',
      appointment: null,         // no upcoming visit
    },
  ];

  // welcome message 
  document.getElementById('welcome-message').innerHTML =
    `Maligayang Pagbabalik, ${currentFamily.name}! <small>Welcome back!</small>`;


  // senior switcher 
  const switcher = document.getElementById('senior-switcher');

  linkedSeniors.forEach((senior, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = senior.name;
    switcher.appendChild(opt);
  });

  function getAge(dobStr) {
    const today = new Date();
    const dob   = new Date(dobStr + 'T00:00:00');
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  function formatDate(isoStr) {
    if (!isoStr) return 'Wala / None';
    const d = new Date(isoStr + 'T00:00:00');
    return d.toLocaleDateString('fil-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  let activeSenior = linkedSeniors[0];

  function renderSenior(senior) {
    activeSenior = senior;

    // overview card
    document.getElementById('senior-name').textContent      = senior.name;
    document.getElementById('senior-age').textContent       = getAge(senior.dob) + ' taong gulang / years old';
    document.getElementById('senior-last-visit').textContent = formatDate(senior.lastVisit);
    document.getElementById('senior-status').textContent    = senior.status;

    // appointment section
    const detailsEl = document.getElementById('appointment-details');
    const emptyEl   = document.getElementById('appointment-empty');

    if (senior.appointment) {
      const a = senior.appointment;
      document.getElementById('appt-date').textContent      = a.date;
      document.getElementById('appt-time').textContent      = a.time;
      document.getElementById('appt-service').textContent   = a.service;
      document.getElementById('appt-location').textContent  = a.location;
      document.getElementById('appt-volunteer').textContent = a.volunteer;

      const phoneLink = document.getElementById('appt-volunteer-phone');
      phoneLink.href        = 'tel:+63' + a.volunteerPhone.slice(1);
      phoneLink.textContent = a.volunteerPhone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');

      // update cancel modal text
      document.getElementById('cancel-modal-msg').innerHTML =
        `Kakanselahin ang bisita sa <strong>${a.date}</strong>. <small>This will cancel the visit on ${a.date}.</small>`;

      detailsEl.hidden = false;
      emptyEl.hidden   = true;
    } else {
      detailsEl.hidden = true;
      emptyEl.hidden   = false;
    }
  }

  renderSenior(linkedSeniors[0]);

  switcher.addEventListener('change', () => {
    renderSenior(linkedSeniors[parseInt(switcher.value, 10)]);
  });


  // reschedule modal 
  const rescheduleModal  = document.getElementById('reschedule-modal');
  const rescheduleDate   = document.getElementById('reschedule-date');
  const rescheduleTime   = document.getElementById('reschedule-time');
  const rescheduleErrBox = document.getElementById('reschedule-error-summary');
  const rescheduleErrList= document.getElementById('reschedule-error-list');

  function showError(id, show) {
    const el = document.getElementById(id);
    if (el) el.hidden = !show;
  }

  function isWeekday(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay();           // 0 = Sun, 6 = Sat
    return day >= 1 && day <= 5;
  }

  function openModal(modal) {
    modal.hidden = false;
    // focus first focusable element
    const first = modal.querySelector('button, input, select, [tabindex]');
    if (first) first.focus();
  }

  function closeModal(modal) {
    modal.hidden = true;
  }

  document.getElementById('btn-reschedule').addEventListener('click', () => {
    rescheduleDate.value = '';
    rescheduleTime.value = '';
    showError('error-reschedule-date', false);
    showError('error-reschedule-time', false);
    rescheduleErrBox.hidden = true;
    openModal(rescheduleModal);
  });

  document.getElementById('btn-reschedule-cancel').addEventListener('click', () => {
    closeModal(rescheduleModal);
  });

  document.getElementById('btn-reschedule-confirm').addEventListener('click', () => {
    const errors = [];

    if (!rescheduleDate.value || !isWeekday(rescheduleDate.value)) {
      showError('error-reschedule-date', true);
      errors.push('Pumili ng valid na araw (Lunes–Biyernes).');
    } else {
      showError('error-reschedule-date', false);
    }

    if (!rescheduleTime.value) {
      showError('error-reschedule-time', true);
      errors.push('Pumili ng oras.');
    } else {
      showError('error-reschedule-time', false);
    }

    if (errors.length > 0) {
      rescheduleErrList.innerHTML = errors.map(m => `<li>${m}</li>`).join('');
      rescheduleErrBox.hidden = false;
      return;
    }

    rescheduleErrBox.hidden = true;

    // TODO: PATCH /api/appointments/:id with { date: rescheduleDate.value, time: rescheduleTime.value }
    // on success: update the displayed appointment and close modal

    // simulated success: update display
    if (activeSenior.appointment) {
      const newDate = new Date(rescheduleDate.value + 'T00:00:00');
      const dayName = newDate.toLocaleDateString('fil-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      activeSenior.appointment.date    = dayName;
      activeSenior.appointment.isoDate = rescheduleDate.value;

      const timeMap = {
        '08:00': '8:00 AM', '09:00': '9:00 AM', '10:00': '10:00 AM',
        '11:00': '11:00 AM', '13:00': '1:00 PM', '14:00': '2:00 PM',
        '15:00': '3:00 PM', '16:00': '4:00 PM',
      };
      activeSenior.appointment.time = timeMap[rescheduleTime.value] || rescheduleTime.value;

      renderSenior(activeSenior);
    }

    closeModal(rescheduleModal);
  });


  // cancel modal 
  const cancelModal = document.getElementById('cancel-modal');

  document.getElementById('btn-cancel').addEventListener('click', () => {
    openModal(cancelModal);
  });

  document.getElementById('btn-cancel-dismiss').addEventListener('click', () => {
    closeModal(cancelModal);
  });

  document.getElementById('btn-cancel-confirm').addEventListener('click', () => {
    // TODO: DELETE /api/appointments/:id
    // on success: clear appointment and show empty state.

    if (activeSenior.appointment) {
      activeSenior.appointment = null;
      renderSenior(activeSenior);
    }

    closeModal(cancelModal);
  });


  // close modals on backdrop click 
  [rescheduleModal, cancelModal].forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
  });


  // close modals on ESC 
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!rescheduleModal.hidden) closeModal(rescheduleModal);
      if (!cancelModal.hidden)     closeModal(cancelModal);
    }
  });

})();