---
title: Operating System Information
---

## Operating Systems and Kernels and Bootloaders, oh my! ##

As I've played in the worlds of software development, Linux, BSD, Operating System wars, and similar nonsense, I have come to realize that many people don't even know what operating systems, kernels, and bootloaders actually are. This is my part of trying to fix that.

## What is an operating system? ##

An operating system is **the software that controls how programs interact with the computer's hardware and lets the user control the computer**.
They are far more common than you may think.
Operating systems are on nearly any device that can run multiple programs, including desktop and laptop computers, cell phones, video game consoles/handhelds, supercomputers, and many other devices.
Some of the more common operating systems are Linux distributions (I'll explain this below), the series of BSD-based operating systems, Mac OS X, and Microsoft Windows.

## What is a kernel? ##

You will notice I said "Linux distributions" above, and that is because Linux is a kernel that different operating systems may use.
A kernel is **the main part of many operating systems, and acts as a proxy between the computer programs and the hardware it runs on**.
For more information look on [wiki.osdev.org](http://wiki.osdev.org/Kernel)

## What is a bootloader? ##

A bootloader is the very first thing your computer runs. It may set up a few things first, but it's main goal is to load the operating system and run it.

## How do all of these tie together? ##

When you press the power button on your computer, it starts a short-lived chain reaction.
The hardware of your computer loads the "[BIOS](http://en.wikipedia.org/wiki/BIOS)".
The BIOS merely performs a few system checks and loads the first 512 Bytes off of your hard drive, which is the **boot loader**.
The boot loader then may perform checks of it's own and set up the hardware in a configuration the operating system expects.
After everything is set up, the boot loader then loads the **operating system** you have installed.

