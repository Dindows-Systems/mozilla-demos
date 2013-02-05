#!/bin/bash

DIR=$(dirname $(readlink -f $0)) # Directory script is in

cd $DIR/js

echo -n > all.js

for x in *.js; do
  [ "$x" == "all.js" ] && continue
  echo "Comrpessing $x, appending to all.js..."
  yuicompressor --type js $x >> all.js
  echo >> all.js
done
