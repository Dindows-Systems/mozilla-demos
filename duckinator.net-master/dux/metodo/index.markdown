---
title: metodo
---

## A brief overview ##

Metodo is the [dux](/dux) kernel. It has the same goals and design philosophy as the entire dux system—primarily a simple design.
Although metodo is designed to be portable, it currently runs exclusively on [x86](http://en.wikipedia.org/wiki/x86) systems.

The name *metodo* comes from the Italian word meaning *method*.

## History ##
Dux and its original kernel were strongly tied.  On August 2nd, 2009, after deciding that this was a poor design idea, we [started development of the metodo kernel](http://github.com/duckinator/dux/commit/cbc463921ae3a5e34e24257445854575b0d4e2f6).
The metodo kernel was heavily developed at a surprisingly fast pace until it was on-par with dux's original kernel.
On August 23rd, 2009, [the old dux kernel was removed](http://github.com/duckinator/dux/commit/af570ca0b1ae29c407c729cdbaae4f98a6bb1a55), and metodo officially replaced it.

## Design ##

Metodo is a hybrid kernel. Non-essential drivers will run in userspace.
The four access levels are, in order from least to most restrictive, the kernel, the kernel drivers, the userland drivers, and the userland.

### Kernel access ###
Kernel access will be the highest access level.
It will provide complete hardware access and the ability to do whatever you can imagine (and possibly more).

### Kernel drivers ###
Kernel drivers will be at the second access level.
They will have less access than the kernel, but enough to implement the "hardcore" drivers (graphics, for example).

### User drivers ###
User drivers are the third access level.
They will have Basically userland access, but a few more syscalls.

### Userland ###
The fourth, and lowest, access level is what userland is given.
This is where all software that is not trusted by the kernel is ran.
