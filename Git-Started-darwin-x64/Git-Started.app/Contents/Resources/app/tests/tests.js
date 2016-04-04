var assert = require('assert');
var expect = require('chai').expect;

var mainFile = require('../AnimationData/StructureSchema');

  describe('inside StructureSchema', function(){
    it('twoPlustwo should add stuff', function(){
      expect(mainFile.twoPlustwo()).to.equal(4);
    })
    it ('should have a DataSchema key', function(){
      expect(mainFile.DataSchema).to.exist;
    })
    it('should return a schema that has a name property when schemaMaker is called',function(){
      var schemaResult = mainFile.schemaMaker(["stdout", "banana"],process.env.HOME)[0]
      expect(schemaResult).to.have.property("name", process.env.HOME);
    })
    it('schemaMaker should return a schema that has a children property thats an array with a name stdout',function(){
      var schemaResult = mainFile.schemaMaker(["stdout", "banana"],process.env.HOME)[0]
      expect(schemaResult).to.have.deep.property("children[0].name","stdout");
    })
  })
  console.log(mainFile.DataSchema(process.env.HOME));

// describe('Array', function() {
//   describe('#indexOf()', function () {
//     it('should return -1 when the value is not present', function () {
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     });
//   });
// });
