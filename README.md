hexo-renderer-pandoc

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
  meta:
```

`filters` is a list of any pandoc filter installed on your path.
`extra` is a list of mappings:

```yml
extra:
  - key: value
```
passed to pandoc as `--key value`.

`meta` is a list of anything you wish to be sent to pandoc as meta:

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

## Credits ##

I'd like to thank [John MacFarlane](http://johnmacfarlane.net/) for creating Pandoc and [John Gruber](http://daringfireball.net/) for developing Markdown. Also, this work is based on @pvorb ([Paul Vorbach](https://github.com/pvorb/)) 's [node-pdc](https://github.com/pvorb/node-pdc) wrapper for pandoc.
