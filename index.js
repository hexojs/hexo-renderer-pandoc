'use strict';

/* global hexo */

const pandocRenderer = require('./lib/renderer');

hexo.config.pandoc = Object.assign(
  {
    pandocPath: 'pandoc',
    timeout: 5000,
    args: []
  },
  hexo.config.pandoc
);

hexo.extend.renderer.register('md', 'html', pandocRenderer, true);
hexo.extend.renderer.register('markdown', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mkd', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mkdn', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mdwn', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mdtxt', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mdtext', 'html', pandocRenderer, true);
