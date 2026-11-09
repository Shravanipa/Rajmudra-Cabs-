Rajmudra Tours & Travels website
Open index.html in a browser, or upload the whole folder to any web host.

FILES
index.html, about.html, services.html, fares.html, routes.html, contact.html, booking.html
style.css   colours (variables at top), layout, animation
script.js   CARS (fare rates), ROUTES, SVC, REVIEWS, PHONE, booking + WhatsApp logic
maps.js     Google Maps autocomplete, route line, distance and duration
config.js   Google Maps key and Map ID
assets/     logo.jpg, cars.jpg (hero background), aura.jpg, ertiga.jpg

GOOGLE MAPS SETUP (the site works without it; the map just stays hidden)
1. Go to console.cloud.google.com, create a project and enable billing.
   Google gives a monthly free usage credit; set a budget alert anyway.
2. Enable these APIs: Maps JavaScript API, Places API (New), Routes API.
3. Credentials > Create credentials > API key.
4. SECURE THE KEY (essential, because a browser key is visible in page source):
   - Application restrictions: Websites (HTTP referrers). Add your domain,
     e.g. https://www.yourdomain.com/* and https://yourdomain.com/*
   - API restrictions: Restrict key, tick only the 3 APIs above.
   - Use a separate key for testing (localhost) and for the live site.
5. Optional: Map Management > Create Map ID (JavaScript, Vector). Needed for the
   route markers on a live site. Without it the demo ID is used.
6. Paste the key (and Map ID) into config.js. Never commit an unrestricted key.

TO EDIT
Fare rates: CARS in script.js (these are placeholders)
Destinations: ROUTES in script.js (first 5 show on the home page)
Reviews: add real reviews to REVIEWS in script.js. Never add made-up ones.
Phone/WhatsApp: PHONE in script.js and the tel:/wa.me links in the .html files

TESTING THE MAP
Do not open index.html by double-clicking when testing the map: a restricted key is
rejected on file:// pages. Run a local server instead:  python -m http.server 8000
then open http://localhost:8000 and add http://localhost:8000/* to the key's
HTTP referrer list (use a separate test key; remove it from the live key).
The "View route on Google Maps" button works without any key.

CAR PHOTOS
assets/aura.jpg, ertiga.jpg, innova.png, carens.jpg are shown in a 2 x 2 grid with the same 16:10 frame.
Replace a file (keep the name) to change a photo. Use photos you own or have licensed.
Rates for Innova and Carens in CARS (script.js) are placeholders. Confirm seating with the customer.
