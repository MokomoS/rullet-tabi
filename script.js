// 47都道府県
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

// スタート地点設定
const startPref = document.getElementById('startPref');
prefectures.forEach(pref => {
  const option = document.createElement('option');
  option.value = pref;
  option.textContent = pref;
  startPref.appendChild(option);
});

// 隣接県マップ
const adjacentPrefectures = {
  "北海道": ["青森県"],
  "青森県": ["北海道", "秋田県", "岩手県"],
  "岩手県": ["青森県", "秋田県", "宮城県"],
  "宮城県": ["岩手県", "山形県", "福島県"],
  "秋田県": ["青森県", "岩手県", "山形県"],
  "山形県": ["秋田県", "宮城県", "福島県", "新潟県"],
  "福島県": ["宮城県", "山形県", "栃木県", "群馬県", "茨城県", "新潟県"],
  "茨城県": ["福島県", "栃木県", "埼玉県", "千葉県"],
  "栃木県": ["福島県", "群馬県", "茨城県", "埼玉県"],
  "群馬県": ["福島県", "栃木県", "埼玉県", "長野県", "新潟県"],
  "埼玉県": ["群馬県", "栃木県", "茨城県", "千葉県", "東京都", "山梨県", "長野県"],
  "千葉県": ["茨城県", "埼玉県", "東京都"],
  "東京都": ["埼玉県", "千葉県", "神奈川県", "山梨県"],
  "神奈川県": ["東京都", "山梨県", "静岡県"],
  "新潟県": ["山形県", "福島県", "群馬県", "長野県"],
  "富山県": ["新潟県", "長野県", "岐阜県", "石川県"],
  "石川県": ["富山県", "岐阜県", "福井県"],
  "福井県": ["石川県", "岐阜県", "滋賀県"],
  "山梨県": ["静岡県", "神奈川県", "東京都", "埼玉県", "長野県"],
  "長野県": ["新潟県", "群馬県", "埼玉県", "山梨県", "静岡県", "岐阜県"],
  "岐阜県": ["富山県", "石川県", "福井県", "滋賀県", "愛知県", "長野県"],
  "静岡県": ["山梨県", "神奈川県", "愛知県", "長野県"],
  "愛知県": ["岐阜県", "静岡県", "三重県"],
  "三重県": ["滋賀県", "奈良県", "愛知県", "和歌山県"],
  "滋賀県": ["福井県", "岐阜県", "三重県", "京都府"],
  "京都府": ["滋賀県", "福井県", "大阪府", "奈良県"],
  "大阪府": ["京都府", "奈良県", "兵庫県"],
  "兵庫県": ["京都府", "大阪府", "鳥取県", "岡山県"],
  "奈良県": ["三重県", "滋賀県", "大阪府", "京都府", "和歌山県"],
  "和歌山県": ["三重県", "奈良県"],
  "鳥取県": ["兵庫県", "岡山県", "島根県"],
  "島根県": ["鳥取県", "広島県", "山口県"],
  "岡山県": ["兵庫県", "鳥取県", "広島県"],
  "広島県": ["岡山県", "島根県", "山口県"],
  "山口県": ["広島県", "島根県", "福岡県"],
  "徳島県": ["香川県", "高知県"],
  "香川県": ["徳島県", "愛媛県"],
  "愛媛県": ["香川県", "高知県"],
  "高知県": ["徳島県", "愛媛県"],
  "福岡県": ["山口県", "佐賀県", "大分県"],
  "佐賀県": ["福岡県", "長崎県"],
  "長崎県": ["佐賀県"],
  "熊本県": ["福岡県", "大分県", "宮崎県", "鹿児島県"],
  "大分県": ["福岡県", "熊本県", "宮崎県"],
  "宮崎県": ["熊本県", "大分県", "鹿児島県"],
  "鹿児島県": ["宮崎県", "熊本県"],
  "沖縄県": ["鹿児島県"]
};

// prefectureIdMap （あなたのSVGに合わせてハイフンなし/あり選ぶ）
const prefectureIdMap = {
  "北海道": "JP01", "青森県": "JP02", "岩手県": "JP03", "宮城県": "JP04", "秋田県": "JP05",
  "山形県": "JP06", "福島県": "JP07", "茨城県": "JP08", "栃木県": "JP09", "群馬県": "JP10",
  "埼玉県": "JP11", "千葉県": "JP12", "東京都": "JP13", "神奈川県": "JP14",
  "新潟県": "JP15", "富山県": "JP16", "石川県": "JP17", "福井県": "JP18", "山梨県": "JP19",
  "長野県": "JP20", "岐阜県": "JP21", "静岡県": "JP22", "愛知県": "JP23", "三重県": "JP24",
  "滋賀県": "JP25", "京都府": "JP26", "大阪府": "JP27", "兵庫県": "JP28", "奈良県": "JP29",
  "和歌山県": "JP30", "鳥取県": "JP31", "島根県": "JP32", "岡山県": "JP33", "広島県": "JP34",
  "山口県": "JP35", "徳島県": "JP36", "香川県": "JP37", "愛媛県": "JP38", "高知県": "JP39",
  "福岡県": "JP40", "佐賀県": "JP41", "長崎県": "JP42", "熊本県": "JP43", "大分県": "JP44",
  "宮崎県": "JP45", "鹿児島県": "JP46", "沖縄県": "JP47"
};

