'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option("parentFolder", { type: String, required: true });
    this.option("auth", { type: String, required: true });
    this.option("db", { type: String, required: true });
    this.option("packageManager", { type: String, required: true });
  }

  writing() {
    const parentFolder = this.options.parentFolder;
    const auth = this.options.auth;
    const db = this.options.db;
    const packageManager = this.options.packageManager;

    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {
      type: "module",
      scripts: {
        dist: 'node -r ts-node/register ./src/server.js',
        'start:watch': 'nodemon',
        dev: 'nodemon --exec ts-node src/server.js',
        test: 'node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand',
        'clear-cache': 'jest --clearCache',
        coverage: 'jest --coverage',
      },
      jest: {
        testEnvironment: 'node',
        transform: {
          '\\.(gql|graphql)$': 'jest-transform-graphql',
        },
        collectCoverageFrom: [
          "src/**/*.{ts,js}",
          "!src/server.js",
        ],
      },
      resolutions: {
        graphql: '^15.3.0',
      },
      license: "MIT",
    });

    const install = (packages, options) => {
      if (packageManager === 'npm') {
        this.npmInstall(packages, options);
      }
      if (packageManager === 'yarn') {
        this.yarnInstall(packages, options);
      }
    };

    install([
      'express',
      'apollo-server',
      'apollo-server-express',
      'graphql@16.3.0',
      'graphql-import-node',
      'graphql-tag',
      '@graphql-tools/merge',
      'dotenv',
    ]);

    install([
      'jest',
      'eslint',
      'eslint-plugin-import',
      'nodemon',
      '@faker-js/faker',
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
        'mongodb-memory-server',
      ], { 'save-dev': true });
    }

    this.fs.writeJSON(this.destinationPath(parentFolder + 'package.json'), pkg);

    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath(parentFolder + 'src/server.js')
    );

    this.fs.copyTpl(
      this.templatePath('userModel.js'),
      this.destinationPath(parentFolder + 'src/models/userModel.js')
    );

    this.fs.copyTpl(
      this.templatePath('userResolver.js'),
      this.destinationPath(parentFolder + 'src/graphql/resolvers/userResolver.js')
    );

    this.fs.copyTpl(
      this.templatePath('dbHandler.js'),
      this.destinationPath(parentFolder + 'tests/dbHandler.js')
    );
    this.fs.copyTpl(
      this.templatePath('userResolver.test.js'),
      this.destinationPath(parentFolder + 'tests/resolvers/userResolver.test.js')
    );
  }
};
