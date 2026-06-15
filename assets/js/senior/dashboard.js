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
    // TODO: POST /api/logout, then redirect
    window.location.href = '../../pages/public/login.html';
  });


  // simulated data 
  // replace with actual fetch from /api/senior/me or similar.

  const currentSenior = {
    name: 'Jose Reyes',
    appointment: {
      date:           'Lunes, Hunyo 15, 2026',
      isoDate:        '2026-06-15',
      time:           '9:00 AM',
      service:        'Pangkalahatang Pagsusuri / General Check-up',
      location:       'Sa tahanan / Home Visit',
      volunteer:      'Maria Santos',
      volunteerPhone: '09171234567',
    },
    // set appointment to null to test the empty state:
    // appointment: null,
  };


  // welcome message 
  document.getElementById('welcome-message').innerHTML =
    `Maligayang Pagbabalik, ${currentSenior.name}! <small>Welcome back!</small>`;


  // appointment display 
  const detailsEl = document.getElementById('appointment-details');
  const emptyEl   = document.getElementById('appointment-empty');

  function renderAppointment(appt) {
    if (appt) {
      detailsEl.hidden = false;
      emptyEl.hidden   = true;

      // update cancel modal text dynamically
      document.querySelector('#cancel-modal p').innerHTML =
        `Kakanselahin ang iyong bisita sa <strong>${appt.date}</strong>. <small>This will cancel your visit on ${appt.date}.</small>`;
    } else {
      detailsEl.hidden = true;
      emptyEl.hidden   = false;
    }
  }

  // handles showing/hiding and keeping the cancel modal in sync
  renderAppointment(currentSenior.appointment);


  // helpers 
  function showError(id, show) {
    const el = document.getElementById(id);
    if (el) el.hidden = !show;
  }

  function isWeekday(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay();     // 0 = Sun, 6 = Sat
    return day >= 1 && day <= 5;
  }

  function openModal(modal) {
    modal.hidden = false;
    const first = modal.querySelector('button, input, select, [tabindex]');
    if (first) first.focus();
  }

  function closeModal(modal) {
    modal.hidden = true;
  }


  // reschedule modal 
  const rescheduleModal   = document.getElementById('reschedule-modal');
  const rescheduleDate    = document.getElementById('reschedule-date');
  const rescheduleTime    = document.getElementById('reschedule-time');
  const rescheduleErrBox  = document.getElementById('reschedule-error-summary');
  const rescheduleErrList = document.getElementById('reschedule-error-list');

  document.getElementById('btn-reschedule').addEventListener('click', () => {
    rescheduleDate.value    = '';
    rescheduleTime.value    = '';
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

    // TODO: PATCH /api/appointments/:id  { date: rescheduleDate.value, time: rescheduleTime.value }
    // on success: update the displayed date/time and close modal.

    // simulated success — update display
    if (currentSenior.appointment) {
      const newDate = new Date(rescheduleDate.value + 'T00:00:00');
      const dayName = newDate.toLocaleDateString('fil-PH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const timeMap = {
        '08:00': '8:00 AM',  '09:00': '9:00 AM',  '10:00': '10:00 AM',
        '11:00': '11:00 AM', '13:00': '1:00 PM',  '14:00': '2:00 PM',
        '15:00': '3:00 PM',  '16:00': '4:00 PM',
      };

      currentSenior.appointment.date    = dayName;
      currentSenior.appointment.isoDate = rescheduleDate.value;
      currentSenior.appointment.time    = timeMap[rescheduleTime.value] || rescheduleTime.value;

      // update the static text nodes in the HTML
      detailsEl.querySelector('p:nth-child(1)').innerHTML =
        `<strong>Petsa / Date:</strong> ${currentSenior.appointment.date}`;
      detailsEl.querySelector('p:nth-child(2)').innerHTML =
        `<strong>Oras / Time:</strong> ${currentSenior.appointment.time}`;

      renderAppointment(currentSenior.appointment);
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
    // On success: clear appointment and show empty state.

    currentSenior.appointment = null;
    renderAppointment(null);
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