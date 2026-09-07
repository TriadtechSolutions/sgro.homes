/**
 * @file
 * Global utilities for Homes theme.
 */
(function (Drupal) {

  'use strict';

  Drupal.behaviors.homesJumpNav = {
    attach: function (context) {
      const toggler = (context.querySelector ? context : document).querySelector('#homes-mobile-toggler');
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

  Drupal.behaviors.homesTestimonialSlider = {
    attach: function (context) {
      const tracks = (context.querySelectorAll ? context : document).querySelectorAll('.testimonials-slider-track, #testimonials-slider-track');

      tracks.forEach(function (track) {
        if (track.dataset.sliderAttached) {
          return;
        }
        track.dataset.sliderAttached = "true";

        const wrapper = track.closest('.testimonials-carousel-wrapper') || track.parentElement || document;
        const prevBtns = wrapper.querySelectorAll('.testimonial-arrow--prev, .testimonial-arrow--left, #testimonial-prev-btn, #testimonial-prev-btn-mobile');
        const nextBtns = wrapper.querySelectorAll('.testimonial-arrow--next, .testimonial-arrow--right, #testimonial-next-btn, #testimonial-next-btn-mobile');

        function scrollSlider(direction) {
          const slideItem = track.querySelector('.testimonial-slide-item');
          if (!slideItem) return;

          const itemWidth = slideItem.getBoundingClientRect().width;
          const gap = 24; // 1.5rem = 24px gap
          const scrollAmount = (itemWidth + gap) * direction;

          track.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }

        prevBtns.forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            scrollSlider(-1);
          });
        });

        nextBtns.forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            scrollSlider(1);
          });
        });
      });
    }
  };

  Drupal.behaviors.homesFaqAccordion = {
    attach: function (context) {
      const accordionContainers = (context.querySelectorAll ? context : document).querySelectorAll('.faq-accordion-container, #faq-accordion');

      accordionContainers.forEach(function (container) {
        if (container.dataset.faqAttached) {
          return;
        }
        container.dataset.faqAttached = "true";

        const items = container.querySelectorAll('.faq-item');
        
        // Open the first FAQ item by default (matching Next.js openIndex = 0)
        if (items.length > 0) {
          const firstItem = items[0];
          firstItem.classList.add('is-open');
          const firstBtn = firstItem.querySelector('.faq-question-btn');
          if (firstBtn) {
            firstBtn.setAttribute('aria-expanded', 'true');
          }
        }

        items.forEach(function (item) {
          const btn = item.querySelector('.faq-question-btn');
          if (!btn) return;

          btn.addEventListener('click', function (e) {
            e.preventDefault();
            const isOpen = item.classList.contains('is-open');

            // Close all items in this container
            items.forEach(function (otherItem) {
              otherItem.classList.remove('is-open');
              const otherBtn = otherItem.querySelector('.faq-question-btn');
              if (otherBtn) {
                otherBtn.setAttribute('aria-expanded', 'false');
              }
            });

            // Toggle current item
            if (!isOpen) {
              item.classList.add('is-open');
              btn.setAttribute('aria-expanded', 'true');
            }
          });
        });
      });
    }
  };

})(Drupal);
