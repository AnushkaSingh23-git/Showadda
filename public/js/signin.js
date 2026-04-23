function showError(msg) {
  const el = document.getElementById('errMsg');
  el.textContent = msg;
  el.classList.remove('hidden');
  document.getElementById('successMsg').classList.add('hidden');
}


function showSuccess(msg) {
  const el = document.getElementById('successMsg');
  el.textContent = msg;
  el.classList.remove('hidden');
  document.getElementById('errMsg').classList.add('hidden');
}


function clearMessages() {
  document.getElementById('errMsg').classList.add('hidden');
  document.getElementById('successMsg').classList.add('hidden');
}

function switchTab(tab) {
  clearMessages();
  if (tab === 'login') {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabRegister').classList.remove('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
  } else {
    document.getElementById('tabRegister').classList.add('active');
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
  }
}


function doLogin() {
  clearMessages();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) return showError('Please fill in all fields.');
  if (!email.includes('@')) return showError('Enter a valid email address.');
  if (password.length < 6) return showError('Password must be at least 6 characters.');

  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showError(data.error);
        btn.disabled = false;
        btn.textContent = 'Sign In';
      } else {
        showSuccess(`Welcome back, ${data.name}! Redirecting...`);
        setTimeout(() => window.location.href = '/', 1000);
      }
    })
    .catch(() => {
      showError('Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Sign In';
    });
}

function doRegister() {
  clearMessages();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) return showError('Please fill in all fields.');
  if (!email.includes('@')) return showError('Enter a valid email address.');
  if (password.length < 6) return showError('Password must be at least 6 characters.');

  const btn = document.getElementById('registerBtn');
  btn.disabled = true;
  btn.textContent = 'Creating account...';

  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showError(data.error);
        btn.disabled = false;
        btn.textContent = 'Create Account';
      } else {
        showSuccess(`Account created! Welcome, ${data.name}! Redirecting...`);
        setTimeout(() => window.location.href = '/', 1000);
      }
    })
    .catch(() => {
      showError('Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Create Account';
    });
}

// Allow Enter key to submit

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (!document.getElementById('registerForm').classList.contains('hidden')) doRegister();
  else doLogin();
});
