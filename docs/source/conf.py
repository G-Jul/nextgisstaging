# Configuration file for the Sphinx documentation builder.

# -- Project information

project = 'NextGIS'
copyright = ''
author = ''

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

html_additional_pages = {"index": "index_modified.html"}

# -- Options for HTML output

html_theme = 'furo'

html_theme_options = {
    "light_css_variables": {
        "color-brand-primary": "#0c65af",
        "color-brand-content": "#7C4DFF",
        "color-header-background": "#0c65af",
        "color-header-text": "#FFFFFF",
        "color-sidebar-background": "#bcd3e6",
        "color-sidebar-brand-text": "#0c65af",
    },
}

# -- Options for EPUB output
epub_show_urls = 'footnote'
