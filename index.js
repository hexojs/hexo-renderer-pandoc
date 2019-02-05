var spawn = require('child_process').spawn;

var pandocRenderer = function(data, options, callback){
  var config = hexo.config.pandoc;
  var extensions = '', filters = [], extra = [], meta = [], math = '--mathjax';

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

  var args = [ '-f', 'markdown-smart'+extensions, '-t', 'html-smart', math]
  .concat(filters)
  .concat(extra)
  .concat(meta);
	
  if(config && config.template) args.push("--template=" + config.template);

	var src = data.text.toString();

	var pandoc = spawn('pandoc', args);

	var result = '';
	var error = '';

	pandoc.stdout.setEncoding('utf8');

	pandoc.stdout.on('data', function (data) {
		result += data.toString();
	});

	pandoc.stderr.on('data', function (data) {
		error += data.toString();
	});

	pandoc.stdin.write(src, 'utf8');

	pandoc.on('close', function (code, signal) {
		var msg = '';
		if (code !== 0)
			msg += 'pandoc exited with code '+code+(error ? ': ' : '.');
		// remove these two harmless warning messages
		// to prevent program from crashing
		error = error.replace(
			"[WARNING] This document format requires a nonempty <title> element.\r\n  Please specify either 'title' or 'pagetitle' in the metadata.\r\n  Falling back to 'Untitled'\r\n"
		,'');
		error = error.replace(
			"[WARNING] This document format requires a nonempty <title> element.\r\n  Please specify either 'title' or 'pagetitle' in the metadata,\r\n  e.g. by using --metadata pagetitle=\"...\" on the command line.\r\n  Falling back to 'Untitled'\r\n"
		,'')
		if (error)
			msg += error;
		if (msg)
			return callback(new Error(msg));
		else{
			if (result === '') console.log("The next file error: ");
			callback(null, result);
		}
	});

    pandoc.stdin.end();

}

// uncomment this if using nunjucks 
// pandocRenderer.disableNunjucks = true;

hexo.extend.renderer.register('md', 'html', pandocRenderer);
hexo.extend.renderer.register('markdown', 'html', pandocRenderer);
hexo.extend.renderer.register('mkd', 'html', pandocRenderer);
hexo.extend.renderer.register('mkdn', 'html', pandocRenderer);
hexo.extend.renderer.register('mdwn', 'html', pandocRenderer);
hexo.extend.renderer.register('mdtxt', 'html', pandocRenderer);
hexo.extend.renderer.register('mdtext', 'html', pandocRenderer);
