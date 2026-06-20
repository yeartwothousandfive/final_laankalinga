// barangay
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
  'Tandang Sora', 'Tatalon', "Teacher's Village East",
  "Teacher's Village West", 'Ugong Norte', 'Unang Sigaw',
  'UP Campus', 'UP Village', 'Vasra', 'Veterans Village',
  'Villa Maria Clara', 'West Kamias', 'West Triangle', 'White Plains'
];

const barangaySearch = document.getElementById('barangay-search');
const barangayHidden = document.getElementById('barangay');
const barangayList   = document.getElementById('barangay-list');

qcBarangays.forEach(b => {
  const opt = document.createElement('option');
  opt.value = b;
  barangayList.appendChild(opt);
});

barangaySearch.addEventListener('change', () => {
  const val = barangaySearch.value.trim();
  if (qcBarangays.includes(val)) {
    barangayHidden.value = val;
    clearError('barangay-search', 'error-barangay');
  } else {
    barangayHidden.value = '';
    showError('barangay-search', 'error-barangay');
  }
});

// helpers
function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (!field || !errorEl) return;
  field.classList.add('field--invalid');
  if (message) errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (!field || !errorEl) return;
  field.classList.remove('field--invalid');
  errorEl.hidden = true;
}

document.getElementById('password').addEventListener('blur', () => {
  validatePassword(); // already shows/clears its own errors
});

