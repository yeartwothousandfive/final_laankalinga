(function () {

  const bannerOffline = document.getElementById('banner-offline');
  window.addEventListener('offline', () => { bannerOffline.hidden = false; });
  window.addEventListener('online',  () => { bannerOffline.hidden = true;  });
  if (!navigator.onLine) bannerOffline.hidden = false;

  const params = new URLSearchParams(window.location.search);
  if (params.get('reason') === 'session-expired') {
    document.getElementById('banner-session').hidden = false;
  }

  const qcBarangays = [
    'Alicia', 'Amihan', 'Apolonio Samson', 'Aurora', 'Baesa', 'Bagbag',
    'Bagong Buhay', 'Bagong Pag-Asa', 'Bagong Silangan', 'Bagong Silang',
    'Bagumbayan', 'Bagumbuhay', 'Bahay Toro', 'Balingasa', 'Balintawak',
    'Batasan Hills', 'Bayanihan', 'Blue Ridge A', 'Blue Ridge B',
    'Botocan', 'Bungad', 'Camp Aguinaldo', 'Capri', 'Central',
    'Claro', 'Commonwealth', 'Culiat', 'Damar', 'Damayan',
    'Damayan Lagi', 'Dangwa', 'Del Monte', 'Dioquino Zobel',
    'Don Manuel', 'Doña Aurora', 'Doña Imelda', 'Doña Josefa',
    'Duyan-Duyan', 'E. Rodriguez', 'East Kamias', 'Escopa I',
    'Escopa II', 'Escopa III', 'Escopa IV', 'Fairview', 'Greater Lagro',
    'Gulod', 'Holy Spirit', 'Horseshoe', 'Immaculate Concepcion',
    'Kaligayahan', 'Kalusugan', 'Kamuning', 'Katipunan', 'Kaunlaran',
    'Kristong Hari', 'Krus na Ligas', 'Laging Handa', 'Libis',
    'Lourdes', 'Loyola Heights', 'Lucban', 'Luzviminda',
    'Maharlika', 'Malaya', 'Mangga', 'Manresa', 'Mariana',
    'Mariblo', 'Marilag', 'Masagana', 'Masambong', 'Matandang Balara',
    'Milagrosa', 'Model', 'Nagkaisang Nayon', 'Nayong Kanluran',
    'New Era', 'North Fairview', 'Novaliches Proper', 'Obrero',
    'Old Capitol Site', 'Paang Bundok', 'Pag-Ibig sa Nayon',
    'Paligsahan', 'Paltok', 'Pansol', 'Paraiso', 'Pasong Putik Proper',
    'Pasong Tamo', 'Payatas', 'Phil-Am', 'Pinagkaisahan', 'Pinyahan',
    'Pitogo', 'Plaridel', 'Poblacion', 'Project 6', 'Pugad Lawin',
    'Quezon City Proper', 'Quirino 2-A', 'Quirino 2-B', 'Quirino 2-C',
    'Quirino 3-A', 'Ramon Magsaysay', 'Roxas', 'Sacred Heart',
    'Saint Ignatius', 'Saint Peter', 'Salvacion', 'San Agustin',
    'San Antonio', 'San Bartolome', 'San Isidro', 'San Isidro Labrador',
    'San Jose', 'San Martin de Porres', 'San Roque', 'San Vicente',
    'Sangandaan', 'Santa Cruz', 'Santa Lucia', 'Santa Monica',
    'Santa Teresita', 'Santo Cristo', 'Santo Niño', 'Santol',
    'Sauyo', 'Siena', 'Sikatuna Village', 'Silangan', 'Socorro',
    'South Triangle', 'Tagumpay', 'Talayan', 'Talipapa',
    'Tandang Sora', 'Tatalon', 'Teacher\'s Village East',
    'Teacher\'s Village West', 'Ugong Norte', 'Unang Sigaw',
    'UP Campus', 'UP Village', 'Vasra', 'Veterans Village',
    'Villa Maria Clara', 'West Kamias', 'West Triangle', 'White Plains'
  ];

  const barangaySearch = document.getElementById('barangay-search');
  const barangayHidden = document.getElementById('barangay');
  const barangayList   = document.getElementById('barangay-list');

  // populate datalist
  qcBarangays.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    barangayList.appendChild(opt);
  });

  // sync hidden input and validate on change
  barangaySearch.addEventListener('change', () => {
    const val = barangaySearch.value.trim();
    if (qcBarangays.includes(val)) {
      barangayHidden.value = val;
      showError('error-barangay', false);
    } else {
      barangayHidden.value = '';
      showError('error-barangay', true);
    }
  });

  // password toggle
  const pwInput = document.getElementById('password');
  const togglePw = document.getElementById('toggle-pw');
  const iconHide = document.getElementById('icon-hide');
  const iconShow = document.getElementById('icon-show');
  iconShow.hidden = true;
  togglePw.addEventListener('click', () => {
    const isHidden = pwInput.type === 'password';
    pwInput.type = isHidden ? 'text' : 'password';
    iconHide.hidden = isHidden;
    iconShow.hidden = !isHidden;
  });

  function isValidPassword(val) {
    return val.length >= 8;
  }


  // senior search
  const linkedSeniors   = [];
  const linkedInput     = document.getElementById('linked-seniors-input');
  const linkedList      = document.getElementById('linked-seniors-list');
  const searchInput     = document.getElementById('senior-search');
  const searchBtn       = document.getElementById('btn-senior-search');
  const searchResults   = document.getElementById('senior-search-results');
  const searchStatus    = document.getElementById('senior-search-status');
  const errorNotFound   = document.getElementById('error-senior-not-found');

  // simulated senior data: replace with actual fetch
  const simulatedSeniors = [
    { id: 's001', name: 'Maria Santos', dob: '1945-03-12' },
    { id: 's002', name: 'Jose Reyes',   dob: '1938-07-25' },
    { id: 's003', name: 'Lourdes Cruz', dob: '1950-11-08' },
  ];

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    errorNotFound.hidden = true;
    searchResults.hidden = true;
    searchResults.innerHTML = '';

    if (!query) {
      searchStatus.textContent = 'Please enter a name or date of birth.';
      return;
    }

    const found = simulatedSeniors.filter(s =>
      s.name.toLowerCase().includes(query) || s.dob.includes(query)
    );

    if (found.length === 0) {
      errorNotFound.hidden = false;
      searchStatus.textContent = '';
      return;
    }

    searchStatus.textContent = `${found.length} result(s) found.`;
    searchResults.hidden = false;

    found.forEach(senior => {
      const already = linkedSeniors.find(s => s.id === senior.id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add('btn-secondary');
      btn.textContent = already
        ? `${senior.name} (already added)`
        : `Add ${senior.name} (${senior.dob})`;
      btn.disabled = !!already;

      btn.addEventListener('click', () => {
        addSenior(senior);
        btn.textContent = `${senior.name} (already added)`;
        btn.disabled = true;
      });

      searchResults.appendChild(btn);
    });
  });

  function addSenior(senior) {
    if (linkedSeniors.find(s => s.id === senior.id)) return;
    linkedSeniors.push(senior);
    syncLinkedInput();
    renderLinkedList();
    showError('error-linked-seniors', false);
  }

  function removeSenior(id) {
    const idx = linkedSeniors.findIndex(s => s.id === id);
    if (idx !== -1) linkedSeniors.splice(idx, 1);
    syncLinkedInput();
    renderLinkedList();
  }

  function syncLinkedInput() {
    linkedInput.value = JSON.stringify(linkedSeniors.map(s => s.id));
  }

  function renderLinkedList() {
    linkedList.innerHTML = '';
    if (linkedSeniors.length === 0) {
      const empty = document.createElement('li');
      empty.textContent = 'No seniors linked yet.';
      empty.classList.add('linked-list__empty');
      linkedList.appendChild(empty);
      return;
    }
    linkedSeniors.forEach(senior => {
      const li = document.createElement('li');
      li.classList.add('linked-list__item');
      li.textContent = `${senior.name} (${senior.dob})`;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.classList.add('btn-remove');
      removeBtn.textContent = 'Remove';
      removeBtn.setAttribute('aria-label', `Remove ${senior.name}`);
      removeBtn.addEventListener('click', () => removeSenior(senior.id));

      li.appendChild(removeBtn);
      linkedList.appendChild(li);
    });
  }

  renderLinkedList();


  // validations
  function showError(id, show) {
    const el = document.getElementById(id);
    if (el) el.hidden = !show;
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function isValidPhone(val) {
    return /^09\d{9}$/.test(val.replace(/\s/g, ''));
  }

  // blur validation
  const blurRules = [
    { id: 'first-name',  errorId: 'error-first-name',  check: v => v.trim() !== '' },
    { id: 'last-name',   errorId: 'error-last-name',   check: v => v.trim() !== '' },
    { id: 'email',       errorId: 'error-email',       check: v => isValidEmail(v) },
    { id: 'phone',       errorId: 'error-phone',       check: v => isValidPhone(v) },
    { id: 'house-number',errorId: 'error-house-number',check: v => v.trim() !== '' },
    { id: 'street',      errorId: 'error-street',      check: v => v.trim() !== '' },
    { id: 'zip',         errorId: 'error-zip',         check: v => v.trim() !== '' },
    { id: 'password', errorId: 'error-password', check: v => isValidPassword(v) },
  ];

  blurRules.forEach(({ id, errorId, check }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => {
        showError(errorId, !check(el.value));
      });
    }
  });

  document.getElementById('confirm-password').addEventListener('blur', () => {
    showError('error-confirm-password',
      document.getElementById('password').value !== document.getElementById('confirm-password').value);
  });

  // select blur validation
  ['relationship', 'decision-maker', 'contact-method', 'update-frequency'].forEach(id => {
    const el = document.getElementById(id);
    const errorId = `error-${id}`;
    if (el) {
      el.addEventListener('blur', () => {
        showError(errorId, el.value === '');
      });
    }
  });


  // submit
  const form        = document.getElementById('register-family-form');
  const summaryBox  = document.getElementById('error-summary');
  const summaryList = document.getElementById('error-summary-list');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const errors = [];

    function check(fieldId, errorId, condition, msg) {
      if (!condition) {
        showError(errorId, true);
        errors.push({ id: fieldId, msg });
      } else {
        showError(errorId, false);
      }
    }

    // step 1
    check('first-name',   'error-first-name',   document.getElementById('first-name').value.trim() !== '',   'Please enter your first name.');
    check('last-name',    'error-last-name',     document.getElementById('last-name').value.trim() !== '',    'Please enter your last name.');
    check('email',        'error-email',         isValidEmail(document.getElementById('email').value),        'Please enter a valid email address.');
    check('phone',        'error-phone',         isValidPhone(document.getElementById('phone').value),        'Please enter a valid mobile number.');
    check('house-number', 'error-house-number',  document.getElementById('house-number').value.trim() !== '', 'Please enter your house or unit number.');
    check('street',       'error-street',        document.getElementById('street').value.trim() !== '',       'Please enter your street name.');
    check('zip',          'error-zip',           document.getElementById('zip').value.trim() !== '',          'Please enter your ZIP code.');
    check('barangay-search', 'error-barangay',   barangayHidden.value !== '',                                 'Please select a valid barangay.');
    check('password', 'error-password', isValidPassword(document.getElementById('password').value), 'Password must be at least 8 characters.');
    check('confirm-password', 'error-confirm-password', document.getElementById('password').value === document.getElementById('confirm-password').value, 'Passwords do not match.');
    // step 2
    check('relationship',    'error-relationship',    document.getElementById('relationship').value !== '',    'Please select your relationship to the senior.');
    check('decision-maker',  'error-decision-maker',  document.getElementById('decision-maker').value !== '',  'Please answer the decision maker question.');
    check('verification-doc','error-verification-doc',document.getElementById('verification-doc').files.length > 0,'Please upload a proof of relationship document.');

    // step 3
    if (linkedSeniors.length === 0) {
      showError('error-linked-seniors', true);
      errors.push({ id: null, msg: 'Please link at least one senior.' });
    }

    // step 4
    check('contact-method',    'error-contact-method',    document.getElementById('contact-method').value !== '',    'Please choose a contact method.');
    check('update-frequency',  'error-update-frequency',  document.getElementById('update-frequency').value !== '',  'Please choose an update frequency.');

    // step 5
    check('terms',        'error-terms',        document.getElementById('terms').checked,        'You must agree to the terms.');
    check('accuracy',     'error-accuracy',     document.getElementById('accuracy').checked,     'Please confirm your information is accurate.');
    check('data-privacy', 'error-data-privacy', document.getElementById('data-privacy').checked, 'Please give your consent to continue.');
    check('authorization','error-authorization',document.getElementById('authorization').checked, 'Please confirm your authorization.');

    if (errors.length > 0) {
      summaryList.innerHTML = errors
        .map(err => err.id
          ? `<li><a href="#${err.id}">${err.msg}</a></li>`
          : `<li>${err.msg}</li>`)
        .join('');
      summaryBox.hidden = false;
      const firstId = errors.find(e => e.id)?.id;
      if (firstId) document.getElementById(firstId).focus();
      return;
    }

    summaryBox.hidden = true;

    // replace w actual fetch
    document.getElementById('register-family-form').hidden = true;
    document.getElementById('register-success').hidden = false;
  });

})();