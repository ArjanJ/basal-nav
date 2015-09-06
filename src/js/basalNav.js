(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.BasalNav = factory();
  }
})(this, function() {

  'use strict';

  //
  // Variables
  //

  var BasalNav = {}; // Object for public APIs
  var settings; // Placeholder variables

  // Merge two objects
  var extend = function (defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
          extended[prop] = defaults[prop];
      }
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
          extended[prop] = options[prop];
      }
    }
    return extended;
  };

  // Check for transitionend event
  var transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'otransitionend'
    },
    elem = document.createElement('div');

  for (var t in transitions) {
    if (typeof elem.style[t] !== 'undefined') {
      window.transitionEnd = transitions[t];
      break;
    }
  }

  // Default settings
  var defaults = {
    TOGGLE_ELEMENT: 'basal-nav__hamburger',
    TOGGLE_ELEMENT_ACTIVE_CLASS: 'basal-nav__hamburger--close'
  };

  var elements = {};
  var isActive = false;

  //
  // Methods
  //

  var showNav = function(toggle, nav, navActiveClass) {

    // first make the nav visible
    nav.style.display = 'block';

    // then animate it by adding the active class
    window.setTimeout(function() {
      nav.classList.add(navActiveClass);
      toggle.classList.add(settings.TOGGLE_ELEMENT_ACTIVE_CLASS);
    }, 20);

    isActive = true;

  };

  var hideNav = function(toggle, nav, navActiveClass) {

    nav.classList.remove(navActiveClass);
    toggle.classList.remove(settings.TOGGLE_ELEMENT_ACTIVE_CLASS);

    function displayNone() {
      nav.style.display = 'none';
      nav.removeEventListener(transitionEnd, displayNone, false);
    }

    nav.addEventListener(transitionEnd, displayNone, false);

    isActive = false;

  };

  /**
   * Toggle the Nav
   * @private
   */
  var toggleNav = function(event) {

    if (event.target && event.target.classList.contains(settings.TOGGLE_ELEMENT)) {
      var toggle = event.target;
      var nav;
      var navActiveClass;
      if (toggle.hasAttribute('data-toggle') && toggle.hasAttribute('data-toggle-class')) {
        nav = document.querySelector('#' + toggle.getAttribute('data-toggle'));
        navActiveClass = toggle.getAttribute('data-toggle-class');
      } else {
        throw new Error('Toggle is missing data attributes.');
      }

      elements.toggle = toggle;
      elements.nav = nav;
      elements.navActiveClass = navActiveClass;

      if (!nav.classList.contains(navActiveClass)) {

        showNav(toggle, nav, navActiveClass);

        // if the nav contains the active class then remove it
      } else if (nav.classList.contains(navActiveClass)) {

        hideNav(toggle, nav, navActiveClass);

      }
    } else if (isActive && elements.nav.classList.contains(elements.navActiveClass)) {
      hideNav(elements.toggle, elements.nav, elements.navActiveClass);
    }

  };

  /**
   * Handle events
   * @private
   */
  var eventHandler = function(event) {

    if (event.type === 'click') {
      toggleNav(event);
    }

  };

  /**
   * Destroy the current initialization.
   * @public
   */
  BasalNav.destroy = function() {

    // Remove event listeners
    document.removeEventListener('click', eventHandler, false);

    // Reset variables
    settings = null;

  };

  /**
   * Initialize Plugin
   * @public
   * @param {Object} options User settings
   */
  BasalNav.init = function(options) {

    // Destroy any existing initializations
    BasalNav.destroy();

    // Merge user options with defaults
    settings = extend(defaults, options || {});

    // Listen for click events
    document.addEventListener('click', eventHandler, false);

  };


  //
  // Public APIs
  //

  return BasalNav;

});
