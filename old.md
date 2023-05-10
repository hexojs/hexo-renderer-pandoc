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
    - bibliography: "/path/to/bibfile.bib"
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