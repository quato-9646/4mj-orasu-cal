const players = ["東", "南", "西", "北"];

const hands = [
  { name: "満貫", ron: 8000, tsumoKo: [2000, 4000], tsumoOya: 4000 },
  { name: "跳満", ron: 12000, tsumoKo: [3000, 6000], tsumoOya: 6000 },
  { name: "倍満", ron: 16000, tsumoKo: [4000, 8000], tsumoOya: 8000 },
  { name: "三倍満", ron: 24000, tsumoKo: [6000, 12000], tsumoOya: 12000 },
  { name: "役満", ron: 32000, tsumoKo: [8000, 16000], tsumoOya: 16000 },
];

function calculate() {
  const score = {
    東: Number(east.value),
    南: Number(south.value),
    西: Number(west.value),
    北: Number(north.value),
  };

  const riichi = Number(document.getElementById("riichi").value);
  const honba = Number(document.getElementById("honba").value);

  const sorted = [...players].sort((a, b) => score[b] - score[a]);
  let output = "";

  for (let i = 1; i < sorted.length; i++) {
    const me = sorted[i];
    output += `【${me}家（${i + 1}位）】\n`;

    for (let t = i - 1; t >= 0; t--) {
      const target = sorted[t];
      const gap = score[target] - score[me];
      output += `  ▶ ${t + 1}位条件（${target}家） 差 ${gap}\n`;

      for (const hand of hands) {
        // ツモ
        if (me !== "東") {
          const pay = target === "東"
            ? hand.tsumoKo[1] + 300 * honba
            : hand.tsumoKo[0] + 300 * honba;
          const total = hand.tsumoKo[1] + hand.tsumoKo[0] * 2 + 900 * honba;
          const diff = pay + total + riichi * 1000;
          if (diff >= gap) {
            output += `    ・${hand.name}ツモ\n`;
          }
        } else {
          const pay = hand.tsumoOya + 300 * honba;
          const total = hand.tsumoOya * 3 + 900 * honba;
          const diff = pay + total + riichi * 1000;
          if (diff >= gap) {
            output += `    ・${hand.name}ツモ（親）\n`;
          }
        }

        // ロン（非直撃）
        if (hand.ron + riichi * 1000 >= gap) {
          output += `    ・${hand.name}ロン（非直撃）\n`;
        }

        // ロン（直撃）
        const direct = 2 * hand.ron + 600 * honba + riichi * 1000;
        if (direct >= gap) {
          output += `    ・${hand.name}ロン（直撃）\n`;
        }
      }
    }
    output += "\n";
  }

  document.getElementById("result").textContent = output;
}
