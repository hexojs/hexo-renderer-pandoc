'use strict';

const { exec } = require('node:child_process');

const platform = process.env.runner_os;
let cmdStr = '';

const installPandoc = cmdStr => {
  exec(
    cmdStr.trim(),
    {
      cwd: process.cwd(),
      env: process.env,
      encoding: 'utf8',
      timeout: 300000
    },
    (error, stdout, stderr) => {
      console.log(`install stdout: ${stdout}`);
      console.error(`install stderr: ${stderr}`);
      if (error) {
        console.error(`install error: ${error}`);
        throw Error(`install error: ${error}`);
      }
    }
  );
};

switch (String(platform).trim().toLowerCase()) {
  case 'linux':
    console.info(`Install pandoc for ${platform}`);
    cmdStr = 'sudo apt install pandoc -y';
    installPandoc(cmdStr);
    break;
  case 'windows':
    console.info(`Install pandoc for ${platform}`);
    cmdStr
      = 'choco install  -y --no-progress --timeout 270 pandoc';
    installPandoc(cmdStr);
    break;
  case 'macos':
    console.info(`Install pandoc for ${platform}`);
    cmdStr = 'brew install pandoc';
    installPandoc(cmdStr);
    break;
  default:
    console.error(`Unsupport platform: ${platform}`);
    throw Error(`Unsupport platform: ${platform}`);
}
