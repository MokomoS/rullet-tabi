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
