// 出典: MokomoS/rullet-tabi (index.html) のデータをそのまま移植
const prefectures = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

const adjacent = {
  "北海道":["青森県"],
  "青森県":["北海道","秋田県","岩手県"],
  "岩手県":["青森県","秋田県","宮城県"],
  "宮城県":["岩手県","秋田県","山形県","福島県"],
  "秋田県":["青森県","岩手県","宮城県","山形県"],
  "山形県":["秋田県","宮城県","福島県","新潟県"],
  "福島県":["宮城県","山形県","栃木県","群馬県","茨城県","新潟県"],
  "茨城県":["福島県","栃木県","埼玉県","千葉県"],
  "栃木県":["福島県","群馬県","茨城県","埼玉県"],
  "群馬県":["福島県","栃木県","埼玉県","長野県","新潟県"],
  "埼玉県":["群馬県","栃木県","茨城県","千葉県","東京都","山梨県","長野県"],
  "千葉県":["茨城県","埼玉県","東京都"],
  "東京都":["埼玉県","千葉県","神奈川県","山梨県"],
  "神奈川県":["東京都","山梨県","静岡県"],
  "新潟県":["山形県","福島県","群馬県","長野県","富山県"],
  "富山県":["新潟県","長野県","岐阜県","石川県"],
  "石川県":["富山県","岐阜県","福井県"],
  "福井県":["石川県","岐阜県","滋賀県","京都府"],
  "山梨県":["静岡県","神奈川県","東京都","埼玉県","長野県"],
  "長野県":["新潟県","群馬県","埼玉県","山梨県","静岡県","愛知県","岐阜県","富山県"],
  "岐阜県":["富山県","石川県","福井県","滋賀県","三重県","愛知県","長野県"],
  "静岡県":["山梨県","神奈川県","愛知県","長野県"],
  "愛知県":["岐阜県","静岡県","三重県","長野県"],
  "三重県":["滋賀県","京都府","奈良県","愛知県","岐阜県","和歌山県"],
  "滋賀県":["福井県","岐阜県","三重県","京都府"],
  "京都府":["滋賀県","福井県","大阪府","兵庫県","奈良県","三重県"],
  "大阪府":["京都府","兵庫県","奈良県","和歌山県"],
  "兵庫県":["京都府","大阪府","鳥取県","岡山県","香川県","徳島県"],
  "奈良県":["三重県","京都府","大阪府","和歌山県"],
  "和歌山県":["三重県","奈良県","大阪府","徳島県"],
  "鳥取県":["兵庫県","岡山県","島根県","広島県"],
  "島根県":["鳥取県","広島県","山口県"],
  "岡山県":["兵庫県","鳥取県","広島県","香川県"],
  "広島県":["岡山県","鳥取県","島根県","山口県","愛媛県"],
  "山口県":["広島県","島根県","福岡県","大分県"],
  "徳島県":["香川県","愛媛県","高知県","兵庫県","和歌山県"],
  "香川県":["徳島県","愛媛県","岡山県","兵庫県"],
  "愛媛県":["香川県","徳島県","高知県","広島県","大分県","山口県"],
  "高知県":["徳島県","愛媛県"],
  "福岡県":["山口県","佐賀県","熊本県","大分県"],
  "佐賀県":["福岡県","長崎県"],
  "長崎県":["佐賀県","熊本県"],
  "熊本県":["福岡県","佐賀県","長崎県","大分県","宮崎県","鹿児島県"],
  "大分県":["福岡県","熊本県","宮崎県","山口県","愛媛県"],
  "宮崎県":["熊本県","大分県","鹿児島県"],
  "鹿児島県":["宮崎県","熊本県","沖縄県"],
  "沖縄県":["鹿児島県"]
};

const idMap = {};
prefectures.forEach((p, i) => { idMap[p] = "JP" + String(i + 1).padStart(2, "0"); });

