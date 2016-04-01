// const animationDataSchema = require('./StructureSchema');
// const exec = require('child_process').exec;


// const initialObj = animationDataSchema.DataSchema(process.env.HOME);
// console.log(initialObj);
export default [
  {
    "name": "Top Level",
    "value": 15,
    "children": [
      {
        "name": "Level 2: A",
        "children": [
          {
            "name": "Son of A",
          },
          {
            "name": "Daughter of A",
          }
        ]
      },
      {
        "name": "Level 2: B",
      }
    ]
  }
];
