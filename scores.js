var exports = {};

  exports.citySimilarity = function(query,compared){
  if(compared.toLowerCase().startsWith(query.toLowerCase()))
    return query.length / compared.length;
  else
    return 0;
};

exports.altCitySimilarity = function(queryName, city)
{
  var score = 0;
  city.alt_name.split(",").forEach((altName)=>{
    var newScore = 0;
    if(altName.toLowerCase().startsWith(queryName.toLowerCase()))
    newScore = queryName.length / altName.length;
    else
    newScore = 0;
    score = Math.max(newScore, score);
  });
  return score;
};

exports.getCityScore = function(query, city)
{
  var score = 0;
  var ratioAltCity = 0.75;

  if("q" in query && "ascii" in city)
  {
    score = exports.citySimilarity(query.q, city.ascii);
  }
  if(score < 1 && 
    "q" in query && "alt_name" in city)
  {
    score = Math.max(score, ratioAltCity * exports.altCitySimilarity(query.q.toLowerCase(), city));
    // while score < 1 .. forach alt_name : score = citySimilarity(query.q, city.alt_name);
  }
  if(score > 0 && 
    "longitude" in query && "latitude" in query &&
    "long" in city && "lat" in city)
  {
    var dist = exports.distance(query.latitude, query.longitude, city.lat, city.long);
    score *= exports.distanceToScore(dist);
  }
  return score;
};

exports.distanceToScore = function(dist){
  // Formulles approximative de score suivant la distance qui semblent pertinentes : 
  // 1-10 km : 1-0.9
  // 10-100 km : 0.9-0.33
  // 100-1000 km: 0.33-0.1
  return Math.max(0,1 - (dist * dist / (20038*20038)) ** 0.2);
  //return 1 - dist / 20038; // 20038 km étant ±la distance maximale d'un côté à l'autre de la terre
};

  //Calculate distance 
  // Taken from : https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  exports.distance = function(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};


module.exports = exports;