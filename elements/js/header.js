export function initializeHeaderAndNavigation() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let scrolled = false;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {

            header.classList.remove('fixed');
            if (!scrolled) {
                header.style.visibility = 'hidden';
            }
        } else if (scrollTop < lastScrollTop && !scrolled) {

            header.classList.add('fixed');
            header.style.visibility = 'visible';
        }

        if (scrollTop === 0) {

            scrolled = false;
        }

        lastScrollTop = scrollTop;
    });

    const burgerElement = document.querySelector('.burger');
    const navElement = document.querySelector('.overlayer');
    const navContainer = document.querySelector('.burger__nav__container');

    burgerElement.addEventListener('click', function () {
        const isExpanded = burgerElement.getAttribute('aria-expanded') === 'true';
        burgerElement.setAttribute('aria-expanded', !isExpanded);
        navElement.style.left = isExpanded ? '100vw' : '0';
    });

    navContainer.addEventListener('click', function () {
        const isExpanded = burgerElement.getAttribute('aria-expanded') === 'true';
        burgerElement.setAttribute('aria-expanded', !isExpanded);
        navElement.style.left = isExpanded ? '100vw' : '0';
    });
}
