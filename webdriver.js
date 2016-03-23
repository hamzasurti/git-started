'use strict';
const mocha = require('mocha');
const assert = require('assert');
const webdriver = require('selenium-webdriver');

// // copies updated files into electron binary folder
// const ncp = require('ncp');
//
// ncp.limit = 16;
// ncp('main.js', '../Desktop', function (err){
//   if(err){
//     return console.error(err);
//   }
//   console.log("Successfully copied and updated into Electron Binary folder!");
// })

// npm install chromedriver and selenium-webdriver
// copy all files in git-started except for electron modules within the node_modules
// run this command in terminal before running webdriver
// node_modules/chromedriver/bin/chromedriver
// then, run
// node webdriver.js

describe("4 Main React Components Render onto DOM", function(){
  var driver = new webdriver.Builder()
    .usingServer('http://localhost:9515')
    .withCapabilities({chromeOptions: {
      // Here is the path to your Electron binary.
      binary: 'node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron'}})
    .forBrowser('electron')
    .build();

  it('Animation element must render', function(){
    var AnimationElem = driver.findElements(webdriver.By.id('Animation'))
      .then(function(value){
        assert(AnimationElem).to.equal(!null);
      });
  })

  it('Terminal element must render', function(){
    var TerminalElem = driver.findElements(webdriver.By.id('Terminal'))
      .then(function(value){
        assert(TerminalElem).to.equal(!null);
      });
  })

  it('Dashboard element must render', function(){
    var DashElem = driver.findElements(webdriver.By.id('Dashboard'))
      .then(function(value){
        assert(DashElem).to.equal(!null);
      });
  })

  it('Lesson element must render', function(){
    var LessonElem = driver.findElements(webdriver.By.id('Lesson'))
      .then(function(value){
        assert(LessonElem).to.equal(!null);
      });
  })

// driver.wait(function() {
//     return driver.getTitle().then(function(title) {
//       return title === 'webdriver - Google Search';
//       console.log(1)
//     });
// }, 1000);
driver.quit();

})
