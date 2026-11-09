/* Rajmudra Tours & Travels - shared site script */
const PHONE = '917758873030';
const CARS = { /* placeholder rates: edit with the customer's real fares */
  Aura:   { name: 'Hyundai Aura',  seats: 4, base: 300, km: 11, img: 'assets/aura.jpg',   pos: 'center', sub: 'Comfortable sedan',   info: ['Up to 4 passengers', 'Air-conditioned', 'Boot space for luggage', 'Great for city and highway trips, couples and small families'] },
  Ertiga: { name: 'Maruti Ertiga', seats: 6, base: 400, km: 15, img: 'assets/ertiga.jpg', pos: 'center', sub: 'Spacious 7-seater',   info: ['Up to 6 passengers', 'Air-conditioned', 'Room for family luggage', 'Great for family tours, pilgrimages and groups'] },
  Innova: { name: 'Toyota Innova Crysta', seats: 7, base: 500, km: 19, img: 'assets/innova.png', fit: 'contain', bg: '#fff', pos: 'center', sub: 'Premium 7-seater MPV', info: ['Up to 7 passengers', 'Air-conditioned, comfortable captain-style cabin', 'Plenty of room for family luggage', 'Great for long tours, pilgrimages and groups'] },
  Carens: { name: 'Kia Carens', seats: 6, base: 450, km: 17, img: 'assets/carens.jpg', pos: 'center 60%', sub: 'Modern family MPV',   info: ['Up to 6 passengers', 'Comfortable cabin for long drives', 'Roomy for family and luggage', 'Great for family tours and groups'] },
  DzireTour: { name: 'Maruti Suzuki Dzire Tour S', seats: 4, base: 300, km: 11, img: 'assets/dzire-tour-s.png', pos: 'center', sub: 'Reliable tour sedan', info: ['Up to 4 passengers', 'Air-conditioned', 'Fuel-efficient and easy to drive', 'Great for city, airport and outstation trips'] },
  Dzire:  { name: 'Maruti Suzuki Dzire', seats: 4, base: 320, km: 12, img: 'assets/dzire.png', pos: 'center', fit: 'contain', bg: '#fff', sub: 'Stylish modern sedan', info: ['Up to 4 passengers', 'Air-conditioned with a premium cabin', 'Smooth ride and good boot space', 'Great for couples, business and small families'] },
  Tigor:  { name: 'Tata Tigor', seats: 4, base: 300, km: 11, img: 'assets/tigor.png', pos: 'center', fit: 'contain', bg: '#e5e5e5', sub: 'Compact sedan', info: ['Up to 4 passengers', 'Air-conditioned', 'Solid build with a comfortable ride', 'Great for city and highway trips'] },
  Rumion: { name: 'Toyota Rumion', seats: 6, base: 450, km: 17, img: 'assets/rumion.png', pos: 'center', fit: 'contain', bg: '#fff', sub: 'Premium family MPV', info: ['Up to 6 passengers', 'Spacious, comfortable cabin', 'Room for family luggage', 'Great for family tours, pilgrimages and groups'] }
};
const SVC = [['➡️','One way','Drop-only trips between cities.'],['🔁','Round trip','Go and return with the same car and driver.'],['⏱️','Local hire','8 hr / 80 km packages for city errands and meetings.'],['🛣️','Outstation','Multi-day tours with a driver who knows the road.'],['🛕','Devdarshan','Comfortable pilgrimage trips for families and elders.'],['💍','Weddings','Cars for wedding days and functions.'],['🏖️','Family tours','Roomy Ertiga for sightseeing with luggage.'],['🎉','Events','Pickup and drop for programs and events.']];
const ROUTES = [['Pune','पुणे'],['Mumbai','मुंबई'],['Goa','गोवा'],['Belgaum','बेळगाव'],['Ratnagiri','रत्नागिरी'],['Solapur','सोलापूर'],['Pandharpur','पंढरपूर']];
/* Genuine customer reviews only. Add one object per real review:
   { name: 'Customer name', trip: 'Shirdi darshan', rating: 5, text: 'Their own words' } */
const REVIEWS = [];

const $ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wa = text => open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank');

