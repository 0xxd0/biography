#!/usr/bin/env bash

# Hugo Updater
# Checks for available updates and then asks to install any updates.
#
# Command: bash ./update.sh

# Check for prerequisites.
if [ ! -d content ]; then
  echo "ERROR: `cd` into your website folder before running this tool."
  exit 1;
fi

# Update Hugo module
function update_hugo_mod() {
  # Update Wowchemy to the latest master version
  echo -e "Updating Wowchemy to the latest master version...\n"
  hugo mod get github.com/wowchemy/wowchemy-hugo-modules/wowchemy/@master
  hugo mod tidy
}

# Update Netlify config
function update_cms() {
  # - Update Netlify.toml with required Hugo version
  if [ -f ./netlify.toml ]; then
    curl -o "tmp_get_version" https://raw.githubusercontent.com/wowchemy/wowchemy-hugo-modules/master/wowchemy/config.yaml
    version=$(sed -n 's/^[[:space:]]*min: //p' "tmp_get_version" | tr -d "'")
    version="${version}"
    echo "Set Netlify Hugo version to v${version}"
    sed -i.bak -e "s/HUGO_VERSION = .*/HUGO_VERSION = \"$version\"/g" ./netlify.toml && rm -f ./netlify.toml.bak
    rm tmp_get_version
  fi
}

# Perform update
update_hugo_mod
update_cms

echo
echo "If there are breaking changes, the site structure, config, and/or front matter of content" \
"may need upgrading by following the steps in the relevant consecutive release notes."
echo
echo "View the wowchemy update guide at: https://wowchemy.com/docs/update/"
echo "View the latest wowchemy release notes at: https://wowchemy.com/updates/"
