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
    const modalContent = document.querySelector('.modal-content-expanded');
    const imageTitle = document.getElementById('imageTitle');
    const closeBtn = document.querySelector('.close');
    const clickableFrames = document.querySelectorAll('.clickable-frame');
    let currentFrameIndex = -1;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDeltaX = 0;
    let isSwipeAnimating = false;
    let isTouchSwiping = false;
    let isHorizontalGesture = false;

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

    const getNextIndex = function(direction) {
        if (clickableFrames.length === 0 || currentFrameIndex < 0) {
            return -1;
        }

        return direction === 'next'
            ? (currentFrameIndex + 1) % clickableFrames.length
            : (currentFrameIndex - 1 + clickableFrames.length) % clickableFrames.length;
    };

    const resetSwipeStyles = function() {
        if (modalContent) {
            modalContent.style.transition = '';
            modalContent.style.transform = '';
            modalContent.style.opacity = '';
        }
    };

    const navigateModal = function(direction) {
        const nextIndex = getNextIndex(direction);
        if (nextIndex === -1 || isSwipeAnimating) {
            return;
        }

        openModalAtIndex(nextIndex, true);
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
        if (!modal.classList.contains('active') || event.touches.length !== 1 || isSwipeAnimating) {
            return;
        }

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchDeltaX = 0;
        isTouchSwiping = false;
        isHorizontalGesture = false;
        resetSwipeStyles();
    }, { passive: true });

    modal.addEventListener('touchmove', function(event) {
        if (!modal.classList.contains('active') || event.touches.length !== 1 || isSwipeAnimating) {
            return;
        }

        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        const horizontalIntentThreshold = 8;

        if (!isTouchSwiping) {
            if (Math.abs(deltaX) < horizontalIntentThreshold && Math.abs(deltaY) < horizontalIntentThreshold) {
                return;
            }

            isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY);
            isTouchSwiping = true;
        }

        if (!isHorizontalGesture) {
            return;
        }

        event.preventDefault();
        touchDeltaX = deltaX;

        const maxDrag = window.innerWidth * 0.45;
        const clampedDelta = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
        const progress = Math.min(Math.abs(clampedDelta) / (window.innerWidth * 0.4), 1);

        if (modalContent) {
            modalContent.style.transition = 'none';
            modalContent.style.transform = `translateX(${clampedDelta}px)`;
            modalContent.style.opacity = `${1 - progress * 0.45}`;
        }
    }, false);

    modal.addEventListener('touchend', function(event) {
        if (!modal.classList.contains('active') || event.changedTouches.length !== 1 || isSwipeAnimating) {
            return;
        }

        if (!isTouchSwiping || !isHorizontalGesture) {
            resetSwipeStyles();
            return;
        }

        const minSwipeDistance = Math.min(120, window.innerWidth * 0.18);
        const shouldNavigate = Math.abs(touchDeltaX) >= minSwipeDistance;

        if (!shouldNavigate) {
            if (modalContent) {
                modalContent.style.transition = 'transform 0.18s ease, opacity 0.18s ease';
                modalContent.style.transform = 'translateX(0)';
                modalContent.style.opacity = '1';
            }
            window.setTimeout(() => {
                resetSwipeStyles();
            }, 190);
            return;
        }

        isSwipeAnimating = true;
        const direction = touchDeltaX < 0 ? 'next' : 'previous';
        const nextIndex = getNextIndex(direction);

        if (nextIndex === -1) {
            isSwipeAnimating = false;
            resetSwipeStyles();
            return;
        }

        const exitOffset = touchDeltaX < 0 ? -window.innerWidth * 0.45 : window.innerWidth * 0.45;
        const entryOffset = touchDeltaX < 0 ? window.innerWidth * 0.28 : -window.innerWidth * 0.28;

        if (modalContent) {
            modalContent.style.transition = 'transform 0.14s ease, opacity 0.14s ease';
            modalContent.style.transform = `translateX(${exitOffset}px)`;
            modalContent.style.opacity = '0';
        }

        window.setTimeout(() => {
            openModalAtIndex(nextIndex, true);
            if (modalContent) {
                modalContent.style.transition = 'none';
                modalContent.style.transform = `translateX(${entryOffset}px)`;
                modalContent.style.opacity = '0';
            }

            window.requestAnimationFrame(() => {
                if (modalContent) {
                    modalContent.style.transition = 'transform 0.18s ease, opacity 0.18s ease';
                    modalContent.style.transform = 'translateX(0)';
                    modalContent.style.opacity = '1';
                }
            });

            window.setTimeout(() => {
                isSwipeAnimating = false;
                resetSwipeStyles();
            }, 190);
        }, 140);
    }, { passive: true });

    modal.addEventListener('touchcancel', function() {
        isTouchSwiping = false;
        isHorizontalGesture = false;
        touchDeltaX = 0;
        resetSwipeStyles();
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
            navigateModal('next');
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            navigateModal('previous');
        }
    });

});
