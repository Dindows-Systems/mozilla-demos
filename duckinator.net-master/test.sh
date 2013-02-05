#!/usr/bin/env bash

function fail() {
  echo
  echo "[FAIL] $@"
  exit 1
}

./_minify-css.sh && jekyll && cd _site && python3 -m http.server && cd ..