document.getElementById('confirm-password').addEventListener('blur', () => {
  const match = document.getElementById('password').value === document.getElementById('confirm-password').value;
  if (!match) showError('confirm-password', 'error-confirm-password');
  else clearError('confirm-password', 'error-confirm-password');
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

// password validation
function validatePassword() {
  const pw = document.getElementById('password');
  const confirm = document.getElementById('confirm-password');

  if (pw.value.length < 8) {
    showError('password', 'error-password');
    return false;
  }
  clearError('password', 'error-password');

  if (pw.value !== confirm.value) {
    showError('confirm-password', 'error-confirm-password');
    return false;
  }
  clearError('confirm-password', 'error-confirm-password');
  return true;
}

// dob validation
function validateDob() {
  const dobEl = document.getElementById('dob');
  if (!dobEl.value) {
    showError('dob', 'error-dob');
    return false;
  }
  const today = new Date();
  const dob = new Date(dobEl.value + 'T00:00:00');
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 50 || age > 110) {
    showError('dob', 'error-dob');
    return false;
  }
  clearError('dob', 'error-dob');
  return true;
}

// phone validation
function validatePhone(fieldId, errorId) {
  const el = document.getElementById(fieldId);
  const val = el.value.replace(/\s/g, '');
  if (!val) {
    showError(fieldId, errorId);
    return false;
  }
  if (!/^09\d{9}$/.test(val)) {
    showError(fieldId, errorId, 'Dapat magsimula sa 09 at may 11 digits. / Must start with 09 and be 11 digits.');
    return false;
  }
  clearError(fieldId, errorId);
  return true;
}

// philsys follow up
const philsysInput = document.getElementById('philsys-id');
const philsysFollowup = document.getElementById('philsys-followup');

philsysFollowup.addEventListener('change', () => {
  philsysInput.disabled = philsysFollowup.checked;
  if (philsysFollowup.checked) {
    philsysInput.value = '';
    clearError('philsys-id', 'error-philsys-id');
  }
});

// pwdd status
const pwdStatus = document.getElementById('pwd-status');
const pwdDetailsGroup = document.getElementById('group-pwd-details');
const pwdUploadGroup = document.getElementById('group-pwd-upload');
const pwdUpload = document.getElementById('pwd-upload');

pwdStatus.addEventListener('change', () => {
  const hasDisability = pwdStatus.value === 'yes' || pwdStatus.value === 'yes-no-id';
  const hasId = pwdStatus.value === 'yes';

  pwdDetailsGroup.hidden = !hasDisability;
  pwdUploadGroup.hidden = !hasId;
  pwdUpload.required = hasId;

  if (!hasId) {
    pwdUpload.value = '';
    clearError('pwd-upload', 'error-pwd-upload');
  }
});

// req fuilds
const REQUIRED_FIELDS = [
  ['first-name',                    'error-first-name'],
  ['last-name',                     'error-last-name'],
  ['gender',                        'error-gender'],
  ['civil-status',                  'error-civil-status'],
  ['phone',                         'error-phone'],
  ['house-number',                  'error-house-number'],
  ['street',                        'error-street'],
  ['primary-contact-name',          'error-primary-contact-name'],
  ['primary-contact-relationship',  'error-primary-contact-relationship'],
  ['primary-contact-phone',         'error-primary-contact-phone'],
  ['terms',                         'error-terms'],
  ['accuracy',                      'error-accuracy'],
  ['data-privacy',                  'error-data-privacy'],
];

REQUIRED_FIELDS.forEach(([fieldId, errorId]) => {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.addEventListener('blur', () => {

    if (fieldId === 'dob') { validateDob(); return; }
    if (fieldId === 'phone' || fieldId === 'primary-contact-phone') {
      validatePhone(fieldId, errorId); return;
    }

    if (el.type === 'checkbox') {
      if (!el.checked) showError(fieldId, errorId);
      else clearError(fieldId, errorId);
      return;
    }

    if (!el.value.trim()) showError(fieldId, errorId);
    else clearError(fieldId, errorId);

  });
  el.addEventListener('input', () => {
    if (el.type === 'checkbox') return;
    if (el.value.trim()) clearError(fieldId, errorId);
  });
});

// submit
document.getElementById('register-senior-form').addEventListener('submit', e => {
  e.preventDefault();
  let errors = [];

  REQUIRED_FIELDS.forEach(([fieldId, errorId]) => {
    const el = document.getElementById(fieldId);
    if (!el) return;

    if (fieldId === 'dob') {
      if (!validateDob()) errors.push({ fieldId, label: 'Petsa ng Kapanganakan / Date of birth' });
      return;
    }
    if (fieldId === 'phone') {
      if (!validatePhone('phone', 'error-phone')) errors.push({ fieldId, label: 'Numero ng Cellphone / Mobile number' });
      return;
    }
    if (fieldId === 'primary-contact-phone') {
      if (!validatePhone('primary-contact-phone', 'error-primary-contact-phone')) errors.push({ fieldId, label: 'Numero ng Pangunahing Kontak / Primary contact number' });
      return;
    }
    if (el.type === 'checkbox') {
      if (!el.checked) {
        showError(fieldId, errorId);
        errors.push({ fieldId, label: el.closest('.field-group')?.querySelector('label')?.textContent?.trim()?.slice(0, 50) || fieldId });
      }
      return;
    }
    if (!el.value.trim()) {
      showError(fieldId, errorId);
      errors.push({ fieldId, label: document.querySelector(`label[for="${fieldId}"]`)?.textContent?.trim()?.slice(0, 50) || fieldId });
    } else {
      clearError(fieldId, errorId);
    }

    if (!barangayHidden.value) {
      showError('barangay-search', 'error-barangay');
      errors.push({ fieldId: 'barangay-search', label: 'Barangay' });
    }

  });

  // philsys: must have ID or follow-up checked
  if (!philsysInput.value.trim() && !philsysFollowup.checked) {
    showError('philsys-id', 'error-philsys-id');
    errors.push({ fieldId: 'philsys-id', label: 'PhilSys ID / National ID' });
  }

  // PWD upload: required only if "yes" selected
  if (pwdUpload.required && !pwdUpload.files.length) {
    showError('pwd-upload', 'error-pwd-upload');
    errors.push({ fieldId: 'pwd-upload', label: 'PWD ID' });
  }

  if (errors.length > 0) {
    const summary = document.getElementById('error-summary');
    const list = document.getElementById('error-summary-list');
    list.innerHTML = '';
    errors.forEach(({ fieldId, label }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + fieldId;
      a.textContent = label;
      a.addEventListener('click', ev => {
        ev.preventDefault();
        document.getElementById(fieldId)?.focus();
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    summary.hidden = false;
    summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  document.getElementById('error-summary').hidden = true;

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Nagsusumite… / Submitting…';

  e.target.submit();

  // TODO: POST /api/register/senior
  document.getElementById('register-senior-form').hidden = true;
  document.getElementById('register-success').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});