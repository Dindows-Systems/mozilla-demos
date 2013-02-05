---
title: Dux CPU API
---

# Dux API #

## CPU API ##

Provides information about all CPU(s) on the system.

* <p class="func"><span class="type">char*</span> <span class="name">CPUBrand</span>():</p>
  Returns a `String` representation of the CPU brand, as the system reports it. Possible values include, but are not limited to:
  * "<span class="monospace">AMDisbetter!</span>"
  * "<span class="monospace">AuthenticAMD</span>"
  * "<span class="monospace">GenuineIntel</span>"
  * "<span class="monospace">CentaurHauls</span>"
  * "<span class="monospace">TransmetaCPU</span>"
  * "<span class="monospace">GenuineTMx86</span>"
  * "<span class="monospace">CyrixInstead</span>"
  * "<span class="monospace">NexGenDriven</span>"
  * "<span class="monospace">UMC UMC UMC </span>"
  * "<span class="monospace">SiS SiS SiS </span>"
  * "<span class="monospace">Geode by NSC</span>"
  * "<span class="monospace">RiseRiseRise</span>"

* <p class="func"><span class="type">char*</span> <span class="name">CPUFamily</span>():</p>
  Returns a `String` representation of the CPU family, as the system reports it. Possible values include, but are not limited to:
  * (TODO: Find out what goes here)

* <p class="func"><span class="type">char*</span> <span class="name">CPUModel</span>():</p>
  Returns a `String` representation of the CPU model, as the system reports it. Possible values include, but are not limited to:
  * (TODO: Find out what goes here)

* <p class="func"><span class="type">int</span> <span class="name">CPUPopulation</span>():</p>
  Returns an `Integer` representation of the number of CPUs in the system.

* <p class="func"><span class="type">int</span> <span class="name">CPUActivePopulation</span>():</p>
  Returns an `Integer` representation of the number of enabled CPUs in the system.

* <p class="func"><span class="type">CPU_features_t</span>  <span class="name">CPUFeatures</span>():</p>
  Returns a `CPU_features_t` struct (or a fully-equivalent alternative representation) containing information about CPU features.
  *TODO:* Find out exactly which features are important on all systems (not x86-specific, we have CPUID functions for that).

* <p class="func"><span class="type">int</span> <span class="name">CPUCacheSize</span>():</p>
  Returns a `Integer` representation of the size of all caches combined.

* <p class="func"><span class="type">char*</span> <span class="name">CPUSerialNumber</span>():</p>
  Returns a `String` representation of the serial number of the processor.

### Possible additions ###

* <p class="func"><span class="type">char*</span> <span class="name">CPUShortBrand</span>():</p>
  Returns a common-name representation of the CPU brand. Possible values include, but are not limited to:
  * AMD
  * Intel
  * VIA
  * Transmeta
  * Cyrix
  * NexGen
  * UMC
  * NSC
  * Rise

