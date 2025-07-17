// --- Kullanıcılar ---
const userList = [
  { username: 'canerpehlivan', password: 'alikoçistifa' },
  { username: 'calo', password: 'hafebayo36' },
  { username: 'arda', password: 'orkunkökçü10' },
  { username: 'daniel', password: '6taneatılırmıbe' },
  { username: 'alp', password: '361881' },
  { username: 'arif', password: 'playstationsucks' },
  { username: 'bekir', password: 'gtx1070ti' },
  { username: 'hami', password: 'catch' },
  { username: 'ali', password: 'hamsikoydumtavaya' },
  { username: 'mert', password: 'officeoynayangay' }
];

// --- Kartlar ---
const cards = [
  { name: "caner", power: 120 },
  { name: "cahit", power: 160 },
  { name: "arda", power: 180 },
  { name: "daniel", power: 160 },
  { name: "alparslan", power: 180 },
  { name: "arif", power: 100 },
  { name: "bekir", power: 140 },
  { name: "hami", power: 180 },
  { name: "ali", power: 100 },
  { name: "mert", power: 200 }
];

// --- Paketler ---
const packs = [
  {
    name: "Cennetten Kovulanlar Tam Liste Paketi",
    img: "assets/paket1.png",
    cards: ["caner", "cahit", "arda", "daniel", "alparslan"]
  },
  {
    name: "Uhud Tepesini Terk Eden Okçular Paketi",
    img: "assets/paket2.png",
    cards: ["arif", "bekir", "hami", "ali", "mert"]
  }
];

// --- Skorlar ---
let scores = {
  caner: 0,
  cahit: 0,
  arda: 0,
  daniel: 0,
  alparslan: 0,
  arif: 0,
  bekir: 0,
  hami: 0,
  ali: 0,
  mert: 0
};

// --- Kullanıcı oturumu ve koleksiyon ---
let currentUser = null;
let userCollections = {};

// --- Alt menü aktif sayfa ---
let activeBottomMenu = "packages";

const app = document.getElementById('app');
const bottomMenuRoot = document.getElementById('bottom-menu-root');

// --- Ana render fonksiyonu ---
function render() {
  if (!currentUser) {
    renderLogin();
    bottomMenuRoot.innerHTML = ""; // Login ekranında alt menü yok
  } else {
    renderMain(activeBottomMenu);
    renderBottomMenu(activeBottomMenu);
  }
}

// --- Giriş ekranı ---
function renderLogin() {
  app.innerHTML = `
    <h1 style="color:var(--accent);font-size:2rem;margin-bottom:18px;">KART OYUNU GİRİŞ</h1>
    <div>
      <div class="input-group">
        <label>Kullanıcı Adı:</label>
        <input type="text" id="login-username" autocomplete="off">
      </div>
      <div class="input-group">
        <label>Şifre:</label>
        <input type="password" id="login-password" autocomplete="off">
      </div>
      <button id="login-btn">Giriş Yap</button>
      <div id="login-error" class="error" style="display:none"></div>
    </div>
  `;
  document.getElementById('login-btn').onclick = tryLogin;
}

function tryLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const user = userList.find(u => u.username === username && u.password === password);
  if (!user) {
    document.getElementById('login-error').style.display = "block";
    document.getElementById('login-error').innerText = "Kullanıcı adı veya şifre yanlış!";
    return;
  }
  currentUser = user.username;
  if (!userCollections[currentUser]) userCollections[currentUser] = [];
  render();
}

// --- Ana menü ve sayfa ---
function renderMain(page = "packages") {
  app.innerHTML = `
    <div class="navbar">
      <button id="nav-packages" class="${page==="packages"?"active":""}">Paketler</button>
      <button id="nav-collection" class="${page==="collection"?"active":""}">Koleksiyon</button>
      <button id="nav-score" class="${page==="score"?"active":""}">Skor Tablosu</button>
      <span style="margin-left:auto;color:var(--accent);font-weight:bold;">${currentUser}</span>
      <button id="nav-logout" class="logout-btn">Çıkış</button>
    </div>
    <div id="main-content"></div>
  `;
  document.getElementById('nav-packages').onclick = () => {activeBottomMenu="packages"; render();};
  document.getElementById('nav-collection').onclick = () => {activeBottomMenu="collection"; render();};
  document.getElementById('nav-score').onclick = () => {activeBottomMenu="score"; render();};
  document.getElementById('nav-logout').onclick = logout;
  if (page === "packages") renderPackages();
  if (page === "collection") renderCollection();
  if (page === "score") renderScoreTable();
}

