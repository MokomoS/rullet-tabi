// === スタート地点＆行き先 ===

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

// スタート地点セット
const startPref = document.getElementById('startPref');
prefectures.forEach(pref => {
  const option = document.createElement('option');
  option.value = pref;
  option.textContent = pref;
  startPref.appendChild(option);
});

// 地図読み込み
fetch('japan-map.svg')
  .then(response => response.text())
  .then(svg => {
    document.getElementById('mapContainer').innerHTML = svg;
  });

// prefectureIdMap（ハイフンなし版）
const prefectureIdMap = {
  "北海道": "JP01", "青森県": "JP02", "岩手県": "JP03", /*...*/ "鹿児島県": "JP46", "沖縄県": "JP47"
};

// 行き先決定
const destinationBtn = document.getElementById('destinationBtn');
const destinationResult = document.getElementById('destinationResult');
destinationBtn.addEventListener('click', () => {
  const randomPref = prefectures[Math.floor(Math.random() * prefectures.length)];
  destinationResult.textContent = `次の行き先は「${randomPref}」！`;
  highlightPrefecture(randomPref);
});

// 県ハイライト
function highlightPrefecture(prefectureName) {
  const prefId = prefectureIdMap[prefectureName];
  if (!prefId) return;

  document.querySelectorAll('#mapContainer circle, #mapContainer path').forEach(el => {
    el.setAttribute('fill', '#cce5ff');
  });

  const selected = document.getElementById(prefId);
  if (selected) {
    selected.setAttribute('fill', '#1976d2');
    selected.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 1000, iterations: 2 });
  }
}

// === 3Dダイス ===
let scene, camera, renderer, dice;
let rolling = false;
let currentFace = 1;

init3DDice();

function init3DDice() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(300, 300);
  document.getElementById('diceContainer').appendChild(renderer.domElement);

  const loader = new THREE.TextureLoader();
  const materials = [
    new THREE.MeshBasicMaterial({ map: loader.load('dice-1.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('dice-2.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('dice-3.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('dice-4.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('dice-5.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('dice-6.png') }),
  ];

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  dice = new THREE.Mesh(geometry, materials);
  scene.add(dice);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (rolling) {
    dice.rotation.x += 0.1;
    dice.rotation.y += 0.1;
  }
  renderer.render(scene, camera);
}

document.getElementById('roll3dDiceBtn').addEventListener('click', () => {
  if (rolling) return;
  rolling = true;

  setTimeout(() => {
    rolling = false;

    // 出目を決定
    currentFace = Math.ceil(Math.random() * 6);

    // 出目に対応するダイスの角度を決める
    // Three.jsの座標系に合わせて面を合わせる
    const rotations = {
      1: { x: 0, y: 0 },
      2: { x: Math.PI / 2, y: 0 },
      3: { x: 0, y: -Math.PI / 2 },
      4: { x: 0, y: Math.PI / 2 },
      5: { x: -Math.PI / 2, y: 0 },
      6: { x: Math.PI, y: 0 }
    };

    const rotation = rotations[currentFace];

    dice.rotation.x = rotation.x;
    dice.rotation.y = rotation.y;

    // 正しい出目で予算を表示
    document.getElementById('budget3dResult').textContent = `次の日の予算は ${currentFace * 10000}円 だよ！`;

  }, 2000);
});

// === シェアボタン
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', () => {
  const text = `${destinationResult.textContent} ${document.getElementById('budget3dResult').textContent} #ルーレット旅`;
  const url = encodeURIComponent(window.location.href);
  const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
  window.open(shareURL, '_blank');
});
