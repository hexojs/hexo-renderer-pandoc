'use strict';

module.exports = function parseArgs(pandocConfig, standalone) {
  // if we are rendering a post,
  // `data` has the key `path`
  // https://github.com/hexojs/hexo/blob/2ed17cd105768df379dad8bbbe4df30964fe8f2d/lib/hexo/post.js#L269
  // otherwise (e.g., rendering a tag),
  // `path` is not present in `data`.
  // https://github.com/hexojs/hexo/blob/2ed17cd105768df379dad8bbbe4df30964fe8f2d/lib/extend/tag.js#L173
  // https://github.com/hexojs/hexo/blob/a6dc0ea28dddad1b5f1bad7c6f86f1e0627b564a/lib/plugins/tag/blockquote.js#L64

  const defaultArgs = ['-M', 'pagetitle=dummy'];
  const input = pandocConfig.args;
  let args = [];
  if (typeof input === 'string') {
    args = defaultArgs.concat(input.split(' '));
  } else if (Array.isArray(input)) {
    args = defaultArgs.concat(input);
  }
  args = args.filter(el => {
    return el.length > 0;
  });

  // if rendering embedded content
  if (!standalone) {
    // remove template, which only apply to standalone posts
    const templateIdx = args.findIndex(item =>
      item.startsWith('--template=')
    );
    if (templateIdx > -1) {
      args.splice(templateIdx, 1);
    }
  }

  // are we rendering a standalone post?
  if (standalone) {
    // do not apply `--standalone`,
    // header/footer are to be added by Hexo

    // also set a metavariable to let concerned
    // pandoc filters know
    args.push(...['-M', 'standalone=True']);
  } else {
    // or some thing to be embedded in a post,
    // like tags?
    args.push(...['-M', 'standalone=False']);
  }

  return args;
};
