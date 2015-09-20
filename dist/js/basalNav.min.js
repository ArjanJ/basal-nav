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

	/**
	 * Class constructor for BasalNav component.
	 *
	 * @constructor
	 * @param {HTMLElement} The navigation element.
	 */
	var BasalNav = function(element) {
		this._element = element;
		this.init();
	};

	/**
	 * CSS class names of elements stored as strings.
	 *
	 * @private
	 */
	BasalNav.prototype._CssClasses = {
		CONTAINER: 'basal-nav',
		NAV: 'basal-nav__nav',
		NAV_ACTIVE: 'basal-nav__nav--active',
		LIST: 'basal-nav__list',
		ITEM: 'basal-nav__item',
		LINK: 'basal-nav__link',
		HAMBURGER: 'basal-nav__hamburger',
		HAMBURGER_ACTIVE: 'basal-nav__hamburger--active',
		OVERLAY: 'basal-nav__overlay',
		OVERLAY_ACTIVE: 'basal-nav__overlay--active'
	};

	/**
	 * Initialize component, add event listeners to elements.
	 */
	BasalNav.prototype.init = function() {
		if (this._element) {
			var nav = this._element.querySelector('.' + this._CssClasses.NAV);
			var hamburger = this._element.querySelector('.' + this._CssClasses.HAMBURGER);
			var overlay = this._element.querySelector('.' + this._CssClasses.OVERLAY);

			this._nav = nav;
			this._hamburger = hamburger;
			this._overlay = overlay;

			hamburger.addEventListener('click', this._handleClick.bind(this));
			overlay.addEventListener('click', this._handleClick.bind(this));
		}
	};

	/**
	 * Handles the click event fired from the element.
	 *
	 * @param {Event} The event that fired.
	 * @private
	 */
	BasalNav.prototype._handleClick = function(event) {
		this._toggle(event);
	};

	/**
	 * Checks if the Nav element has the active class or not and fires the show
	 * or hide functions.
	 *
	 * @param {Event} The event that fired.
	 * @private
	 */
	BasalNav.prototype._toggle = function(event) {
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
	BasalNav.prototype._hide = function() {
		if (this._nav && this._hamburger) {
			this._nav.classList.remove(this._CssClasses.NAV_ACTIVE);
			this._hamburger.classList.remove(this._CssClasses.HAMBURGER_ACTIVE);
			this._overlay.classList.remove(this._CssClasses.OVERLAY_ACTIVE);

			this._addTransitionEndListener();
		}
	};

	/**
	 * Shows the navigation.
	 *
	 * @private
	 */
	BasalNav.prototype._show = function(event) {
		event.stopPropagation();

		if (this._nav && this._hamburger) {
			this._nav.style.display = 'block';

			window.setTimeout(function() {
				this._nav.classList.add(this._CssClasses.NAV_ACTIVE);
				this._hamburger.classList.add(this._CssClasses.HAMBURGER_ACTIVE);
				this._overlay.classList.add(this._CssClasses.OVERLAY_ACTIVE);
			}.bind(this), 20);

		}
	};

	/**
	 * Adds 'display: none' to the nav after the transitionEnd event is done,
	 * then removes the transitionEnd event listener.
	 *
	 * @private
	 */
	BasalNav.prototype._addTransitionEndListener = function() {
		var hideNav = function() {
			this._nav.style.display = 'none';
			this._nav.removeEventListener('transitionend', hideNav);
			this._nav.removeEventListener('webkitTransitionend', hideNav);
		}.bind(this);

		this._nav.addEventListener('transitionend', hideNav);
		this._nav.addEventListener('webkitTransitionend', hideNav);
	};

	/**
	 * Initialize all instances of Basal Nav component.
	 */
	var init = function() {
		var el = document.querySelectorAll('.basal-nav');
		for (var i = 0; i < el.length; i++) {
			var bn = new BasalNav(el[i]);
		}
	};

	init();

});
