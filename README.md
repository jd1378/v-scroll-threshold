# v-scroll-threshold

A vue directive that accepts a threshold value and a callback function that tells you if current scroll position is before the binded element, after element and inside the threshold, or past the threshold

## usage

```bash
npm install v-scroll-threshold
# or 
yarn add v-scroll-threshold
```

then add it to your vue application:

```js
// add it to your vue application:
import VScrollThreshold from 'v-scroll-threshold';
import Vue from 'vue';

Vue.use(VScrollThreshold);

// or

import VScrollThreshold from 'v-scroll-threshold';

export default {
  directives: {
    VScrollThreshold
  }
}
```

then use it:

```html
<template>
  <div > 
    <!-- 
      .
      .
      .
     -->
    <SomeElement v-scroll-threshold="{ 
      threshold: 100,
      callback: callbackFunction
    }" />
  </div>
</template>
```

### notes

v-scroll-threshold directive has 2 modifiers (up, down) and accepts an object with following properties:

#### `scrollElement` - the element to add "onscroll" event listener to

#### `threshold` - number in px unit

#### `offset` - number in px unit, will move the element detection by this offset up (negative) or down (positive)

#### `scrollBackThreshold` - number in px unit

When set above zero, will only call callback when scroll is moved at least of this ammount along the direction set by modifier.

#### `callback(relativePos, sameDirection)`

the function that is called everytime the page is scrolled with two arguments. first arg is always one of the following values: `-1`, `0`, `1`

- `-1` means the scroll position is before the element (element not reached the top of screen)
- `0` means the scroll has passed the element and is inside the threshold (inclusive)
- `1` means the scroll has passed the element and the threshold
- `-0` means the scroll position is inside the threshold but also at the top of screen. added this because it was hard to know this.

second arg is if the last scroll event was in direction of the specified modifier.
