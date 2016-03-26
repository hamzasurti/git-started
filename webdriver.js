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
// mocha webdriver.js

describe("4 Main React Components Render onto DOM", function(){
  var driver
  beforeEach(function(done){
    new webdriver.Builder()
    .usingServer('http://localhost:9515')
    .withCapabilities({chromeOptions: {
      // Here is the path to your Electron binary.
      binary: 'node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron'}
      })
    .forBrowser('electron')
    .buildAsync().then(function(message){
      driver = message;
      console.log(driver);
      done();
    })
  })

  it('Animation element must render', function(done){
    var AnimationElem = driver.findElements(webdriver.By.tag("div"))
      .then(function(value){
        value[0].getInnerHtml().then(function(item){
          console.log('this is item',item);
          done();
        });
        assert.notEqual(value,null);
      }, function(err){
        console.log(err);
        done();
      });
  })



// driver.wait(function() {
//     return driver.getTitle().then(function(title) {
//       return title === 'webdriver - Google Search';
//       console.log(1)
//     });
// }, 1000);
// driver.quit();

})
