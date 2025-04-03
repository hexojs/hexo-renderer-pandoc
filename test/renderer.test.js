'use strict';

const { should } = require('chai');
should();

const stripEOL = str => {
  return str.replace(/\r\n/gi, '\n').replace(/\r/gi, '\n');
};

const defaultPandocConfig = {
  pandocPath: 'pandoc',
  timeout: 10000,
  args: ['-M', 'pagetitle=dummy', '-M', 'standalone=True']
};

describe('renderer', () => {
  const pandocRenderer = require('../lib/renderer');

  let pandocConfig, config, ctx, data, options;

  beforeEach(() => {
    pandocConfig = Object.assign({}, defaultPandocConfig);
    config = { pandoc: pandocConfig };
    ctx = { config };
  });

  it('default', () => {
    data = { path: 'foo', text: '# test' };
    const res = stripEOL(pandocRenderer.bind(ctx)(data, options));
    res.should.eql('<h1 id="test">test</h1>\n');
  });
  it('default - error', () => {
    data = { path: 'error', text: '' };
    ctx.config.pandoc.pandocPath = 'wrongPandocpath';
    try {
      pandocRenderer.bind(ctx)(data, options);
    } catch (error) {
    }
  });
  it('default - stdwarn', () => {
    data = { path: 'stdwarn', text: '---\nlang: zfash\n---\n# test' };
    const res = stripEOL(pandocRenderer.bind(ctx)(data, options));
    res.should.eql('<h1 id="test">test</h1>\n');
  });
  it('default - stderror', () => {
    data = { path: 'stderror', text: '# test' };
    ctx.config.pandoc.args = ['--forgaefmat', 'wrongfsafaForgmat'];
    try {
      pandocRenderer.bind(ctx)(data, options);
    } catch (error) {
    }
  });
});
