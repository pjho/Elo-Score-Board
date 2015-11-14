var percent = function(wins, losses){
   if(wins + losses > 9){
    return (Math.round(wins / (wins + losses) * 100) || 0)
   }
   else{
    return NaN;
   }
  }

  var percentOfPlayerWins = function(wins, losses){
  	var num = percent(wins, losses);

    if (isNaN(num)){
			return '-';
		} else{
			return num + '%';
		} 
  }

module.exports = {
  percentOfPlayerWins: percentOfPlayerWins
};
