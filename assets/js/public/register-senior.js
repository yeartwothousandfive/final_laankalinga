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

  // TODO: POST /api/register/senior
  document.getElementById('register-senior-form').hidden = true;
  document.getElementById('register-success').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});