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

  Drupal.behaviors.homesHeaderFooterNavLinks = {
    attach: function (context) {
      const navLinks = (context.querySelectorAll ? context : document).querySelectorAll('.sgro-header a, .navbar a, .primary-menu-container a, .site-footer-wrapper a, .footer-col a');

      navLinks.forEach(function (link) {
        // ── Hard skip: never touch phone, email, or data links ──
        const rawHref = (link.getAttribute('href') || '');
        if (
          rawHref.startsWith('tel:') ||
          rawHref.startsWith('mailto:') ||
          rawHref.startsWith('data:') ||
          rawHref.startsWith('javascript:')
        ) {
          return; // leave native browser behaviour 100% intact
        }

        if (link.dataset.navAttached) {
          return;
        }
        link.dataset.navAttached = "true";

        const text = link.textContent.trim().toLowerCase();
        const href = rawHref.toLowerCase();

        // ── PRIORITY 0: Contact Us / Customer Support Center ──
        // Must be checked FIRST — these links all use href="/" on this site,
        // so they would otherwise be stolen by the Home or Services conditions.
        var isContactText = (
          text === 'contact us' ||
          text === 'contact' ||
          text.includes('customer support')
        );
        var isContactHref = /^\/contact(-us)?$/.test(href);

        if (isContactText || isContactHref) {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            Drupal.behaviors.homesContactModal && Drupal.behaviors.homesContactModal.openModal();
          });
          return;
        }

        // 1. Home Link
        if (text === 'home' || href === '#' || href === '/#') {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          return;
        }

        // 2. About us
        if (text.includes('about') || href.includes('about')) {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector('#about') || document.querySelector('.about-section');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
          return;
        }

        // 3. Brands / Gallery
        if (text.includes('brand') || text.includes('gallery') || href.includes('brand') || href.includes('gallery')) {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector('#our-brands') || document.querySelector('.our-brands-section');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
          return;
        }

        // 4. Services (exclude "Customer Support" — already handled above)
        if (text.includes('service') || href.includes('service')) {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector('#our-services') || document.querySelector('.explore-categories-section');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
          return;
        }

        // 5. FAQ
        if (text.includes('faq') || href.includes('faq')) {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector('#faqs') || document.querySelector('.faq-section');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
          return;
        }
      });
    }
  };

  // ── Contact Us Popup Modal Behavior ──
  Drupal.behaviors.homesContactModal = {

    openModal: function () {
      var modal = document.getElementById('contact-us-modal');
      if (!modal) return;
      modal.classList.add('is-open');
      document.body.classList.add('contact-modal-open');
      var closeBtn = modal.querySelector('#contact-modal-close-btn');
      if (closeBtn) {
        setTimeout(function () { closeBtn.focus(); }, 80);
      }
    },

    closeModal: function () {
      var modal = document.getElementById('contact-us-modal');
      if (!modal) return;
      modal.classList.remove('is-open');
      document.body.classList.remove('contact-modal-open');
    },

    attach: function (context) {
      var self = this;

      // ── Delegated click — Contact Us modal triggers ──
      if (!document.body.dataset.contactDelegateAttached) {
        document.body.dataset.contactDelegateAttached = 'true';

        document.addEventListener('click', function (e) {
          var el = e.target.closest(
            'a, button, [class*="btn-book-visit"], [class*="btn-hero-primary"], [class*="about-cta-btn"], .about-cta-wrap a, .about-cta-wrap button'
          );
          if (!el) return;

          // ── Hard exclusions — always let these pass through to browser ──
          var rawHref = (el.getAttribute('href') || '');
          if (
            rawHref.startsWith('tel:') ||
            rawHref.startsWith('mailto:') ||
            rawHref.startsWith('data:') ||
            rawHref.startsWith('javascript:')
          ) {
            return;
          }

          var href = rawHref.toLowerCase();

          // Skip admin / contextual / user / external URLs
          if (
            href.includes('/admin/') ||
            href.includes('/contextual/') ||
            href.includes('/user/') ||
            href.includes('?destination=') ||
            (href.startsWith('http') && !href.includes(window.location.hostname))
          ) {
            return;
          }

          var text = el.textContent.trim().toLowerCase();

          // 1. Specific button CLASSES that always open the modal
          var isModalButton = (
            el.classList.contains('btn-book-visit') ||
            el.classList.contains('btn-book-visit-mobile') ||
            el.classList.contains('btn-hero-primary') ||
            el.classList.contains('about-cta-btn') ||
            !!el.closest('.about-cta-wrap')
          );

          // 2. "Customer Support Center" text label (anywhere on page)
          var isCustomerSupport = text.includes('customer support');

          // 3. Generic "Contact Us" nav label or /contact href
          var isContactLabel = (
            text === 'contact us' ||
            text === 'contact' ||
            text === 'contact us >' ||
            text === '→ contact us'
          );
          var isContactHref = /^\/contact(-us)?$/.test(href);

          if (isModalButton || isCustomerSupport || isContactLabel || isContactHref) {
            e.preventDefault();
            e.stopPropagation();
            self.openModal();
          }
        });
      }

      // ── Close button inside the modal ──
      var closeBtn = (context.querySelector ? context : document).querySelector('#contact-modal-close-btn');
      if (closeBtn && !closeBtn.dataset.contactModalCloseAttached) {
        closeBtn.dataset.contactModalCloseAttached = 'true';
        closeBtn.addEventListener('click', function () {
          self.closeModal();
        });
      }

      // ── Clicking the backdrop (overlay) closes the modal ──
      var overlay = (context.querySelector ? context : document).querySelector('#contact-us-modal');
      if (overlay && !overlay.dataset.contactOverlayAttached) {
        overlay.dataset.contactOverlayAttached = 'true';
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) {
            self.closeModal();
          }
        });
      }

      // ── Escape key closes the modal ──
      if (!document.body.dataset.contactEscAttached) {
        document.body.dataset.contactEscAttached = 'true';
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            self.closeModal();
          }
        });
      }
    }
  };

  // ── Footer Section Scroll Links (Help Center + Useful Links) ──
  // Uses delegated capture-phase listener so it fires BEFORE Drupal's own
  // link handling which would navigate away on href="/" links.
  Drupal.behaviors.homesFooterScrollLinks = {
    attach: function (context) {
      if (document.body.dataset.footerScrollAttached) return;
      document.body.dataset.footerScrollAttached = 'true';

      // Map of lowercase text fragments → target section selectors
      var scrollMap = [
        { match: 'frequently asked questions',  target: '#faqs, .faq-section'              },
        { match: 'faq',                          target: '#faqs, .faq-section'              },
        { match: 'about',                        target: '#about, .about-section'           },
        { match: 'services',                     target: '#our-services, .explore-categories-section' },
        { match: 'brands',                       target: '#our-brands, .our-brands-section' },
      ];

      // Contacts that should open the modal instead of scrolling
      var modalMatches = ['customer support', 'contact'];

      document.addEventListener('click', function (e) {
        var link = e.target.closest('.site-footer-wrapper a, .footer-col a');
        if (!link) return;

        // Never intercept tel: / mailto: links
        var href = (link.getAttribute('href') || '').toLowerCase();
        if (href.startsWith('tel:') || href.startsWith('mailto:')) return;

        var text = link.textContent.trim().toLowerCase();

        // ── Modal links ──
        for (var m = 0; m < modalMatches.length; m++) {
          if (text.includes(modalMatches[m])) {
            e.preventDefault();
            e.stopImmediatePropagation();
            Drupal.behaviors.homesContactModal && Drupal.behaviors.homesContactModal.openModal();
            return;
          }
        }

        // ── Home link ──
        if (text === 'home') {
          e.preventDefault();
          e.stopImmediatePropagation();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // ── Section scroll links ──
        for (var i = 0; i < scrollMap.length; i++) {
          if (text.includes(scrollMap[i].match)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var selectors = scrollMap[i].target.split(', ');
            var target = null;
            for (var s = 0; s < selectors.length; s++) {
              target = document.querySelector(selectors[s].trim());
              if (target) break;
            }
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
          }
        }
      }, true); // ← capture phase: fires before Drupal's own handlers
    }
  };

})(Drupal);
