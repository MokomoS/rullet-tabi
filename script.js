/* ================= app ================= */
function bootApp() {
  var $ = function (id) { return document.getElementById(id); };
  var state = {
    start: "東京都", dest: null, budget: null, transport: null, mission: null,
    spinning: false, rolling: false, turns: 0,
    route: [], stamps: []
  };
  var id2pref = {}, slug2pref = {};
  Object.keys(idMap).forEach(function (p) { id2pref[idMap[p]] = p; });
  Object.keys(slug).forEach(function (p) { slug2pref[slug[p]] = p; });

  /* ---------- 計測（GA4） ---------- */
  function track(name, params) {
    try { if (typeof gtag === "function") gtag("event", name, params || {}); } catch (e) {}
  }

  /* ---------- 楽天アフィリエイト ---------- */
  // URLタイプのリンク。pc= に任意の楽天ドメインのURLを渡せる。
  var AFF_TRAVEL = "52e959bc.15d9121a.52e959bd.aefd9435"; // 宿・バス・パック（既存のID）
  var AFF_CARS   = "52ec94e4.d986eaaa.52ec6059.b7cf170b"; // レンタカー（既存のIDを流用）
  var AFF_UT = "eyJwYWdlIjoidXJsIiwidHlwZSI6InRleHQiLCJjb2wiOjF9";

  function aff(ids, url) {
    return "https://hb.afl.rakuten.co.jp/hgc/" + ids + "/?pc=" + encodeURIComponent(url) +
           "&link_type=text&ut=" + AFF_UT;
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function addDays(base, n) { var d = new Date(base.getTime()); d.setDate(d.getDate() + n); return d; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // 出た目×1万円を、楽天トラベルの価格上限プルダウンに存在する値へ寄せる
  var PRICE_CAP = { 1: 10000, 2: 20000, 3: 30000, 4: 40000, 5: 50000, 6: 100000 };

  // 明日チェックイン・明後日チェックアウト。予算が出ていれば上限価格(f_kin)も乗せる。
  function hotelUrl(pref, budget) {
    var sl = slug[pref];
    if (!sl) return "https://travel.rakuten.co.jp/";
    var now = new Date(), i = addDays(now, 1), o = addDays(now, 2);
    var q = "f_nen1=" + i.getFullYear() + "&f_tuki1=" + pad(i.getMonth() + 1) + "&f_hi1=" + pad(i.getDate()) +
            "&f_nen2=" + o.getFullYear() + "&f_tuki2=" + pad(o.getMonth() + 1) + "&f_hi2=" + pad(o.getDate()) +
            "&f_heya_su=1&f_otona_su=2";
    var cap = budget ? PRICE_CAP[budget / 10000] : null;
    if (cap) q += "&f_kin=" + cap;
    return "https://search.travel.rakuten.co.jp/ds/yado/" + sl + "?" + q;
  }

  function carUrl(pref) {
    var area = carArea[pref];
    return area ? "https://cars.travel.rakuten.co.jp/cars/area/" + area + "/"
                : "https://travel.rakuten.co.jp/cars/";
  }
  function busUrl(pref) {
    var s = busSlug[pref];
    return s ? "https://travel.rakuten.co.jp/bus/pref/" + s + ".html"
             : "https://travel.rakuten.co.jp/bus/";
  }

  /* ---------- 移動手段 ---------- */
  var TRANSPORT = {
    car:   { label: "レンタカー",   note: "寄り道は自由。",       ids: AFF_CARS,   url: carUrl,
             cta: function (p) { return p + "でレンタカーを押さえる"; } },
    train: { label: "電車・新幹線", note: "移動中から呑んでいい。", ids: AFF_TRAVEL,
             url: function () { return "https://travel.rakuten.co.jp/package/jr/"; },
             cta: function (p) { return p + "へ 新幹線＋宿で行く"; } },
    bus:   { label: "高速バス",     note: "浮いた分は現地で使う。", ids: AFF_TRAVEL, url: busUrl,
             cta: function (p) { return p + "行きの高速バスを探す"; } },
    air:   { label: "飛行機",       note: "海を越える日。",         ids: AFF_TRAVEL,
             url: function () { return "https://travel.rakuten.co.jp/package/ana/"; },
             cta: function (p) { return p + "へ 航空券＋宿で行く"; } },
    ferry: { label: "フェリー",     note: "車ごと、海を渡る。",     ids: AFF_CARS,   url: carUrl,
             cta: function (p) { return p + "でレンタカーを押さえる"; } }
  };

  // 北海道・沖縄がからむ区間は陸路で行けない
  function isSeaLeg(a, b) {
    return a === "北海道" || b === "北海道" || a === "沖縄県" || b === "沖縄県";
  }
  function pickTransport(from, to) {
    return isSeaLeg(from, to) ? pick(["air", "ferry"]) : pick(["car", "train", "bus"]);
  }

  function updateLinks() {
    var dest = state.dest;
    if (!dest) return;
    var t = TRANSPORT[state.transport || "car"];
    $("hotelLink").href = aff(AFF_TRAVEL, hotelUrl(dest, state.budget));
    $("hotelLabel").textContent = state.budget
      ? "¥" + state.budget.toLocaleString() + "以内で泊まれる宿"
      : "明日泊まれる宿を探す";
    $("moveLink").href = aff(t.ids, t.url(dest));
    $("moveLabel").textContent = t.cta(dest);
    var mh = $("modalHotel");
    if (mh) mh.href = $("hotelLink").href;
  }

  function affParams(placement, which) {
    return {
      link_id: which,
      destination: state.dest || "",
      budget: state.budget || 0,
      transport: state.transport || "",
      leg: Math.max(0, state.route.length - 1),
      placement: placement
    };
  }
  $("hotelLink").addEventListener("click", function () {
    track("affiliate_click", affParams("prep", "hotel"));
  });
  $("moveLink").addEventListener("click", function () {
    track("affiliate_click", affParams("prep", state.transport || "car"));
  });

  /* ---------- 県別ページへの導線 ---------- */
  function updateStartLink() {
    var a = $("startPrefLink");
    if (!a || !slug[state.start]) return;
    a.href = "pref/" + slug[state.start] + "/";
    a.textContent = state.start + "のページ \u2192";
  }
  ["startPrefLink", "destPrefLink"].forEach(function (id) {
    var el = $(id);
    if (!el) return;
    el.addEventListener("click", function () {
      track("to_pref_page", {
        prefecture: id === "startPrefLink" ? state.start : (state.dest || ""),
        placement: id === "startPrefLink" ? "map_bar" : "result_poster"
      });
    });
  });

  // --- start select ---
  var sel = $("startPref");
  prefectures.forEach(function (p) {
    var o = document.createElement("option");
    o.value = p; o.textContent = p;
    sel.appendChild(o);
  });
  sel.value = state.start;
  sel.addEventListener("change", function () { setStart(sel.value, "select"); });

  // --- map ---
  fetch("japan-map.svg").then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (txt) {
    var host = $("mapContainer");
    host.innerHTML = txt;
    host.querySelectorAll("path, circle").forEach(function (el) {
      el.style.stroke = "#201e1d";
      el.style.strokeWidth = "0.6";
      el.style.cursor = "pointer";
      el.style.transition = "fill .18s linear";
      var pref = id2pref[el.id];
      if (!pref) return;
      el.addEventListener("click", function () { setStart(pref, "map"); });
      el.addEventListener("mouseenter", function () {
        if (pref !== state.start && pref !== state.dest) el.style.fill = "#ffc4b8";
      });
      el.addEventListener("mouseleave", function () { paint(); });
    });
    paint();
  }).catch(function () { $("mapContainer").textContent = "地図を読み込めませんでした"; });

  function paint(flash) {
    var cands = adjacent[state.start] || [];
    var visited = state.route;
    document.querySelectorAll("#mapContainer path, #mapContainer circle").forEach(function (el) {
      var pref = id2pref[el.id];
      var fill = "#eae7e7";
      if (pref) {
        if (pref === state.start) fill = "#201e1d";
        else if (pref === (flash || state.dest)) fill = "#ec3013";
        else if (state.spinning && cands.indexOf(pref) >= 0) fill = "#ffc4b8";
        else if (visited.indexOf(pref) >= 0) fill = "#ffc4b8";
      }
      el.style.fill = fill;
    });
  }

  function setStart(pref, how) {
    state.start = pref; state.dest = null; state.budget = null;
    state.transport = null; state.mission = null; state.spinning = false;
    state.route = [pref];
    sel.value = pref;
    $("mapStart").textContent = pref;
    updateStartLink();
    $("result").hidden = true;
    $("reel").hidden = true;
    paint();
    track("select_start", { start: pref, method: how || "select" });
  }

  /* ---------- ルーレット ---------- */
  function candidatesFor(start) {
    var cands = (adjacent[start] || prefectures).filter(function (p) { return p !== start; });
    // 来た道はなるべく除く。ただし選択肢が消えてしまう場合（北海道↔青森など）は許す。
    var prev = state.route.length >= 2 ? state.route[state.route.length - 2] : null;
    if (prev) {
      var filtered = cands.filter(function (p) { return p !== prev; });
      if (filtered.length) return filtered;
    }
    return cands;
  }

  function spin() {
    if (state.spinning) return;
    var cands = candidatesFor(state.start);
    var final = pick(cands);
    var total = 2400, t = 0, i = 0;
    state.spinning = true; state.dest = null; state.budget = null;
    state.transport = null; state.mission = null;
    if (!state.route.length) state.route = [state.start];
    $("result").hidden = true;
    $("reel").hidden = false;
    revealReel();
    (function tick() {
      i++;
      var name = cands[i % cands.length];
      $("reelName").textContent = name;
      paint(name);
      if (t >= total) { land(final); return; }
      var gap = 55 + 320 * Math.pow(t / total, 3.2);
      t += gap;
      setTimeout(tick, gap);
    })();
  }
  $("spinBtn").addEventListener("click", function () {
    state.route = [state.start];
    spin();
  });

  // 回している間は「地図 + ROLLING の帯」が同時に見える位置へ寄せる
  function revealReel() {
    requestAnimationFrame(function () {
      var r = $("reel").getBoundingClientRect();
      if (r.bottom <= window.innerHeight && r.top >= 0) return;
      var target = window.scrollY + r.bottom - window.innerHeight + 16;
      window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    });
  }

  function land(dest) {
    state.spinning = false;
    state.dest = dest;
    state.route.push(dest);
    $("reelName").textContent = dest;
    setTimeout(function () { $("reel").hidden = true; }, 320);
    paint();
    drawMission(dest);
    renderResult(dest);
    fetchWeather(dest);
    addStamp();
    $("result").hidden = false;
    track("spin_roulette", {
      start: state.start, destination: dest, leg: state.route.length - 1
    });
    setTimeout(function () {
      var top = window.scrollY + $("result").getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 560);
  }

  /* ---------- 連鎖（旅を続ける） ---------- */
  $("chainBtn").addEventListener("click", function () {
    if (state.spinning || !state.dest) return;
    var from = state.dest;
    track("continue_journey", { from: from, leg: state.route.length - 1 });
    state.start = from;
    sel.value = from;
    $("mapStart").textContent = from;
    updateStartLink();
    spin();
  });

  /* ---------- お題 ---------- */
  function drawMission(dest) {
    var list = spots[dest] || [];
    if (list.length && Math.random() < 0.4) {
      state.mission = "「" + pick(list).name + "」まで、実際に行ってみる";
    } else {
      state.mission = pick(MISSIONS);
    }
    $("missionText").textContent = state.mission;
  }
  $("missionReroll").addEventListener("click", function () {
    if (!state.dest) return;
    drawMission(state.dest);
    updateStampCurrent();
    track("reroll_mission", { destination: state.dest });
  });

  /* ---------- 結果 ---------- */
  function routeLabel() {
    return state.route.length > 2 ? state.route.join(" → ") : state.start + " → " + state.dest;
  }

  function renderResult(dest) {
    var legs = state.route.length - 1;
    $("destName").textContent = dest;
    $("legRow").textContent = (legs > 1 ? legs + "県目 ／ " : "") + routeLabel();
    $("routeLink").href = "https://www.google.com/maps/dir/?api=1&origin=" +
      encodeURIComponent(state.start) + "&destination=" + encodeURIComponent(dest) + "&travelmode=driving";
    $("prepNote").textContent = dest + "の宿と足。回した勢いのまま押さえるのが一番早い。";
    $("budget").textContent = "— — —";
    $("budgetNote").textContent = "まだ振っていません。";
    $("transport").textContent = "—";
    $("transportNote").textContent = "ダイスと一緒に決まります。";
    $("chainLabel").textContent = dest + "から、もう一回回す";
    if ($("destPrefLink") && slug[dest]) {
      $("destPrefLink").href = "pref/" + slug[dest] + "/";
      $("destPrefLabel").textContent = dest + "のページを見る";
    }
    updateLinks();

    var wrap = $("spots");
    wrap.innerHTML = "";
    (spots[dest] || []).forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "spot";
      b.innerHTML = '<span class="spot-no">SPOT ' + ("0" + (i + 1)).slice(-2) + '</span>' +
        '<span class="spot-name"></span><span class="spot-desc"></span>';
      b.querySelector(".spot-name").textContent = s.name;
      b.querySelector(".spot-desc").textContent = s.description;
      b.addEventListener("click", function () { openModal(dest, s); });
      wrap.appendChild(b);
    });
  }

  function fetchWeather(pref) {
    var city = cityMap[pref] || "Tokyo";
    var key = "0db7274b7abf5a6db8875b8185916e7d";
    $("weather").textContent = "明日の天気を確認中…";
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",JP&appid=" + key + "&units=metric&lang=ja")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var f = d.list[8] || d.list[0];
        $("weather").textContent = "明日の" + pref + "は " + f.weather[0].description + " / " + Math.round(f.main.temp) + "℃";
      })
      .catch(function () { $("weather").textContent = "明日の天気はいま取得できません"; });
  }

  /* ---------- ダイス（予算＋移動手段） ---------- */
  var faceRot = { 1: [0, 0], 6: [0, 180], 3: [0, -90], 4: [0, 90], 5: [-90, 0], 2: [90, 0] };
  $("rollBtn").addEventListener("click", function () {
    if (state.rolling || !state.dest) return;
    state.rolling = true;
    var v = Math.floor(Math.random() * 6) + 1;
    var base = faceRot[v];
    state.turns++;
    $("dice").style.transform = "rotateX(" + (720 * state.turns + base[0]) + "deg) rotateY(" + (1080 * state.turns + base[1]) + "deg)";
    setTimeout(function () {
      state.rolling = false;
      state.budget = v * 10000;
      state.transport = pickTransport(state.start, state.dest);
      var t = TRANSPORT[state.transport];
      $("budget").textContent = "¥" + state.budget.toLocaleString();
      $("budgetNote").textContent = "この金額で" + state.dest + "を一日遊ぶ。";
      $("transport").textContent = t.label;
      $("transportNote").textContent = t.note;
      $("prepNote").textContent = "予算¥" + state.budget.toLocaleString() + "、移動は" + t.label +
        "。その条件で" + state.dest + "を押さえます。";
      updateStampCurrent();
      updateLinks();
      track("roll_dice", {
        destination: state.dest, face: v, budget: state.budget, transport: state.transport
      });
    }, 1650);
  });

  /* ---------- シェア ---------- */
  function shareText() {
    var b = state.budget ? "／予算¥" + state.budget.toLocaleString() : "";
    var t = state.transport ? "／" + TRANSPORT[state.transport].label : "";
    var legs = state.route.length - 1;
    var head = legs > 1 ? "ルー列島旅NEXT！ " + legs + "県まわって「" + state.dest + "」に到着！"
                        : "ルー列島旅NEXT！ " + state.start + "から次の行き先は「" + state.dest + "」！";
    return head + b + t + " #ルーレット旅NEXT";
  }
  function shareUrl() {
    var qs = "r=" + state.route.map(function (p) { return slug[p]; }).join("-");
    if (state.budget) qs += "&b=" + (state.budget / 10000);
    if (state.transport) qs += "&t=" + state.transport;
    return location.origin + location.pathname + "?" + qs;
  }

  $("shareBtn").addEventListener("click", function () {
    track("share", { method: "x", destination: state.dest || "", budget: state.budget || 0 });
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText()) +
      "&url=" + encodeURIComponent(shareUrl()), "_blank");
  });
  $("shareLineBtn").addEventListener("click", function () {
    track("share", { method: "line", destination: state.dest || "", budget: state.budget || 0 });
    window.open("https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(shareUrl()) +
      "&text=" + encodeURIComponent(shareText()), "_blank");
  });

  /* ---------- 結果カードの画像化 ---------- */
  function drawCard() {
    var W = 1200, H = 630, c = document.createElement("canvas");
    c.width = W; c.height = H;
    var g = c.getContext("2d");
    var jp = '"Zen Kaku Gothic New", "Hiragino Sans", "Noto Sans JP", sans-serif';

    g.fillStyle = "#ec3013"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#201e1d"; g.fillRect(0, H - 14, W, 14);

    g.fillStyle = "#fff";
    g.font = "800 22px " + jp;
    g.fillText("ルー列島旅 NEXT", 64, 88);
    g.font = "800 20px " + jp;
    g.fillText("次の行き先", 64, 150);

    var name = state.dest || "";
    var size = name.length > 4 ? 120 : 150;
    g.font = "900 " + size + "px " + jp;
    g.fillText(name, 60, 150 + size * 0.95);

    var y = 430;
    g.font = "700 26px " + jp;
    var legs = state.route.length - 1;
    var line = (legs > 1 ? legs + "県目 ／ " : "") + routeLabel();
    if (line.length > 34) line = line.slice(0, 33) + "…";
    g.fillText(line, 64, y); y += 46;

    var meta = [];
    if (state.budget) meta.push("予算 ¥" + state.budget.toLocaleString());
    if (state.transport) meta.push("移動 " + TRANSPORT[state.transport].label);
    if (meta.length) { g.font = "800 30px " + jp; g.fillText(meta.join("　／　"), 64, y); y += 44; }
    if (state.mission) {
      g.font = "700 24px " + jp;
      var m = "お題：" + state.mission;
      if (m.length > 36) m = m.slice(0, 35) + "…";
      g.fillText(m, 64, y);
    }

    g.font = "800 20px " + jp;
    g.fillText("rullet-tabi.net", 64, H - 46);
    return c;
  }

  $("saveImgBtn").addEventListener("click", function () {
    track("share", { method: "image", destination: state.dest || "", budget: state.budget || 0 });
    var go = function () {
      var c = drawCard();
      c.toBlob(function (blob) {
        if (!blob) return;
        var file = null;
        try { file = new File([blob], "rullet-tabi.png", { type: "image/png" }); } catch (e) {}
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text: shareText(), url: shareUrl() }).catch(function () {});
          return;
        }
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "rullet-tabi.png";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      }, "image/png");
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go).catch(go);
    else go();
  });

  /* ---------- URL からの復元 ---------- */
  function restoreFromUrl() {
    var q = new URLSearchParams(location.search);
    var r = q.get("r");
    if (!r) return;
    var route = r.split("-").map(function (s) { return slug2pref[s]; }).filter(Boolean);
    if (route.length < 2) return;
    state.route = route;
    state.start = route[route.length - 2];
    state.dest = route[route.length - 1];
    sel.value = state.start;
    $("mapStart").textContent = state.start;
    updateStartLink();

    var b = parseInt(q.get("b"), 10);
    if (b >= 1 && b <= 6) state.budget = b * 10000;
    var t = q.get("t");
    if (TRANSPORT[t]) state.transport = t;

    paint();
    drawMission(state.dest);
    renderResult(state.dest);
    fetchWeather(state.dest);
    if (state.budget) {
      $("budget").textContent = "¥" + state.budget.toLocaleString();
      $("budgetNote").textContent = "この金額で" + state.dest + "を一日遊ぶ。";
    }
    if (state.transport) {
      $("transport").textContent = TRANSPORT[state.transport].label;
      $("transportNote").textContent = TRANSPORT[state.transport].note;
    }
    updateLinks();
    $("result").hidden = false;
    track("restore_shared", { destination: state.dest, leg: route.length - 1 });
  }

  /* ---------- モーダル ---------- */
  var lastFocus = null;
  function openModal(pref, s) {
    lastFocus = document.activeElement;
    $("modalPref").textContent = pref + " の観光スポット";
    $("modalName").textContent = s.name;
    $("modalBody").textContent = s.description;
    $("modalMap").href = "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(pref + " " + s.name);
    $("modalHotel").href = aff(AFF_TRAVEL, hotelUrl(pref, state.budget));
    $("modalHotelLabel").textContent = pref + "の宿を探す";
    $("modal").hidden = false;
    $("modalClose").focus();
    track("open_spot", { destination: pref, spot: s.name });
  }
  $("modalMap").addEventListener("click", function () {
    track("open_spot_map", { destination: state.dest || "", spot: $("modalName").textContent });
  });
  $("modalHotel").addEventListener("click", function () {
    track("affiliate_click", affParams("spot_modal", "hotel"));
  });
  function closeModal() {
    $("modal").hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $("modalClose").addEventListener("click", closeModal);
  $("modal").addEventListener("click", function (e) { if (e.target === $("modal")) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !$("modal").hidden) closeModal();
  });

  /* ---------- スタンプ帳 ---------- */
  var STORE = "rullet-tabi:stamps";
  try {
    var raw = JSON.parse(localStorage.getItem(STORE) || "[]");
    state.stamps = raw.map(function (s) {
      // 旧フォーマット {pref, budget:"¥10,000"|"予算 未定", date} からの移行
      if (s.to) return s;
      var n = parseInt(String(s.budget || "").replace(/[^0-9]/g, ""), 10);
      return { from: "", to: s.pref, budget: n || 0, transport: "", mission: "", date: s.date, leg: 1 };
    });
  } catch (e) { state.stamps = []; }
  renderStamps();

  function addStamp() {
    var d = new Date();
    state.stamps = [{
      from: state.start, to: state.dest, budget: 0, transport: "", mission: state.mission,
      date: (d.getMonth() + 1) + "/" + d.getDate(), leg: state.route.length - 1
    }].concat(state.stamps).slice(0, 30);
    saveStamps();
  }
  // 直近のスタンプ（＝いま遊んでいる区間）に予算・移動手段・お題を書き戻す
  function updateStampCurrent() {
    if (!state.stamps.length) return;
    var s = state.stamps[0];
    s.budget = state.budget || 0;
    s.transport = state.transport || "";
    s.mission = state.mission || "";
    saveStamps();
  }
  function saveStamps() {
    try { localStorage.setItem(STORE, JSON.stringify(state.stamps)); } catch (e) {}
    renderStamps();
  }
  function renderStamps() {
    var wrap = $("stamps");
    wrap.innerHTML = "";
    var seen = {}, longest = 0;
    state.stamps.forEach(function (st) {
      if (st.from) seen[st.from] = 1;
      if (st.to) seen[st.to] = 1;
      if ((st.leg || 1) > longest) longest = st.leg || 1;
    });
    var n = Object.keys(seen).length;
    $("stampStats").textContent = state.stamps.length
      ? "47都道府県中 " + n + "県（" + Math.round(n / 47 * 100) + "%）／ 最長ルート " + longest + "県"
      : "";

    state.stamps.forEach(function (st) {
      var d = document.createElement("div");
      d.className = "stamp";
      d.innerHTML = '<span class="stamp-date"></span><span class="stamp-pref"></span>' +
        '<span class="stamp-leg"></span><span class="stamp-budget"></span>';
      d.querySelector(".stamp-date").textContent = st.date;
      d.querySelector(".stamp-pref").textContent = st.to;
      d.querySelector(".stamp-leg").textContent = st.from ? st.from + " → " + st.to : "";
      var parts = [];
      parts.push(st.budget ? "¥" + Number(st.budget).toLocaleString() : "予算 未定");
      if (st.transport && TRANSPORT[st.transport]) parts.push(TRANSPORT[st.transport].label);
      d.querySelector(".stamp-budget").textContent = parts.join(" ／ ");
      wrap.appendChild(d);
    });
    $("stampSection").hidden = state.stamps.length === 0;
  }
  $("clearStamps").addEventListener("click", function () {
    state.stamps = [];
    try { localStorage.removeItem(STORE); } catch (e) {}
    renderStamps();
  });

  state.route = [state.start];
  updateStartLink();
  // 地図の読み込み結果に関係なく、共有リンクからの復元は成立させる
  restoreFromUrl();
}

/* ---------- 起動 ----------
   GitHub Pages は HTML も JS も Cache-Control: max-age=600 で配信するため、
   デプロイ直後の最大10分間は「古いindex.html + 新しいscript.js」の組み合わせが
   ブラウザ内で発生しうる。古いindex.htmlは data.js を読み込まないので、
   その場合はここで自力で読み込んでから起動する。 */
(function () {
  if (typeof prefectures !== "undefined" && typeof idMap !== "undefined") { bootApp(); return; }
  var s = document.createElement("script");
  s.src = "data.js";
  s.onload = function () {
    try { bootApp(); } catch (e) { failed(); }
  };
  s.onerror = failed;
  document.head.appendChild(s);

  function failed() {
    var m = document.getElementById("mapContainer");
    if (m) m.textContent = "読み込みに失敗しました。ページを再読み込みしてください。";
  }
})();
