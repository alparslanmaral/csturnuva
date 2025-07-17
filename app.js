// --- Kullanıcılar ---
const userList = [
  { username: 'caner', password: '1234' },
  { username: 'cahit', password: '2345' },
  { username: 'arda', password: '3456' },
  { username: 'daniel', password: '4567' },
  { username: 'alparslan', password: '5678' },
  { username: 'arif', password: '6789' },
  { username: 'bekir', password: '7890' },
  { username: 'hami', password: '8901' },
  { username: 'ali', password: '9012' },
  { username: 'mert', password: '0123' }
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
let userCollections = {}; // { username: [kartAdi, ...] }

const app = document.getElementById('app');

// --- Ana render fonksiyonu ---
function render() {
  if (!currentUser) {
    renderLogin();
  } else {
    renderMain();
  }
}

// --- Giriş ekranı ---
function renderLogin() {
  app.innerHTML = `
    <h1>Kart Oyunu Giriş</h1>
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
function renderMain(page = "home") {
  app.innerHTML = `
    <div class="navbar">
      <button id="nav-packages">Paketler</button>
      <button id="nav-collection">Koleksiyon</button>
      <button id="nav-score">Skor Tablosu</button>
      <span style="margin-left:auto;color:#666;font-weight:bold;">${currentUser}</span>
      <button id="nav-logout" style="background:#ad1d1d;">Çıkış</button>
    </div>
    <div id="main-content"></div>
  `;
  document.getElementById('nav-packages').onclick = () => renderMain("packages");
  document.getElementById('nav-collection').onclick = () => renderMain("collection");
  document.getElementById('nav-score').onclick = () => renderMain("score");
  document.getElementById('nav-logout').onclick = logout;
  if (page === "home") renderHome();
  if (page === "packages") renderPackages();
  if (page === "collection") renderCollection();
  if (page === "score") renderScoreTable();
}

function renderHome() {
  document.getElementById('main-content').innerHTML = `
    <h2>Hoşgeldin, ${currentUser}!</h2>
    <p>Oyun menüsünden paket açabilir, koleksiyonunu görebilir veya skor tablosunu inceleyebilirsin.</p>
  `;
}

// --- Paketler ve slider mekaniği ---
function renderPackages() {
  let html = `<h2>Paketler</h2><div class="pack-list">`;
  packs.forEach((p, i) => {
    html += `
      <div class="pack" data-pack="${i}">
        <img src="${p.img}" alt="Paket">
        <div style="font-size:16px;font-weight:bold;margin-bottom:6px;">${p.name}</div>
        <div style="font-size:15px;color:#666;">${p.cards.map(cn => `${cn.charAt(0).toUpperCase()+cn.slice(1)}`).join(", ")}</div>
        <button class="open-pack-btn" data-pack="${i}" style="margin-top:10px;">Paket Aç</button>
      </div>
    `;
  });
  html += `</div><div id="case-opening-area"></div>`;
  document.getElementById('main-content').innerHTML = html;
  document.querySelectorAll('.open-pack-btn').forEach(btn => {
    btn.onclick = () => renderCaseOpening(parseInt(btn.dataset.pack, 10));
  });
}

// --- Bar animasyonlu kasa açma ---
function renderCaseOpening(packIdx) {
  const pack = packs[packIdx];
  const unopenedCards = pack.cards.filter(cn => !userCollections[currentUser].includes(cn));
  if (unopenedCards.length === 0) {
    document.getElementById('case-opening-area').innerHTML = `<div style="margin-top:24px;color:#b00;font-weight:bold;">Bu paketteki tüm kartları açtınız.</div>`;
    return;
  }

  // Nadire göre bar dizisi oluştur
  let cardArray = [];
  unopenedCards.forEach(cardName => {
    let card = cards.find(c => c.name === cardName);
    let weight = Math.max(1, 220 - card.power); // Güçlü kart az tekrar
    for (let i = 0; i < weight; i += 35) {
      cardArray.push(cardName);
    }
  });
  while (cardArray.length < 40) {
    cardArray.push(unopenedCards[Math.floor(Math.random()*unopenedCards.length)]);
  }
  cardArray = shuffle(cardArray);

  // Bar HTML
  let barHtml = `
    <div id="case-bar-wrap" style="
      position:relative;
      margin:36px 0 18px 0;
      width:100%;
      max-width:620px;
      height:140px;
      overflow:hidden;
      border-radius:16px;
      background:linear-gradient(90deg,#d8ecff,#f4faff 60%,#d8ecff);
      box-shadow:0 3px 30px rgba(0,0,0,0.12);margin-left:auto;margin-right:auto;">
      <div id="case-bar" style="display:flex;align-items:end;height:100%;transition:none;">
        ${cardArray.map(cardName => `
          <div style="width:100px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:end;padding:0;">
            <img src="assets/${cardName}.png" style="width:90px;height:120px;object-fit:cover;border-radius:8px;box-shadow:0 1px 8px rgba(0,0,0,0.11);margin:0;">
            <div style="font-size:14px;font-weight:bold;color:#222;margin-top:2px;margin-bottom:2px;">${cardName.charAt(0).toUpperCase()+cardName.slice(1)}</div>
          </div>
        `).join('')}
      </div>
      <div style="
        position:absolute;top:0;left:50%;transform:translateX(-50%);
        width:100px;height:100%;border:3px solid #2b6cb0;border-radius:10px;
        pointer-events:none;box-sizing:border-box;z-index:2;">
      </div>
    </div>
    <div id="case-bar-btns" style="text-align:center;">
      <button id="start-case-opening">Açılışı Başlat</button>
    </div>
    <div id="case-bar-result"></div>
  `;
  document.getElementById('case-opening-area').innerHTML = barHtml;
  document.getElementById('start-case-opening').onclick = () => startCaseBarOpening(cardArray, packIdx);
}

// --- Bar kaydırma ve durdurma algoritması ---
function startCaseBarOpening(cardArray, packIdx) {
  const bar = document.getElementById('case-bar');
  const barWrap = document.getElementById('case-bar-wrap');
  const cardWidth = 100; // yukarıda width:100px!
  let velocity = 60;
  let slowing = false;
  let frame = 0;
  const barCenterPx = barWrap.offsetWidth / 2 - cardWidth / 2;

  // Rastgele bir indeks seç, bar tam ortada duracak şekilde offset hesapla
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
        // Tam ortadaki kutunun altında kalan kartın indexi:
        const idxAtCenter = Math.round((stopOffset + barCenterPx) / cardWidth);
        const wonCardName = cardArray[idxAtCenter];
        finishCaseOpening(wonCardName, packIdx);
      }, 500);
      return;
    }
    bar.style.transform = `translateX(${-currentOffset}px)`;
  }, 16);

  document.getElementById('start-case-opening').disabled = true;
}

// --- Kartı koleksiyona ekle ve sonucu göster ---
function finishCaseOpening(cardName, packIdx) {
  if (!userCollections[currentUser].includes(cardName)) {
    userCollections[currentUser].push(cardName);
  }
  document.getElementById('case-bar-result').innerHTML = `
    <div style="margin-top:32px;">
      <div style="font-size:22px;font-weight:bold;color:#2b6cb0;">Tebrikler!</div>
      <div style="margin-top:8px;">
        <img src="assets/${cardName}.png" style="width:140px;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,0.14);">
      </div>
      <div style="font-size:18px;margin-top:10px;font-weight:bold;">${cardName.charAt(0).toUpperCase()+cardName.slice(1)}</div>
      <div style="font-size:16px;margin-top:5px;color:#555;">Koleksiyonuna yeni kart eklendi.</div>
      <button onclick="renderPackages()" style="margin-top:16px;">Paketlere Dön</button>
      <button onclick="renderCollection()" style="margin-top:16px;margin-left:8px;">Koleksiyonumu Gör</button>
    </div>
  `;
}

// --- Koleksiyon ---
function renderCollection() {
  let html = `<h2>Koleksiyonum</h2><div class="card-list">`;
  cards.forEach(card => {
    const opened = userCollections[currentUser].includes(card.name);
    html += `
      <div class="card ${opened ? '' : 'blurred'}" data-card="${card.name}">
        <img src="assets/${card.name}.png" alt="${card.name}">
        <div class="card-name">${card.name.charAt(0).toUpperCase()+card.name.slice(1)}</div>
        <div class="card-power">Güç: ${card.power}</div>
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
      <img src="assets/${card.name}.png" alt="${card.name}">
      <div style="font-size:22px;font-weight:bold;">${card.name.charAt(0).toUpperCase()+card.name.slice(1)}</div>
      <div style="margin-top:10px;font-size:17px;color:#444;">Güç: ${card.power}</div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = () => {
    document.body.removeChild(modal);
  };
}

// --- Skor Tablosu ---
function renderScoreTable() {
  const sorted = Object.entries(scores)
    .sort((a,b) => b[1] - a[1]);
  let html = `<h2>Skor Tablosu</h2>
    <table class="score-table">
      <thead>
        <tr><th>#</th><th>Kart</th><th>Puan</th></tr>
      </thead>
      <tbody>
  `;
  sorted.forEach(([name, score], idx) => {
    html += `<tr>
      <td>${idx+1}</td>
      <td>${name.charAt(0).toUpperCase()+name.slice(1)}</td>
      <td>${score}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  document.getElementById('main-content').innerHTML = html;
}

function logout() {
  currentUser = null;
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

// --- Başlat ---
render();