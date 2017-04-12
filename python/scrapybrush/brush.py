import json
from os.path import join, dirname, abspath

from importlib import import_module
from jinja2 import Environment, PackageLoader
from scrapy.commands import ScrapyCommand
from scrapy.commands.genspider import sanitize_module_name
from scrapy.exceptions import UsageError

__all__ = ['BrushCommand']


class BrushCommand(ScrapyCommand):
    def syntax(self):
        return "-n project_name -p pageSchema1 [-p pageSchema2 ...] [-f]"

    def short_desc(self):
        return "ScrapyBrush: generate spider code from page schemas"

    def add_options(self, parser):
        super().add_options(parser)
        parser.add_option("-n", "--name", dest="name", help="Name for new spider")
        parser.add_option("-p", "--page", dest="pages", action="append", help="Add one more page schema to spider")
        parser.add_option("-f", "--force", dest="force", action="store_true", help="Overwrite spider if it already exists")

    def run(self, args, opts):
        spider_name = opts.name
        if not spider_name:
            raise UsageError("Name argument is required")

        pages = []
        for file_name in opts.pages:
            with open(file_name) as f:
                pages.append(json.load(f))

        env = Environment(loader=PackageLoader('scrapybrush', '.'))
        template = env.get_template('spider.tpl')
        out = template.render(projectId = spider_name, pages = pages)

        with open(self._spider_file(spider_name, opts.force), 'w') as f:
            f.write(out)

    def _spider_file(self, spider_name, force):
        module_name = sanitize_module_name(spider_name)
        try:
            spidercls = self.crawler_process.spider_loader.load(spider_name)
        except KeyError:
            pass
        else:
            if not force:
                raise UsageError("Spider %r already exists in module [%s]" % (spider_name, spidercls.__module__))

        if self.settings.get('NEWSPIDER_MODULE'):
            spiders_module = import_module(self.settings['NEWSPIDER_MODULE'])
            spiders_dir = abspath(dirname(spiders_module.__file__))
        else:
            spiders_dir = "."
        spider_file = "%s.py" % join(spiders_dir, module_name)
        return spider_file
