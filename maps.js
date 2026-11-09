/* Google Maps: place autocomplete, route line, distance and duration.
   Loads only when RAJ_CONFIG.mapsKey is set; otherwise the plain text form keeps working. */
(() => {
  const cfg = window.RAJ_CONFIG || {};
  const form = document.querySelector('.fm'), box = document.querySelector('.mapbox');
  if (!cfg.mapsKey || !form || !box) return;

  const state = { p: null, d: null }, swapped = [];
  let map, Route, polylines = [], markers = [];
  const q = n => form.querySelector(`[name=${n}]`);

  const fallback = () => { swapped.forEach(([input, el]) => { el.remove(); input.style.display = ''; }); box.hidden = true; };
  window.gm_authFailure = fallback; /* called by Google when the key is rejected */

  const fmtDur = ms => { const m = Math.max(1, Math.round(ms / 60000)); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`; };
  const info = html => document.getElementById('rinfo').innerHTML = html;
  const clear = () => { polylines.forEach(p => p.setMap(null)); markers.forEach(m => m.map = null); polylines = []; markers = []; };

  function setSel(name, text) {
    const label = q(name).closest('label');
    let s = label.querySelector('.sel');
    if (!s) label.append(s = Object.assign(document.createElement('small'), { className: 'sel' }));
    s.textContent = '✔ ' + text;
  }

  async function draw() {
    if (!state.p || !state.d) return;
    info('<span>Calculating route…</span>'); clear(); window.rajTrip = null;
    try {
      const { routes } = await Route.computeRoutes({ origin: state.p, destination: state.d, travelMode: 'DRIVING', fields: ['path', 'distanceMeters', 'durationMillis'] });
      const r = routes && routes[0];
      if (!r) throw new Error('no route');
      polylines = r.createPolylines(); polylines.forEach(p => { p.setOptions({ strokeColor: '#C99A2E', strokeWeight: 6 }); p.setMap(map); });
      markers = await r.createWaypointAdvancedMarkers(); markers.forEach(m => m.map = map);
      const b = new google.maps.LatLngBounds(); r.path.forEach(pt => b.extend(pt)); map.fitBounds(b, 40);
      const km = (r.distanceMeters / 1000).toFixed(1), dur = fmtDur(r.durationMillis);
      window.rajTrip = { km, dur };
      info(`<span>📏 ${km} km</span><span>⏱ ${dur}</span>`);
    } catch (e) { info('<span>Could not calculate a route. Please check both locations.</span>'); }
  }

  window.__rajMaps = async () => {
    try {
      const { Map } = await google.maps.importLibrary('maps');
      ({ Route } = await google.maps.importLibrary('routes'));
      const { PlaceAutocompleteElement } = await google.maps.importLibrary('places');
      await google.maps.importLibrary('marker');
      box.hidden = false;
      map = new Map(document.getElementById('map'), { center: { lat: 19.5, lng: 75.3 }, zoom: 6, mapId: cfg.mapId || 'DEMO_MAP_ID', mapTypeControl: false, streetViewControl: false });

      ['p', 'd'].forEach(name => {
        const input = q(name), el = new PlaceAutocompleteElement({ includedRegionCodes: ['in'] });
        const pick = async ev => {
          const place = ev.place || ev.placePrediction.toPlace();
          await place.fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] });
          const text = place.formattedAddress || place.displayName;
          input.value = text; state[name] = place.location; setSel(name, text); draw();
        };
        el.addEventListener('gmp-select', pick); el.addEventListener('gmp-placeselect', pick);
        input.style.display = 'none'; input.after(el); swapped.push([input, el]);
      });

      if (q('d').value) { /* destination pre-filled from a destination card */
        state.d = q('d').value + ', Maharashtra, India'; setSel('d', q('d').value);
      }
    } catch (e) { fallback(); }
  };

  const s = document.createElement('script');
  s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(cfg.mapsKey)}&loading=async&v=weekly&callback=__rajMaps`;
  s.async = true; s.onerror = fallback; document.head.appendChild(s);
})();
