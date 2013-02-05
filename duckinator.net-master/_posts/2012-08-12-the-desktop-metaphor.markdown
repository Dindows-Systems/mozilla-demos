---
title: The Desktop Metaphor Is Broken
tags: desktop metaphor broken linux xerox parc x11 spideros
layout: post
draft: true
---

Just a heads up: this may get a bit ranty, but I'm trying to tone it down because I really want people to think about the implications of this.

So, let's start: I use ArchLinux. I _hate_ Linux. I'm starting to dislike ArchLinux. I despise Windows and OS X. All of their interfaces are "meh" at best, to me. Including all of Linux's that I've used. That includes, but is by no means limited to: GNOME2/MATE, GNOME3, Xfce, KDE, openbox, and fluxbox.

I prefer BSDs, but I'm not brave enough to use one as my desktop operating system of choice yet. Maybe I'll try one the next time I have to install an operating system, because every BSD I've tried has had a simpler install sequence than ArchLinux current one *_*ahem*_*. I really like DragonFly BSD, in case you're curious. OpenBSD and NetBSD are pretty neat, too. I haven't used FreeBSD recently enough feel alright commenting on it.

The rest of this will mostly be to elaborate what I said regarding the interfaces being "meh."

First, some facts:

1. It's 2012.
2. The desktop metaphor was introduced in 1970, at Xerox PARC.
3. It's barely changed, aside from becoming shinier: http://upload.wikimedia.org/wikipedia/en/f/f2/Xerox_8010_compound_document.jpg
4. That's 42 years. Forty-two. FORTY-FREAKING-TWO years of fairly unchanging interfaces.

Old software and protocols are not implicitly broken. Metaphors do become outdated, however.

To me, the desktop metaphor is broken. It's a metaphor for something that it's largely replaced, so I feel it's served its purpose. It can now be improved upon without people exploding from frustration and/or confusion. _Although, if they do, the other desktop environments and operating systems will still be there for them to continue using, so that's not entirely relevant._

With the rise of tablets, cellphones, and whatever the heck the iPod Touch counts as, we've seen a lot of new approaches. The approach of iOS and Android (fairly similar, imo), as well as Metro are the prominent ones.

I feel Metro on a desktop computer is fundamentally broken. You can't optimize it for a tablet, then throw it on a desktop computer and go "surprise!" It's a pain to use, to me.

*_However,_* it got some things right. The panes that show effectively a summary of everything you use it for? I love it.

Daniel Lamando ("danopia") and I are working on an operating system that will probably be called "SpiderJS", it's a fork of [Scott Olson's spideros](https://github.com/tsion/spideros). It's quite an interesting idea: we plan to basically turn multiple claims about operating systems on their heads. First, it'll use [our fork](https://github.com/danopia/spiderv8) of [Google's v8](https://github.com/v8/v8) JavaScript engine (the one used in Chrome).
