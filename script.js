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

const spinButton = document.getElementById('spinButton');
const resultArea = document.getElementById('resultArea');
const shareButton = document.getElementById('shareButton');

spinButton.addEventListener('click', () => {
  resultArea.style.opacity = 0;
  let spinCount = 0;
  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * prefectures.length);
    resultArea.textContent = prefectures[randomIndex];
    spinCount++;

    if (spinCount > 20) { // 回転を20回繰り返したらストップ
      clearInterval(interval);
      resultArea.style.animation = 'fadeIn 0.5s ease-in-out forwards';
    }
  }, 100); // 100msごとに文字が切り替わる → ルーレット感
});

shareButton.addEventListener('click', () => {
  const text = `今日の行き先は「${resultArea.textContent}」です！`;
  const url = encodeURIComponent(location.href);
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
  window.open(shareUrl, '_blank');
});
