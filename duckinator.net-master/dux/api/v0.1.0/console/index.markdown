---
title: Dux Console API
---

# Dux API #

## Console API ##

### Data structures ###

Data structures defined by the console API, represented with their C equivalents from Dux.


`ConsoleInfo_t` contains information about an individual console:

``` c
typedef struct ConsoleInfo_s {
  unsigned int width;
  unsigned int height;
  uint8_t 
} ConsoleInfo_t;
```

### Functions ###

Functions for printing information to the screen.

* `ConsoleInfo_t *ConsoleGetInfo(Console console)`
  General console information.

* `void MoveCursor(int row, int col)`
  Places the cursor on row `row`, column `col`.

* `void PrintChar(char chr)`
  Prints a single character (`chr`) to the console.
  Adjusts internal row and column representations.

* `int PrintString(char* str)`
  Prints a string (`str`) to the console.
  Returns number of characters printed.
  Adjusts internal row and column representations.

## Possible additions for Console API ##

### Functions ###

These are things that are frequently seen elsewhere, but as of now are not thought to be needed.

* `void PutChar(int row, col, chr)`
  Prints a single character (`chr`) on row `row`, column `col`.
  TODO: *If this is added, determine whether it updates internal row/column representation*

* `void PutString(int row, int col, char* str)`
  Prints a string (`str`) on row `row`, column `col`.
  *If this is added, determine whether it updates internal row/column representation*

