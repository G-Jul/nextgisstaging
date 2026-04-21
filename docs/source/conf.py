# Configuration file for the Sphinx documentation builder.

import time
from datetime import date

import os
from sphinx.locale import get_translation

language = "ru"

catalog = "messages"
_ = get_translation(catalog)


def setup(app):
    locale_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), "locale")
    app.add_message_catalog(catalog, locale_dir)


# -- Project information
project = "NextGIS"
copyright = "2011-{}, NextGIS".format(date.today().year)
author = str(_("NextGIS team"))

release = "0.1"
version = "0.1.0"

# -- General configuration

extensions = [
    "sphinx.ext.duration",
    "sphinx.ext.doctest",
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.intersphinx",
]

intersphinx_mapping = {
    "python": ("https://docs.python.org/3/", None),
    "sphinx": ("https://www.sphinx-doc.org/en/master/", None),
}
intersphinx_disabled_domains = ["std"]

templates_path = ["_templates"]
locale_dirs = ["locale/"]

html_static_path = ["_static"]

# -- Options for HTML output

html_theme = "pydata_sphinx_theme"


html_css_files = [
    "dist/app.css",
]

html_js_files = [
    "dist/app.js",
]


html_theme_options = {
    "search_bar_text": _("Search the docs..."),
    "logo": {
        "image_light": "_static/icons/logo.svg",
        "image_dark": "_static/icons/small_logo_white.png",
        "text": _("NextGIS Documentation"),
        "alt_text": _("NextGIS Documentation - Home"),
    },
    "header_links_before_dropdown": 0,
    "navbar_start": ["navbar-logo"],
    "navbar_center": ["navbar-nav"],
    "navbar_persistent": ["search-field.html"],
    "navbar_end": ["theme-switcher", "login.html"],
    "navigation_depth": 4,
    "show_nav_level": 4,
    "navbar_align": "left",
    "show_prev_next": False,
    "secondary_sidebar_items": {
        "**": ["page-toc"],
        "index": [],
    },
    "footer_start": [],
    "footer_center": [],
    "footer_end": [],
}


html_context = {
    "build_time": int(time.time()),
    "default_mode": "light",
}


numfig = True

numfig_format = {
    "figure": _("Fig. %s."),
    "table": _("Table %s."),
    "code-block": _("Listing %s."),
}

illufig_format = {"illustrate": _("Fig. %s (%s).")}


# Передаем время сборки в шаблоны для cache busting
html_context["build_time"] = int(time.time())

# -- Options for EPUB output
epub_show_urls = "footnote"
