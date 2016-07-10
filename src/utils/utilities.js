let percent = function(portion, total){
  return Math.round(portion / total * 100);
}

let percentOfPlayerWins = function(wins, losses){
  let total = wins + losses;
  let winPercent = percent(wins, total); // returns number, NaN or Infinity/-Infinity
  return total > 9 && !!winPercent && isFinite(winPercent) ? winPercent + '%' : '-'; // Ensures we have a sensible result
}

const daysSince = (timestamp) => Math.floor((Date.now() - timestamp) / 1000 / 60 / 60 / 24);

module.exports = {
  percentOfPlayerWins,
  daysSince
};
