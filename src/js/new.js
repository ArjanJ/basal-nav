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

	function BasalNav(basalNavParent) {

		var bn = this;
		var parent = basalNavParent;

		var NAV_OPEN = 0;
		var NAV_CLOSED = 1;
		var NAV_SELECTOR = '.basal-nav__nav';
		var NAV_CLASS_NAME_ACTIVE = 'basal-nav__nav--active';
		var HAMBURGER_SELECTOR = '.basal-nav__hamburger';
		var HAMBURGER_CLASS_NAME_ACTIVE = 'basal-nav__hamburger--active';
		var DISMISS_EVENT = window.hasOwnProperty('ontouchstart') ? 'ontouchstart' : 'click';

		bn._state = NAV_CLOSED;

		bn._nav = parent.querySelector(NAV_SELECTOR);
		bn._hamburger = parent.querySelector(HAMBURGER_SELECTOR);

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

		bn.open = function() {
			if (bn._state !== NAV_OPEN) {
				bn._nav.style.display = 'block';

				window.setTimeout(function() {
					bn._nav.classList.add(NAV_CLASS_NAME_ACTIVE);
					bn._hamburger.classList.add(HAMBURGER_CLASS_NAME_ACTIVE);
					bn._state = NAV_OPEN;
				}, 20);

			}
		};

		bn.close = function() {
			if (bn._state !== NAV_CLOSED) {
				bn._nav.classList.remove(NAV_CLASS_NAME_ACTIVE);
				bn._hamburger.classList.remove(HAMBURGER_CLASS_NAME_ACTIVE);

				function displayNoneNav() {
					bn._nav.style.display = 'none';
					bn._nav.removeEventListener(transitionEnd, displayNoneNav, false);
				}

				bn._nav.addEventListener(transitionEnd, displayNoneNav, false);

				bn._state = NAV_CLOSED;
			}
		};

		bn.toggle = function() {
			bn[bn._state === NAV_CLOSED ? 'open' : 'close']();
		};

		bn.eventHandler = function(event) {
			event.stopPropagation();
			event.preventDefault();
			bn.toggle();
		};

		bn.init = function() {
			bn._hamburger.addEventListener('click', bn.eventHandler, false);
			document.addEventListener(DISMISS_EVENT, function(event) {
				var target = event.target;
				if (!bn._nav.contains(target) && target.nodeName !== 'A') {
					bn.close();
				}
			});
		};

		bn.init();

	}

	function init() {
		var nav = document.querySelectorAll('.basal-nav');
		for (var i = 0; i < nav.length; i++) {
			var bn = new BasalNav(nav[i]);
		}
	}

	init();


});