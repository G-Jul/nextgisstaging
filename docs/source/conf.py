# Configuration file for the Sphinx documentation builder.

import os
import sys
import time

# -- Project information
project = u'NextGIS'
copyright = u'2011-{}, NextGIS'.format(date.today().year)
author = u'Команда NextGIS'

release = '0.1'
version = '0.1.0'

# -- General configuration

extensions = [
    'sphinx.ext.duration',
    'sphinx.ext.doctest',
    'sphinx.ext.autodoc',
    'sphinx.ext.autosummary',
    'sphinx.ext.intersphinx',
]

intersphinx_mapping = {
    'python': ('https://docs.python.org/3/', None),
    'sphinx': ('https://www.sphinx-doc.org/en/master/', None),
}
intersphinx_disabled_domains = ['std']

templates_path = ['_templates']
html_additional_pages = {"index": "index.html"}
html_static_path = ['_static']

# -- Options for HTML output

html_theme = 'sphinx_rtd_theme'

html_css_files = [
    'css/custom.css',
    'css/homepage.css',
]

html_js_files = [
    'css/custom.js',
]

html_theme_options = {
    'collapse_navigation': False,
    'sticky_navigation': True,
    'navigation_depth': 4,
    'includehidden': True,
    'titles_only': False
}

numfig = True

numfig_format = {
    'figure': u'Рис. %s.', 
    'table': u'Таблица %s.', 
    'code-block': u'Listing %s.'}

illufig_format = {'illustrate': u'Рис. %s (%s).'}


# Передаем время сборки в шаблоны для cache busting
html_context = {
    'build_time': int(time.time())
}

# -- Options for EPUB output
epub_show_urls = 'footnote'
