'use strict';
const Generator = require('yeoman-generator');
const extend = require('deep-extend');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  async prompting() {
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
      }, //need to add username and password as well
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
    ]);

    this.log('this is the new version');
    this.log('projectName', this.questions.projectName);
    this.log('database', this.questions.database);
    this.log('defaultDB', this.questions.defaultDB);
    this.log('DbHost', this.questions.DbHost);
    this.log('DbPort', this.questions.DbPort);
    this.log('DbName', this.questions.DbName);
    this.log('auth', this.questions.auth);
    this.log('secretKey', this.questions.secretKey);
  }

  writing() {
    const db = this.questions.database;
    const auth = this.questions.auth;

    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {
      scripts: {
        dist: 'node -r ts-node/register ./src/server.ts',
        'start:watch': 'nodemon',
        dev: 'nodemon --exec ts-node src/server.ts',
        test: 'jest --runInBand ./tests',
        'clear-cache': 'jest --clearCache',
      },
      jest: {
        testEnvironment: 'node',
        transform: {
          '\\.(gql|graphql)$': 'jest-transform-graphql',
          '^.+\\.jsx?$': 'babel-jest',
          '^.+\\.tsx?$': 'ts-jest',
        },
      },
    });

    this.npmInstall([
      'lodash',
      'express',
      'apollo-server',
      'apollo-server-express',
      'graphql-import-node',
      'merge-graphql-schemas',
      'dotenv',
    ]);

    this.npmInstall([
      '@types/express',
      '@types/node',
      '@types/lodash',
      'eslint',
      'eslint-plugin-import',
      'nodemon',
      'typescript',
      'ts-node',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
      'jest',
      'ts-jest',
      'faker',
      'easygraphql-tester',
      'jest-transform-graphql',
      '@types/jest',
      'mongodb-memory-server',
    ], { 'save-dev': true });

    if (auth === 'JWT') {
      this.npmInstall([
        'jsonwebtoken',
        'express-jwt',
        'bcrypt'
      ]);
    }

    if (db === 'noSQL') {
      this.npmInstall([
        'mongoose'
      ]);
      this.npmInstall([
        '@types/mongoose',
        'mongodb-memory-server'
      ], { 'save-dev': true });
    }

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    this.fs.copyTpl(
      this.templatePath('server.ts'),
      this.destinationPath('src/server.ts')
    );
    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copyTpl(
      this.templatePath('.eslintrc.json'),
      this.destinationPath('.eslintrc.json')
    );
    this.fs.copyTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json')
    );
    this.fs.copyTpl(
      this.templatePath('user.graphql'),
      this.destinationPath('src/graphql/schemas/user.graphql')
    );
    this.fs.copyTpl(
      this.templatePath('userResolver.ts'),
      this.destinationPath('src/graphql/resolvers/userResolver.ts')
    );

    let port = '27017';
    let host = 'localhost';
    let name = this.questions.projectName;
    if (this.questions.defaultDB === false) {
      port = this.questions.DbPort;
      host = this.questions.DbHost;
      name = this.questions.DbName;
    }
    this.fs.copyTpl(this.templatePath('.env'), this.destinationPath('.env'), {
      dbHost: host,
      dbPort: port,
      dbName: name,
      jwtSecret: this.questions.jwtSecret,
    });
    //this is noSQL specific
    this.fs.copyTpl(
      this.templatePath('userModel.ts'),
      this.destinationPath('src/models/userModel.ts')
    );

    this.fs.copyTpl(
      this.templatePath('dbHandler.ts'),
      this.destinationPath('tests/dbHandler.ts')
    );
    this.fs.copyTpl(
      this.templatePath('userResolver.test.ts'),
      this.destinationPath('tests/resolvers/userResolver.test.ts')
    );
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