const cityMap = {"北海道":"Sapporo","青森県":"Aomori","岩手県":"Morioka","宮城県":"Sendai","秋田県":"Akita","山形県":"Yamagata","福島県":"Fukushima","茨城県":"Mito","栃木県":"Utsunomiya","群馬県":"Maebashi","埼玉県":"Saitama","千葉県":"Chiba","東京都":"Tokyo","神奈川県":"Yokohama","新潟県":"Niigata","富山県":"Toyama","石川県":"Kanazawa","福井県":"Fukui","山梨県":"Kofu","長野県":"Nagano","岐阜県":"Gifu","静岡県":"Shizuoka","愛知県":"Nagoya","三重県":"Tsu","滋賀県":"Otsu","京都府":"Kyoto","大阪府":"Osaka","兵庫県":"Kobe","奈良県":"Nara","和歌山県":"Wakayama","鳥取県":"Tottori","島根県":"Matsue","岡山県":"Okayama","広島県":"Hiroshima","山口県":"Yamaguchi","徳島県":"Tokushima","香川県":"Takamatsu","愛媛県":"Matsuyama","高知県":"Kochi","福岡県":"Fukuoka","佐賀県":"Saga","長崎県":"Nagasaki","熊本県":"Kumamoto","大分県":"Oita","宮崎県":"Miyazaki","鹿児島県":"Kagoshima","沖縄県":"Naha"};

const slug = {"北海道":"hokkaido","青森県":"aomori","岩手県":"iwate","宮城県":"miyagi","秋田県":"akita","山形県":"yamagata","福島県":"fukushima","茨城県":"ibaraki","栃木県":"tochigi","群馬県":"gunma","埼玉県":"saitama","千葉県":"chiba","東京都":"tokyo","神奈川県":"kanagawa","新潟県":"niigata","富山県":"toyama","石川県":"ishikawa","福井県":"fukui","山梨県":"yamanashi","長野県":"nagano","岐阜県":"gifu","静岡県":"shizuoka","愛知県":"aichi","三重県":"mie","滋賀県":"shiga","京都府":"kyoto","大阪府":"osaka","兵庫県":"hyogo","奈良県":"nara","和歌山県":"wakayama","鳥取県":"tottori","島根県":"shimane","岡山県":"okayama","広島県":"hiroshima","山口県":"yamaguchi","徳島県":"tokushima","香川県":"kagawa","愛媛県":"ehime","高知県":"kochi","福岡県":"fukuoka","佐賀県":"saga","長崎県":"nagasaki","熊本県":"kumamoto","大分県":"oita","宮崎県":"miyazaki","鹿児島県":"kagoshima","沖縄県":"okinawa"};