/* ---------- static sections ---------- */
$('.svc').forEach(g => g.innerHTML = SVC.map(s => `<div class="card"><div class="ic">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p></div>`).join(''));
$('.rt').forEach(g => g.innerHTML = ROUTES.slice(0, +(g.dataset.n || 99)).map(([en, mr]) =>
  `<div class="card dest"><div class="pin">📍</div><h3>${en}</h3><p class="mr">${mr}</p><p>Comfortable cars, booked by call or WhatsApp.</p><p style="margin-top:12px"><a class="btn nv" href="booking.html?to=${encodeURIComponent(en)}">Book this route</a></p></div>`).join(''));
const rv = document.getElementById('reviews');
if (rv) rv.innerHTML = REVIEWS.map(r => `<figure class="card"><div class="stars">${'★'.repeat(r.rating)}</div><blockquote>“${esc(r.text)}”</blockquote><figcaption>${esc(r.name)}${r.trip ? ' · ' + esc(r.trip) : ''}</figcaption></figure>`).join('');

/* ---------- review form (sends to the owner on WhatsApp) ---------- */
const rsend = document.getElementById('rsend');
if (rsend) rsend.onclick = () => {
  const name = rn.value.trim(), text = rtx.value.trim();
  if (!name || !text) { rerr.textContent = 'Please enter your name and review.'; return; }
  rerr.textContent = '';
  wa(['*Customer review*', `Name: ${name}`, rtp.value.trim() && `Trip: ${rtp.value.trim()}`, `Rating: ${rr.value}/5`, `Review: ${text}`].filter(Boolean).join('\n'));
};

/* ---------- fare estimator + rate card (fares page) ---------- */
if (window.rc) rc.innerHTML = Object.entries(CARS).map(([, c]) => `<tr><td>${c.name}</td><td>${c.seats}</td><td>₹${c.base}</td><td>₹${c.km}</td></tr>`).join('');
if (window.ev) ev.innerHTML = Object.entries(CARS).map(([k, c]) => `<option value="${k}">${c.name}</option>`).join('');
function est() {
  const c = CARS[ev.value], k = +ed.value || 0, d = Math.max(1, +edy.value || 1), t = et.value;
  const f = t == 'one' ? c.base + k * c.km
    : t == 'round' ? c.base + Math.max(k * 2, d * 150) * c.km
    : t == 'local' ? c.km * 80 + c.base + 300
    : Math.max(k * 2, d * 250) * c.km + d * 300;
  er.textContent = '₹' + Math.round(f).toLocaleString('en-IN');
}

/* ---------- booking form (home + booking page) ---------- */
const TRIPS = ['One Way', 'Round Trip', 'Local Hire', 'Outstation'];
let trip = TRIPS[0];
const formHTML = full => `<div class="pills">${TRIPS.map((t, i) => `<button type="button" class="${i ? '' : 'on'}">${t}</button>`).join('')}</div>
<div class="fg"><label>Full name<input name="n" autocomplete="name"></label><label>Mobile number<input name="m" type="tel" autocomplete="tel" inputmode="numeric"></label>
<label>Pickup location<input name="p"></label><label>Destination<input name="d"></label>
<label>Journey date<input name="dt" type="date"></label><label>Pickup time<span class="tm"><select name="th"><option value="">Hr</option>${Array.from({length: 12}, (_, i) => `<option>${i + 1}</option>`).join('')}</select><select name="tmi">${['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => `<option>${m}</option>`).join('')}</select><select name="tp"><option>AM</option><option>PM</option></select></span></label>
<label class="rd">Return date<input name="rt" type="date"></label>
<label>Vehicle<select name="v"><option value="">Select a vehicle</option>${Object.entries(CARS).map(([k, c]) => `<option value="${k}">${c.name} (up to ${c.seats} passengers)</option>`).join('')}<option value="other">Others (type your own choice)</option></select></label>
<label class="vo">Car type you need<input name="vo" placeholder="e.g. Innova, SUV, tempo traveller"></label></div>
<div class="vp" aria-live="polite"><div class="vp-in"><div class="vp-card"><div class="vp-img"><img alt=""></div><div class="vp-tx"><h3></h3><p class="sub"></p><ul></ul></div></div></div></div>
${full ? '<label style="margin-top:14px">Additional notes<textarea name="no" rows="3"></textarea></label>' : ''}
<p class="acts"><button type="button" class="btn go">Book on WhatsApp</button><button type="button" class="btn ol mp">🗺️ View route on Google Maps</button></p><p class="err"></p>
<p class="note">This sends your request on WhatsApp. Booking is confirmed only after we reply with the final details.</p>`;

