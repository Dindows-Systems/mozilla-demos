---
title: Javascript magic up the wazoo!
tags: javascript browser
layout: post
---

## List, and descriptions, of various decoders

(WIP)

This is just a quick list of various JavaScript decoders, VMs, and the like.

### Image decoders

All of these render using Canvas.

* [pdf.js](https://github.com/mozilla/pdf.js) - [Demo](http://mozilla.github.com/pdf.js/web/viewer.html)
* [png.js](https://github.com/devongovett/png.js) - [Demo](http://devongovett.github.com/png.js/)
* [jpgjs](https://github.com/notmasteryet/jpgjs) - [Demo](http://notmasteryet.github.com/jpgjs/example.html)
* [jsgif](https://github.com/shachaf/jsgif) - [Demo](http://slbkbs.org/jsgif/)
* [bmp.js](https://github.com/devongovett/bmp.js) - [Demo](http://devongovett.github.com/bmp.js/)
* [weppy (WebP)](https://github.com/antimatter15/weppy) - [Demo](http://antimatter15.github.com/weppy/demo.html)
* [canvg (SVG)](http://code.google.com/p/canvg) - [Demo](http://canvg.googlecode.com/svn/trunk/examples/index.htm)
* [psd.js](https://github.com/meltingice/psd.js) - [Demo](http://meltingice.github.com/psd.js) (Demo requires drag-and-drop support)

### Video decoders

* [Broadway (H.264)](https://github.com/mbebenita/Broadway) - [Demo](http://mbebenita.github.com/Broadway/treeDemo.html) (Uses WebGL?)
* [Route9.js (VP8/WebM)](https://github.com/bemasc/Broadway/tree/master/vp8) - [Demo](http://people.xiph.org/~bens/route9/route9.html)

### Plugin replacements

* [shumway (Flash)](https://github.com/mozilla/shumway) - No demo.
* [jvm-js](https://github.com/notmasteryet/jvm-js) - No demo.
* [BicaVM (JVM)](https://github.com/nurv/BicaVM) - No demo.

### Browser features

* [html2canvas](http://html2canvas.hertzen.com) - [Demo](http://html2canvas.hertzen.com/screenshots.html). [Examples/tests](http://html2canvas.hertzen.com/examples.html).
* [DrawWindow](https://github.com/bgrins/DrawWindow) - Renders HTML to Canvas. [Demos](http://bgrins.github.com/DrawWindow/)
* [dom.js](https://github.com/andreasgal/dom.js) - Pure JavaScript implementation of the DOM. No demo.

### Audio

* [pitch.js](https://github.com/ofmlabs/pitch.js) - pitch detection library.
* [Aurora.js](https://github.com/ofmlabs/aurora.js) - this is not a decoder, but rather a framework for making them.


Codecs using Aurora.js:

* [aac.js](https://github.com/ofmlabs/aac.js) - No demo yet.
* [alac.js](https://github.com/ofmlabs/alac.js) - [Demo](http://labs.official.fm/codecs/alac)
* [flac.js](https://github.com/ofmlabs/flac.js) - [Demo](http://labs.official.fm/codecs/flac)
* [jsmad (MP3)](https://github.com/ofmlabs/jsmad) - See mp3.js.
* [mp3.js](https://github.com/devongovett/mp3.js) - Fork of jsmad modified to use Aurora.js. [Demo](http://labs.official.fm/codecs/mp3)
* [ogg/vorbis](https://github.com/jsantell/ogg.js) - Demo: the [README](https://github.com/jsantell/ogg.js#readme) explains how to run a demo locally.

Codecs not using Aurora.js:

* [pcmdata.js (.wav)](https://github.com/jussi-kalliokoski/pcmdata.js) - No demo.
* [mp2dec.js](https://github.com/cosinusoidally/mp2dec.js) - [Demo](http://cosinusoidally.github.com/mp2dec.js)
* ogg/vorbis - Alternative, and older, ogg/vorbis implementation. This may not be FOSS. [Demo](http://libwebpjs.hohenlimburg.org/vp8/ogg-vorbis-javascript-decoder/)

### 3D and CAD

* [OFFDecoder](https://github.com/yeuchi/OFFDecoder) - [Demo](http://www.ctyeung.com/JQuery/DecodeOFF/TestOFF.html)
* [STLDecoder](https://github.com/yeuchi/STLDecoder) - [Demo](http://www.ctyeung.com/JQuery/DecodeSTL/TestSTL.html)
* [OBJDecoder](https://github.com/yeuchi/OBJDecoder) - [Demo](http://www.ctyeung.com/JQuery/DecodeOBJ/TestOBJ.html)
* [PLYDecoder](https://github.com/yeuchi/PLYDecoder) - [Demo](http://www.ctyeung.com/JQuery/DecodePLY/TestPLY.html)