// --- Alt menü render ---
function renderBottomMenu(selected) {
  bottomMenuRoot.innerHTML = `
    <div class="bottom-navbar">
      <button class="nav-btn${selected==="packages"?" active":""}" id="bm-packages">Paketler</button>
      <button class="nav-btn${selected==="collection"?" active":""}" id="bm-collection">Koleksiyon</button>
      <button class="nav-btn${selected==="score"?" active":""}" id="bm-score">Skor Tablosu</button>
      <button class="nav-btn" id="bm-logout">Çıkış</button>
    </div>
  `;
  document.getElementById('bm-packages').onclick = () => {activeBottomMenu="packages"; render();};
  document.getElementById('bm-collection').onclick = () => {activeBottomMenu="collection"; render();};
  document.getElementById('bm-score').onclick = () => {activeBottomMenu="score"; render();};
  document.getElementById('bm-logout').onclick = logout;
}

function renderPackages() {
  let html = `<h2 style="color:var(--accent);margin-bottom:24px;">Paketler</h2><div class="pack-list">`;
  packs.forEach((p, i) => {
    html += `
      <div class="pack" data-pack="${i}">
        <img src="${p.img}" alt="Paket">
        <div style="font-size:16px;font-weight:bold;color:var(--accent);margin-bottom:6px;">${p.name}</div>
        <button class="open-pack-btn" data-pack="${i}">Paket Aç</button>
      </div>
    `;
  });
  html += `</div><div id="case-opening-area"></div>`;
  document.getElementById('main-content').innerHTML = html;
  document.querySelectorAll('.open-pack-btn').forEach(btn => {
    btn.onclick = () => showPackModal(parseInt(btn.dataset.pack, 10));
  });
  document.querySelectorAll('.pack img').forEach(img => {
    img.onclick = () => {
      const idx = img.parentElement.getAttribute('data-pack');
      showPackModal(parseInt(idx, 10));
    };
  });
}

function showPackModal(packIdx) {
  const pack = packs[packIdx];
  const modal = document.createElement('div');
  modal.id = "pack-modal";
  modal.innerHTML = `
    <div class="modal-card" style="text-align:center;">
      <img src="${pack.img}" alt="Paket" style="width:220px;max-width:90vw;border-radius:16px;box-shadow:0 2px 16px #21e78622;">
      <div style="font-size:22px;font-weight:bold;color:var(--accent);margin-top:18px;">${pack.name}</div>
      <div style="margin-top:18px;color:var(--accent);font-weight:bold;">Paketi açmak için resme tıklayın</div>
    </div>
  `;
  modal.querySelector('img').onclick = (e) => {
    e.stopPropagation();
    document.body.removeChild(modal);
    showSliderModal(packIdx);
  };
  modal.onclick = () => {
    document.body.removeChild(modal);
  };
  document.body.appendChild(modal);
}

