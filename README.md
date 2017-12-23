hexo-renderer-pandoc

[![npm](https://img.shields.io/npm/v/hexo-renderer-pandoc.svg)](https://www.npmjs.com/package/hexo-renderer-pandoc)
[![npm](https://img.shields.io/npm/dm/hexo-renderer-pandoc.svg)](http://github.com/wzpan/hexo-renderer-pandoc)

Yet another markdown renderer plugin for [Hexo](http://zespia.tw/hexo). It can converts [Pandoc's markdown](http://johnmacfarlane.net/pandoc/) to HTML. If you want, it can also be a renderer for [textile](http://redcloth.org/textile), [reStructedText](http://docutils.sourceforge.net/rst.html), *etc*. 

## Installation ##

1. Firstly, make sure you have [installed](http://johnmacfarlane.net/pandoc/installing.html) pandoc.
2. Secondly, `cd` into your hexo root folder and execute the following command:

``` bash
$ npm install hexo-renderer-pandoc --save
```

This will install hexo-renderer-pandoc.

## Customization ##

hexo-renderer-pandoc can not only render markdown, but also supports textile, reStructedText and many other formats, due to the strong capability of pandoc.

By default, it only renders Pandoc-markdown. But if you want to make it be a textile renderer instead of a markdown renderer, simply modify the args from the index.js as:

``` javascript
var args = [ '-f', 'textile', '-t', 'html', '--mathjax', '--smart'];
```

and change the register line as:

``` javascript
hexo.extend.renderer.register('textile', 'html', pandoc);
```

You can pass additional arguments to pandoc through `_config.yml`. The default configuration is:

```yml
pandoc:
  filters:
  extra:
  template:
  meta:
  mathEngine:
```

* `filters` is a list of any pandoc filter installed on your path.
* `extra` is a list of mappings:

```yml
extra:
  - key: value
```
passed to pandoc as `--key value`.

* `template` is a template file you wish to use when pandoc generates your posts:

``` yml
template: dir/.../template.html
```

will be passed to pandoc as `--template=dir/../template.html`

The path of the template should be relative to the root of your blog.

For example, the very simple template

``` html
$if(toc)$
<div id="$idprefix$TOC">
$toc$
</div>
$endif$
$body$
```

prepends table of contents to all your posts if variable `--toc` is also passed. To enable TOC, add to your `_config.yml`:

``` yml
pandoc:
  # other options
  extra:
    - toc: # will be passed as `--toc`. Note the colon
  template: dir/../template.html
```

* `meta` is a list of anything you wish to be sent to pandoc as meta:

```yml
meta:
  - key: value1
  - value2
```
would be passed as `-M key=value1 -M value2`.

`pandoc-citeproc` for example can be configured as:

```yml
pandoc:
  filters:
    - pandoc-citeproc
  extra:
    bibliography: "/path/to/bibfile.bib"
  meta:
    - suppress-bibliography
```

* `mathEngine` is an option for choosing math engine. By default, mathEngine is mathjax.

For example, if you want to use KaTeX, you can pass `katex` to the mathEngine option:

```
pandoc:
  mathEngine: katex
```

Then, the args of pandoc is this: `[..., "--katex", ...]` .

## Credits ##

I'd like to thank [John MacFarlane](http://johnmacfarlane.net/) for creating Pandoc and [John Gruber](http://daringfireball.net/) for developing Markdown. Also, this work is based on @pvorb ([Paul Vorbach](https://github.com/pvorb/)) 's [node-pdc](https://github.com/pvorb/node-pdc) wrapper for pandoc.


