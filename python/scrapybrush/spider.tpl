import scrapy
from datetime import datetime


class {{ projectId }}Spider(scrapy.Spider):
    name = "{{ projectId }}"

    def parse(self, response):
        raise NotImplementedError

{% for page in pages %}
    def parse_{{ page.typeId }}(self, response):
        for element in response.css("{{ page.objectSelector if page.objectSelector|length > 0 else "body" }}"):
            item = {
                "url": response.url,
                "timestamp": int(datetime.now().timestamp()),
                "page_type": "{{ page.typeId }}"
            }
{% for field in page.fields %}
            {{ field.name }} = element.css("""{{ field.selector }}""")
            {% if field.kind == "text" %}{{ field.name }} = {{ field.name }}.xpath("normalize-space(.)"){% elif field.kind == "attr" %}{{ field.name }} = {{ field.name }}.css("""::attr({{ field.attribute }})"""){% endif %}
            {% if field.multiple %}{{ field.name }} = {{ field.name }}.extract(){% else %}{{ field.name }} = {{ field.name }}.extract_first(){% endif %}
            item["{{ field.name }}"] = {{ field.name }}
{% endfor %}
            yield item
{% for url in page.urls %}
        urls = response.css("{{ url.selector }}")
        {% if url.kind == "text" %}urls = urls.xpath("normalize-space(.)"){% elif url.kind == "attr" %}urls = urls.css("""::attr({{ url.attribute }})"""){% endif %}
        urls = urls.extract()
        for url in urls:
            yield scrapy.Request(response.urljoin(url), self.parse_{{ url.typeId }})
{% endfor %}{% endfor %}

    def start_requests(self):
{% for page in pages %}
{% for startUrl in page.startUrls %}{% if startUrl|length > 0 %}        yield scrapy.Request(callback=self.parse_{{ page.typeId }}, url="{{ startUrl }}")
{% endif %}{% endfor %}{% endfor %}
