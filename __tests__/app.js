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
      });
  });

  it('creates files', () => {
    assert.file([
      '.env',
      '.gitignore',
      '.eslintrc.json',
      'tsconfig.json',
      'src/server.ts',
      'src/models/userModel.ts',
      'src/graphql/schemas/user.graphql',
      'src/graphql/resolvers/userResolver.ts',
      'tests/dbHandler.ts',
      'tests/resolvers/userResolver.test.ts',
    ]);
  });
});
