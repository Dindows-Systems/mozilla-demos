#!/bin/bash

DIR=$(dirname $(readlink -f $0)) # Directory script is in

cd $DIR/css

echo -n > all.min.css

ORIGINAL_FILES=$(cat ../_includes/main.html | grep -E '<link rel="stylesheet"' | sed 's/.*<link .* href="\/css\/\(.*\)">.*/\1/' | grep -v 'all.min.css' | xargs echo)
TEMP_FILES=$(echo $ORIGINAL_FILES | sed 's/.css/.css.tmp/g')

#for x in {normalize,main}.css; do
echo "Minifying files."
for x in $ORIGINAL_FILES; do
  echo "  $x"
  cat $x > $x.tmp

  # Loop over everything 2 times.
  # Should probably have it just do this until it doesn't change...
  for ((i=0;i<2;i++)); do

    # Remove all tabs and leading whitespace.
    sed -i    's/\t\|^[\t ]*//g'             $x.tmp

    # Remove whitespace around colons and brackets.
    sed -i    's/ *\(:\|{\|}\) */\1/g'       $x.tmp

    # Make comma-separated list be single-line (foo,\nbar -> foo,bar).
    sed -i -n '1h;1!H;${;g;s/,\n/,/g;p;}'    $x.tmp

    # Remove newlines before closing brackets (foo\n} -> foo}).
    sed -i -n '1h;1!H;${;g;s/\s*\n}/}/g;p;}' $x.tmp

    # Remove newlines after opening brackets ({\nfoo -> {foo).
    sed -i -n '1h;1!H;${;g;s/{\s*\n/{/g;p;}' $x.tmp

    # Remove newlines after semicolons (foo;\nbar -> foo;bar).
    sed -i -n '1h;1!H;${;g;s/;\s*\n/;/g;p;}' $x.tmp

    # Remove single-line comments
    sed -i    's|/\*.*\*/||g'                $x.tmp

    # Remove multi-line comments
    # TODO: Make this less hideous.
    sed -i '/\/\*/,/\*\//d'                  $x.tmp

    # Remove repeated newlines.
    # TODO: Make this less hideous.
    cat $x.tmp | grep -v "^$" > $x.tmp2
    cat $x.tmp2 > $x.tmp
    rm $x.tmp2
  done
done

echo
echo "Concatenating temporary files to all.min.css."
for x in $TEMP_FILES; do
  echo "  $x"
  cat $x >> all.min.css
  echo >> all.min.css
done

rm *.tmp

