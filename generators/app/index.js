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
        }, // Need to add username and password as well
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

  writing() {
    const install = (packages, options) => {
      if (this.questions.packageManager === 'npm') {
        this.npmInstall(packages, options);
      }
      if (this.questions.packageManager === 'yarn') {
        this.yarnInstall(packages, options);
      }
    };

    const parentFolder = this.options.parentFolder ? this.options.parentFolder + "/" : "";
    const codeFolder = this.questions.type + "/";
    const fileExtension = this.questions.type === 'typescript' ? '.ts' : '.js';
    const db = this.questions.database;
    const auth = this.questions.auth;

    const jestScript = this.questions.type === 'typescript'
      ? 'jest --runInBand ./tests'
      : 'node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand';
    const transform = this.questions.type === 'typescript'
      ? {
        '\\.(gql|graphql)$': 'jest-transform-graphql',
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest',
      }
      : {
        '\\.(gql|graphql)$': 'jest-transform-graphql',
      };
    const module = this.questions.type === 'typescript' ? {} : { type: "module" };
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {
      ...module,
      scripts: {
        dist: 'node -r ts-node/register ./src/server.ts',
        'start:watch': 'nodemon',
        dev: 'nodemon --exec ts-node src/server.ts',
        test: jestScript,
        'clear-cache': 'jest --clearCache',
        coverage: 'jest --coverage',
      },
      jest: {
        testEnvironment: 'node',
        transform: transform,
        collectCoverageFrom: [
          "src/**/*.{ts,js}",
          "!src/server" + fileExtension,
        ],
      },
    });

    install([
      'express',
      'apollo-server',
      'apollo-server-express',
      'graphql-import-node',
      '@graphql-tools/merge',
      'dotenv',
    ]);

    const packages = this.questions.type === 'typescript'
      ? [
        '@types/express',
        '@types/node',
        '@typescript-eslint/eslint-plugin@latest',
        '@typescript-eslint/parser@latest',
        '@types/jest',
        'typescript',
        'ts-node',
        'ts-jest',
        'jest',
      ]
      : [ 'jest' ];

    install([
      ...packages,
      'eslint',
      'eslint-plugin-import',
      'nodemon',
      'faker',
      'easygraphql-tester',
      'jest-transform-graphql',
      'mongodb-memory-server',
    ], { 'save-dev': true });

    if (auth === 'JWT') {
      install([
        'jsonwebtoken',
        'express-jwt',
        'bcrypt',
      ]);
    }

    if (db === 'noSQL') {
      install([
        'mongoose',
      ]);
      install([
        '@types/mongoose',
        'mongodb-memory-server',
      ], { 'save-dev': true });
    }

    this.fs.writeJSON(this.destinationPath(parentFolder + 'package.json'), pkg);

    this.fs.copyTpl(
      this.templatePath(codeFolder + 'server' + fileExtension),
      this.destinationPath(parentFolder + 'src/server' + fileExtension)
    );
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath(parentFolder + '.gitignore')
    );
    this.fs.copyTpl(
      this.templatePath('.eslintrc.json'),
      this.destinationPath(parentFolder + '.eslintrc.json')
    );
    if (this.questions.type === 'typescript') {
      this.fs.copyTpl(
        this.templatePath(codeFolder + 'tsconfig.json'),
        this.destinationPath(parentFolder + 'tsconfig.json')
      );
    }
    this.fs.copyTpl(
      this.templatePath('user.graphql'),
      this.destinationPath(parentFolder + 'src/graphql/schemas/user.graphql')
    );
    this.fs.copyTpl(
      this.templatePath(codeFolder + 'userResolver' + fileExtension),
      this.destinationPath(parentFolder + 'src/graphql/resolvers/userResolver' + fileExtension)
    );

    this.fs.copyTpl(this.templatePath('.env'), this.destinationPath(parentFolder + '.env'), {
      dbHost: this.questions.defaultDB ? 'localhost' : this.questions.DbHost,
      dbPort: this.questions.defaultDB ? '27017' : this.questions.DbPort,
      dbName: this.questions.defaultDB ? this.questions.projectName : this.questions.DbName,
      jwtSecret: this.questions.secretKey,
    });

    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath(parentFolder + 'README.md'), {
      projectName: this.questions.projectName,
      pkm: this.questions.packageManager ? 'yarn' : 'npm run',
    });

    // This is noSQL specific
    this.fs.copyTpl(
      this.templatePath(codeFolder + 'userModel' + fileExtension),
      this.destinationPath(parentFolder + 'src/models/userModel' + fileExtension)
    );

    this.fs.copyTpl(
      this.templatePath(codeFolder + 'dbHandler' + fileExtension),
      this.destinationPath(parentFolder + 'tests/dbHandler' + fileExtension)
    );
    this.fs.copyTpl(
      this.templatePath(codeFolder + 'userResolver.test' + fileExtension),
      this.destinationPath(parentFolder + 'tests/resolvers/userResolver.test' + fileExtension)
    );
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
