/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-env mocha */

const expect = require('chai').expect;
const StructureSchema = require('../AnimationData/StructureSchema');

describe('StructureSchema', () => {
  it('should have a dataSchema key', () => {
    expect(StructureSchema.dataSchema).to.exist;
  });
  it('should return a schema that has a name property when schemaMaker is called', () => {
    const schemaResult = StructureSchema.schemaMaker(['stdout', 'banana'], process.env.HOME)[0];
    expect(schemaResult).to.have.property('name', process.env.HOME);
  });
  it('schemaMaker should return a schema that has a children property that is an array with a name stdout', () => {
    const schemaResult = StructureSchema.schemaMaker(['stdout', 'banana'], process.env.HOME)[0];
    expect(schemaResult).to.have.deep.property('children[0].name', 'stdout');
  });
});
