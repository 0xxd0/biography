---
# An instance of the Pages widget.
# Documentation: https://wowchemy.com/docs/page-builder/
widget: pages

# This file represents a page section.
headless: true

# Activate this widget? true/false
active: true

# Order that this section appears on the page.
weight: 30

title: 近期文章
subtitle:

content:
  # Page type to display. E.g. post, talk, publication...
  page_type: post
  # Choose how many pages you would like to display (0 = all pages)
  count: 5
  # Filter on criteria
  filters:
    author: ""
    category: ""
    tag: ""
    exclude_featured: false
    exclude_future: false
    exclude_past: false
    publication_type: ""
  # Choose how many pages you would like to offset by
  offset: 0
  # Page order: descending (desc) or ascending (asc) date.
  order: desc

design:
  columns: '1'
  # Choose a view for the listings:
  #   1 = List
  #   2 = Compact
  #   3 = Card
  #   4 = Citation (publication only)
  view: 3

  # Apply a background color, gradient, or image.
  #   Uncomment (by removing `#`) an option to apply it.
  #   Choose a light or dark text color by setting `text_color_light`.
  #   Any HTML color name or Hex value is valid.

  # Background color.
  # color = "rgb(32,32,32)"

  # Background gradient.
  # gradient_start = "DeepSkyBlue"
  # gradient_end = "SkyBlue"

  # Background image.
  background:
    image: "background.png"  # Name of image in `static/media/`.
---
