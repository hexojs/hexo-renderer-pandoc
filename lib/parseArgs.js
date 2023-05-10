module.exports = function parseArgs(data,options) {
  // if we are rendering a post,
  // `data` has the key `path`
  // https://github.com/hexojs/hexo/blob/2ed17cd105768df379dad8bbbe4df30964fe8f2d/lib/hexo/post.js#L269
  // otherwise (e.g., rendering a tag),
  // `path` is not present in `data`.
  // https://github.com/hexojs/hexo/blob/2ed17cd105768df379dad8bbbe4df30964fe8f2d/lib/extend/tag.js#L173
  // https://github.com/hexojs/hexo/blob/a6dc0ea28dddad1b5f1bad7c6f86f1e0627b564a/lib/plugins/tag/blockquote.js#L64
  let standalone = "path" in data;

  let config = this.config?.pandoc;
  var args = ['-M', 'pagetitle=dummy'];

  /* istanbul ignore else*/
  // ignore testing the old interface
  if (config?.args) {
    args = args.concat(config.args);

    // if rendering embedded content
    if (!standalone) {
      // remove template, which only apply to standalong posts
      let templateIdx = args.findIndex(item => item.startsWith("--template="));
      if (templateIdx > -1) {
        args.splice(templateIdx, 1)
      }
    }

  } else {
    // old yaml dictionary interface for argument specification
    // deprecating due to #54
    // i.e., will keep the code for backward compatibility
    // but will not provide support in the future

    var extensions = '', filters = [], extra = [];
    // To satisfy pandoc's requirement that html5 must have a title.
    // Since the markdown file is only rendered as body part,
    // the title is never used and thus does not matter
    var meta = [];
    var math = '--mathjax';

    if(config) {
      if(config.extensions) {
        config.extensions.forEach(function(extension) {
          extensions += extension;
        });
      }

      if(config.filters) {
        config.filters.forEach(function(filter) {
          filters.push('--filter');
          filters.push(filter);
        });
      }

      if(config.extra) {
        for(var e in config.extra) {
          var eoption = config.extra[e];
          for (var key in eoption){
            extra.push('--' + key);
            if(eoption[key]!=null) {
              extra.push(eoption[key]);
            }
          }
        }
      }

      if(config.meta) {
        config.meta.forEach(function(m) {
          meta.push('-M');
          if(m.length) {
            meta.push(m);
          } else {
            for(var m2 in m) {
              meta.push(m2 + '=' + m[m2]);
            }
          }
        });
      }

      if(config.mathEngine) {
        if(typeof config.mathEngine === 'string') {
          math = '--' + config.mathEngine;
        }
      }
    }

    args = args
      .concat([ '-f', 'markdown-smart'+extensions, '-t', 'html-smart', math])
      .concat(filters)
      .concat(extra)
      .concat(meta);

    // only apply template when rendering post, not tags
    if (standalone && config && config.template) {
      args.push("--template=" + config.template);
    }
  }

  // are we rendering a standalone post?
  if(standalone) {
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
}