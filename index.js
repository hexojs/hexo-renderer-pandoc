let spawnSync = require('child_process').spawnSync;
let parseArgs = require('./lib/parseArgs.js');

function pandocRenderer(data, options){
  var pandoc_path = 'pandoc';
  if(hexo?.config?.pandoc?.pandoc_path) {
    pandoc_path = hexo.config.pandoc.pandoc_path;
  }

  let args = parseArgs.bind(hexo)(data,options);

  let src = data.text.toString();

  let res = spawnSync(pandoc_path, args, {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf8",
    input: src
  });

  if (res.status === 0) {
    if (res.stderr) {
      let warn_msg = ''
        + '[WARNING][hexo-renderer-pandoc] On ' + data.path + '\n'
        + '[WARNING][hexo-renderer-pandoc] ' + res.stderr;
      console.log(warn_msg);
    }

    return res.stdout;
  } else {
    let error_msg = '\n'
      + '[ERROR][hexo-renderer-pandoc] On ' + data.path + '\n'
      + '[ERROR][hexo-renderer-pandoc] pandoc exited with code '+res.status+(res.stderr ? ': ' + res.stderr : '.');
    console.log(error_msg);
    throw Error(error_msg);
  }
}

hexo.extend.renderer.register('md', 'html', pandocRenderer, true);
hexo.extend.renderer.register('markdown', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mkd', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mkdn', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mdwn', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mdtxt', 'html', pandocRenderer, true);
hexo.extend.renderer.register('mdtext', 'html', pandocRenderer, true);
