#!/bin/bash

NAME="yuicompressor-2.4.6"

wget http://yui.zenfs.com/releases/yuicompressor/$NAME.zip &&
unzip $NAME.zip &&

mkdir -p $HOME/.bin &&
cp $NAME/build/$NAME.jar $HOME/.bin/ &&
echo '#!/bin/bash' > $HOME/.bin/yuicompressor &&
echo 'java -Xmx100M -jar '$HOME'/.bin/'$NAME'.jar "$@"' >> $HOME/.bin/yuicompressor &&
chmod +x $HOME/.bin/yuicompressor &&

rm -rf $NAME $NAME.zip &&
echo 'Installed! Please add $HOME/.bin to your $PATH'