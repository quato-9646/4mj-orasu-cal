const players = ["東", "南", "西", "北"];

// 子の点数テーブル
const tableChild = {
  1: {
    30: { ron: 1000, tsumoKo: [300, 500] },
    40: { ron: 1300, tsumoKo: [400, 700] },
    50: { ron: 1600, tsumoKo: [400, 800] },
    60: { ron: 2000, tsumoKo: [500, 1000] },
    70: { ron: 2300, tsumoKo: [600, 1200] },
  },
  2: {
    20: { ron: 1300, tsumoKo: [400, 700] },
    25: { ron: 1600, tsumoKo: [400, 800] },
    30: { ron: 2000, tsumoKo: [500, 1000] },
    40: { ron: 2600, tsumoKo: [700, 1300] },
    50: { ron: 3200, tsumoKo: [800, 1600] },
    60: { ron: 3900, tsumoKo: [1000, 2000] },
    70: { ron: 4500, tsumoKo: [1200, 2300] },
  },
  3: {
    20: { ron: 2600, tsumoKo: [700, 1300] },
    25: { ron: 3200, tsumoKo: [800, 1600] },
    30: { ron: 3900, tsumoKo: [1000, 2000] },
    40: { ron: 5200, tsumoKo: [1300, 2600] },
    50: { ron: 6400, tsumoKo: [1600, 3200] },
    60: { ron: 7700, tsumoKo: [2000, 3900] },
    70: { ron: 8000, tsumoKo: [2000, 4000] },
  },
  4: {
    20: { ron: 5200, tsumoKo: [1300, 2600] },
    25: { ron: 6400, tsumoKo: [1600, 3200] },
    30: { ron: 7700, tsumoKo: [2000, 3900] },
    40: { ron: 8000, tsumoKo: [2000, 4000] },
    50: { ron: 8000, tsumoKo: [2000, 4000] },
    60: { ron: 8000, tsumoKo: [2000, 4000] },
    70: { ron: 8000, tsumoKo: [2000, 4000] },
  }
};

// 親の点数テーブル
const tableOya = {
  1: {
    30: { ron: 1500, tsumoOya: 500 },
    40: { ron: 2000, tsumoOya: 700 },
    50: { ron: 2400, tsumoOya: 800 },
    60: { ron: 2900, tsumoOya: 1000 },
    70: { ron: 3400, tsumoOya: 1200 },
  },
  2: {
    20: { ron: 2000, tsumoOya: 700 },
    25: { ron: 2400, tsumoOya: 800 },
    30: { ron: 2900, tsumoOya: 1000 },
    40: { ron: 3900, tsumoOya: 1300 },
    50: { ron: 4800, tsumoOya: 1600 },
    60: { ron: 5800, tsumoOya: 2000 },
    70: { ron: 6800, tsumoOya: 2300 },
  },
  3: {
    20: { ron: 3900, tsumoOya: 1300 },
    25: { ron: 4800, tsumoOya: 1600 },
    30: { ron: 5800, tsumoOya: 2000 },
    40: { ron: 7700, tsumoOya: 2600 },
    50: { ron: 9600, tsumoOya: 3200 },
    60: { ron: 11600, tsumoOya: 3900 },
    70: { ron: 12000, tsumoOya: 4000 },
  },
  4: {
    20: { ron: 7700, tsumoOya: 2600 },
    25: { ron: 9600, tsumoOya: 3200 },
    30: { ron: 11600, tsumoOya: 3900 },
    40: { ron: 12000, tsumoOya: 4000 },
    50: { ron: 12000, tsumoOya: 4000 },
    60: { ron: 12000, tsumoOya: 4000 },
    70: { ron: 12000, tsumoOya: 4000 },
  }
};

