'use strict';

const should = require('chai').should(); // eslint-disable-line

describe('pandoc renderer', () => {
  const parseArgs = require('../lib/parseArgs.js');

  const defaultArgs = [
    '-M',
    'pagetitle=dummy',
    '-f',
    'markdown-smart',
    '-t',
    'html-smart',
    '--mathjax',
    '-M',
    'standalone=True']

  const standalone = {path:""} // simulates a standalone post
  const embedded = {} // simulates some embedded content

  it('default', () => {
    const ctx = {}
    const result = parseArgs.bind(ctx)(standalone);

    result.should.eql(defaultArgs);
  });

  it('empty args', () => {
    const ctx = {config: {pandoc: {args: []}}}
    const result = parseArgs.bind(ctx)(standalone);

    result.should.eql(['-M', 'pagetitle=dummy', "-M", "standalone=True"]);
  });

  it('empty args, embedded', () => {
    const ctx = {config: {pandoc: {args: []}}}
    const result = parseArgs.bind(ctx)(embedded);

    result.should.eql(['-M', 'pagetitle=dummy', "-M", "standalone=False"]);
  });

  it('args, template', () => {
    const ctx = {config: {pandoc: {args: ["--template=toc"]}}}
    const result = parseArgs.bind(ctx)(standalone);

    result.should.eql(['-M', 'pagetitle=dummy', "--template=toc", "-M", "standalone=True"]);
  });

  it('args, template, but embedded', () => {
    const ctx = {config: {pandoc: {args: ["--template=toc"]}}}
    const result = parseArgs.bind(ctx)(embedded);

    // template should be removed
    result.should.eql(['-M', 'pagetitle=dummy', "-M", "standalone=False"]);
  });
});