function showSliderModal(packIdx) {
  const pack = packs[packIdx];
  const cardWidth = 110;
  const cardHeight = 155;
  const possibleCards = pack.cards;

  let cardArray = [];
  possibleCards.forEach(cardName => {
    let card = cards.find(c => c.name === cardName);
    let weight = Math.max(1, 220 - card.power);
    for (let i = 0; i < weight; i += 35) {
      cardArray.push(cardName);
    }
  });
  while (cardArray.length < 40) {
    cardArray.push(possibleCards[Math.floor(Math.random()*possibleCards.length)]);
  }
  cardArray = shuffle(cardArray);

  const modal = document.createElement('div');
  modal.id = "slider-modal";
  modal.innerHTML = `
    <div class="modal-card" style="min-width:520px;">
      <div class="slider-title" style="text-align:center;color:var(--accent);">Kart Açılıyor!</div>
      <div id="case-bar-wrap" style="position:relative;width:100%;height:${cardHeight}px;">
        <div id="case-bar" style="transition:none;">
          ${cardArray.map(cardName => `
            <div class="card-bar-card">
              <img src="assets/${cardName}.png">
              <div class="card-name" style="color:var(--accent);">${cardName.charAt(0).toUpperCase()+cardName.slice(1)}</div>
            </div>
          `).join('')}
        </div>
        <div class="center-indicator"></div>
      </div>
      <div id="case-bar-btns" style="text-align:center;">
        <button id="start-case-opening">Açılışı Başlat</button>
      </div>
      <div id="case-bar-result"></div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('start-case-opening').onclick = () => startCaseBarOpening(cardArray, packIdx, cardWidth, modal);
}

function startCaseBarOpening(cardArray, packIdx, cardWidth, modal) {
  const bar = modal.querySelector('#case-bar');
  const barWrap = modal.querySelector('#case-bar-wrap');
  let velocity = 60;
  let slowing = false;
  let frame = 0;
  const barCenterPx = barWrap.offsetWidth / 2 - cardWidth / 2;

  let safeMargin = 4;
  let randomIdx = Math.floor(Math.random() * (cardArray.length - safeMargin*2)) + safeMargin;
  let stopOffset = randomIdx * cardWidth - barCenterPx;

  let currentOffset = 0;
  let interval = setInterval(() => {
    frame++;
    if (!slowing && frame > 40) slowing = true;
    if (slowing && velocity > 4) velocity *= 0.96;
    currentOffset += velocity;

    if (slowing && currentOffset >= stopOffset) {
      clearInterval(interval);
      bar.style.transition = "transform 0.5s cubic-bezier(.8,-0.6,.24,1.65)";
      bar.style.transform = `translateX(${-stopOffset}px)`;
      setTimeout(() => {
        const idxAtCenter = Math.round((stopOffset + barCenterPx) / cardWidth);
        const wonCardName = cardArray[idxAtCenter];
        finishCaseOpening(wonCardName, packIdx, modal);
      }, 500);
      return;
    }
    bar.style.transform = `translateX(${-currentOffset}px)`;
  }, 16);

  modal.querySelector('#start-case-opening').disabled = true;
}

function finishCaseOpening(cardName, packIdx, modal) {
  if (!userCollections[currentUser].includes(cardName)) {
    userCollections[currentUser].push(cardName);
  }
  modal.querySelector('#case-bar-result').innerHTML = `
    <div class="panel" style="text-align:center;">
      <div class="result-title" style="color:var(--accent);">Tebrikler!</div>
      <img src="assets/${cardName}.png" style="width:210px;border-radius:14px;box-shadow:0 2px 12px #21e78644;" alt="${cardName}">
      <div class="card-name" style="font-size:18px;margin-top:10px;color:var(--accent);">${cardName.charAt(0).toUpperCase()+cardName.slice(1)}</div>
      <div class="result-desc" style="color:var(--text-muted);">Koleksiyonuna yeni kart eklendi.</div>
      <button onclick="document.body.removeChild(document.getElementById('slider-modal'));renderPackages()">Paketlere Dön</button>
      <button onclick="document.body.removeChild(document.getElementById('slider-modal'));renderCollection()">Koleksiyonumu Gör</button>
    </div>
  `;
}

function renderCollection() {
  let html = `<h2 style="color:var(--accent);margin-bottom:24px;">Koleksiyonum</h2><div class="card-list">`;
  cards.forEach(card => {
    const opened = userCollections[currentUser].includes(card.name);
    html += `
      <div class="card ${opened ? '' : 'blurred'}" data-card="${card.name}">
        <img src="assets/${card.name}.png" alt="${card.name}">
        <div class="card-name" style="color:var(--accent);">${card.name.charAt(0).toUpperCase()+card.name.slice(1)}</div>
        <div class="card-power" style="color:var(--text-muted);">Güç: ${card.power}</div>
      </div>
    `;
  });
  html += `</div>`;
  document.getElementById('main-content').innerHTML = html;
  document.querySelectorAll('.card:not(.blurred)').forEach(cardEl => {
    cardEl.onclick = () => showCardModal(cardEl.dataset.card);
  });
}

function showCardModal(cardName) {
  const card = cards.find(c => c.name === cardName);
  const modal = document.createElement('div');
  modal.id = "opened-card-modal";
  modal.className = "active";
  modal.innerHTML = `
    <div class="modal-card">
      <img src="assets/${card.name}.png" alt="${card.name}" style="width:210px;border-radius:14px;">
      <div style="font-size:22px;font-weight:bold;color:var(--accent);">${card.name.charAt(0).toUpperCase()+card.name.slice(1)}</div>
      <div style="margin-top:10px;font-size:17px;color:var(--text-muted);">Güç: ${card.power}</div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = () => {
    document.body.removeChild(modal);
  };
}

function renderScoreTable() {
  const sorted = Object.entries(scores)
    .sort((a,b) => b[1] - a[1]);
  let html = `<h2 style="color:var(--accent);margin-bottom:24px;">Skor Tablosu</h2>
    <table class="score-table">
      <thead>
        <tr><th>#</th><th>Kart</th><th>Puan</th></tr>
      </thead>
      <tbody>
  `;
  sorted.forEach(([name, score], idx) => {
    html += `<tr>
      <td>${idx+1}</td>
      <td style="color:var(--accent);">${name.charAt(0).toUpperCase()+name.slice(1)}</td>
      <td>${score}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  document.getElementById('main-content').innerHTML = html;
}

function logout() {
  currentUser = null;
  activeBottomMenu = "packages";
  render();
}

window.updateScores = function(newScores) {
  Object.assign(scores, newScores);
}

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

render();