$('.fm').forEach(box => {
  box.innerHTML = formHTML(box.dataset.full);
  const q = n => box.querySelector(`[name=${n}]`), err = box.querySelector('.err'), rd = box.querySelector('.rd');
  const multi = () => /Round|Outstation/.test(trip);
  rd.style.display = 'none';
  const vo = box.querySelector('.vo'); vo.style.display = 'none';
  const vp = box.querySelector('.vp'), vimg = vp.querySelector('img'), vcard = vp.querySelector('.vp-card');
  let vt;
  const showCar = () => { /* smooth pop-in of the selected car's photo + info */
    vo.style.display = q('v').value == 'other' ? 'block' : 'none';
    const c = CARS[q('v').value];
    clearTimeout(vt);
    if (!c) { vp.classList.remove('open'); return; }
    const fill = () => {
      vimg.src = c.img; vimg.alt = c.name; vimg.style.objectPosition = c.pos; vimg.style.objectFit = c.fit || 'cover'; vimg.parentNode.style.background = c.bg || '';
      vp.querySelector('h3').textContent = c.name; vp.querySelector('.sub').textContent = c.sub;
      vp.querySelector('ul').innerHTML = c.info.map(i => `<li>${esc(i)}</li>`).join('');
      vcard.classList.remove('swap');
    };
    if (vp.classList.contains('open')) { vcard.classList.add('swap'); vt = setTimeout(fill, 50); } /* fade out, swap, fade in */
    else { fill(); requestAnimationFrame(() => vp.classList.add('open')); }
  };
  q('v').onchange = showCar;
  q('dt').min = q('rt').min = new Date().toISOString().slice(0, 10);
  $('.pills button', box).forEach(b => b.onclick = () => {
    $('.pills button', box).forEach(x => x.classList.remove('on')); b.classList.add('on');
    trip = b.textContent; rd.style.display = multi() ? 'block' : 'none';
  });
  box.querySelector('.go').onclick = () => {
    const phone = q('m').value.replace(/[\s+-]/g, '').replace(/^91(?=\d{10}$)/, '');
    const missing = !q('n').value.trim() ? 'your name' : !/^[6-9]\d{9}$/.test(phone) ? 'a valid 10-digit mobile number'
      : !q('p').value.trim() ? 'the pickup location' : !q('d').value.trim() ? 'the destination' : !q('dt').value ? 'the journey date'
      : !q('v').value ? 'a vehicle' : q('v').value == 'other' && !q('vo').value.trim() ? 'the car type you need' : '';
    if (missing) { err.textContent = 'Please enter ' + missing + '.'; return; }
    err.textContent = '';
    const t = window.rajTrip;
    wa([`*New booking request*`, `Trip: ${trip}`, `Name: ${q('n').value.trim()}`, `Mobile: ${phone}`, `Pickup: ${q('p').value}`, `Destination: ${q('d').value}`,
      `Date: ${q('dt').value}${q('th').value ? ' at ' + q('th').value + ':' + q('tmi').value + ' ' + q('tp').value : ''}`, multi() && q('rt').value && `Return: ${q('rt').value}`,
      `Vehicle: ${q('v').value == 'other' ? 'Other - ' + q('vo').value.trim() : CARS[q('v').value].name}`, t && `Route: approx. ${t.km} km, ${t.dur}`, q('no') && q('no').value.trim() && `Notes: ${q('no').value.trim()}`].filter(Boolean).join('\n'));
  };
  box.querySelector('.mp').onclick = () => { /* works without an API key */
    if (!q('p').value.trim() || !q('d').value.trim()) { err.textContent = 'Please enter the pickup location and destination first.'; return; }
    err.textContent = '';
    open(`https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(q('p').value)}&destination=${encodeURIComponent(q('d').value)}`, '_blank');
  };
  const p = new URLSearchParams(location.search);
  if (p.get('to')) q('d').value = p.get('to');
  if (CARS[p.get('car')]) { q('v').value = p.get('car'); showCar(); }
  else if (p.get('car') == 'other') { q('v').value = 'other'; q('v').onchange(); }
});

/* ---------- nav, mobile menu, scroll reveal ---------- */
const cur = location.pathname.split('/').pop() || 'index.html';
$('nav a').forEach(a => { a.classList.toggle('on', a.getAttribute('href') == cur); a.addEventListener('click', () => nav.classList.remove('open')); });
if (window.er) est();
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 }) : null;
$('.card,.form,.tag,main h2').forEach(el => { el.classList.add('rv'); io ? io.observe(el) : el.classList.add('in'); });
