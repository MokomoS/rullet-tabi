/* 県別ページ・OGP画像・sitemap・robots.txt を生成する。
   使い方:  node build.mjs
   data.js を唯一のデータ源として読むので、県や隣接関係を足したらここも自動で追従する。 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://www.rullet-tabi.net';
const OUT_PREF = path.join(ROOT, 'pref');
const OUT_OGP = path.join(ROOT, 'ogp');

/* ---------- data.js を読み込む ---------- */
const src = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
const D = new Function(src + `
  return { prefectures, adjacent, cityMap, slug, spots, carArea, busSlug, MISSIONS };`)();
const { prefectures, adjacent, slug, spots, carArea, busSlug, MISSIONS } = D;

/* ---------- 隣接グラフの計算 ---------- */
function bfs(src) {
  const d = { [src]: 0 }, q = [src];
  for (let i = 0; i < q.length; i++) {
    for (const y of adjacent[q[i]]) if (!(y in d)) { d[y] = d[q[i]] + 1; q.push(y); }
  }
  return d;
}
const DIST = Object.fromEntries(prefectures.map(p => [p, bfs(p)]));

// 隣接数の順位（多い順、同数は同順位）
const counts = prefectures.map(p => adjacent[p].length);
const rankOf = p => counts.filter(c => c > adjacent[p].length).length + 1;
const maxAdj = Math.max(...counts), minAdj = Math.min(...counts);
const mostBranchy = prefectures.filter(p => adjacent[p].length === maxAdj);
const leastBranchy = prefectures.filter(p => adjacent[p].length === minAdj);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 「◯◯県」「◯◯府」「◯◯都」から助詞の前の短い呼び名
const shortName = p => p.replace(/[都道府県]$/, '') || p;

/* ---------- 県ごとの派生データ ---------- */
function prefInfo(p) {
  const d = DIST[p];
  const levels = {};
  for (const [q, n] of Object.entries(d)) { if (n > 0) (levels[n] ||= []).push(q); }
  const maxHop = Math.max(...Object.values(d));
  const farthest = Object.keys(d).filter(q => d[q] === maxHop);
  return {
    pref: p, sl: slug[p], nbrs: adjacent[p], levels, maxHop, farthest,
    rank: rankOf(p), idx: prefectures.indexOf(p) + 1
  };
}

/* ---------- ページ生成 ---------- */
function prefPage(info) {
  const { pref, sl, nbrs, levels, maxHop, farthest, rank, idx } = info;
  const s = shortName(pref);
  const far = farthest[0];
  const nbrList = nbrs.map(n => `<a class="nbr" href="../${slug[n]}/">
        <span class="nbr-no">NEXT</span>
        <span class="nbr-name">${esc(n)}</span>
        <span class="nbr-note">${esc(shortName(n))}からは さらに${adjacent[n].length}県へ</span>
      </a>`).join('\n      ');

  const reachRows = Object.keys(levels).map(Number).sort((a, b) => a - b).map(n => `<div class="reach-row">
        <span class="reach-n">${n}<small>回</small></span>
        <span class="reach-c">${levels[n].length}県</span>
        <span class="reach-prefs">${levels[n].map(q =>
          `<a href="../${slug[q]}/">${esc(q)}</a>`).join('、')}</span>
      </div>`).join('\n      ');

  const spotList = (spots[pref] || []).map((sp, i) => `<div class="spot spot-static">
        <span class="spot-no">SPOT ${String(i + 1).padStart(2, '0')}</span>
        <span class="spot-name">${esc(sp.name)}</span>
        <span class="spot-desc spot-desc-full">${esc(sp.description)}</span>
      </div>`).join('\n      ');

  // ビルドのたびに変わらないよう、県のインデックスからお題を決める
  const miss = [0, 1, 2].map(k => MISSIONS[(idx * 7 + k * 5) % MISSIONS.length]);
  const missList = miss.map(m => `<li>${esc(m)}</li>`).join('');

  const faq = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `${pref}に隣接する都道府県はどこですか？`,
        acceptedAnswer: { '@type': 'Answer',
          text: `${pref}に隣接するのは${nbrs.join('、')}の${nbrs.length}都道府県です。` } },
      { '@type': 'Question', name: `${pref}から一番遠い都道府県はどこですか？`,
        acceptedAnswer: { '@type': 'Answer',
          text: `隣の県だけをたどっていく場合、${pref}から最も遠いのは${farthest.join('、')}で、${maxHop}回の移動が必要です。` } }
    ]
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ルー列島旅 NEXT', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: pref, item: `${SITE}/pref/${sl}/` }
    ]
  };

  const title = `${pref}の隣の県はどこ？ 隣接${nbrs.length}県をルーレットで決める｜ルー列島旅 NEXT`;
  const desc = `${pref}に隣接するのは${nbrs.join('・')}の${nbrs.length}県。` +
    `回すと隣の県にしか行けないルーレットで、${s}からの次の行き先を決めます。` +
    `${pref}から一番遠いのは${far}で、${maxHop}回。`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="../../favicon.png" type="image/png">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}/pref/${sl}/">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(pref)}の隣は、${nbrs.length}つ。">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/ogp/${sl}.png">
