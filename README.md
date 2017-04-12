# Scrapy Brush

[Scrapy](https://scrapy.org/) Brush provides an easy way to create simple web scrappers visually, right in browser.
It consists of two parts, an extension for Chrome Browser and an extension for Scrapy CLI.

The core concept in Scrapy Brush is content schema. It contains selectors and extraction rules for all useful data for specific type of site's pages.

To create content schema in easy way, one should use Schema Generator, a Chrome plugin which adds a minimalistic interface for visual schema edition.

When schema is ready, one should use a `scrapy brush` command to convert schema to usual Scrapy spider. After conversion, spider could be edited manually or used in pipeline (recommended).
