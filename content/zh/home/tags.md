---
# An instance of the Tag Cloud widget.
# Docs: https://wowchemy.com/docs/page-builder/
widget: tag_cloud

# This file represents a page section.
headless: true

# Activate this widget? true/false
active: true

# Order that this section appears on the page.
weight: 120

title: 标签云
subtitle: ''

content:
# Choose the taxonomy from `config.toml` to display (e.g. tags, categories)
  taxonomy: tags
  # Choose how many tags you would like to display (0 = all tags)
  count: 30

design:
  # Minimum and maximum font sizes (1.0 = 100%).
  font_size_min: 0.95
  font_size_max: 2.25

  columns: '1'
  background:
    image: "background.png"  # Name of image in `static/media/`.
---
