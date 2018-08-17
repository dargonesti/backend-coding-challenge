var tsv = require('tsv');
var fs = require("fs");

var tsvString = fs.readFileSync("./data/cities_canada-usa.tsv").toString();
//console.log(tsvString);
var tsvObj = tsv.parse(tsvString);

module.exports = tsvObj;