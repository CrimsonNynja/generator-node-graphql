'use strict';
const Generator = require('yeoman-generator');
const extend = require('deep-extend');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'checkbox',
        name: 'database',
        message: 'Select the database type: ',
        default: 'mongo',
        choices: [
          {
            name: 'noSQL (mongoose)',
            value: 'mongo',
          },
          {
            name: 'mySQL',
            value: 'mysql',
          }
        ]
      },
      {
        type: 'confirm',
        name: 'auth',
        message: 'Would you like to generate an auth as well?',
        default: true,
      }
    ]);

    this.log('database', this.answers.database);
    this.log('auth', this.answers.auth);
  }

  writing() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.npmInstall([
      'lodash',
      'express',
      'apollo-server',
      'apollo-server-express',
      'graphql-import-node',
      'merge-graphql-schemas'
    ]);

    if (this.answers.auth === true) {
      this.npmInstall([
        'jsonwebtoken',
        'express-jwt',
        'dotenv',
        'bcrypt'
      ]);
    }

    // if (this.answers.database === 'mongo') {
      this.npmInstall([
        'mongoose'
      ]);
      this.npmInstall([
        '@types/mongoose'
      ], { 'save-dev': true });
    // }

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
      '@typescript-eslint/parser@latest'
    ], { 'save-dev': true });

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

    // if (this.answers.database === 'mongo') {
      this.fs.copyTpl(
        this.templatePath('userModel.ts'),
        this.destinationPath('src/models/userModel.ts')
      );
    // }

    if (this.answers.auth === true) {
      this.fs.copyTpl(
        this.templatePath('user.graphql'),
        this.destinationPath('src/graphql/schemas/user.graphql')
      );
      this.fs.copyTpl(
        this.templatePath('userResolver.ts'),
        this.destinationPath('src/graphql/resolvers/userResolver.ts')
      );
      this.fs.copyTpl(
        this.templatePath('.env'),
        this.destinationPath('.env')
      );
    }
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