const raw = {
"北海道":[["札幌時計台","明治11年に建設された日本最古の塔時計。毎正時に鳴り響く鐘の音は札幌の象徴です。"],["函館山","世界三大夜景の一つに数えられる絶景スポット。扇状に広がる市街地の灯りが幻想的です。"],["富良野のラベンダー畑","夏には一面紫色の絨毯が広がる絶景。爽やかな香りと共に北海道の初夏を感じられます。"]],
"青森県":[["弘前城","江戸時代に築かれた現存12天守の一つ。春には日本最古級のソメイヨシノが咲き誇ります。"],["奥入瀬渓流","約14km続く神秘的な渓流。豊かな森と滝、奇岩が織りなす自然美は圧巻です。"],["ねぶたの家 ワ・ラッセ","青森ねぶた祭の歴史や魅力を紹介。実際に祭りで出陣した巨大なねぶたを間近で見られます。"]],
"岩手県":[["中尊寺金色堂","奥州藤原氏の栄華を伝える世界遺産。内外を金箔で覆った豪華絢爛な阿弥陀堂です。"],["龍泉洞","日本三大鍾乳洞の一つ。透明度の高いブルーの地底湖「ドラゴンブルー」は神秘的な輝きを放ちます。"],["小岩井農場","岩手山を望む広大な民間総合農場。搾りたての牛乳で作るソフトクリームは絶品です。"]],
"宮城県":[["松島","日本三景の一つ。松島湾に浮かぶ260余りの島々が織りなす風景は、古来より多くの歌人を魅了してきました。"],["瑞巌寺","伊達政宗が建立した桃山文化の粋を集めた寺院。本堂の豪華な障壁画や彫刻が見どころです。"],["仙台城跡","伊達政宗の居城跡。騎馬像が立つ高台からは仙台市街を一望でき、夜景も人気です。"]],
"秋田県":[["角館武家屋敷","「みちのくの小京都」と称される町並み。江戸時代の武家屋敷が現存し、春のシダレザクラも有名です。"],["田沢湖","日本一の深さを誇る湖。伝説の美女・辰子像が立つ湖面は、深い藍色に透き通っています。"],["男鹿半島 (なまはげ館)","秋田の伝統行事「なまはげ」の歴史を展示。実際に家々を回る迫力の映像や衣装が見られます。"]],
"山形県":[["山寺 (立石寺)","1015段の石段を登る修行の地。松尾芭蕉が「閑さや岩にしみ入る蝉の声」と詠んだ名刹です。"],["銀山温泉","大正ロマン漂う温泉街。夜になるとガス灯が灯り、ノスタルジックな雰囲気に包まれます。"],["蔵王の樹氷","冬の蔵王で見られる「スノーモンスター」。自然が作り出す神秘的な造形美は世界的に有名です。"]],
"福島県":[["会津若松城 (鶴ヶ城)","赤瓦が特徴的な名城。幕末の戊辰戦争では難攻不落を誇った、会津の歴史の象徴です。"],["大内宿","江戸時代の宿場町の面影を残す集落。茅葺き屋根の民家が並び、名物の「ねぎそば」も楽しめます。"],["五色沼","火山の影響で湖水が緑、青、赤など様々な色に見える不思議な沼。散策コースとしても人気です。"]],
"茨城県":[["偕楽園","日本三名園の一つ。早春には約3,000本の梅が咲き誇り、園内からは千波湖の眺望も楽しめます。"],["国営ひたち海浜公園","春のネモフィラ、秋のコキアで有名な広大な公園。四季折々の花々が大地を彩ります。"],["袋田の滝","日本三名瀑の一つ。四段にわたって流れ落ちる姿から「四度の滝」とも呼ばれます。"]],
"栃木県":[["日光東照宮","徳川家康を祀る世界遺産。豪華絢爛な「陽明門」や「見ざる言わざる聞かざる」の彫刻が有名です。"],["那須ハイランドパーク","那須高原の大自然に囲まれた東日本最大級の遊園地。40種類以上のアトラクションが楽しめます。"],["あしかがフラワーパーク","樹齢150年におよぶ大藤の棚が圧巻。冬のイルミネーションは日本三大イルミネーションの一つです。"]],
"群馬県":[["草津温泉","日本三名泉の一つ。街の中心にある「湯畑」は圧巻で、伝統の「湯もみ」体験も人気です。"],["富岡製糸場","明治時代に設立された日本初の本格的製糸工場。世界遺産として日本の近代化の歴史を伝えます。"],["伊香保温泉","365段の石段街がシンボルの温泉地。黄金の湯と白銀の湯の2種類の源泉が楽しめます。"]],
"埼玉県":[["川越 (蔵造りの町並み)","「小江戸」と呼ばれる歴史的な町並み。シンボルの「時の鐘」や菓子屋横丁での食べ歩きが人気です。"],["鉄道博物館","日本最大級の鉄道ミュージアム。実物車両の展示やシミュレーター体験は大人も子供も夢中になります。"],["長瀞","国の名勝に指定された自然豊かな景勝地。ライン下りや不思議な岩盤「岩畳」の散策を楽しめます。"]],
"千葉県":[["東京ディズニーリゾート","夢と魔法の王国。東京ディズニーランドとディズニーシー、世界中のファンを魅了する一大リゾートです。"],["成田山新勝寺","1000年以上の歴史を持つ名刹。参道には名物のうなぎ屋が並び、多くの参拝客で賑わいます。"],["鴨川シーワールド","海の王者シャチのパフォーマンスは必見。房総半島の海沿いで海の生き物たちの知性に触れられます。"]],
"東京都":[["浅草寺・雷門","東京最古の寺院。巨大な提灯の雷門から続く仲見世通りは、江戸情緒あふれる観光スポットです。"],["渋谷スクランブル交差点","世界一有名な交差点。一度の信号で数千人が行き交う光景は、現代日本の象徴的な風景です。"],["東京タワー","1958年完成の東京のシンボル。展望台からの夜景や、ライトアップされた姿は今も根強い人気を誇ります。"]],
"神奈川県":[["箱根","日本屈指の温泉リゾート。芦ノ湖や大涌谷などの自然、彫刻の森美術館などのアートも充実しています。"],["横浜中華街","世界最大級の中華街。500以上の店が軒を連ね、本格的な中華料理や食べ歩きを楽しめます。"],["鎌倉 (大仏・鶴岡八幡宮)","武家の都としての歴史が息づく古都。巨大な高徳院の大仏や、力強い建築の鶴岡八幡宮が見どころです。"]],
"新潟県":[["佐渡島 (たらい舟)","かつて金山で栄えた歴史ある島。独特の「たらい舟」体験や、トキの保護センターなどが有名です。"],["清津峡","日本三大渓谷の一つ。近年完成した「トンネル」からの鏡面のような反射写真はフォトスポットとして大人気です。"],["越後湯沢温泉","川端康成の小説「雪国」の舞台。新幹線駅からすぐの温泉地で、冬はスキー、夏は避暑地として賑わいます。"]],
"富山県":[["立山黒部アルペンルート","標高3000m級の山々を貫く山岳観光ルート。巨大な雪の壁「雪の大谷」は春の絶景として有名です。"],["五箇山合掌造り集落","世界遺産に登録された歴史ある集落。のどかな日本の原風景の中、独特の建築様式を見学できます。"],["黒部ダム","日本最大の水力発電用ダム。毎秒10トン以上の放水シーンは息を呑むほどの迫力です。"]],
"石川県":[["兼六園","日本三名園の一つ。四季を通じて美しい庭園美を楽しめ、特に冬の「雪吊り」は金沢の冬の風物詩です。"],["ひがし茶屋街","美しい格子戸の町家が並ぶ歴史的地区。金沢名物の金箔ソフトクリームや伝統工芸品を楽しめます。"],["金沢21世紀美術館","「まちに開かれた公園のような美術館」。プールの中に人がいるように見える不思議なアートが有名です。"]],
"福井県":[["東尋坊","荒々しい岩壁が続く断崖絶壁。世界に3ヶ所しかない貴重な柱状節理の地質が見どころです。"],["福井県立恐竜博物館","世界三大恐竜博物館の一つ。40体以上の恐竜全身骨格が展示され、迫力満点の恐竜の世界を体験できます。"],["永平寺","道元禅師によって開かれた曹洞宗の本山。深い静寂の中に、厳しい修行の場としての空気が流れています。"]],
"山梨県":[["富士山","日本の最高峰であり、信仰の対象・芸術の源泉として世界遺産にも登録。どの角度からも美しく荘厳です。"],["河口湖","富士五湖の一つ。湖面に映る「逆さ富士」の名所として知られ、周辺にはハーブ園や美術館も豊富です。"],["忍野八海","富士山の伏流水を水源とする8つの湧水池。非常に透明度が高く、神秘的な青さを湛えています。"]],
"長野県":[["善光寺","「一生に一度は参れ」と言われる名刹。本堂の下を通る「お戒壇巡り」で極楽浄土への縁を結べます。"],["松本城","現存12天守の一つで、国宝。黒と白のコントラストが美しく、背景の北アルプスに映える名城です。"],["上高地","日本を代表する山岳景勝地。梓川の清流と穂高連峰の絶景は、まるで絵画のような美しさです。"]],
"岐阜県":[["白川郷","合掌造りの民家が立ち並ぶ世界遺産の村。冬のライトアップされた姿は、まるでおとぎ話の世界のようです。"],["飛騨高山 (古い町並)","江戸時代の面影を残す商人町。飛騨牛の串焼きなどを食べ歩きながら、歴史を感じる散策を楽しめます。"],["下呂温泉","日本三名泉の一つ。肌に優しく馴染む滑らかなお湯は「美人の湯」として知られています。"]],
"静岡県":[["伊豆半島 (温泉・海岸)","海と山の幸が豊富なリゾート地。城ヶ崎海岸の絶景や、修善寺温泉などの歴史ある名湯が点在します。"],["白糸の滝","富士山の湧水が幅150mの絶壁から絹糸のように流れ落ちる滝。国の名勝・天然記念物です。"],["久能山東照宮","徳川家康が最初に埋葬された場所。豪華な社殿は国宝に指定されており、駿河湾の眺望も素晴らしいです。"]],
"愛知県":[["名古屋城","金のシャチホコで有名な徳川御三家の居城。近年復元された「本丸御殿」の豪華な内装は必見です。"],["熱田神宮","三種の神器の一つ「草薙神剣」を祀る由緒正しい神社。広い境内は都会のオアシスとして親しまれています。"],["トヨタ産業技術記念館","トヨタグループの歴史と技術を学べる施設。繊維機械から自動車製造まで、ものづくりの進化を体感できます。"]],
"三重県":[["伊勢神宮","日本人の「心のふるさと」と称される最高位の神社。外宮・内宮があり、江戸時代からお伊勢参りで賑わいました。"],["鳥羽水族館","飼育種類数が日本一を誇る巨大水族館。人魚伝説のモデルと言われるジュゴンに会えるのはここだけです。"],["おかげ横丁","伊勢神宮内宮の門前にある、江戸から明治時代の町並みを再現したエリア。赤福餅や伊勢うどんを楽しめます。"]],
"滋賀県":[["琵琶湖","日本最大の面積を誇る湖。湖畔のドライブや、湖上に浮かぶ「白髭神社」の大鳥居など、絶景が豊富です。"],["彦根城","国宝に指定された現存天守。マスコット「ひこにゃん」でも有名で、琵琶湖を望む眺望も魅力です。"],["比叡山延暦寺","日本仏教の母山。世界遺産に登録されており、広大な山内に点在する堂宇を巡ることで心が洗われます。"]],
"京都府":[["清水寺","「清水の舞台」で有名な世界遺産。釘を使わずに組まれた舞台からは、京都市街を一望できます。"],["金閣寺","内外を金箔で仕上げた豪華な寺院。鏡湖池に映り込む「逆さ金閣」の姿は、京都観光の象徴です。"],["伏見稲荷大社","千本鳥居で知られる全国の稲荷神社の総本宮。朱色の鳥居が連なるトンネルは、幻想的な体験をさせてくれます。"]],
"大阪府":[["大阪城","豊臣秀吉ゆかりの名城。現在の天守閣は博物館になっており、展望台からは大都会大阪を見渡せます。"],["道頓堀","巨大なグリコの看板やカニの看板が並ぶ、大阪を象徴する繁華街。たこ焼きや串カツの食べ歩きが醍醐味です。"],["ユニバーサル・スタジオ・ジャパン","ハリウッド映画の世界や、人気キャラクターのエリアが集結したテーマパーク。世界最高峰のアトラクションが楽しめます。"]],
"兵庫県":[["姫路城","真っ白な姿から「白鷺城」とも呼ばれる日本初の世界遺産。現存天守の中でも最大級の美しさを誇ります。"],["神戸港 (メリケンパーク)","ポートタワーや海洋博物館が並ぶ神戸のランドマーク。夜には美しいライトアップが楽しめます。"],["有馬温泉","日本三古湯の一つ。鉄分豊富な「金泉」と無色透明な「銀泉」、2種類の異なる源泉が楽しめます。"]],
"奈良県":[["東大寺 (大仏)","世界最大の木造建築の中に、巨大な「奈良の大仏様」が鎮座。その大きさと歴史の深さに圧倒されます。"],["奈良公園 (鹿)","約1200頭の野生の鹿が暮らす公園。国の天然記念物に指定されている鹿たちと触れ合うことができます。"],["法隆寺","聖徳太子が建立した、世界最古の木造建築群。飛鳥時代の美術品が数多く納められています。"]],
"和歌山県":[["高野山","空海が開いた真言密教の聖地。1200年の歴史を持つ山上の宗教都市で、宿坊体験も人気です。"],["熊野古道","世界遺産に登録された古の巡礼道。深い森の中、自然と歴史を感じながらハイキングを楽しめます。"],["アドベンチャーワールド","動物園、水族館、遊園地が一体となった施設。特にパンダの飼育頭数が多いことで有名です。"]],
"鳥取県":[["鳥取砂丘","日本最大級の砂丘。風が作る「風紋」や、日本海に向かって滑り降りるパラグライダーなどが楽しめます。"],["水木しげるロード","ゲゲゲの鬼太郎の作者ゆかりの地。170体以上の妖怪ブロンズ像が並び、大人も童心に帰れます。"],["三徳山三佛寺投入堂","断崖絶壁の窪みに建つ、日本一危険な国宝。どのように建てられたか今も謎に包まれています。"]],
"島根県":[["出雲大社","縁結びの神様として有名な日本屈指の古社。巨大な神楽殿のしめ縄は圧巻の迫力です。"],["松江城","現存12天守の一つで国宝。黒い外観から「千鳥城」と呼ばれ、お堀を巡る遊覧船も人気です。"],["石見銀山","かつて世界の銀の約3分の1を産出したと言われる世界遺産。古い坑道（間歩）や当時の町並みを見学できます。"]],
"岡山県":[["岡山後楽園","日本三名園の一つ。広い芝生が特徴的な開放感あふれる庭園で、岡山城との共演も見事です。"],["倉敷美観地区","白壁の蔵屋敷が並ぶ運河沿いの町並み。デニムの聖地としても知られ、オシャレな雑貨店も豊富です。"],["岡山城","黒い外観から「烏城（うじょう）」と呼ばれる名城。内部では、お殿様やお姫様の着付け体験なども楽しめます。"]],
"広島県":[["厳島神社","海上に浮かぶ朱塗りの鳥居で有名な世界遺産。潮の満ち引きで表情を変える神秘的な景観は必見です。"],["原爆ドーム・平和記念公園","人類の平和を願う象徴。悲劇を伝えるドームの姿と、平和への祈りが捧げられる美しい公園です。"],["尾道","「坂の町」「映画の町」として知られる情緒あふれる町。細い路地や階段、瀬戸内海の眺望を楽しめます。"]],
"山口県":[["角島大橋","エメラルドグリーンの海を貫く全長1780mの橋。まるで南国のような絶景ドライブが楽しめます。"],["元乃隅神社","123基の朱色の鳥居が海に向かって連なる絶景神社。アメリカのCNNで「日本の最も美しい場所」に選ばれました。"],["秋芳洞","日本最大級の鍾乳洞。洞内の「百枚皿」や巨大な黄金柱など、自然が数億年かけて作った芸術に圧倒されます。"]],
"徳島県":[["鳴門の渦潮","世界三大潮流の一つ。激しい潮の流れが作る巨大な渦を、観潮船や遊歩道「渦の道」から間近で見学できます。"],["大歩危・小歩危","吉野川が長い年月をかけて削り出したV字型の渓谷。奇岩や巨岩が続く景色を遊覧船で楽しめます。"],["阿波おどり会館","徳島名物「阿波おどり」を一年中体験できる施設。歴史を学べるほか、プロの踊りを観賞し一緒に踊ることもできます。"]],
"香川県":[["金刀比羅宮","「こんぴらさん」として親しまれる神社。本宮まで785段の石段を登りますが、参道には土産物店やうどん店が並び楽しめます。"],["栗林公園","「お庭の国宝」とも称される広大な大名庭園。一歩進むごとに景色が変わる「一歩一景」の美しさが自慢です。"],["直島 (アート)","島全体が現代アートの美術館のような島。有名な「カボチャ」のオブジェや、地中美術館など、世界中からファンが訪れます。"]],
"愛媛県":[["道後温泉","日本最古と言われる温泉。シンボルの「本館」は重要文化財で、ジブリ映画『千と千尋の神隠し』のモデルの一つとも言われます。"],["松山城","現存12天守の一つ。標高132mの勝山山頂に建ち、ロープウェイで登る道中や天守からの松山市街の眺めは絶景です。"],["しまなみ海道","本州と四国を島々で結ぶサイクリングの聖地。海の上を走るような爽快感と、瀬戸内海の多島美を堪能できます。"]],
"高知県":[["桂浜","土佐の象徴、坂本龍馬像が立つ景勝地。五色の小砂利と紺碧の海が美しい、高知県を代表する観光スポットです。"],["四万十川","「日本最後の清流」として知られる川。増水しても流されない「沈下橋」が点在し、のどかな原風景を楽しめます。"],["高知城","本丸の建物がほぼ完全に残る貴重な城。日本で唯一、天守閣と本丸御殿の両方が現存しています。"]],
"福岡県":[["太宰府天満宮","学問の神様・菅原道真公を祀る神社。参道の「梅ヶ枝餅」を食べ歩き、美しい庭園や社殿を散策するのが人気です。"],["博多 (屋台・中洲)","夜になると那珂川沿いに立ち並ぶ屋台街。ラーメンや餃子、おでんなど、博多の夜の活気を楽しめます。"],["門司港レトロ","明治・大正時代の洋風建築が残るエリア。異国情緒あふれる町並みと、名物の焼きカレーが人気です。"]],
"佐賀県":[["吉野ヶ里歴史公園","弥生時代の巨大環濠集落を復元。当時の暮らしを体感でき、勾玉作りなどのワークショップも楽しめます。"],["嬉野温泉","日本三代美肌の湯の一つ。トロトロとした独特のお湯に加え、特産の「温泉豆腐」も絶品です。"],["有田焼 (陶山神社)","陶磁器の町・有田。鳥居や狛犬がすべて磁器で作られた珍しい神社があり、焼き物の歴史を感じられます。"]],
"長崎県":[["グラバー園","幕末の異国情緒が残る丘。旧グラバー住宅など貴重な洋館が立ち並び、長崎港の美しいパノラマを楽しめます。"],["平和公園","平和への願いを込めた平和祈念像が立つ公園。歴史を語り継ぐ場所として、多くの人が訪れます。"],["ハウステンボス","オランダの街並みを再現した日本最大のテーマパーク。四季折々の花々や、世界最大級のイルミネーションが圧巻です。"]],
"熊本県":[["熊本城","「武者返し」と呼ばれる屈強な石垣で有名な名城。震災からの復興が進み、力強い天守閣の姿を再び見学できます。"],["阿蘇山","世界最大級のカルデラを持つ活火山。巨大な火口を見学できるほか、周囲には広大な草千里などの草原が広がります。"],["黒川温泉","山間に佇む、落ち着いた雰囲気の温泉地。各旅館の個性豊かな露天風呂を巡る「入湯手形」が人気です。"]],
"大分県":[["別府温泉 (地獄めぐり)","源泉数・湧出量ともに日本一の温泉地。海地獄や血の池地獄など、色鮮やかで不思議な源泉を巡ることができます。"],["由布院温泉","由布岳の麓に広がる、オシャレな店や美術館が点在する温泉地。朝霧に包まれる金鱗湖の散策も人気です。"],["宇佐神宮","全国に4万社以上ある八幡宮の総本宮。朱塗りの社殿が美しく、広大な境内は神秘的な空気に包まれています。"]],
"宮崎県":[["高千穂峡","阿蘇の噴火で作られた断崖絶壁の渓谷。貸しボートで「真名井の滝」を間近で見上げる体験は感動的です。"],["青島神社","波の浸食で作られた「鬼の洗濯板」に囲まれた島。縁結びの神様として知られ、南国の草木が生い茂っています。"],["サンメッセ日南","イースター島から特別に許可を得て復刻された7体のモアイ像が並ぶスポット。太平洋を背に並ぶ姿は壮観です。"]],
"鹿児島県":[["桜島","今も噴煙を上げる鹿児島のシンボル。市街地からフェリーで15分で行くことができ、自然の力強さを体感できます。"],["屋久島","樹齢数千年と言われる縄文杉が自慢の世界遺産。苔むした深い森の中、生命の神秘を感じるトレッキングが楽しめます。"],["指宿温泉 (砂むし風呂)","海岸に埋まって温泉の熱を楽しむ世界でも珍しい「天然砂むし温泉」。波の音を聴きながらリラックスできます。"]],
"沖縄県":[["沖縄美ら海水族館","巨大な水槽の中をジンベエザメやマンタが泳ぐ姿は圧巻。沖縄の海の豊かさを世界最大級のスケールで体験できます。"],["首里城公園","琉球王国の歴史と文化を伝える城跡。鮮やかな朱色の建築物から、かつての王国の繁栄を感じることができます。"],["国際通り","那覇市の中心にあるメインストリート。土産物店やレストランが並び、沖縄の活気とグルメを満喫できます。"]]
};

