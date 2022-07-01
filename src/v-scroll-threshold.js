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

function getRelativeScrollPositionToElement(el) {
  const currentScroll = window.pageYOffset || window.scrollTop || 0;
  const elementScroll = el.offsetTop || 0;
  return currentScroll - elementScroll;
}

function scrollPosition(el) {
  const scrollRelativePos = getRelativeScrollPositionToElement(el);
  if (scrollRelativePos < 0) {
    return -1;
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

const bind = (el, binding) => {
  if (!isBindingValueValid(binding.value)) {
    return;
  }
  const callback = binding.value.callback;
  el._scrollThreshold = binding.value.threshold || 0;
  let startingRelativeScrollPos = scrollPosition(el);
  let lastScrollPos = window.pageYOffset || window.scrollTop || 0;
  let lastWasAlong = false;
  const f = function scrollHandler() {
    const newRelativeScrollPos = scrollPosition(el);
    const newScrollPos = window.pageYOffset || window.scrollTop || 0;
    const offset = lastScrollPos - newScrollPos;
    lastScrollPos = newScrollPos;
    const newDirectionStatus = isAlongDirection(binding.modifiers, offset);
    if (
      newRelativeScrollPos !== startingRelativeScrollPos ||
      lastWasAlong !== newDirectionStatus
    ) {
      startingRelativeScrollPos = newRelativeScrollPos;
      lastWasAlong = newDirectionStatus;
      callback(newRelativeScrollPos, newDirectionStatus);
    }
  };
  window.addEventListener('scroll', f, { passive: true });
  callback(startingRelativeScrollPos, false);
  el._onScrollThreshold = callback;
};

const unbind = (el) => {
  if (!el._onScrollThreshold) return;
  const callback = el._onScrollThreshold;
  window.removeEventListener('scroll', callback);
  delete el._onScrollThreshold;
};

const update = (el, binding) => {
  el._scrollThreshold = binding.value.threshold || 0;
};

export default {
  bind,
  beforeMount: bind, // vue 3
  unbind,
  unmounted: unbind, // vue 3
  update,
  updated: update, // vue 3
};
