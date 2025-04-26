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

// 地図SVG読み込み
fetch('japan-map.svg')
  .then(response => response.text())
  .then(svg => {
    document.getElementById('mapContainer').innerHTML = svg;
  });

// 県IDマッピング（例：東京都 → JP-13）
const prefectureIdMap = {
  "北海道": "JP-01", "青森県": "JP-02", "岩手県": "JP-03", /*...*/ "沖縄県": "JP-47"
};

// 行き先決定
const destinationBtn = document.getElementById('destinationBtn');
const destinationResult = document.getElementById('destinationResult');
destinationBtn.addEventListener('click', () => {
  const randomPref = prefectures[Math.floor(Math.random() * prefectures.length)];
  destinationResult.textContent = `次の行き先は「${randomPref}」！`;
  highlightPrefecture(randomPref);
});

// 地図強調
function highlightPrefecture(prefectureName) {
  const prefId = prefectureIdMap[prefectureName];
  if (!prefId) return;

  document.querySelectorAll('#mapContainer path').forEach(path => {
    path.setAttribute('fill', '#cce5ff');
  });

  const selected = document.getElementById(prefId);
  if (selected) {
    selected.setAttribute('fill', '#1976d2');
    selected.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 1000, iterations: 3 });
  }
}

// 予算ダイス
let scene, camera, renderer, dice;
let rolling = false;
let currentFace = 1; // 出た目を記憶

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
    new THREE.MeshBasicMaterial({ map: loader.load('dice-1.png') }), // 1の目
    new THREE.MeshBasicMaterial({ map: loader.load('dice-2.png') }), // 2の目
    new THREE.MeshBasicMaterial({ map: loader.load('dice-3.png') }), // 3の目
    new THREE.MeshBasicMaterial({ map: loader.load('dice-4.png') }), // 4の目
    new THREE.MeshBasicMaterial({ map: loader.load('dice-5.png') }), // 5の目
    new THREE.MeshBasicMaterial({ map: loader.load('dice-6.png') }), // 6の目
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

    // 1〜6をランダムに出目として選ぶ
    currentFace = Math.ceil(Math.random() * 6);

    // 出目に合わせてダイスの向き固定（リアル合わせ）
    switch (currentFace) {
      case 1: dice.rotation.set(0, 0, 0); break;
      case 2: dice.rotation.set(Math.PI / 2, 0, 0); break;
      case 3: dice.rotation.set(0, Math.PI / 2, 0); break;
      case 4: dice.rotation.set(0, -Math.PI / 2, 0); break;
      case 5: dice.rotation.set(-Math.PI / 2, 0, 0); break;
      case 6: dice.rotation.set(Math.PI, 0, 0); break;
    }

    // 正しい出目で予算を表示
    document.getElementById('budget3dResult').textContent = `次の日の予算は ${currentFace * 10000}円 だよ！`;

  }, 2000); // 2秒後に止まる
});

// === X(Twitter)シェア ===
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', () => {
  const text = `${destinationResult.textContent} ${document.getElementById('budget3dResult').textContent} #ルーレット旅`;
  const url = encodeURIComponent(window.location.href);
  const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
  window.open(shareURL, '_blank');
});
