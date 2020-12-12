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
    console.log('packageManager outer: ', packageManager);

    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {
      scripts: {
        dist: 'node -r ts-node/register ./src/server.ts',
        'start:watch': 'nodemon',
        dev: 'nodemon --exec ts-node src/server.ts',
        test: 'jest --runInBand ./tests',
        'clear-cache': 'jest --clearCache',
        coverage: 'jest --coverage',
      },
      jest: {
        testEnvironment: 'node',
        transform: {
          '\\.(gql|graphql)$': 'jest-transform-graphql',
          '^.+\\.jsx?$': 'babel-jest',
          '^.+\\.tsx?$': 'ts-jest',
        },
        collectCoverageFrom: [
          "src/**/*.{ts,js}",
          "!src/server.ts",
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
      'graphql@^15.3.0',
      'graphql-import-node',
      'graphql-tag',
      '@graphql-tools/merge',
      'dotenv',
    ]);

    install([
      '@types/express',
      '@types/node',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
      '@types/jest',
      'typescript',
      'ts-node',
      'ts-jest',
      'jest',
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
      this.templatePath('tsconfig.json'),
      this.destinationPath(parentFolder + 'tsconfig.json')
    );

    this.fs.copyTpl(
      this.templatePath('server.ts'),
      this.destinationPath(parentFolder + 'src/server.ts')
    );

    this.fs.copyTpl(
      this.templatePath('userModel.ts'),
      this.destinationPath(parentFolder + 'src/models/userModel.ts')
    );

    this.fs.copyTpl(
      this.templatePath('userResolver.ts'),
      this.destinationPath(parentFolder + 'src/graphql/resolvers/userResolver.ts')
    );

    this.fs.copyTpl(
      this.templatePath('dbHandler.ts'),
      this.destinationPath(parentFolder + 'tests/dbHandler.ts')
    );
    this.fs.copyTpl(
      this.templatePath('userResolver.test.ts'),
      this.destinationPath(parentFolder + 'tests/resolvers/userResolver.test.ts')
    );
  }
};
