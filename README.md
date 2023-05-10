hexo-renderer-pandoc

[![npm](https://img.shields.io/npm/v/hexo-renderer-pandoc.svg)](https://www.npmjs.com/package/hexo-renderer-pandoc)
[![npm](https://img.shields.io/npm/dm/hexo-renderer-pandoc.svg)](http://github.com/hexojs/hexo-renderer-pandoc)

Yet another markdown renderer plugin for [Hexo](https://hexo.io/). It can convert [Pandoc's markdown](http://johnmacfarlane.net/pandoc/) to HTML. If you want, it can also be a renderer for [textile](http://redcloth.org/textile), [reStructedText](http://docutils.sourceforge.net/rst.html), *etc*. 

## Installation ##

1. Firstly, make sure you have [installed](http://johnmacfarlane.net/pandoc/installing.html) pandoc (version >= 2.0).
2. Secondly, `cd` into your hexo root folder and execute the following command:

``` bash
$ npm install hexo-renderer-pandoc --save
```

This will install hexo-renderer-pandoc.

## Customization ##

By default, this plugin issues command `pandoc` to invoke pandoc. If your pandoc executable is not in your search path environment variable, you can override this command through `_config.yml`.

``` yml
pandoc:
  pandoc_path: C:/Program Files/Pandoc/pandoc.exe
```

Using absolute path is recommended.

The path depends on your operating system. So even if you are using the git-bash shell on Windows, you need the Windows path like the one in the example.

You can pass arguments to pandoc through `_config.yml` as an array:

```yml
pandoc:
  args:
    - arg1
    - arg2
    - arg3
```

or in another style:

```yml
pandoc:
  args: [arg1, arg2, arg3]
```

You may need to quote each argument with quotation marks according to YAML syntax specification.
If in doubt, quote all arguments.

Note:
a Pandoc key-value arguments `--key value` need to be separated as two arguments

```yml
pandoc:
  args: [..., "-key", "value", ...]
```

A minimal working example that render HTML from markdown:

```yml
pandoc:
  args:
    - '-f'
    - 'markdown'
    - '-t'
    - 'html'
    - '--mathjax'
```

The extension automatically adds the following arguments:

```yml
['-M', 'pagetitle=dummy', <arguments you specified>, "-M", "standalone=[True|False]"] 
```

where `pagetitle` specifies a dummy title to make Pandoc happy;
the actual title is handled by Hexo.
And see the next section on Hexo Tags for the meaning of the `standalone` value.

There exists another interface
for specifying arguments prior to version v4.0.
See [here](old.md) for the old documentation on its behaviour.
The interface is preserved for backward compatibility
but will not be supported due to its lack of flexibility.

## Issues related to Hexo Tags ##_

There are issues related to Hexo tags. If you are using them, this section may be at your concern.

Here we are referring to [this sort of tags](https://hexo.io/docs/tag-plugins), not [post tags](https://hexo.io/docs/front-matter#Categories-amp-Tags)

### Mechanism of Tag Rendering ###

[This function](https://github.com/hexojs/hexo/blob/a6dc0ea28dddad1b5f1bad7c6f86f1e0627b564a/lib/hexo/post.js#L220) takes care of post rendering.

The rendering of a post takes the following steps:

1. Since Swig Tags (things like `{% %}`) are not part of legal Markdown, all Swig Tags are "escaped", i.e., extracted from the post and each replaced with a unique marker.

2. The post, now contains only legal Markdown, is rendered without any tag, by calling this plugin.

3. Tags are separately rendered as Markdown, also by calling this plugin.

4. Rendered tags are inserted back to the post, each to the position of its unique marker.

Note tags can be nested.

Issues arise as tags are rendered with separate calls to this plugin. One being when using Pandoc templates to add header/footer, we only want the template to be used if we are rendering a post.
An other similar issue is some Pandoc filters also needs to know whether they are rendering a standalone post, or just a fragment.

Since Hexo calls this plugin without telling whether it want us to render a standalone post, we attempt to figure this out ourselves. Looking at the source code of Hexo, we found that if we are rendering a post, `data` has the key `path` [](https://github.com/hexojs/hexo/blob/2ed17cd105768df379dad8bbbe4df30964fe8f2d/lib/hexo/post.js#L269), otherwise (e.g., rendering a tag), `path` is not present in `data` [](https://github.com/hexojs/hexo/blob/2ed17cd105768df379dad8bbbe4df30964fe8f2d/lib/extend/tag.js#L173) [](https://github.com/hexojs/hexo/blob/a6dc0ea28dddad1b5f1bad7c6f86f1e0627b564a/lib/plugins/tag/blockquote.js#L64). We are currently only aware of one situation when we are not rendering a standalone post, i.e., when we are rendering a tag.

### What to be Aware of when Using Tags ###

#### Templates ####

Currently templates are only applied when rendering standalone posts.
If there is any need to also apply templates (possibly a different set applied to posts) to tags, please submit an issue report to request this functionality, we'd be happy to discuss on how it should behave and implement it.

#### Footnotes ####

Due to how tags are rendered, content of each tag has its own "scope". When rendering a tag, Pandoc sees neither other tags contained in it, nor the context where it is contained. One implication of which is when using footnotes, one has to be aware of that a footnote reference and its definition has to be in the same tag. Even when one thing is in the tag nested in where the other is, is illegal.

For example, the following is illegal.

```
{% tag %}
[^1]
{% tag %}
[^1]: definition of footnote 1
{% endtag%}
{% endtag%}
```

The following is legal, as all three definitions are in different scopes.

```
{% tag %}
[^1]
{% tag %}
[^1]
[^1]: definition of footnote 1
{% endtag%}
[^1]: definition of footnote 1
{% endtag%}

{% tag %}
[^1]
[^1]: definition of footnote 1
{% endtag%}
```

#### Pandoc Filters ####

we passed the argument `-M standalone=[True|False]` to Pandoc. If a Pandoc Filter desires to know whether it is applied to a standalone post, it can check the metavariable `standalone`.

As an example, when using Panflute, this metavariable can be accessed by

``` python
doc.get_metadata("standalone", True)
```

We recommend to assume rendering standalone post when this metavariable is not set for backward compatibility.

## Credits ##

I'd like to thank [John MacFarlane](http://johnmacfarlane.net/) for creating Pandoc and [John Gruber](http://daringfireball.net/) for developing Markdown. Also, this work is based on @pvorb ([Paul Vorbach](https://github.com/pvorb/)) 's [node-pdc](https://github.com/pvorb/node-pdc) wrapper for pandoc.

Special credit for [@Ritsuka314](https://github.com/Ritsuka314) as a good maintainer for this project!
