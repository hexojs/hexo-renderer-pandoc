module.exports = function parseArgs(data, options) {
  // if we are rendering a post,
  // `data` has the key `path`
  // https://github.com/hexojs/hexo/blob/2ed17cd105768df379dad8bbbe4df30964fe8f2d/lib/hexo/post.js#L269
  // otherwise (e.g., rendering a tag),
  // `path` is not present in `data`.
  // https://github.com/hexojs/hexo/blob/2ed17cd105768df379dad8bbbe4df30964fe8f2d/lib/extend/tag.js#L173
  // https://github.com/hexojs/hexo/blob/a6dc0ea28dddad1b5f1bad7c6f86f1e0627b564a/lib/plugins/tag/blockquote.js#L64
  let standalone = "path" in data;

  let config = this.config?.pandoc;
  var args = ["-M", "pagetitle=dummy"];

  /* istanbul ignore else*/
  // ignore testing the old interface
  if (config?.args) {
    args = args.concat(config.args);

    // if rendering embedded content
    if (!standalone) {
      // remove template, which only apply to standalong posts
      let templateIdx = args.findIndex((item) =>
        item.startsWith("--template=")
      );
      if (templateIdx > -1) {
        args.splice(templateIdx, 1);
      }
    }
  } else {
    args = args.concat([
      "-f",
      "markdown-smart",
      "-t",
      "html-smart",
      "--mathjax",
    ]);
  }

  // are we rendering a standalone post?
  if (standalone) {
    // do not apply `--standalone`,
    // header/footer are to be added by Hexo

    // also set a metavariable to let concerned
    // pandoc filters know
    args.push(...["-M", "standalone=True"]);
  }
  // or some thing to be embedded in a post,
  // like tags?
  else {
    args.push(...["-M", "standalone=False"]);
  }

  return args;
};
