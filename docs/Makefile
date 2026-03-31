# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = source
BUILDDIR      = build

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)


translations:
	pybabel compile --directory=$(SOURCEDIR)/locale --domain=messages
	pybabel compile --directory=$(SOURCEDIR)/locale --domain=sphinx

init:
	pip install -r requirements.txt
	npm install

assets:
	npm run build:assets

html: translations assets
	$(SPHINXBUILD) -b html "$(SOURCEDIR)" "$(BUILDDIR)"

dev-assets:
	npm run dev

clean:
	npm run clean

.PHONY: help Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
