'use strict';

const { spawnSync } = require('node:child_process');
const parseArgs = require('./parseArgs.js');

function pandocRenderer(data, options) {
  const hexo = this;
  const { pandoc: pandocConfig } = hexo.config;

  const standalone = 'path' in data;
  const args = parseArgs(pandocConfig, standalone);

  const cp = spawnSync(pandocConfig.pandocPath, args, {
    cwd: process.cwd(),
    env: process.env,
    input: data.text.toString(),
    encoding: 'utf8',
    timeout: pandocConfig.timeout
  });

  if (cp.status === 0) {
    if (cp.stderr) {
      const warn_msg
        = ''
        + '[WARNING][hexo-renderer-pandoc] On '
        + data.path
        + '\n'
        + '[WARNING][hexo-renderer-pandoc] '
        + cp.stderr;
      console.warn(warn_msg);
    }
    return cp.stdout;
  }
  if (cp.error) {
    console.error(`${cp.error}`);
    throw cp.error;
  }
  const error_msg
    = '\n'
    + '[ERROR][hexo-renderer-pandoc] On '
    + data.path
    + '\n'
    + '[ERROR][hexo-renderer-pandoc] pandoc exited with code '
    + cp.status
    + (cp.stderr ? ': ' + cp.stderr : '.');
  console.error(error_msg);
  throw Error(error_msg);
}

module.exports = pandocRenderer;
