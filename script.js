// 都道府県リスト
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

// スタート地点ドロップダウン作成
const startPref = document.getElementById('startPref');
prefectures.forEach(pref => {
  const option = document.createElement('option');
  option.value = pref;
  option.textContent = pref;
  startPref.appendChild(option);
});

// 日本地図SVG読み込み
fetch('japan-map.svg')
  .then(response => response.text())
  .then(svg => {
    document.getElementById('mapContainer').innerHTML = svg;
  });

// 都道府県名→SVG IDマッピング（抜粋版。フル版も用意してある）
const prefectureIdMap = {
  "北海道": "JP-01", "青森県": "JP-02", "岩手県": "JP-03", "宮城県": "JP-04",
  "秋田県": "JP-05", "山形県": "JP-06", "福島県": "JP-07",
  "茨城県": "JP-08", "栃木県": "JP-09", "群馬県": "JP-10", "埼玉県": "JP-11",
  "千葉県": "JP-12", "東京都": "JP-13", "神奈川県": "JP-14",
  // …47都道府県分
};

// 行き先決定ボタン
const destinationBtn = document.getElementById('destinationBtn');
const destinationResult = document.getElementById('destinationResult');
destinationBtn.addEventListener('click', () => {
  const start = startPref.value;
  const randomPref = prefectures[Math.floor(Math.random() * prefectures.length)];
  destinationResult.textContent = `次の行き先は「${randomPref}」！`;
  highlightPrefecture(randomPref);
});

// 県を強調
function highlightPrefecture(prefectureName) {
  const prefId = prefectureIdMap[prefectureName];
  if (!prefId) return;

  const paths = document.querySelectorAll('#mapContainer path');
  paths.forEach(path => {
    path.setAttribute('fill', '#cce5ff'); // パステルブルー系にリセット
  });

  const selected = document.getElementById(prefId);
  if (selected) {
    selected.setAttribute('fill', '#1976d2'); // 濃いブルーでハイライト

    selected.animate([
      { opacity: 0.5 },
      { opacity: 1 }
    ], {
      duration: 1000,
      iterations: 3
    });
  }
}

// 予算ルーレット
const rollDiceBtn = document.getElementById('rollDiceBtn');
const diceArea = document.getElementById('diceArea');
const budgetResult = document.getElementById('budgetResult');
rollDiceBtn.addEventListener('click', () => {
  diceArea.textContent = "🎲";
  let rotations = 0;
  const diceInterval = setInterval(() => {
    diceArea.textContent = Math.ceil(Math.random() * 6);
    rotations++;
    if (rotations > 20) {
      clearInterval(diceInterval);
      const diceResult = parseInt(diceArea.textContent);
      const budget = diceResult * 10000;
      budgetResult.textContent = `次の日の予算は ${budget}円 だよ！`;
    }
  }, 100);
});

// シェアボタン
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', () => {
  const text = `${destinationResult.textContent} ${budgetResult.textContent} #ルーレット旅`;
  const url = encodeURIComponent(window.location.href);
  const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
  window.open(shareURL, '_blank');
});

// === 3Dダイス ===

let scene, camera, renderer, dice;
let rolling = false;

init3DDice();

function init3DDice() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(300, 300);
  document.getElementById('diceContainer').appendChild(renderer.domElement);

  // サイコロの目 (1～6のテクスチャ)
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

// 3Dダイスを回す
document.getElementById('roll3dDiceBtn').addEventListener('click', () => {
  if (rolling) return;
  rolling = true;
  setTimeout(() => {
    rolling = false;
    const rollResult = Math.ceil(Math.random() * 6);

    // 出目に応じてダイスの向き固定
    switch (rollResult) {
      case 1: dice.rotation.set(0, 0, 0); break;
      case 2: dice.rotation.set(Math.PI / 2, 0, 0); break;
      case 3: dice.rotation.set(0, Math.PI / 2, 0); break;
      case 4: dice.rotation.set(0, -Math.PI / 2, 0); break;
      case 5: dice.rotation.set(-Math.PI / 2, 0, 0); break;
      case 6: dice.rotation.set(Math.PI, 0, 0); break;
    }

    document.getElementById('budget3dResult').textContent = `次の日の予算は ${rollResult * 10000}円 だよ！`;
  }, 2000); // 2秒後に止まる
});
