(function () {
  const form = document.getElementById('signup-form');
  if (!form) return;

  // ——— Password visibility toggle ———
  document.querySelectorAll('.toggle-password').forEach((btn) => {
    btn.addEventListener('click', function () {
      const wrap = this.closest('.password-input-wrap');
      const input = wrap.querySelector('input');
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      this.setAttribute('aria-pressed', isHidden);
      this.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  });

  // ——— Validation helpers ———
  function showError(field, message) {
    const group = field.closest('.field-group');
    const msg = group?.querySelector('.error-msg');
    if (msg) msg.textContent = message || '';
    field.classList.add('error');
    field.classList.remove('valid');
  }

  function showValid(field) {
    const group = field.closest('.field-group');
    const msg = group?.querySelector('.error-msg');
    if (msg) msg.textContent = '';
    field.classList.remove('error');
    field.classList.add('valid');
  }

  function clearFieldState(field) {
    field.classList.remove('error', 'valid');
    const group = field.closest('.field-group');
    const msg = group?.querySelector('.error-msg');
    if (msg) msg.textContent = '';
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // ——— Live validation on blur / input ———
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach((field) => {
    field.addEventListener('blur', function () {
      if (this.type === 'checkbox') return;
      const value = this.value.trim();
      if (!value) {
        showError(this, 'This field is required');
        return;
      }
      if (this.type === 'email' && !validateEmail(value)) {
        showError(this, 'Please enter a valid email');
        return;
      }
      if (this.id === 'password' && value.length < 8) {
        showError(this, 'Password must be at least 8 characters');
        return;
      }
      showValid(this);
    });
    field.addEventListener('input', function () {
      clearFieldState(this);
    });
  });

  const confirmPassword = form.querySelector('#confirmPassword');
  if (confirmPassword) {
    confirmPassword.addEventListener('blur', function () {
      const password = form.querySelector('#password');
      if (!this.value.trim()) return;
      if (this.value !== password?.value) {
        showError(this, 'Passwords do not match');
      } else {
        showValid(this);
      }
    });
    confirmPassword.addEventListener('input', function () {
      clearFieldState(this);
    });
  }

  const termsCheckbox = form.querySelector('#terms');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', function () {
      const group = this.closest('.field-group');
      const msg = group?.querySelector('.error-msg');
      if (msg) msg.textContent = this.checked ? '' : 'You must accept the terms';
      group?.querySelector('.checkbox-label')?.classList.toggle('error', !this.checked);
    });
  }

  // ——— Submit validation ———
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // Required text/email/tel/select
    form.querySelectorAll('.field-group input[required]:not([type="checkbox"]), .field-group select[required]').forEach((field) => {
      const value = field.value.trim();
      if (!value) {
        showError(field, 'This field is required');
        isValid = false;
        return;
      }
      if (field.type === 'email' && !validateEmail(value)) {
        showError(field, 'Please enter a valid email');
        isValid = false;
        return;
      }
      if (field.id === 'password' && value.length < 8) {
        showError(field, 'Password must be at least 8 characters');
        isValid = false;
        return;
      }
      showValid(field);
    });

    // Confirm password
    const password = form.querySelector('#password');
    if (confirmPassword && confirmPassword.value !== password?.value) {
      showError(confirmPassword, 'Passwords do not match');
      isValid = false;
    } else if (confirmPassword?.value) {
      showValid(confirmPassword);
    }

    // Terms
    if (termsCheckbox && !termsCheckbox.checked) {
      const group = termsCheckbox.closest('.field-group');
      const msg = group?.querySelector('.error-msg');
      if (msg) msg.textContent = 'You must accept the terms';
      isValid = false;
    }

    if (isValid) {
      // Simulate success (replace with real submit)
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Account created!';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
        form.querySelectorAll('.error, .valid').forEach((el) => el.classList.remove('error', 'valid'));
        form.querySelectorAll('.error-msg').forEach((el) => (el.textContent = ''));
      }, 2000);
    }
  });

  // ——— Reset: clear all errors ———
  form.addEventListener('reset', function () {
    setTimeout(() => {
      form.querySelectorAll('.error, .valid').forEach((el) => el.classList.remove('error', 'valid'));
      form.querySelectorAll('.error-msg').forEach((el) => (el.textContent = ''));
      form.querySelector('.checkbox-label.error')?.classList.remove('error');
    }, 0);
  });
})();
