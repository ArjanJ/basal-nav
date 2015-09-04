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

  // Elements
  var toggle = document.querySelector('.' + defaults.TOGGLE_ELEMENT); // the hamburger
  if (toggle && toggle.hasAttribute('data-toggle') && toggle.hasAttribute('data-toggle-class')) {
    var nav = document.querySelector('#' + toggle.getAttribute('data-toggle')); // the navigation
    var toggleTargetClass = toggle.getAttribute('data-toggle-class'); // the class that animates the navigation in/out
  }

  //
  // Methods
  //

  var showNav = function() {

    // first make the nav visible
    nav.style.display = 'block';

    // then animate it by adding the active class
    window.setTimeout(function() {
      nav.classList.add(toggleTargetClass);
      toggle.classList.add(settings.TOGGLE_ELEMENT_ACTIVE_CLASS);
    }, 20);
  };

  var hideNav = function() {

    nav.classList.remove(toggleTargetClass);
    toggle.classList.remove(settings.TOGGLE_ELEMENT_ACTIVE_CLASS);

    function displayNone() {
      nav.style.display = 'none';
      nav.removeEventListener(transitionEnd, displayNone, false);
    }

    nav.addEventListener(transitionEnd, displayNone, false);
  }

  /**
   * Toggle the Nav
   * @private
   */
  var toggleNav = function(event) {

    // check if the clicked element is the hamburger
    if (event.target === toggle) {

      // if the nav doesn't contain the active class then add it
      if (!nav.classList.contains(toggleTargetClass)) {

        showNav();

        // if the nav contains the active class then remove it
      } else if (nav.classList.contains(toggleTargetClass)) {

        hideNav();

      }

      // if the clicked element isn't the hamburger && the nav has the active class, then remove it
    } else if (nav.classList.contains(toggleTargetClass) && toggle.classList.contains(settings.TOGGLE_ELEMENT_ACTIVE_CLASS)) {

      hideNav();
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

    // If plugin isn't already initialized, stop
    if (!settings) return;

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
