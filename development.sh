#!/usr/bin/env bash
hugo server --disableFastRender \
            --environment "development" \
            --buildDrafts \
            --debug \
            --verbose \
            --i18n-warnings
