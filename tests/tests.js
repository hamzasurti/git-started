/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
// Mocha defines describe and it.

const expect = require('chai').expect;
const mainFile = require('../AnimationData/StructureSchema');

describe('inside StructureSchema', () => {
  it('should have a dataSchema key', () => {
    expect(mainFile.dataSchema).to.exist;
  });
  it('should return a schema that has a name property when schemaMaker is called', () => {
    const schemaResult = mainFile.schemaMaker(['stdout', 'banana'], process.env.HOME)[0];
    expect(schemaResult).to.have.property('name', process.env.HOME);
  });
  it('schemaMaker should return a schema that has a children property thats an array with a name stdout', () => {
    const schemaResult = mainFile.schemaMaker(['stdout', 'banana'], process.env.HOME)[0];
    expect(schemaResult).to.have.deep.property('children[0].name', 'stdout');
  });
});