const spots = {};
Object.keys(raw).forEach(k => { spots[k] = raw[k].map(([name, description]) => ({ name, description })); });


/* 楽天トラベル レンタカーのエリア別ページ（area/<地方>/<県>/） */
const carArea = {"北海道":"hokkaido/hokkaido","青森県":"tohoku/aomori","岩手県":"tohoku/iwate","宮城県":"tohoku/miyagi","秋田県":"tohoku/akita","山形県":"tohoku/yamagata","福島県":"tohoku/fukushima","茨城県":"kitakanto/ibaraki","栃木県":"kitakanto/tochigi","群馬県":"kitakanto/gunma","埼玉県":"kanto/saitama","千葉県":"kanto/chiba","東京都":"kanto/tokyo","神奈川県":"kanto/kanagawa","新潟県":"chubu/niigata","富山県":"chubu/toyama","石川県":"chubu/ishikawa","福井県":"chubu/fukui","山梨県":"chubu/yamanashi","長野県":"chubu/nagano","岐阜県":"chubu/gifu","静岡県":"chubu/shizuoka","愛知県":"chubu/aichi","三重県":"chubu/mie","滋賀県":"kinki/shiga","京都府":"kinki/kyoto","大阪府":"kinki/osaka","兵庫県":"kinki/hyogo","奈良県":"kinki/nara","和歌山県":"kinki/wakayama","鳥取県":"chu-shikoku/tottori","島根県":"chu-shikoku/shimane","岡山県":"chu-shikoku/okayama","広島県":"chu-shikoku/hiroshima","山口県":"chu-shikoku/yamaguchi","徳島県":"chu-shikoku/tokushima","香川県":"chu-shikoku/kagawa","愛媛県":"chu-shikoku/ehime","高知県":"chu-shikoku/kochi","福岡県":"kyushu/fukuoka","佐賀県":"kyushu/saga","長崎県":"kyushu/nagasaki","熊本県":"kyushu/kumamoto","大分県":"kyushu/oita","宮崎県":"kyushu/miyazaki","鹿児島県":"kyushu/kagoshima","沖縄県":"okinawa/okinawa"};

