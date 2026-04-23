/** @param {import('plop').NodePlopAPI} plop */
export default function (plop) {
  plop.setGenerator('component', {
    description: 'Create a new Webflow Code Component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase, e.g. HeroCard):',
        validate: (value) => {
          if (!value) return 'Component name is required';
          if (!/^[A-Z][A-Za-z0-9]*$/.test(value)) return 'Must be PascalCase (e.g. HeroCard)';
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Short description (used in file comments):',
        validate: (value) => (value ? true : 'Description is required'),
      },
      {
        type: 'confirm',
        name: 'hasSlots',
        message: 'Does this component accept Webflow child elements (slots)?',
        default: false,
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.tsx',
        templateFile: 'plop/component/__name__.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.webflow.tsx',
        templateFile: 'plop/component/__name__.webflow.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.stories.tsx',
        templateFile: 'plop/component/__name__.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.test.tsx',
        templateFile: 'plop/component/__name__.test.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/index.ts',
        templateFile: 'plop/component/index.ts.hbs',
      },
    ],
  });
}
