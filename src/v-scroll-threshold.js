function isBindingValueValid(bindingValue) {
  if (bindingValue) {
    if (bindingValue.threshold !== undefined) {
      if (
        bindingValue.callback &&
        typeof bindingValue.callback === 'function'
      ) {
        return true;
      }
    }
  }
  return false;
}

function getRelativeScrollPositionToElement(el, elementOffset) {
  const currentScroll = window.pageYOffset || window.scrollTop || 0;
  const elementScroll = (el.offsetTop || 0) + (elementOffset || 0);
  if (currentScroll === 0 && elementScroll === 0) {
    /**
     * since we can't go past the element at the top,
     * we have to have a way of telling that we have went reached the top but
     * still inside the element and
     * maybe the user need to trigger sth
     */
    return -0;
  }
  return currentScroll - elementScroll;
}

export function isMinusZero(value) {
  if (Object.is(value, -0)) return true;
}

function scrollPosition(el, elementOffset) {
  const scrollRelativePos = getRelativeScrollPositionToElement(
    el,
    elementOffset
  );
  if (scrollRelativePos < 0) {
    return -1;
  } else if (scrollRelativePos === 0) {
    // this is for letting -0 through
    return scrollRelativePos;
  } else if (
    scrollRelativePos >= 0 &&
    scrollRelativePos <= el._scrollThreshold
  ) {
    return 0;
  } else {
    return 1;
  }
}

function isAlongDirection(modifiers, offset) {
  let direction = 'down';
  if (offset > 0) {
    direction = 'up';
  }
  if (modifiers[direction]) {
    return true;
  }
  return false;
}

const evtOpts = { passive: true };

const bind = (el, binding) => {
  if (!isBindingValueValid(binding.value)) {
    return;
  }

  el._thresholdCallback = binding.value.callback || (() => {});
  el._scrollThreshold = binding.value.threshold || 0;
  el._detectionOffset = binding.value.offset || 0;
  el._scrollBackThreshold = binding.value.scrollBackThreshold || 0;
  el._scrollBackValue = 0;
  let startingRelativeScrollPos = scrollPosition(el, el._detectionOffset);
  let lastScrollPos = window.pageYOffset || window.scrollTop || 0;
  let lastWasAlong = false;
  const scrollHandler = function scrollHandler() {
    const newRelativeScrollPos = scrollPosition(el, el._detectionOffset);
    const newScrollPos = window.pageYOffset || window.scrollTop || 0;
    const offset = lastScrollPos - newScrollPos;
    lastScrollPos = newScrollPos;
    const newIsAlong = isAlongDirection(binding.modifiers, offset);
    if (newIsAlong) {
      el._scrollBackValue += Math.abs(offset);
    } else {
      el._scrollBackValue = 0;
    }

    const isMinusZ = isMinusZero(newRelativeScrollPos);

    if (
      el._scrollBackThreshold &&
      newIsAlong &&
      !isMinusZ &&
      el._scrollBackValue < el._scrollBackThreshold
    ) {
      return;
    }

    if (
      isMinusZ ||
      newRelativeScrollPos !== startingRelativeScrollPos ||
      lastWasAlong !== newIsAlong
    ) {
      startingRelativeScrollPos = newRelativeScrollPos;
      lastWasAlong = newIsAlong;
      el._thresholdCallback(newRelativeScrollPos, newIsAlong);
    }
  };
  window.addEventListener('scroll', scrollHandler, evtOpts);
  el._thresholdCallback(startingRelativeScrollPos, false);
  el._scrollHandler = scrollHandler;
};

const unbind = (el) => {
  if (!el._scrollHandler) return;
  window.removeEventListener('scroll', el._scrollHandler, evtOpts);
  delete el._scrollHandler;
  delete el._thresholdCallback;
  delete el._scrollThreshold;
  delete el._scrollBackThreshold;
  delete el._detectionOffset;
};

const update = (el, binding) => {
  el._thresholdCallback = binding.value.callback || (() => {});
  el._scrollThreshold = binding.value.threshold || 0;
  el._scrollBackThreshold = binding.value.scrollBackThreshold || 0;
  el._detectionOffset = binding.value.offset || 0;
};

export default {
  bind,
  beforeMount: bind, // vue 3
  unbind,
  unmounted: unbind, // vue 3
  update,
  updated: update, // vue 3
};