/* 楽天トラベル 高速バスの県別ページ（/bus/pref/<slug>.html）
   宿の slug とはローマ字表記が違うので別に持つ（山梨=yamanasi, 千葉=tiba など） */
const busSlug = {"北海道":"hokkaido","青森県":"aomori","岩手県":"iwate","宮城県":"miyagi","秋田県":"akita","山形県":"yamagata","福島県":"hukushima","茨城県":"ibaragi","栃木県":"tochigi","群馬県":"gunma","埼玉県":"saitama","千葉県":"tiba","東京都":"tokyo","神奈川県":"kanagawa","新潟県":"niigata","富山県":"toyama","石川県":"ishikawa","福井県":"hukui","山梨県":"yamanasi","長野県":"nagano","岐阜県":"gihu","静岡県":"shizuoka","愛知県":"aichi","三重県":"mie","滋賀県":"shiga","京都府":"kyoto","大阪府":"osaka","兵庫県":"hyogo","奈良県":"nara","和歌山県":"wakayama","鳥取県":"tottori","島根県":"simane","岡山県":"okayama","広島県":"hiroshima","山口県":"yamaguchi","徳島県":"tokushima","香川県":"kagawa","愛媛県":"ehime","高知県":"kouchi","福岡県":"hukuoka","佐賀県":"saga","長崎県":"nagasaki","熊本県":"kumamoto","大分県":"ooita","宮崎県":"miyazaki","鹿児島県":"kagoshima","沖縄県":"okinawa"};

