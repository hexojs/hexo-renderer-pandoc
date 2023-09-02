'use strict';

const { should } = require("chai"); // eslint-disable-line
should();

const isStandlone = data => {
  return 'path' in data;
};

describe('parseArgs', () => {
  const parseArgs = require('../lib/parseArgs.js');

  const defaultArgs = ['-M', 'pagetitle=dummy', '-M', 'standalone=True'];

  const standalone = { path: '' }; // simulates a standalone post
  const embedded = {}; // simulates some embedded content
  let pandocConfig = {};

  beforeEach(() => {
    pandocConfig = {
      pandocPath: 'pandoc',
      timeout: 1000,
      args: []
    };
  });

  it('default', () => {
    const result = parseArgs(pandocConfig, isStandlone(standalone));

    result.should.eql(defaultArgs);
  });

  it('string args', () => {
    pandocConfig = { args: '-f markdown -t html' };
    const result = parseArgs(pandocConfig, isStandlone(standalone));

    result.should.eql([
      '-M',
      'pagetitle=dummy',
      '-f',
      'markdown',
      '-t',
      'html',
      '-M',
      'standalone=True'
    ]);
  });

  it('empty args', () => {
    pandocConfig = { args: [] };
    const result = parseArgs(pandocConfig, isStandlone(standalone));

    result.should.eql(['-M', 'pagetitle=dummy', '-M', 'standalone=True']);
  });

  it('empty args, embedded', () => {
    pandocConfig = { args: [] };
    const result = parseArgs(pandocConfig, isStandlone(embedded));

    result.should.eql(['-M', 'pagetitle=dummy', '-M', 'standalone=False']);
  });

  it('args, template', () => {
    pandocConfig = { args: ['--template=toc'] };
    const result = parseArgs(pandocConfig, isStandlone(standalone));

    result.should.eql([
      '-M',
      'pagetitle=dummy',
      '--template=toc',
      '-M',
      'standalone=True'
    ]);
  });

  it('args, template, but embedded', () => {
    pandocConfig = { args: ['--template=toc'] };
    const result = parseArgs(pandocConfig, isStandlone(embedded));

    // template should be removed
    result.should.eql(['-M', 'pagetitle=dummy', '-M', 'standalone=False']);
  });
});
