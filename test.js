//const { spawn } = require('child_process');
//const request = require('request');
var request = require('supertest');
const test = require('tape');
var app = require("./index.js");

console.log("t0");
// Start the app
const env = Object.assign({}, process.env, {PORT: 5000});

test("GET /suggestions?q=Montre", function(assert){
  request(app)
  .get("/suggestions?q=Montre")
  .expect(200)
  .expect('Content-Type',/json/)
  .end(function(err,res){
    var expectedCities = [{"name":"Montréal, 10, CA",
    "latitude":"45.50884",
    "longitude":"-73.58781",
    "score":0.75},
    {"name":"Montréal-Ouest, 10, CA",
    "latitude":"45.45286",
    "longitude":"-73.64918",
    "score":0.42857142857142855}];
    var actualCities = res.body;

    assert.error(err,"No error");
    assert.same(expectedCities, actualCities.suggestions);
    assert.end();
  })
});