/* 明日の「お題」。どの県でも成立する、お金のかからないものを中心に。 */
const MISSIONS = [
  "地元のスーパーで、見たことのない惣菜をひとつ買う",
  "駅から歩いて15分以内の店で、昼をすませる",
  "その土地の水を、そのまま飲んでみる",
  "ご当地サイダーか、ご当地牛乳を1本さがす",
  "名前を知らなかった駅で、一度だけ降りてみる",
  "商店街を、端から端まで歩ききる",
  "県の名前がついたお菓子を買って帰る",
  "地元の人に「おすすめ」を一度だけ聞く",
  "夕方、いちばん高いところに登って街を見る",
  "コンビニに売っていない飲みものを見つける",
  "その土地の麺類を食べる",
  "風呂に入る。銭湯でも温泉でもいい",
  "写真を10枚撮る。ただし人は写さない",
  "神社か寺をひとつ、通りすがりでいいので寄る",
  "朝ごはんを、宿の外で食べる",
  "海か川か湖を、この目で見る",
  "その県の形をした何かを探す",
  "帰る前に、もう一杯だけ寄り道する"
];


/* ================= app ================= */
(function () {
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
  // 地図の読み込み結果に関係なく、共有リンクからの復元は成立させる
  restoreFromUrl();
})();