fetch('japan-map.svg')
  .then(response => response.text())
  .then(svgText => {
    const wrapper = `<div class="svg-wrapper">${svgText}</div>`;
    document.getElementById('mapContainer').innerHTML = wrapper;

    // 地図クリックイベント（読み込んだ後に）
    document.querySelectorAll('#mapContainer path, #mapContainer circle').forEach(el => {
      el.addEventListener('click', (e) => {
        const clickedId = e.target.id;
        const prefName = Object.keys(prefectureIdMap).find(name => prefectureIdMap[name] === clickedId);
        if (prefName) {
          startPref.value = prefName;
        }
      });
    });
  });

// 行き先決定ボタン
const destinationBtn = document.getElementById('destinationBtn');
const destinationResult = document.getElementById('destinationResult');
destinationBtn.addEventListener('click', () => {
  const start = startPref.value;
  const candidates = adjacentPrefectures[start] || prefectures;
  const randomPref = candidates[Math.floor(Math.random() * candidates.length)];
  destinationResult.textContent = `次の行き先は「${randomPref}」！`;
  highlightPrefecture(randomPref);
});

// ハイライト処理（ふわふわ演出）
function highlightPrefecture(prefectureName) {
  const prefId = prefectureIdMap[prefectureName];
  if (!prefId) return;

  document.querySelectorAll('#mapContainer path, #mapContainer circle').forEach(el => {
    el.setAttribute('fill', '#cce5ff');
  });

  const selected = document.getElementById(prefId);
  if (selected) {
    selected.setAttribute('fill', '#1976d2');
    selected.animate([
      { opacity: 0.5 },
      { opacity: 1 },
      { opacity: 0.5 },
      { opacity: 1 }
    ], {
      duration: 2000,
      iterations: 1
    });
  }
}

// === 3Dダイス ===

let scene, camera, renderer, dice;
let rolling = false;
let materials = [];

init3DDice();

function init3DDice() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(300, 300);
  document.getElementById('diceContainer').appendChild(renderer.domElement);

  const loader = new THREE.TextureLoader();
  materials = [
    new THREE.MeshBasicMaterial({ map: loader.load('dice-1.png') }), // Front
    new THREE.MeshBasicMaterial({ map: loader.load('dice-6.png') }), // Back
    new THREE.MeshBasicMaterial({ map: loader.load('dice-3.png') }), // Top
    new THREE.MeshBasicMaterial({ map: loader.load('dice-4.png') }), // Bottom
    new THREE.MeshBasicMaterial({ map: loader.load('dice-2.png') }), // Left
    new THREE.MeshBasicMaterial({ map: loader.load('dice-5.png') })  // Right
  ];

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  dice = new THREE.Mesh(geometry, materials);
  scene.add(dice);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (rolling) {
    dice.rotation.x += 0.2;
    dice.rotation.y += 0.2;
  }
  renderer.render(scene, camera);
}

document.getElementById('roll3dDiceBtn').addEventListener('click', () => {
  if (rolling) return;
  rolling = true;

  const randomFace = Math.ceil(Math.random() * 6); // 出目を先に決める

  const spinStart = Date.now();
  const spinDuration = 2000; // 2秒回す

  function spin() {
    const elapsed = Date.now() - spinStart;
    if (elapsed < spinDuration) {
      dice.rotation.x += 0.3;
      dice.rotation.y += 0.3;
      requestAnimationFrame(spin);
    } else {
      rolling = false;

      // 止まったら、ランダムな出目に応じて角度を決めて強制セット
      switch (randomFace) {
        case 1:
          dice.rotation.set(0, 0, 0);
          break;
        case 2:
          dice.rotation.set(0, Math.PI / 2, 0);
          break;
        case 3:
          dice.rotation.set(-Math.PI / 2, 0, 0);
          break;
        case 4:
          dice.rotation.set(Math.PI / 2, 0, 0);
          break;
        case 5:
          dice.rotation.set(0, -Math.PI / 2, 0);
          break;
        case 6:
          dice.rotation.set(Math.PI, 0, 0);
          break;
      }

      // 出目×1万円でテキスト表示
      document.getElementById('budget3dResult').textContent = `次の日の予算は ${randomFace * 10000}円だよ！`;
    }
  }

  requestAnimationFrame(spin);
});

// === シェアボタン ===
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', () => {
  const text = `${destinationResult.textContent} ${document.getElementById('budget3dResult').textContent} #ルーレット旅`;
  const url = encodeURIComponent(window.location.href);
  const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
  window.open(shareURL, '_blank');
});
