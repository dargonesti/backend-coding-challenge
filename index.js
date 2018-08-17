const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
const scores = require("./scores.js");

var cities = require("./cities.js");

//console.log("cities : ");
//console.log(cities);

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) { ///suggestions:q

  //User.findById(req.params.q, function (err, user) {
     // if (err) return res.status(500).send("There was a problem finding the user.");
      //if (!user) return res.status(404).send("No user found.");
      console.log(req.query);

      res.status(200).send(searchCities(req.query));
      //res.status(200).send("ok");
 // });
});
//.listen(PORT, () => console.log("listening on " + PORT));
express()
.use("/", router) ///suggestions
.listen(PORT, function(req,res){
  //console.log("test");
  return "ok2";
});
/*
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

  //*/

  function searchCities(req){
    return JSON.stringify(
      {
      suggestions: cities.map(function(city){
      //console.log(city);    
        return { 
        name: city.name + ", " + city.admin1 + ", "  + city.country,
        latitude: city.lat,
        longitude: city.long,
        score: scores.getCityScore(req, city)
        //("name" in city ? citySimilarity(nameQuery, city.ascii) : 0)
      };
    })
    .filter(cityComparison=>cityComparison.score > 0)
    .sort((c1,c2) => c2.score - c1.score)
    }, null, 4);
  }
/*
  function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

function citySimilarity(query,compared){
  if(compared.toLowerCase().startsWith(query.toLowerCase()))
    return query.length / compared.length;
  else
    return 0;
}

function altCitySimilarity(queryName, city)
{
  var score = 0;

  if ("alt_name" in city && 
    city.alt_name.length > 0)
  try{
    city.alt_name.split(",").forEach((altName)=>{
      var newScore = 0;
      if(altName.toLowerCase().startsWith(queryName.toLowerCase()))
      newScore = queryName.length / altName.length;
      else
      newScore = 0;
      score = Math.max(newScore, score);
    });
  }catch(ex){
    console.log(ex);
    console.log(city.alt_name);
  }
  return score;
}

function getCityScore(query, city)
{
  var score = 0;
  if("q" in query && "ascii" in city)
  {
    score = citySimilarity(query.q, city.ascii);
  }
  if(score < 1 && 
    "q" in query && "alt_name" in city)
  {
    score = Math.max(score, altCitySimilarity(query.q.toLowerCase(), city));
    // while score < 1 .. forach alt_name : score = citySimilarity(query.q, city.alt_name);
  }
  if(score > 0 && 
    "longitude" in query && "latitude" in query &&
    "longitude" in city && "latitude" in city)
  {
    var dist = distance(query.latitude, query.longitude, city.lat, city.long);
    score *= distanceToScore(dist);
  }
}

function distanceToScore(dist){
  // Formulles approximative de score suivant la distance qui semblent pertinentes : 
  // 1-10 km : 1-0.9
  // 10-100 km : 0.9-0.33
  // 100-1000 km: 0.33-0.1
  return Math.max(0,1 - (dist * dist / (20038*20038)) ** 0.2);
  //return 1 - dist / 20038; // 20038 km étant ±la distance maximale d'un côté à l'autre de la terre
}

  //Calculate distance 
  // Taken from : https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}//*/