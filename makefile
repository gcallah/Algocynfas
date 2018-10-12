# Need to export as ENV var
export TEMPLATE_DIR = templates
PTML_DIR = html_src
UTILS_DIR = utils

INCS = $(TEMPLATE_DIR)/head.txt

HTMLFILES = $(shell ls $(PTML_DIR)/*.ptml | sed -e 's/.ptml/.html/' | sed -e 's/html_src\///')

%.html: $(PTML_DIR)/%.ptml $(INCS)
	python3 $(UTILS_DIR)/html_checker.py $< 
	$(UTILS_DIR)/html_include.awk <$< >$@
	git add $@

website: $(INCS) $(HTMLFILES)
# run tests here!
	-git commit -a 
	git pull origin master
	git push origin master

local: $(HTMLFILES)

clean:
	touch $(PTML_DIR)/*.ptml; make local

