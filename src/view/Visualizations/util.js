import { get } from 'lodash';
import regression from 'regression';

export function getAgeMetrics(data){
    const ageHash = {}
  
    for(let i = 0; i < data.length; i++){
      const fight = data[i];
      const winner = fight.Winner;
      const redAge = fight.R_age || 'unknown';
      const blueAge = fight.B_age || 'unknown';
  
  
      if(winner === 'Red') {
        ageHash[redAge] = {
          wins: get(ageHash[redAge], 'wins', 0) + 1,
          losses: get(ageHash[redAge], 'losses', 0),
        }
  
        ageHash[blueAge] = {
          wins: get(ageHash[blueAge], 'wins', 0),
          losses: get(ageHash[blueAge], 'losses', 0) + 1,
        }
  
      } else {
        ageHash[blueAge] = {
          wins: get(ageHash[blueAge], 'wins', 0) + 1,
          losses: get(ageHash[blueAge], 'losses', 0),
        }
  
        ageHash[redAge] = {
          wins: get(ageHash[redAge], 'wins', 0),
          losses: get(ageHash[redAge], 'losses', 0) + 1,
        }
  
      }
  
    }
  
    for(let key in ageHash){
      const wins = ageHash[key].wins;
      const losses = ageHash[key].losses;
      const total = wins + losses;
      const winPct = (wins/total * 100).toFixed(2);
  
      ageHash[key] = {
        ...ageHash[key],
        winPct 
      }
    }
  
    return ageHash;
  }

  export function getDiffMetrics(data, key, divisor = 1, reverse = false) {
    const metric = {};
    const redKey = 'R_' + key;
    const blueKey = 'B_' + key;
    if(key.includes('pct')){
      divisor = .01;
    }
  
    for(let i = 0; i < data.length; i++){
      const fight = data[i];
  
      const winner = fight.Winner;
      const red = fight[redKey] / divisor;
      const blue = fight[blueKey] / divisor;
      const absDiff = Math.abs(red - blue);
  
      if(absDiff > 0 && red && blue){
        const diff = absDiff.toFixed(0);
        if(red > blue){
          if(winner === 'Red'){
            metric[diff] = {
              wins: get(metric[diff], 'wins', 0) + 1,
              losses: get(metric[diff], 'losses', 0),
            }

            if(absDiff !== 0){
              metric[-diff] = {
                wins: get(metric[-diff], 'wins', 0),
                losses: get(metric[-diff], 'losses', 0) + 1,
              }
            }
          } else {
            metric[diff] = {
              wins: get(metric[diff], 'wins', 0),
              losses: get(metric[diff], 'losses', 0) + 1,
            }

            if(absDiff !== 0){
              metric[-diff] = {
                wins: get(metric[-diff], 'wins', 0) + 1,
                losses: get(metric[-diff], 'losses', 0),
              }
            }
          }
        } else if (blue > red){
          if(winner === 'Blue'){
            metric[diff] = {
              wins: get(metric[diff], 'wins', 0) + 1,
              losses: get(metric[diff], 'losses', 0),
            }

            if(absDiff !== 0){
              metric[-diff] = {
                wins: get(metric[-diff], 'wins', 0),
                losses: get(metric[-diff], 'losses', 0) + 1,
              }
            }
          } else {
            metric[diff] = {
              wins: get(metric[diff], 'wins', 0),
              losses: get(metric[diff], 'losses', 0) + 1,
            }

            if(absDiff !== 0){
              metric[-diff] = {
                wins: get(metric[-diff], 'wins', 0) + 1,
                losses: get(metric[-diff], 'losses', 0),
              }
            }
          }
        }
      }
  
    }
  
    for(let key in metric){
      const wins = metric[key].wins;
      const losses = metric[key].losses;
      const total = wins + losses;

      if(reverse){
        metric[key].winPct = (100 - wins / total * 100).toFixed(2);
      } else {
        metric[key].winPct = (wins / total * 100).toFixed(2);
      }

      metric[key].diff = key;
    }
  
    return metric;
  
  }

  export function getAllKeys(data){
    const item = data[0];
    let arr = [];
    const filter = ['fighter', 
    'Referee', 
    'date', 
    'location', 
    'Winner', 
    'weight_class', 
    'no_of_rounds', 
    'current_lose_streak', 
    'current_win_streak', 
    'draw', 
    'longest_win_streak', 
    'losses', 
    'total_rounds_fought', 
    'total_time_fought(seconds)', 
    'total_title_bouts', 
    'total_title_bouts',
    'win_by_Decision_Majority',
    'win_by_Decision_Split',
    'win_by_Decision_Unanimous',
    'win_by_KO/TKO',
    'win_by_Submission',
    'win_by_TKO_Doctor_Stoppage', 
    'Weight_lbs', 
    'wins', 
    'title_bout',
    'Stance',
    'avg_opp_KD',
    'avg_KD',
    'avg_REV',
    'avg_opp_REV',
  ];
  
    for(let key in item){
      if(!key.startsWith('R_')){
        if(key.startsWith('B_')){
          arr.push(key.slice(2));
        } else {
          arr.push(key)
        }
      }
    }
  
    return arr.filter(item => !filter.includes(item));
  }

  export function formatKeys(keys){
    return keys.map(key => ({ key, value: key, text: key }));
  }


  export function preProcess(data, key){
    const d = getDiffMetrics(data, key);
    const plotData = Object.keys(d).map(k => ({ x: Number(k), y: Number(d[k].winPct), total: d[k].wins + d[k].losses })).filter(item => item.total > 10);
    const max = plotData.reduce((acc,cur) => Math.max(acc, cur.x), 0);
    const regData = plotData.map(item => [Number(item.x), Number(item.y)]);
    const result = regression.linear(regData);
    const r2 = result.r2;
    const r = Math.sqrt(r2).toPrecision(2);
    const points = result.points;
    const linearFit = points.map((item) => ({x: item[0], y: item[1]}));

    return { plotData, max, linearFit, r, r2 };
  }

  export function rMapped(data, threshold = 0){
    const keys = getAllKeys(data);
    const radarD = [];
    const names = [];

    for(let i = 0; i < keys.length; i++){
      const { r } = preProcess(data, keys[i]);
      const name = keys[i];


      if(r >= threshold){
        radarD.push({ name, r: Number(r)});
        names.push(name);
      }


    }

    return { radarD, names };
  }

const getTickFormat = (i) => {
    let tickFormat = null;

    if (i === 0){
        tickFormat = (t) => t.toPrecision(1);
    }

    return tickFormat;
};

export const getDomains = (edges) =>
    edges.map((edge, i) => ({
        name: edge,
        domain: [0, 1],
        tickFormat: getTickFormat(i)
}));

