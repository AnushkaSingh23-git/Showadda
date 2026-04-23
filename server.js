const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
if (!fs.existsSync(BOOKINGS_FILE)) fs.writeFileSync(BOOKINGS_FILE, '[]');

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
  catch { return []; }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'bms-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Please sign in to continue' });
  next();
}

// Pages
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'idx.html')));
app.get('/signin', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'signin.html')));
app.get('/bookings', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'bookings.html')));






// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const users = readJSON(USERS_FILE);
  if (users.find(u => u.email === email))
    return res.status(400).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, password: hashed, createdAt: new Date().toISOString() };
  users.push(user);
  writeJSON(USERS_FILE, users);

  req.session.userId = user.id;
  req.session.userName = user.name;
  res.json({ success: true, name: user.name });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid email or password' });

  req.session.userId = user.id;
  req.session.userName = user.name;
  res.json({ success: true, name: user.name });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// Current session user
app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, name: req.session.userName, id: req.session.userId });
});

// Save a booking
app.post('/api/bookings', requireAuth, (req, res) => {
  const { showId, showName, showImage, seats, fare, paymentId, paymentMethod } = req.body;
  if (!showId || !seats || !seats.length)
    return res.status(400).json({ error: 'Invalid booking data' });

  const bookings = readJSON(BOOKINGS_FILE);
  const booking = {
    id: Date.now().toString(),
    userId: req.session.userId,
    userName: req.session.userName,
    showId: String(showId),
    showName,
    showImage,
    seats,
    fare,
    paymentId: paymentId || null,
    paymentMethod: paymentMethod || null,
    bookedAt: new Date().toISOString()
  };
  bookings.push(booking);
  writeJSON(BOOKINGS_FILE, bookings);
  res.json({ success: true, booking });
});

// Get current user's bookings
app.get('/api/bookings', requireAuth, (req, res) => {
  const bookings = readJSON(BOOKINGS_FILE);
  res.json(bookings.filter(b => b.userId === req.session.userId).reverse());
});

// Get booked seat numbers for a show
app.get('/api/seats/:showId', (req, res) => {
  const bookings = readJSON(BOOKINGS_FILE);
  const booked = bookings
    .filter(b => b.showId === req.params.showId)
    .flatMap(b => b.seats.map(String));
  res.json([...new Set(booked)]);
});

app.listen(6000, () => console.log('Server running at http://localhost:5000'));