<meta property="og:url" content="${SITE}/pref/${sl}/">
<meta name="twitter:card" content="summary_large_image">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4GQEGFSQ58"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-4GQEGFSQ58');
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800;900&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../style.css">
<script type="application/ld+json">${JSON.stringify(faq)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head>
<body>

<header class="site-head">
  <div class="brand">
    <a class="brand-link" href="../../"><span class="brand-name">ルー列島旅</span><span class="brand-next">NEXT</span></a>
  </div>
  <div class="head-note">${esc(pref)}から、隣の県へ</div>
</header>

<section class="hero">
  <div class="hero-copy">
    <div class="kicker accent">PREF ${String(idx).padStart(2, '0')} — ${esc(pref)}</div>
    <h1>${esc(pref)}の隣は、<br>${nbrs.length}つ。</h1>
    <p class="lede">行けるのは${esc(nbrs.join('・'))}だけ。どれになるかは回すまで分かりません。${esc(s)}を出発地にして、明日の行き先を運に丸投げしましょう。</p>
    <div class="rule"></div>
    <button type="button" id="spinBtn" class="btn btn-primary spin-btn">
      <span>${esc(pref)}から回す</span><span class="arrow">&#8594;</span>
    </button>
    <div class="fineprint">※ 行き先は必ず${esc(pref)}に隣接した都道府県になります。</div>
  </div>

  <div class="hero-map">
    <div class="map-bar">
      <span class="kicker">ADJACENT / ${nbrs.length}</span>
      <span class="map-start">隣の多さ 全国 <b>${rank}</b> 位</span>
    </div>
    <div class="pref-stats">
      <div class="stat">
        <span class="kicker muted">いちばん遠い県</span>
        <span class="stat-big">${esc(far)}</span>
        <span class="block-note">隣の県だけをたどると <b>${maxHop}回</b>。ここまで続けられますか。</span>
      </div>
      <div class="stat">
        <span class="kicker muted">全国のものさし</span>
        <span class="block-note">いちばん分岐が多いのは${esc(mostBranchy.join('・'))}（${maxAdj}県）。
        いちばん少ないのは${esc(leastBranchy.join('・'))}（${minAdj}県）。</span>
      </div>
    </div>
  </div>
</section>

<section id="reel" class="reel" hidden>
  <div class="kicker rolling">ROLLING…</div>
  <div id="reelName" class="reel-name"></div>
</section>

<section id="miniResult" class="poster" hidden>
  <div class="poster-main">
    <div class="kicker">次の行き先</div>
    <div id="destName" class="dest"></div>
    <div class="weather" id="legText"></div>
  </div>
  <div class="poster-actions">
    <a id="goApp" href="../../" class="link-block">
      <span id="goAppLabel">予算とお題を決める</span><span>&#8599;</span>
    </a>
    <button type="button" id="againBtn" class="link-block ghost-white">
      <span>もう一度回す</span><span>&#8635;</span>
    </button>
  </div>
</section>

<section class="block">
  <div class="block-bar">
    <span class="kicker">${esc(pref)}の隣 — ${nbrs.length}県</span>
    <span class="block-note">タップでその県のページへ</span>
  </div>
  <div class="nbr-grid">
      ${nbrList}
  </div>
</section>

<section class="block">
  <div class="block-bar">
    <span class="kicker">何回まわせば、どこまで</span>
    <span class="block-note">${esc(pref)}起点</span>
  </div>
  <div class="reach">
      ${reachRows}
  </div>
</section>

<section class="block">
  <div class="block-bar">
    <span class="kicker">${esc(pref)}で出るスポット</span>
    <span class="block-note">回して当たると出てきます</span>
  </div>
  <div class="spots">
      ${spotList}
  </div>
</section>

<section class="mission">
  <div class="mission-head"><span class="kicker accent">${esc(pref)}で出るお題の例</span></div>
  <ul class="mission-list">${missList}</ul>
</section>

<section class="prep">
  <div class="kicker">${esc(pref)}に泊まるなら</div>
  <div class="block-note prep-note">予算ダイスの出目に合わせて、明日チェックインで探せます。</div>
  <div class="budget-grid">
    <a class="link-block outline" data-cap="10000" href="#"><span>1万円で泊まる</span><span class="accent">&#8599;</span></a>
    <a class="link-block outline" data-cap="30000" href="#"><span>3万円で泊まる</span><span class="accent">&#8599;</span></a>
    <a class="link-block outline" data-cap="50000" href="#"><span>5万円で泊まる</span><span class="accent">&#8599;</span></a>
  </div>
  <div class="prep-grid">
    <a class="link-block outline" data-move="car" href="#"><span>${esc(pref)}でレンタカーを借りる</span><span class="accent">&#8599;</span></a>
    <a class="link-block outline" data-move="bus" href="#"><span>${esc(pref)}行きの高速バスを探す</span><span class="accent">&#8599;</span></a>
  </div>
  <div class="fineprint">楽天のアフィリエイトリンクです。別タブで開きます。</div>
</section>

<footer class="site-foot">
  <span><a class="brand-link" href="../../">&copy; 2026 ルー列島旅 NEXT</a></span>
  <span>rullet-tabi.net</span>
</footer>

<script>
(function () {
  var PREF = ${JSON.stringify(pref)}, SL = ${JSON.stringify(sl)};
  var NBRS = ${JSON.stringify(nbrs)};
  var NBR_SLUG = ${JSON.stringify(Object.fromEntries(nbrs.map(n => [n, slug[n]])))};
  var CAR = ${JSON.stringify(carArea[pref] || '')}, BUS = ${JSON.stringify(busSlug[pref] || '')};
  var $ = function (id) { return document.getElementById(id); };
  function track(n, p) { try { if (typeof gtag === 'function') gtag('event', n, p || {}); } catch (e) {} }

  /* --- アフィリエイトリンク（日付は開いた日の翌日にする） --- */
  var AFF_TRAVEL = '52e959bc.15d9121a.52e959bd.aefd9435';
  var AFF_CARS = '52ec94e4.d986eaaa.52ec6059.b7cf170b';
  var AFF_UT = 'eyJwYWdlIjoidXJsIiwidHlwZSI6InRleHQiLCJjb2wiOjF9';
  function aff(ids, url) {
    return 'https://hb.afl.rakuten.co.jp/hgc/' + ids + '/?pc=' + encodeURIComponent(url) +
      '&link_type=text&ut=' + AFF_UT;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function addDays(b, n) { var d = new Date(b.getTime()); d.setDate(d.getDate() + n); return d; }
  var now = new Date(), i1 = addDays(now, 1), o1 = addDays(now, 2);
  var DATES = 'f_nen1=' + i1.getFullYear() + '&f_tuki1=' + pad(i1.getMonth() + 1) + '&f_hi1=' + pad(i1.getDate()) +
    '&f_nen2=' + o1.getFullYear() + '&f_tuki2=' + pad(o1.getMonth() + 1) + '&f_hi2=' + pad(o1.getDate()) +
    '&f_heya_su=1&f_otona_su=2';

  document.querySelectorAll('[data-cap]').forEach(function (a) {
    var cap = a.getAttribute('data-cap');
    a.href = aff(AFF_TRAVEL, 'https://search.travel.rakuten.co.jp/ds/yado/' + SL + '?' + DATES + '&f_kin=' + cap);
    a.target = '_blank'; a.rel = 'noopener sponsored';
    a.addEventListener('click', function () {
      track('affiliate_click', { link_id: 'hotel', destination: PREF, budget: Number(cap), placement: 'pref_page' });
    });
  });
  document.querySelectorAll('[data-move]').forEach(function (a) {
    var kind = a.getAttribute('data-move');
    if (kind === 'car') a.href = aff(AFF_CARS, CAR ? 'https://cars.travel.rakuten.co.jp/cars/area/' + CAR + '/' : 'https://travel.rakuten.co.jp/cars/');
    else a.href = aff(AFF_TRAVEL, BUS ? 'https://travel.rakuten.co.jp/bus/pref/' + BUS + '.html' : 'https://travel.rakuten.co.jp/bus/');
    a.target = '_blank'; a.rel = 'noopener sponsored';
    a.addEventListener('click', function () {
      track('affiliate_click', { link_id: kind, destination: PREF, budget: 0, placement: 'pref_page' });
    });
  });

  /* --- ミニルーレット --- */
  var spinning = false;
  function spin() {
    if (spinning || !NBRS.length) return;
    spinning = true;
    var final = NBRS[Math.floor(Math.random() * NBRS.length)];
    var total = 1800, t = 0, i = 0;
    $('miniResult').hidden = true;
    $('reel').hidden = false;
    (function tick() {
      i++;
      $('reelName').textContent = NBRS[i % NBRS.length];
      if (t >= total) { land(final); return; }
      var gap = 55 + 300 * Math.pow(t / total, 3.2);
      t += gap;
      setTimeout(tick, gap);
    })();
  }
  function land(dest) {
    spinning = false;
    $('reelName').textContent = dest;
    setTimeout(function () { $('reel').hidden = true; }, 320);
    $('destName').textContent = dest;
    $('legText').textContent = PREF + ' → ' + dest;
    $('goApp').href = '../../?r=' + SL + '-' + NBR_SLUG[dest];
    $('goAppLabel').textContent = dest + 'の予算とお題を決める';
    $('miniResult').hidden = false;
    track('pref_spin', { start: PREF, destination: dest });
    setTimeout(function () {
      var el = $('miniResult');
      window.scrollTo({ top: Math.max(0, window.scrollY + el.getBoundingClientRect().top), behavior: 'smooth' });
    }, 360);
  }
  $('spinBtn').addEventListener('click', spin);
  $('againBtn').addEventListener('click', spin);
  $('goApp').addEventListener('click', function () {
    track('pref_to_app', { start: PREF, destination: $('destName').textContent });
  });
})();
</script>
</body>
</html>
`;
}

/* ---------- OGP画像のテンプレート ---------- */
function ogpHtml(info) {
  const { pref, nbrs, maxHop, farthest } = info;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#ec3013;color:#fff;
    font-family:"Noto Sans CJK JP","Noto Sans JP",sans-serif;
    padding:64px 60px;position:relative;overflow:hidden}
  .brand{font-size:24px;font-weight:900;letter-spacing:.06em}
  .kick{margin-top:52px;font-size:22px;font-weight:700;letter-spacing:.2em;opacity:.9}
  h1{font-size:${pref.length > 4 ? 104 : 128}px;font-weight:900;line-height:1.02;letter-spacing:-.04em;margin-top:6px}
  .sub{position:absolute;left:60px;right:60px;bottom:100px;font-size:${nbrs.length>=7?27:nbrs.length>=5?31:34}px;font-weight:900;letter-spacing:-.01em;line-height:1.34}
  .far{position:absolute;left:60px;bottom:56px;font-size:24px;font-weight:700;opacity:.92}
  .bar{position:absolute;left:0;right:0;bottom:0;height:16px;background:#201e1d}
  .n{white-space:nowrap}.sep{margin:0 13px;opacity:.7}
  .dom{position:absolute;right:60px;bottom:56px;font-size:22px;font-weight:800;opacity:.92}
  </style></head><body>
  <div class="brand">ルー列島旅 NEXT</div>
  <div class="kick">${esc(pref)}の隣は</div>
  <h1>${nbrs.length}つ。</h1>
  <div class="sub">${nbrs.map(n => `<span class="n">${esc(n)}</span>`).join('<span class="sep">/</span>')}</div>
  <div class="far">いちばん遠いのは ${esc(farthest[0])}（${maxHop}回）</div>
  <div class="dom">rullet-tabi.net</div>
  <div class="bar"></div>
  </body></html>`;
}

/* ---------- 出力 ---------- */
fs.mkdirSync(OUT_PREF, { recursive: true });
fs.mkdirSync(OUT_OGP, { recursive: true });

const infos = prefectures.map(prefInfo);
for (const info of infos) {
  const dir = path.join(OUT_PREF, info.sl);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), prefPage(info));
}
console.log('県別ページ:', infos.length, '件');

/* sitemap */
const today = new Date().toISOString().slice(0, 10);
const urls = [`  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>`]
  .concat(infos.map(i => `  <url>\n    <loc>${SITE}/pref/${i.sl}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n  </url>`));
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

/* robots.txt */
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('sitemap.xml / robots.txt を書き出しました');

/* OGP画像 */
if (process.argv.includes('--no-ogp')) {
  console.log('OGP画像の生成はスキップしました');
} else {
  const pw = await import('/home/claude/.npm-global/lib/node_modules/playwright/index.js');
  const browser = await pw.default.chromium.launch({ args: ['--no-proxy-server'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const info of infos) {
    await page.setContent(ogpHtml(info), { waitUntil: 'load' });
    await page.screenshot({ path: path.join(OUT_OGP, info.sl + '.png') });
  }
  await browser.close();
  console.log('OGP画像:', infos.length, '枚');
}
