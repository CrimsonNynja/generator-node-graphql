const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-node-graphql:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        projectName: 'test',
        database: 'noSQL',
        defaultDB: true,
        auth: 'JWT',
        secretKey: 'hwWxD5cB6LtaCB0GOcbaxiOI2eaFoC4rIT9jh51DCdB6p9IZrHTMRuFUM72xIjm',
        packageManager: 'npm',
        type: 'typescript',
      });
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.env',
      '.gitignore',
      '.eslintrc.json',
      'tsconfig.json',
      'README.md',
      'src/server.ts',
      'src/models/userModel.ts',
      'src/graphql/schemas/user.graphql',
      'src/graphql/resolvers/userResolver.ts',
      'tests/dbHandler.ts',
      'tests/resolvers/userResolver.test.ts',
    ]);
  });
});

describe('generator-node-graphql:app commandLine', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withArguments(['testDir'])
      .withPrompts({
        projectName: 'test',
        database: 'noSQL',
        defaultDB: true,
        auth: 'JWT',
        secretKey: 'hwWxD5cB6LtaCB0GOcbaxiOI2eaFoC4rIT9jh51DCdB6p9IZrHTMRuFUM72xIjm',
        packageManager: 'npm',
        type: 'typescript',
      });
  });

  it('creates files in the given directory', () => {
    assert.file([
      'package.json',
      '.env',
      '.gitignore',
      '.eslintrc.json',
      'tsconfig.json',
      'README.md',
      'src/server.ts',
      'src/models/userModel.ts',
      'src/graphql/schemas/user.graphql',
      'src/graphql/resolvers/userResolver.ts',
      'tests/dbHandler.ts',
      'tests/resolvers/userResolver.test.ts',
    ]);
  });
});

describe('generator-node-graphql:app commandLine defaults', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withOptions({ default: true });
  });

  it('creates files in the given directory', () => {
    assert.file([
      'package.json',
      '.env',
      '.gitignore',
      '.eslintrc.json',
      'tsconfig.json',
      'README.md',
      'src/server.ts',
      'src/models/userModel.ts',
      'src/graphql/schemas/user.graphql',
      'src/graphql/resolvers/userResolver.ts',
      'tests/dbHandler.ts',
      'tests/resolvers/userResolver.test.ts',
    ]);
  });
});

describe('generator-node-graphql:app javascript', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withArguments(['testDir'])
      .withPrompts({
        projectName: 'test',
        database: 'noSQL',
        defaultDB: true,
        auth: 'JWT',
        secretKey: 'hwWxD5cB6LtaCB0GOcbaxiOI2eaFoC4rIT9jh51DCdB6p9IZrHTMRuFUM72xIjm',
        packageManager: 'npm',
        type: 'javascript',
      });
  });

  it('creates files in the given directory', () => {
    assert.file([
      'package.json',
      '.env',
      '.gitignore',
      '.eslintrc.json',
      'README.md',
      'src/server.js',
      'src/models/userModel.js',
      'src/graphql/schemas/user.graphql',
      'src/graphql/resolvers/userResolver.js',
      'tests/dbHandler.js',
      'tests/resolvers/userResolver.test.js',
    ]);
  });
});
