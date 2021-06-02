/**
 * Route Generator
 */

const routeExists = require('../utils/routeExists');

module.exports = {
  description: 'Add a route component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the base route type:',
      default: 'CRUD',
      choices: () => ['CRUD', 'Blank'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: (answers) => (answers.type === 'CRUD' ? "Management" : "Page") + "Test",
      validate: (value) => {
        if ((/.+/).test(value)) {
          return routeExists(value) ? 'A file with this name already exists' : true;
        }
        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'api',
      message: 'What is the API path in page?',
      default: (answers) => '/' + answers.name.toLowerCase(),
    },
    {
      when: (answers) => answers.type === 'CRUD',
      type: 'confirm',
      name: 'isGroup',
      message: 'That data has category?',
      default: false,
    },
    {
      when: (answers) => answers.isGroup === true,
      type: 'input',
      name: 'nameGroup',
      message: 'What should it be called?',
      default: (answers) => answers.name.charAt(0).toUpperCase() + answers.name.slice(1)  +'Category',
    },
    {
      when: (answers) => answers.isGroup === true,
      type: 'input',
      name: 'apiGroup',
      message: 'What is the API path in category?',
      default: (answers) => '/' + answers.name.toLowerCase() + '-category',
    },
    {
      when: (answers) => answers.isGroup === true,
      type: 'confirm',
      name: 'isModalTable',
      message: 'That data has modal table?',
      default: false,
    },
    {
      when: (answers) => answers.isModalTable === true,
      type: 'input',
      name: 'nameModalTable',
      message: 'What should it be called?',
      default: 'ModalTableTest',
    },
    {
      when: (answers) => answers.isModalTable === true,
      type: 'input',
      name: 'apiModalTable',
      message: 'What is the API path in modal table?',
      default: (answers) => '/' + answers.nameModalTable.toLowerCase(),
    },
  ],
  actions: (answers) => {
    // Generate index.js.hbs.hbs and index.test.js
    answers.linkPath = "Admin/";
    const _translation = `,\n      "{{properCase name}}": {\n${answers.isGroup ? '        "{{properCase nameGroup}}": "{{nameGroup}}"\n' : ''}      }\n    }\n  }\n}$1`;
    let actions = [
      {
        type: 'add',
        path: '../src/routes/{{linkPath}}{{properCase name}}/index.js',
        templateFile: `./route/${answers.type}/index.js.hbs`,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `../src/routes/{{linkPath}}{{properCase name}}/column.js`,
        templateFile: `./route/${answers.type}/column.js.hbs`,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `../src/routes/{{linkPath}}{{properCase name}}/service.js`,
        templateFile: `./route/${answers.type}/service.js.hbs`,
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: '../src/layouts/AdminLayout/menus.js',
        pattern: /( {4}]\n)( {2}},\n)( {2}{\n)( {4}title: 'Settings',)/gi,
        template: `      { icon: 'las la-lg la-user-graduate', name: '{{properCase name}}' },\n    ]\n  },\n  {\n    title: 'Settings',`,
      },
      {
        type: 'modify',
        path: '../src/utils/routerLinks.js',
        pattern: /(\n {2}};\/\/ 💬 generate link to here)/gi,
        template: `\n    {{ properCase name }}: '/{{lowerCase name}}',$1`,
      },
      {
        type: 'modify',
        path: '../src/utils/routerLinks.js',
        pattern: /(\n {2}};\/\/ 💬 generate api to here)/gi,
        template: `\n    {{ properCase name }}: '{{api}}',$1`,
      },
      {
        type: 'modify',
        path: '../public/locales/en/translation.json',
        pattern: /(\n  },)(\n  "routes": {)/gi,
        template: `,\n    "{{properCase name}}": "{{name}}"\n  },\n  "routes": {`,
      },
      {
        type: 'modify',
        path: '../public/locales/vi/translation.json',
        pattern: /(\n  },)(\n  "routes": {)/gi,
        template: `,\n    "{{properCase name}}": "{{name}}"\n  },\n  "routes": {`,
      },
      {
        type: 'modify',
        path: '../public/locales/ja/translation.json',
        pattern: /(\n  },)(\n  "routes": {)/gi,
        template: `,\n    "{{properCase name}}": "{{name}}"\n  },\n  "routes": {`,
      },
      {
        type: 'modify',
        path: '../src/routes/routes.js',
        pattern: /(\n)( {4}]\n)( {2}}\n)(];)/gi,
        template: `\n      {\n        path: routerLinks('{{properCase name}}'),\n        component: React.lazy(() => import('./Admin/{{properCase name}}')),\n        title: '{{properCase name}}'\n      },\n    ]\n  }\n];`,
      },
      {
        type: 'modify',
        path: '../public/locales/en/translation.json',
        pattern: /(\n)( {4}}\n)( {2}}\n)(})/gi,
        template: _translation,
      },
      {
        type: 'modify',
        path: '../public/locales/vi/translation.json',
        pattern: /(\n)( {4}}\n)( {2}}\n)(})/gi,
        template: _translation,
      },
      {
        type: 'modify',
        path: '../public/locales/ja/translation.json',
        pattern: /(\n)( {4}}\n)( {2}}\n)(})/gi,
        template: _translation,
      }
    ];

    if (answers.isGroup) {
      actions.push({
        type: 'modify',
        path: '../src/utils/routerLinks.js',
        pattern: /(\n {2}};\/\/ 💬 generate link to here)/gi,
        template: `\n    {{ properCase nameGroup }}: '/{{lowerCase nameGroup}}',$1`,
      });
      actions.push({
        type: 'modify',
        path: '../src/utils/routerLinks.js',
        pattern: /(\n {2}};\/\/ 💬 generate api to here)/gi,
        template: `\n    {{ properCase nameGroup }}: '{{apiGroup}}',$1`,
      });
    }

    if (answers.isModalTable) {
      actions.push({
        type: 'modify',
        path: '../public/locales/en/translation.json',
        pattern: /(\n {6}}\n)( {4}}\n)( {2}}\n)(})/gi,
        template: `,\n        "{{properCase nameModalTable}}": "{{nameModalTable}}"\n      }\n    }\n  }\n}`,
      });
      actions.push({
        type: 'modify',
        path: '../public/locales/vi/translation.json',
        pattern: /(\n {6}}\n)( {4}}\n)( {2}}\n)(})/gi,
        template: `,\n        "{{properCase nameModalTable}}": "{{nameModalTable}}"\n      }\n    }\n  }\n}`,
      });
      actions.push({
        type: 'modify',
        path: '../public/locales/ja/translation.json',
        pattern: /(\n {6}}\n)( {4}}\n)( {2}}\n)(})/gi,
        template: `,\n        "{{properCase nameModalTable}}": "{{nameModalTable}}"\n      }\n    }\n  }\n}`,
      });
      actions.push({
        type: 'modify',
        path: '../src/utils/routerLinks.js',
        pattern: /(\n {2}};\/\/ 💬 generate link to here)/gi,
        template: `\n    {{ properCase nameModalTable }}: '/{{lowerCase nameModalTable}}',$1`,
      });
      actions.push({
        type: 'modify',
        path: '../src/utils/routerLinks.js',
        pattern: /(\n {2}};\/\/ 💬 generate api to here)/gi,
        template: `\n    {{ properCase nameModalTable }}: '{{apiModalTable}}',$1`,
      });
    }
    return actions;
  },
};
