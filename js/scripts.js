/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const sideNavContainer = document.body.querySelector('#sideNav');
    const mobileNavTitle = document.querySelector('#sideNav .navbar-brand .d-block.d-lg-none');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );

    const syncMobileNavTitle = () => {
        if (!mobileNavTitle) {
            return;
        }

        let activeNavLink = document.querySelector('#navbarResponsive .nav-link.active');

        // Fallback when active class has not yet updated.
        if (!activeNavLink) {
            const sections = document.querySelectorAll('.resume-section[id]');
            const navOffset = sideNavContainer ? sideNavContainer.offsetHeight : 0;
            const probeY = window.scrollY + navOffset + 24;
            let currentSection = null;

            sections.forEach((section) => {
                if (section.offsetTop <= probeY) {
                    currentSection = section;
                }
            });

            if (currentSection) {
                activeNavLink = document.querySelector(`#navbarResponsive .nav-link[href="#${currentSection.id}"]`);
            }
        }

        mobileNavTitle.textContent = activeNavLink
            ? activeNavLink.textContent.trim()
            : 'Portfolio';
    };

    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }

            // Let scroll and active states settle before reflecting title text.
            window.setTimeout(syncMobileNavTitle, 120);
        });
    });

    // Allow tapping the mobile top bar area to toggle the collapsed menu.
    if (sideNavContainer) {
        sideNavContainer.addEventListener('click', (event) => {
            if (window.getComputedStyle(navbarToggler).display === 'none') {
                return;
            }

            if (event.target.closest('.navbar-toggler')) {
                return;
            }

            if (event.target.closest('#navbarResponsive')) {
                return;
            }

            navbarToggler.click();
        });
    }

    document.addEventListener('scroll', syncMobileNavTitle, { passive: true });
    window.addEventListener('hashchange', syncMobileNavTitle);
    window.setTimeout(syncMobileNavTitle, 0);

    // Image frame modal functionality
    const modal = document.getElementById('imageModal');
    const expandedImage = document.getElementById('expandedImage');
    const imageTitle = document.getElementById('imageTitle');
    const closeBtn = document.querySelector('.close');
    const clickableFrames = document.querySelectorAll('.clickable-frame');
    let currentFrameIndex = -1;
    let touchStartX = 0;
    let touchStartY = 0;

    const openModalAtIndex = function(index, shouldScrollToSection = false) {
        if (index < 0 || index >= clickableFrames.length) {
            return;
        }

        const frame = clickableFrames[index];
        const imageSrc = frame.getAttribute('data-image');
        const title = frame.getAttribute('data-title');
        const section = frame.closest('.resume-section');
        currentFrameIndex = index;
        expandedImage.src = imageSrc;
        imageTitle.textContent = title;
        modal.classList.add('active');

        if (shouldScrollToSection && section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    clickableFrames.forEach((frame, index) => {
        frame.addEventListener('click', function() {
            openModalAtIndex(index);
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Swipe navigation on touch devices mirrors left/right arrow keys.
    modal.addEventListener('touchstart', function(event) {
        if (!modal.classList.contains('active') || event.touches.length !== 1) {
            return;
        }

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    modal.addEventListener('touchend', function(event) {
        if (!modal.classList.contains('active') || event.changedTouches.length !== 1) {
            return;
        }

        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 40;

        // Ignore mostly vertical gestures so normal scroll behavior is preserved.
        if (Math.abs(deltaX) < minSwipeDistance || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
        }

        if (deltaX < 0) {
            openModalAtIndex((currentFrameIndex + 1) % clickableFrames.length, true);
        } else {
            openModalAtIndex((currentFrameIndex - 1 + clickableFrames.length) % clickableFrames.length, true);
        }
    }, { passive: true });

    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (!modal.classList.contains('active')) {
            return;
        }

        if (event.key === 'Escape') {
            modal.classList.remove('active');
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            openModalAtIndex((currentFrameIndex + 1) % clickableFrames.length, true);
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            openModalAtIndex((currentFrameIndex - 1 + clickableFrames.length) % clickableFrames.length, true);
        }
    });

});
