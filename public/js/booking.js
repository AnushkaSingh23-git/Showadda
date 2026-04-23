document.addEventListener('DOMContentLoaded', () => {

  // ── Seat Modal ──────────────────────────────────────────────────────────────
  const seatModal = document.createElement('div');
  seatModal.id = 'seatModal';
  seatModal.style = `
    display:none; position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.85); justify-content:center; align-items:center;
    overflow-y:auto; z-index:9999;
  `;
  seatModal.innerHTML = `
    <div style="background:white; padding:24px; border-radius:8px; max-width:520px; width:90%; position:relative;">
      <span id="closeSeatModal" style="position:absolute; top:10px; right:15px; cursor:pointer; font-size:20px;">&times;</span>
      <h3 style="margin-bottom:10px;">Select Your Seats</h3>
      <div style="font-size:12px; display:flex; gap:14px; align-items:center; margin-bottom:12px;">
        <span><span style="display:inline-block;width:14px;height:14px;background:lightgray;border-radius:3px;vertical-align:middle;margin-right:4px;"></span>Available</span>
        <span><span style="display:inline-block;width:14px;height:14px;background:red;border-radius:3px;vertical-align:middle;margin-right:4px;"></span>Booked</span>
        <span><span style="display:inline-block;width:14px;height:14px;background:green;border-radius:3px;vertical-align:middle;margin-right:4px;"></span>Selected</span>
      </div>
      <div id="seatMap" style="display:grid; grid-template-columns:repeat(8, 40px); gap:5px;"></div>
      <p style="margin-top:14px;">Selected Seats: <span id="selectedSeatsCount">0</span> &nbsp;|&nbsp; Seat No.: <span id="selectedSeatsNums">—</span></p>
      <p style="margin-top:4px;">Price per seat: ₹<span id="pricePerSeat">—</span> &nbsp;|&nbsp; Total Fare: ₹<span id="totalFare">0</span></p>
      <div id="bookingMsg" style="display:none; margin-top:10px; padding:9px 14px; border-radius:5px; font-size:13px; text-align:center;"></div>
      <button id="proceedToPayment" style="margin-top:14px; padding:10px 20px; background:rgb(244,69,98); color:white; border:none; border-radius:4px; cursor:pointer; font-size:14px; font-weight:700; width:100%;">Proceed to Payment</button>
    </div>
  `;
  document.body.appendChild(seatModal);

  // ── Payment Modal ───────────────────────────────────────────────────────────
  const payModal = document.createElement('div');
  payModal.id = 'payModal';
  payModal.style = `
    display:none; position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.85); justify-content:center; align-items:center;
    overflow-y:auto; z-index:10000;
  `;
  payModal.innerHTML = `
    <div style="background:white; border-radius:10px; max-width:480px; width:92%; position:relative; overflow:hidden; box-shadow:0 8px 40px rgba(0,0,0,0.3);">
      <!-- Header -->
      <div style="background:rgb(42,42,68); padding:18px 24px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="color:white; font-size:16px; font-weight:700;">Complete Payment</div>
          <div style="color:rgba(255,255,255,0.6); font-size:12px; margin-top:2px;">Secure &amp; Encrypted</div>
        </div>
        <span id="closePayModal" style="cursor:pointer; font-size:22px; color:rgba(255,255,255,0.7);">&times;</span>
      </div>

      <!-- Order Summary -->
      <div id="paySummary" style="background:rgb(250,250,255); border-bottom:1px solid #eee; padding:14px 24px; font-size:13px; color:#444;"></div>

      <!-- Payment Tabs -->
      <div style="padding:0 24px; margin-top:16px;">
        <div style="display:flex; gap:0; border:1px solid #ddd; border-radius:6px; overflow:hidden; margin-bottom:18px;">
          <button class="pay-tab active" data-tab="card" style="flex:1; padding:9px 4px; border:none; background:rgb(244,69,98); color:white; font-size:12px; font-weight:700; cursor:pointer;">💳 Card</button>
          <button class="pay-tab" data-tab="upi" style="flex:1; padding:9px 4px; border:none; background:#f5f5f5; color:#555; font-size:12px; font-weight:700; cursor:pointer;">📱 UPI</button>
          <button class="pay-tab" data-tab="netbanking" style="flex:1; padding:9px 4px; border:none; background:#f5f5f5; color:#555; font-size:12px; font-weight:700; cursor:pointer;">🏦 Net Banking</button>
          <button class="pay-tab" data-tab="wallet" style="flex:1; padding:9px 4px; border:none; background:#f5f5f5; color:#555; font-size:12px; font-weight:700; cursor:pointer;">👛 Wallet</button>
        </div>

        <!-- Card Form -->
        <div id="tab-card" class="pay-panel">
          <div style="margin-bottom:12px;">
            <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">Card Number</label>
            <input id="cardNumber" maxlength="19" placeholder="1234 5678 9012 3456"
              style="width:100%; padding:10px 12px; border:1px solid #ddd; border-radius:5px; font-size:14px; outline:none;">
          </div>
          <div style="display:flex; gap:12px; margin-bottom:12px;">
            <div style="flex:1;">
              <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">Expiry (MM/YY)</label>
              <input id="cardExpiry" maxlength="5" placeholder="MM/YY"
                style="width:100%; padding:10px 12px; border:1px solid #ddd; border-radius:5px; font-size:14px; outline:none;">
            </div>
            <div style="flex:1;">
              <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">CVV</label>
              <input id="cardCvv" maxlength="3" placeholder="•••" type="password"
                style="width:100%; padding:10px 12px; border:1px solid #ddd; border-radius:5px; font-size:14px; outline:none;">
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">Name on Card</label>
            <input id="cardName" placeholder="John Doe"
              style="width:100%; padding:10px 12px; border:1px solid #ddd; border-radius:5px; font-size:14px; outline:none;">
          </div>
        </div>

        <!-- UPI Form -->
        <div id="tab-upi" class="pay-panel" style="display:none;">
          <div style="margin-bottom:14px;">
            <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">UPI ID</label>
            <input id="upiId" placeholder="yourname@upi"
              style="width:100%; padding:10px 12px; border:1px solid #ddd; border-radius:5px; font-size:14px; outline:none;">
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
            ${['GPay','PhonePe','Paytm','BHIM'].map(app => `
              <button onclick="document.getElementById('upiId').value='yourname@${app.toLowerCase()}'; this.style.borderColor='rgb(244,69,98)'; this.style.color='rgb(244,69,98)';"
                style="padding:8px 14px; border:1px solid #ddd; border-radius:5px; background:white; cursor:pointer; font-size:12px; font-weight:600;">
                ${app}
              </button>`).join('')}
          </div>
        </div>

        <!-- Net Banking Form -->
        <div id="tab-netbanking" class="pay-panel" style="display:none;">
          <div style="margin-bottom:14px;">
            <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">Select Bank</label>
            <select id="bankSelect" style="width:100%; padding:10px 12px; border:1px solid #ddd; border-radius:5px; font-size:14px; outline:none; background:white;">
              <option value="">-- Choose your bank --</option>
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra Bank</option>
              <option>Punjab National Bank</option>
              <option>Bank of Baroda</option>
              <option>Canara Bank</option>
            </select>
          </div>
        </div>

        <!-- Wallet Form -->
        <div id="tab-wallet" class="pay-panel" style="display:none;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
            ${[['Paytm Wallet','💰'],['Amazon Pay','🛒'],['Mobikwik','📲'],['Freecharge','⚡']].map(([name, icon]) => `
              <button class="wallet-option" data-wallet="${name}"
                onclick="selectWallet(this)"
                style="padding:12px 10px; border:1px solid #ddd; border-radius:6px; background:white; cursor:pointer; font-size:12px; font-weight:600; display:flex; align-items:center; gap:8px;">
                <span style="font-size:18px;">${icon}</span> ${name}
              </button>`).join('')}
          </div>
        </div>
      </div>

      <!-- Pay Button -->
      <div style="padding:16px 24px 20px;">
        <div id="payError" style="display:none; background:#ffe0e5; color:rgb(244,69,98); padding:9px 14px; border-radius:5px; font-size:13px; text-align:center; margin-bottom:12px;"></div>
        <button id="payNowBtn" style="width:100%; padding:12px; background:rgb(244,69,98); color:white; border:none; border-radius:6px; font-size:15px; font-weight:700; cursor:pointer;">
          Pay Now
        </button>
        <p style="text-align:center; font-size:11px; color:#999; margin-top:10px;">🔒 100% Secure Payment &nbsp;·&nbsp; SSL Encrypted</p>
      </div>
    </div>
  `;
  document.body.appendChild(payModal);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const seatMapEl             = document.getElementById('seatMap');
  const selectedSeatsCountEl  = document.getElementById('selectedSeatsCount');
  const selectedSeatsNumsEl   = document.getElementById('selectedSeatsNums');
  const totalFareEl           = document.getElementById('totalFare');
  const bookingMsgEl          = document.getElementById('bookingMsg');
  const proceedBtn            = document.getElementById('proceedToPayment');

  let selectedSeats = [];
  let seatPrice     = 150;
  let seats         = [];
  let activePayTab  = 'card';
  let selectedWallet = '';

  function getShowPrice(show) {
    const base        = 120;
    const rating      = show.rating?.average || 6;
    const ratingBonus = Math.round(Math.max(0, rating - 5) * 20);
    const premium     = ['Action','Thriller','Adventure','Sports','Science-Fiction','Crime'];
    const genreBonus  = show.genres?.some(g => premium.includes(g)) ? 50 : 0;
    const idVariation = (show.id % 5) * 20;
    return base + ratingBonus + genreBonus + idVariation;
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function showBookingMsg(msg, type) {
    bookingMsgEl.style.display = 'block';
    bookingMsgEl.style.background = type === 'error' ? '#ffe0e5' : type === 'success' ? '#e0ffe5' : '#fff8e0';
    bookingMsgEl.style.color = type === 'error' ? 'rgb(244,69,98)' : type === 'success' ? '#1a7a3a' : '#7a5a00';
    bookingMsgEl.textContent = msg;
  }

  function hideBookingMsg() { bookingMsgEl.style.display = 'none'; }

  function showPayError(msg) {
    const el = document.getElementById('payError');
    el.style.display = msg ? 'block' : 'none';
    el.textContent = msg;
  }

  // ── Seat modal open ──────────────────────────────────────────────────────────
  document.getElementById('checkSeats').addEventListener('click', () => {
    const show = window.currentShow;
    if (!show) return;
    seatPrice = getShowPrice(show);
    hideBookingMsg();
    selectedSeats = [];
    updateSelection();
    seatModal.style.display = 'flex';
    seatMapEl.innerHTML = '<p style="color:#888; grid-column:1/-1;">Loading seats...</p>';

    fetch(`/api/seats/${show.id}`)
      .then(res => res.json())
      .then(booked => generateSeats(booked.map(String)))
      .catch(() => generateSeats([]));
  });

  document.getElementById('closeSeatModal').addEventListener('click', () => {
    seatModal.style.display = 'none';
    selectedSeats = [];
    updateSelection();
    hideBookingMsg();
  });

  // ── Generate seat grid ───────────────────────────────────────────────────────
  function generateSeats(bookedFromServer) {
    seatMapEl.innerHTML = '';
    seats = [];
    for (let i = 1; i <= 40; i++) {
      const seat = document.createElement('div');
      seat.dataset.seat = String(i);
      const isBooked = bookedFromServer.includes(String(i)) || Math.random() < 0.15;
      if (isBooked) seat.classList.add('booked');
      seat.style.cssText = `
        width:35px; height:35px; border:1px solid #bbb; border-radius:5px;
        display:flex; justify-content:center; align-items:center;
        cursor:${isBooked ? 'not-allowed' : 'pointer'};
        font-size:12px; font-weight:600;
        background:${isBooked ? 'red' : 'lightgray'};
        color:${isBooked ? 'white' : '#333'};
      `;
      seat.innerText = i;
      seatMapEl.appendChild(seat);
      seats.push(seat);

      seat.addEventListener('click', () => {
        if (seat.classList.contains('booked')) return;
        hideBookingMsg();
        if (seat.classList.contains('selected')) {
          seat.classList.remove('selected');
          seat.style.background = 'lightgray';
          seat.style.color = '#333';
          selectedSeats = selectedSeats.filter(s => s !== seat.dataset.seat);
        } else {
          seat.classList.add('selected');
          seat.style.background = 'green';
          seat.style.color = 'white';
          selectedSeats.push(seat.dataset.seat);
        }
        updateSelection();
      });
    }
  }

  function updateSelection() {
    selectedSeatsCountEl.innerText = selectedSeats.length;
    selectedSeatsNumsEl.innerText = selectedSeats.length ? selectedSeats.join(', ') : '—';
    totalFareEl.innerText = selectedSeats.length * seatPrice;
    const priceEl = document.getElementById('pricePerSeat');
    if (priceEl) priceEl.innerText = seatPrice;
  }

  // ── Proceed to Payment ───────────────────────────────────────────────────────
  proceedBtn.addEventListener('click', () => {
    hideBookingMsg();
    if (selectedSeats.length === 0) {
      showBookingMsg('Please select at least one seat first.', 'warn');
      return;
    }

    fetch('/api/me').then(r => r.json()).then(user => {
      if (!user.loggedIn) {
        showBookingMsg('Please sign in to continue.', 'warn');
        setTimeout(() => {
          seatModal.style.display = 'none';
          window.location.href = '/signin';
        }, 1500);
        return;
      }
      openPaymentModal();
    });
  });

  function openPaymentModal() {
    const show = window.currentShow;
    const fare = selectedSeats.length * seatPrice;
    document.getElementById('paySummary').innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; font-size:14px; color:#222;">${show.name}</div>
          <div style="margin-top:3px;">Seats: <b>${selectedSeats.join(', ')}</b> &nbsp;(${selectedSeats.length} ticket${selectedSeats.length > 1 ? 's' : ''})</div>
        </div>
        <div style="font-size:20px; font-weight:800; color:rgb(244,69,98);">₹${fare}</div>
      </div>
    `;
    showPayError('');
    ['cardNumber','cardExpiry','cardCvv','cardName','upiId'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('bankSelect').value = '';
    switchPayTab('card');
    payModal.style.display = 'flex';
  }

  document.getElementById('closePayModal').addEventListener('click', () => {
    payModal.style.display = 'none';
    showPayError('');
  });

  // ── Payment tabs ─────────────────────────────────────────────────────────────
  payModal.querySelectorAll('.pay-tab').forEach(btn => {
    btn.addEventListener('click', () => switchPayTab(btn.dataset.tab));
  });

  function switchPayTab(tab) {
    activePayTab = tab;
    selectedWallet = '';
    payModal.querySelectorAll('.pay-tab').forEach(b => {
      b.style.display = '';
      const active = b.dataset.tab === tab;
      b.style.background = active ? 'rgb(244,69,98)' : '#f5f5f5';
      b.style.color = active ? 'white' : '#555';
    });
    payModal.querySelectorAll('.pay-panel').forEach(p => {
      p.style.display = p.id === `tab-${tab}` ? 'block' : 'none';
    });
    // reset UPI app button highlights when switching tabs
    payModal.querySelectorAll('.pay-panel button').forEach(b => {
      b.style.borderColor = '#ddd';
      b.style.color = '';
    });
  }

  // ── Wallet selection ─────────────────────────────────────────────────────────
  window.selectWallet = function(btn) {
    document.querySelectorAll('.wallet-option').forEach(b => {
      b.style.borderColor = '#ddd';
      b.style.background = 'white';
    });
    btn.style.borderColor = 'rgb(244,69,98)';
    btn.style.background = 'rgb(255,245,247)';
    selectedWallet = btn.dataset.wallet;
  };

  // ── Card number formatting ───────────────────────────────────────────────────
  document.getElementById('cardNumber').addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });
  document.getElementById('cardExpiry').addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  });

  // ── Pay Now ──────────────────────────────────────────────────────────────────
  document.getElementById('payNowBtn').addEventListener('click', () => {
    showPayError('');

    // Validate based on active tab
    if (activePayTab === 'card') {
      const num  = document.getElementById('cardNumber').value.replace(/\s/g, '');
      const exp  = document.getElementById('cardExpiry').value;
      const cvv  = document.getElementById('cardCvv').value;
      const name = document.getElementById('cardName').value.trim();
      if (num.length < 16)   return showPayError('Enter a valid 16-digit card number.');
      if (!/^\d{2}\/\d{2}$/.test(exp)) return showPayError('Enter expiry in MM/YY format.');
      if (cvv.length < 3)    return showPayError('Enter a valid 3-digit CVV.');
      if (!name)             return showPayError('Enter the name on card.');
    } else if (activePayTab === 'upi') {
      const upi = document.getElementById('upiId').value.trim();
      if (!upi.includes('@')) return showPayError('Enter a valid UPI ID (e.g. name@upi).');
    } else if (activePayTab === 'netbanking') {
      if (!document.getElementById('bankSelect').value) return showPayError('Please select a bank.');
    } else if (activePayTab === 'wallet') {
      if (!selectedWallet) return showPayError('Please select a wallet.');
    }

    const payBtn = document.getElementById('payNowBtn');
    payBtn.disabled = true;
    payBtn.textContent = '⏳ Processing...';

    // Simulate payment gateway delay then confirm booking
    setTimeout(() => confirmBooking(payBtn), 2000);
  });

  function confirmBooking(payBtn) {
    const show   = window.currentShow;
    const fare   = selectedSeats.length * seatPrice;
    const paymentId = 'PAY' + Date.now();
    const paymentMethod = activePayTab === 'wallet' ? selectedWallet : activePayTab;

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showId:        String(show.id),
        showName:      show.name,
        showImage:     show.image?.medium ?? '',
        seats:         selectedSeats,
        fare,
        paymentId,
        paymentMethod
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          showPayError(data.error);
          payBtn.disabled = false;
          payBtn.textContent = 'Pay Now';
          return;
        }

        // Success — show confirmation screen
        payBtn.textContent = '✓ Payment Successful!';
        payBtn.style.background = '#1a7a3a';

        const summary = document.getElementById('paySummary');
        summary.innerHTML = `
          <div style="text-align:center; padding:12px 0;">
            <div style="font-size:40px; margin-bottom:8px;">🎉</div>
            <div style="font-size:16px; font-weight:800; color:#1a7a3a; margin-bottom:4px;">Booking Confirmed!</div>
            <div style="font-size:13px; color:#555; margin-bottom:4px;">${show.name}</div>
            <div style="font-size:13px; color:#555;">Seats: <b>${selectedSeats.join(', ')}</b> &nbsp;·&nbsp; ₹${fare}</div>
            <div style="font-size:11px; color:#999; margin-top:6px;">Payment ID: ${paymentId}</div>
          </div>
        `;

        // Hide payment panels + button
        payModal.querySelectorAll('.pay-panel, .pay-tab').forEach(el => el.style.display = 'none');
        payBtn.style.width = '100%';

        // Mark seats visually in seat map
        selectedSeats.forEach(s => {
          const seat = seats.find(se => se.dataset.seat === s);
          if (seat) {
            seat.classList.add('booked');
            seat.classList.remove('selected');
            seat.style.background = 'red';
            seat.style.color = 'white';
            seat.style.cursor = 'not-allowed';
          }
        });
        selectedSeats = [];
        updateSelection();

        setTimeout(() => {
          payModal.style.display = 'none';
          seatModal.style.display = 'none';
          hideBookingMsg();
          payBtn.disabled = false;
          payBtn.textContent = 'Pay Now';
          payBtn.style.background = 'rgb(244,69,98)';
          // Restore panels
          switchPayTab('card');
        }, 3500);
      })
      .catch(() => {
        showPayError('Payment failed. Please try again.');
        payBtn.disabled = false;
        payBtn.textContent = 'Pay Now';
      });
  }

});
