(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.BassNav = factory();
	}
})(this, function() {

	'use strict';

	/**
	 * Class constructor for BassNav component.
	 *
	 * @constructor
	 * @param {HTMLElement} element The navigation element.
	 */
	var BassNav = function(element) {
		this._element = element;
		this.init();
	};

	/**
	 * CSS class names of elements stored as strings.
	 *
	 * @private
	 */
	BassNav.prototype._CssClasses = {
		CONTAINER: 'bass-nav',
		CONTAINER_COLLAPSED: 'bass-nav--collapsed',
		NAV: 'bass-nav__nav',
		NAV_ACTIVE: 'bass-nav__nav--active',
		LIST: 'bass-nav__list',
		ITEM: 'bass-nav__item',
		LINK: 'bass-nav__link',
		HAMBURGER: 'bass-nav__hamburger',
		HAMBURGER_ACTIVE: 'bass-nav__hamburger--active',
		OVERLAY: 'bass-nav__overlay',
		OVERLAY_ACTIVE: 'bass-nav__overlay--active'
	};

	// Breakpoint
	var desktop = 768;

	/**
	 * Initialize component, add event listeners to elements.
	 */
	BassNav.prototype.init = function() {
		if (this._element) {
			this._nav = this._element.querySelector('.' + this._CssClasses.NAV);
			this._hamburger = this._element.querySelector('.' + this._CssClasses.HAMBURGER);
			this._overlay = this._element.querySelector('.' + this._CssClasses.OVERLAY);

			this._setAriaAttributes();

			this._hamburger.addEventListener('click', this._handleClick.bind(this));
			this._overlay.addEventListener('click', this._handleClick.bind(this));
			window.addEventListener('resize', this._handleResize.bind(this));
		}
	};

	/**
	 * Handles the click event fired from the element.
	 *
	 * @param {Event} event The event that fired.
	 * @private
	 */
	BassNav.prototype._handleClick = function(event) {
		this._toggle(event);
	};

	/**
	 * Checks if the Nav element has the active class or not and fires the show
	 * or hide functions.
	 *
	 * @param {Event} The event that fired.
	 * @private
	 */
	BassNav.prototype._toggle = function(event) {
		if (this._nav.classList.contains(this._CssClasses.NAV_ACTIVE)) {
			this._hide();
		} else {
			this._show(event);
		}
	};

	/**
	 * Hides the navigation.
	 *
	 * @private
	 */
	BassNav.prototype._hide = function() {
		if (this._nav && this._hamburger) {
			this._nav.classList.remove(this._CssClasses.NAV_ACTIVE);
			this._hamburger.classList.remove(this._CssClasses.HAMBURGER_ACTIVE);
			this._overlay.classList.remove(this._CssClasses.OVERLAY_ACTIVE);

			this._addTransitionEndListener();
			this._setAriaAttributes();
		}
	};

	/**
	 * Shows the navigation.
	 *
	 * @private
	 */
	BassNav.prototype._show = function(event) {
		event.stopPropagation();

		if (this._nav && this._hamburger) {
			this._nav.style.display = 'block';

			window.setTimeout(function() {
				this._nav.classList.add(this._CssClasses.NAV_ACTIVE);
				this._hamburger.classList.add(this._CssClasses.HAMBURGER_ACTIVE);
				this._overlay.classList.add(this._CssClasses.OVERLAY_ACTIVE);
				this._setAriaAttributes();
			}.bind(this), 20);

		}
	};

	/**
	 * Adds 'display: none' to the nav after the transitionEnd event is done,
	 * then removes the transitionEnd event listener.
	 *
	 * @private
	 */
	BassNav.prototype._addTransitionEndListener = function() {
		var hideNav = function() {
			this._nav.style.display = 'none';
			this._nav.removeEventListener('transitionend', hideNav);
			this._nav.removeEventListener('webkitTransitionend', hideNav);
		}.bind(this);

		this._nav.addEventListener('transitionend', hideNav);
		this._nav.addEventListener('webkitTransitionend', hideNav);
	};

	/**
	 * Add ARIA Attributes.
	 *
	 * @private
	 */
	BassNav.prototype._setAriaAttributes = function() {
		if (this._hamburger && this._nav) {
			if (this._nav.classList.contains(this._CssClasses.NAV_ACTIVE)) {
				this._hamburger.setAttribute('aria-expanded', 'true');
				this._nav.setAttribute('aria-hidden', 'false');
			} else {
				this._hamburger.setAttribute('aria-expanded', 'false');
				this._nav.setAttribute('aria-hidden', 'true');
			}
		}
	};

	/**
	 * Remove 'active' classes from elements when the window is resized larger
	 * than desktop size. Doesn't apply to 'basal-nav--collapsed'.
	 *
	 * @private
	 */
	BassNav.prototype._handleResize = debounce(function() {
		if (window.innerWidth >= desktop && !this._element.classList.contains(this._CssClasses.CONTAINER_COLLAPSED)) {
			this._nav.classList.remove(this._CssClasses.NAV_ACTIVE);
			this._hamburger.classList.remove(this._CssClasses.HAMBURGER_ACTIVE);
			this._overlay.classList.remove(this._CssClasses.OVERLAY_ACTIVE);
			this._nav.removeAttribute('style');
		}
	}, 150);


	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	/**
	 * Initialize all instances of Basal Nav component.
	 *
	 * @public
	 */
	var init = function() {
		var el = document.querySelectorAll('.bass-nav');
		for (var i = 0; i < el.length; i++) {
			var bn = new BassNav(el[i]);
		}
	};

	init();

});
