'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("parentFolder", { type: String, required: false });
    this.option("default");
  }

  async prompting() {
    if (!this.options.default) {
      this.questions = await this.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'what is the name of your project?',
          default: 'node-graphql',
        },
        {
          type: 'list',
          name: 'database',
          message: 'Select the database type: ',
          choices: ['noSQL'],
        },
        {
          type: 'confirm',
          name: 'defaultDB',
          message: 'database connection will be set to the defaults, is this ok?',
          default: true,
        },
        {
          type: 'input',
          name: 'DbHost',
          message: 'enter database host name: ',
          default: 'localhost',
          when: (answers) => answers.defaultDB === false,
        },
        {
          type: 'input',
          name: 'DbPort',
          message: 'enter database port: ',
          default: '27017',
          when: (answers) => answers.defaultDB === false,
        },
        {
          type: 'input',
          name: 'DbName',
          message: 'enter database name: ',
          default: 'node-graphql',
          when: (answers) => answers.defaultDB === false,
        },
        {
          type: 'input',
          name: 'DbUserName',
          message: 'enter database username: ',
          default: '',
          when: (answers) => answers.defaultDB === false,
        },
        {
          type: 'input',
          name: 'DbPassword',
          message: 'enter database password: ',
          default: '',
          when: (answers) => answers.defaultDB === false,
        },
        {
          type: 'list',
          name: 'auth',
          message: 'Select the auth type: ',
          choices: ['JWT'],
        },
        {
          type: 'input',
          name: 'secretKey',
          message: 'input JWT secret key: ',
          default: 'hwWxD5cB6LtaCB0GOcbaxiOI2eaFoC4rIT9jh51DCdB6p9IZrHTMRuFUM72xIjm',
          when: (answers) => answers.auth === 'JWT',
        },
        {
          type: 'list',
          name: 'packageManager',
          message: 'which package manager do you want to use?',
          choices: ['npm', 'yarn'],
          default: 'yarn',
        },
        {
          type: 'list',
          name: 'type',
          message: 'would you like the project in typescript of javascript?',
          choices: ['typescript', 'javascript'],
          default: 'typescript',
        },
      ]);
    } else {
      this.questions = {};
      this.questions.projectName = 'node-graphql';
      this.questions.database = 'noSQL';
      this.questions.defaultDB = true;
      this.questions.auth = 'JWT';
      this.questions.secretKey = 'hwWxD5cB6LtaCB0GOcbaxiOI2eaFoC4rIT9jh51DCdB6p9IZrHTMRuFUM72xIjm';
      this.questions.packageManager = 'yarn';
      this.questions.type = 'typescript';
    }
  }

  default() {
    const parentFolder = this.options.parentFolder ? this.options.parentFolder + "/" : "";
    const db = this.questions.database;
    const auth = this.questions.auth;

    if (this.questions.type === 'typescript') {
      this.composeWith(require.resolve('../typescript'), {
        parentFolder,
        db,
        auth,
        packageManager: this.questions.packageManager,
      });
    } else {
      this.composeWith(require.resolve('../javascript'), {
        parentFolder,
        db,
        auth,
        packageManager: this.questions.packageManager,
      });
    }
  }

  writing() {
    const parentFolder = this.options.parentFolder ? this.options.parentFolder + "/" : "";

    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath(parentFolder + '.gitignore')
    );
    this.fs.copyTpl(
      this.templatePath('.eslintrc.json'),
      this.destinationPath(parentFolder + '.eslintrc.json')
    );

    this.fs.copyTpl(
      this.templatePath('user.graphql'),
      this.destinationPath(parentFolder + 'src/graphql/schemas/user.graphql')
    );

    this.fs.copyTpl(this.templatePath('.env'), this.destinationPath(parentFolder + '.env'), {
      dbHost: this.questions.defaultDB ? 'localhost' : this.questions.DbHost,
      dbPort: this.questions.defaultDB ? '27017' : this.questions.DbPort,
      dbName: this.questions.defaultDB ? this.questions.projectName : this.questions.DbName,
      dbUserName: this.questions.defaultDB ? '' : this.questions.DbUserName,
      dbPassword: this.questions.defaultDB ? '' : this.questions.DbPassword,
      jwtSecret: this.questions.secretKey,
    });

    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath(parentFolder + 'README.md'), {
      projectName: this.questions.projectName,
      pkm: this.questions.packageManager ? 'yarn' : 'npm run',
    });
  }

  install() {
    if (this.options.parentFolder) {
      var dir = process.cwd() + '/' + this.options.parentFolder;
      process.chdir(dir);
    }

    if (this.questions.packageManager === 'npm') {
      this.installDependencies({
        npm: true,
        yarn: false,
        bower: false,
      });
    }

    if (this.questions.packageManager === 'yarn') {
      this.installDependencies({
        yarn: true,
        npm: false,
        bower: false,
      });
    }
  }
};
