/**
 * generator/index.js.hbs.hbs
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const path = require('path');
const routeGenerator = require('./route/index.js');
// const componentGenerator = require('./component/index.js.hbs.hbs');

module.exports = (plop) => {
  plop.setGenerator('route', routeGenerator);
  // plop.setGenerator('component', componentGenerator);

  plop.setHelper('preCurly', (t) => `{${t}}`);

  plop.addHelper('directory', (comp) => {
    try {
      fs.accessSync(path.join(__dirname, `../src/routes/${comp}`), fs.F_OK);
      return `routes/${comp}`;
    } catch (e) {
      // return `components/${comp}`;
    }
  });
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
};
