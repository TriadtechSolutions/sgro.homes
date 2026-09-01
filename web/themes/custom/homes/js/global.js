/**
 * @file
 * Global utilities for Homes theme.
 */
(function (Drupal) {

  'use strict';

  Drupal.behaviors.homesJumpNav = {
    attach: function (context) {
      const toggler = context.querySelector('#homes-mobile-toggler');
      const navbar = document.querySelector('#HomesCollapsingNavbar');

      if (toggler && navbar && !toggler.dataset.jumpModeAttached) {
        toggler.dataset.jumpModeAttached = "true";

        const iconOpen = toggler.querySelector('.hamburger-icon-open');
        const iconClose = toggler.querySelector('.hamburger-icon-close');

        function toggleMenu(showState) {
          const isShown = navbar.classList.contains('show') || navbar.classList.contains('is-open');
          const shouldShow = showState !== undefined ? showState : !isShown;

          if (shouldShow) {
            navbar.classList.add('show', 'is-open');
            navbar.classList.remove('collapsing');
            toggler.classList.add('is-open');
            toggler.setAttribute('aria-expanded', 'true');
            if (iconOpen) iconOpen.style.display = 'none';
            if (iconClose) iconClose.style.display = 'block';
          } else {
            navbar.classList.remove('show', 'is-open', 'collapsing');
            toggler.classList.remove('is-open');
            toggler.setAttribute('aria-expanded', 'false');
            if (iconOpen) iconOpen.style.display = 'block';
            if (iconClose) iconClose.style.display = 'none';
          }
        }

        toggler.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleMenu();
        });

        // Close menu when clicking menu link targets on mobile
        const menuLinks = navbar.querySelectorAll('a');
        menuLinks.forEach(function (link) {
          link.addEventListener('click', function () {
            if (window.innerWidth < 992) {
              toggleMenu(false);
            }
          });
        });
      }
    }
  };

})(Drupal);