const limitHands = [
  { name: "満貫", ronKo: 8000, ronOya: 12000, tsumoKo: [2000, 4000], tsumoOya: 4000 },
  { name: "跳満", ronKo: 12000, ronOya: 18000, tsumoKo: [3000, 6000], tsumoOya: 6000 },
  { name: "倍満", ronKo: 16000, ronOya: 24000, tsumoKo: [4000, 8000], tsumoOya: 8000 },
  { name: "三倍満", ronKo: 24000, ronOya: 36000, tsumoKo: [6000, 12000], tsumoOya: 12000 },
  { name: "役満", ronKo: 32000, ronOya: 48000, tsumoKo: [8000, 16000], tsumoOya: 16000 },
];

function getAllHands(isOya) {
  const list = [];
  const table = isOya ? tableOya : tableChild;

  for (const han in table) {
    for (const fu in table[han]) {
      const data = table[han][fu];
      list.push({
        name: `${fu}符${han}翻`,
        ron: data.ron,
        tsumoKo: data.tsumoKo || null,
        tsumoOya: data.tsumoOya || null,
      });
    }
  }

  for (const h of limitHands) {
    list.push({
      name: h.name,
      ron: isOya ? h.ronOya : h.ronKo,
      tsumoKo: !isOya ? h.tsumoKo : null,
      tsumoOya: isOya ? h.tsumoOya : null,
    });
  }

  list.sort((a, b) => a.ron - b.ron);
  return list;
}

function findMinimumWinningConditions(me, target, scores, honba, riichi) {
  const isOya = (me === "東");
  const hands = getAllHands(isOya);
  const gap = scores[target] - scores[me];
  const candidates = [];

  for (const hand of hands) {
    // 1. ロン（直撃）
    const directGain = hand.ron + (300 * honba);
    const directLoss = hand.ron + (300 * honba);
    if ((directGain + directLoss + riichi * 1000) >= gap) {
      candidates.push(`ロン（直撃）: ${hand.name}`);
    }

    // 2. ツモ
    let myGain = 0;
    let targetLoss = 0;
    if (isOya) {
      myGain = (hand.tsumoOya * 3) + (900 * honba);
      targetLoss = hand.tsumoOya + (300 * honba);
    } else if (hand.tsumoKo) {
      myGain = (hand.tsumoKo[0] * 2) + hand.tsumoKo[1] + (900 * honba);
      targetLoss = (target === "東") ? (hand.tsumoKo[1] + 300 * honba) : (hand.tsumoKo[0] + 300 * honba);
    }
    if ((myGain + targetLoss + riichi * 1000) >= gap) {
      candidates.push(`ツモ: ${hand.name}`);
    }

    // 3. ロン（非直撃/脇）
    if ((hand.ron + (300 * honba) + riichi * 1000) >= gap) {
      candidates.push(`ロン（脇）: ${hand.name}`);
    }

    if (candidates.length > 0) break;
  }
  return candidates;
}

function calculate() {
  // HTMLのIDから値を取得
  const scores = {
    東: Number(document.getElementById("east").value),
    南: Number(document.getElementById("south").value),
    西: Number(document.getElementById("west").value),
    北: Number(document.getElementById("north").value),
  };

  const riichi = Number(document.getElementById("riichi").value);
  const honba = Number(document.getElementById("honba").value);

  const sorted = [...players].sort((a, b) => scores[b] - scores[a]);
  let out = "";

  for (let i = 1; i < sorted.length; i++) {
    const me = sorted[i];
    out += `【${me}家（${i + 1}位）】\n`;

    for (let t = i - 1; t >= 0; t--) {
      const target = sorted[t];
      const gap = scores[target] - scores[me];
      out += `  ▶ ${t + 1}位（${target}家）との差: ${gap}\n`;

      const minimum = findMinimumWinningConditions(me, target, scores, honba, riichi);
      if (minimum.length === 0) {
        out += `    ・逆転不可\n`;
      } else {
        minimum.forEach(cond => out += `    ・${cond}\n`);
      }
    }
    out += "\n";
  }
  document.getElementById("result").textContent = out;
}
