'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {}});
const map = new Map();

rl.on('line', (lineString) => {
  const lines = lineString.split(',');
  const year = parseInt(lines[0]);
  const prefecture = lines[2];
  const popu = parseInt(lines[7]);
  if(year == 2010 || year == 2015) {
    let value = map.get(prefecture);
    if(!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      }
    }
    if(year == 2010) {
      value.popu10 += popu;
    }
    if(year == 2015) {
      value.popu15 += popu;
    }
    map.set(prefecture, value);
  }
});

rl.on('close', () => {
  for(let [key, value] of map) {
    value.change = value.popu15 / value.popu10;
  }
  const rankingMap = Array.from(map).sort((pair1,pair2) => {
    return pair1[1].change - pair2[1].change;
  });
  const rankingStrings = rankingMap.map(([key, value],i) => {
    const rank = parseInt(i) + 1;
    return '第' + rank + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);
});