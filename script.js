// Kullanıcı adı ve şifre listesi
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

// Kart PNG'leri: assets/kartadi.png

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

// Skor tablosu başlangıcı
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

// Kullanıcı oturumu ve açılan kartlar
let currentUser = null;
let userCollections = {}; // { username: [kartAdi, ...] }

const app = document.getElementById('app');

// Ana render fonksiyonu
function render() {
  if (!currentUser) {
    renderLogin();
  } else {
    renderMain();
  }
}

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
  html += `</div><div id="opened-cards-list"></div>`;
  document.getElementById('main-content').innerHTML = html;
  document.querySelectorAll('.open-pack-btn').forEach(btn => {
    btn.onclick = () => openPack(parseInt(btn.dataset.pack, 10));
  });
}

function openPack(packIdx) {
  const pack = packs[packIdx];
  // Kartları rastgele seç, nadirlik algoritması
  const unopenedCards = pack.cards.filter(cn => !userCollections[currentUser].includes(cn));
  if (unopenedCards.length === 0) {
    alert("Bu paketteki tüm kartları açtınız.");
    return;
  }
  // Nadirlik algoritması: güç arttıkça çıkma ihtimali azalır
  let weights = unopenedCards.map(cardName => {
    let card = cards.find(c => c.name === cardName);
    return Math.max(1, 220 - card.power); // En yüksek güç kartına en az ağırlık
  });
  let sum = weights.reduce((a, b) => a + b, 0);
  let rand = Math.floor(Math.random() * sum);
  let idx = 0, acc = 0;
  for (; idx < weights.length; idx++) {
    acc += weights[idx];
    if (rand < acc) break;
  }
  const cardName = unopenedCards[idx];
  userCollections[currentUser].push(cardName);
  showOpenedCard(cardName);
}

function showOpenedCard(cardName) {
  const card = cards.find(c => c.name === cardName);
  const modal = document.createElement('div');
  modal.id = "opened-card-modal";
  modal.className = "active";
  modal.innerHTML = `
    <div class="modal-card">
      <img src="assets/${card.name}.png" alt="${card.name}">
      <div style="font-size:20px;font-weight:bold;">${card.name.charAt(0).toUpperCase()+card.name.slice(1)}</div>
      <div style="margin-top:6px;font-size:16px;color:#555;">Güç: ${card.power}</div>
      <div style="margin-top:8px;font-size:14px;color:#44a;">Tebrikler! Koleksiyonuna yeni bir kart eklendi.</div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = () => {
    document.body.removeChild(modal);
    renderPackages();
  };
}

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
  // Kart büyütme
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

function renderScoreTable() {
  // Skorları en yüksekten düşük puana göre sırala
  const sorted = Object.entries(scores)
    .sort((a,b) => b[1] - a[1]); // [ [name, score], ... ]
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

// Skorları koddan değiştirince tablo otomatik sıralanır
window.updateScores = function(newScores) {
  Object.assign(scores, newScores);
}

// Başlat
render();