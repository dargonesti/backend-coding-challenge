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

router.get('/suggestions/', function (req, res) { 
      console.log(req.query);

      //res.status(200).send(searchCities(req.query));
       
      res.json(searchCities(req.query));
});

var app = express()
.use("/", router) ///suggestions
.listen(PORT, function(req,res){
  return "ok";
});

  function searchCities(req){
    return {
        suggestions: cities.map(function(city){   
        return { 
        name: city.name + ", " + city.admin1 + ", "  + city.country,
        latitude: city.lat,
        longitude: city.long,
        score: scores.getCityScore(req, city)
      };
    })
    .filter(cityComparison=>cityComparison.score > 0)
    .sort((c1,c2) => c2.score - c1.score)
    };
  }

  module.exports = app;