'use strict';

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


const webdriver = require('selenium-webdriver');

// run this command in terminal before running webdriver
// node_modules/chromedriver/bin/chromedriver

var driver = new webdriver.Builder()
  .usingServer('http://localhost:9515')
  .withCapabilities({chromeOptions: {
// Here is the path to your Electron binary.
  binary: 'node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron'}})
  .forBrowser('electron')
  .build();

// write tests to check if 4 elements are rendered properlly
// terminal
// dashboard
// lesson
// animation

// driver.get('http://www.google.com');
// driver.findElement(webdriver.By.name('div'));
driver.findElements(webdriver.By.name('div'));
driver.wait(function() {
    return driver.getTitle().then(function(title) {
    return title === 'webdriver - Google Search';
    });
}, 1000);



driver.quit();
