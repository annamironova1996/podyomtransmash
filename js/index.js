document.addEventListener('DOMContentLoaded', function () {
    const body = document.querySelector('body');
    const html = document.querySelector('html');

    // Кастомный селект
    const selectElements = document.querySelectorAll('[data-select]');

    selectElements.forEach((selectElement) => {
        // Кастомный селект для выбора языка в шапке
        if (selectElement.closest('.header-lang')) {
            new Choices(selectElement, {
                searchEnabled: false,
                itemSelectText: '',
                placeholder: false,
                placeholderValue: '',
                shouldSort: false,
                position: 'auto',
            });

            const options = selectElement.options;
            const urls = {};
            for (let i = 0; i < options.length; i++) {
                urls[options[i].value] = options[i].getAttribute('data-url');
            }

            selectElement.addEventListener('change', function (e) {
                const url = urls[this.value];
                if (url && url !== '#!') {
                    window.location.href = url;
                }
            });
        }
    });

    // Открытие/закрытие мобильного меню
    const headerBurger = document.querySelector('.header-burger');
    const headerMobile = document.querySelector('.header-mobile');

    if (headerBurger && headerMobile) {
        headerBurger.addEventListener('click', function () {
            if (headerMobile.classList.contains('active')) {
                headerBurger.classList.remove('close');
                headerMobile.classList.remove('active');
                headerMobile.setAttribute('hidden', '');
            } else {
                headerBurger.classList.add('close');
                headerMobile.classList.add('active');
                headerMobile.removeAttribute('hidden');
            }

            if (body.classList.contains('no-scroll')) {
                body.classList.remove('no-scroll');
                html.classList.remove('no-scroll');
            } else {
                body.classList.add('no-scroll');
                html.classList.add('no-scroll');
            }
        });
    }

    // Скрыть мобильное меню на экранах больше 1280
    function hiddenMobileMenu() {
        if (headerMobile && headerBurger) {
            if (innerWidth > 1280) {
                headerMobile.setAttribute('hidden', true);
                headerMobile.classList.remove('active');
                headerBurger.classList.remove('close');
            }
        }
    }
    hiddenMobileMenu();

    // Открыть/закрыть подменю в мобильном меню
    document.addEventListener('click', function (e) {
        const button = e.target.closest('.header-mobile__open-btn');
        if (button) {
            button.classList.toggle('active');
            const parentLi = button.closest('li');
            if (parentLi) {
                const childList = parentLi.querySelector('ul');
                if (childList) {
                    childList.classList.toggle('active');
                }
            }
        }
    });

    // Открытие/закрытие контактов на экранах <=  1500
    function initMobileContact() {
        const isMobile = window.innerWidth <= 1500;
        const contactBtn = document.querySelector('.header-contacts__open-btn');
        const contactBlock = document.querySelector('.header-contacts');

        if (!contactBtn || !contactBlock) return;

        contactBtn.removeEventListener('click', toggleContact);
        document.removeEventListener('click', handleOutsideClick);

        if (isMobile) {
            contactBtn.addEventListener('click', toggleContact);
            document.addEventListener('click', handleOutsideClick);
        } else {
            contactBlock.classList.remove('active');
        }
    }
    initMobileContact();

    function toggleContact(e) {
        e.stopPropagation();
        const parent = this.closest('.header-contacts');
        parent?.classList.toggle('active');
    }

    function handleOutsideClick(e) {
        const contactBlock = document.querySelector('.header-contacts');
        if (!contactBlock?.classList.contains('active')) return;

        const isClickInside = contactBlock.contains(e.target) || e.target.closest('.header-contacts__open-btn');

        if (!isClickInside) {
            contactBlock.classList.remove('active');
        }
    }

    // Слайдер (3)
    const slider3 = document.querySelectorAll('.slider-3');
    if (slider3) {
        slider3.forEach((slider) => {
            const parent = slider.closest('.section');
            const prevEl = parent.querySelector('.slider-button--prev');
            const nextEl = parent.querySelector('.slider-button--next');

            const swiper = new Swiper(slider, {
                slidesPerView: 'auto',
                initialSlide: window.innerWidth >= 1590 ? 1 : 0,
                spaceBetween: 14,
                breakpoints: {
                    1590: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                },
                navigation: {
                    nextEl: nextEl,
                    prevEl: prevEl,
                },
            });

            window.addEventListener('resize', () => {
                const newIndex = window.innerWidth >= 1590 ? 1 : 0;
                if (swiper.activeIndex !== newIndex) {
                    swiper.slideTo(newIndex, 0);
                }
            });
        });
    }

    // Слайдер (4)
    const slider4 = document.querySelectorAll('.slider-4');
    if (slider4) {
        slider4.forEach((slider) => {
            const parent = slider.closest('.section');
            const prevEl = parent.querySelector('.slider-button--prev');
            const nextEl = parent.querySelector('.slider-button--next');

            const swiper = new Swiper(slider, {
                slidesPerView: 'auto',
                initialSlide: window.innerWidth >= 1590 ? 1 : 0,

                spaceBetween: 14,
                breakpoints: {
                    1590: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                        loop: false,
                    },
                    769: {
                        spaceBetween: 14,
                        slidesPerView: 'auto',
                        loop: false,
                    },
                },
                navigation: {
                    nextEl: nextEl,
                    prevEl: prevEl,
                },
            });

            window.addEventListener('resize', () => {
                const newIndex = window.innerWidth >= 1590 ? 1 : 0;
                if (swiper.activeIndex !== newIndex) {
                    swiper.slideTo(newIndex, 0);
                }
            });
        });
    }

    // Прикрепление файлов
    const fileInputs = document.querySelectorAll('.form-file input[type="file"]');

    if (fileInputs) {
        fileInputs.forEach((input) => {
            const fileNameElement = input.closest('.form-file').querySelector('.form-file__name');

            input.addEventListener('change', function () {
                if (this.files && this.files.length > 0) {
                    // Показываем имя файла
                    fileNameElement.textContent = this.files[0].name;
                    fileNameElement.classList.add('selected');
                } else {
                    // Возвращаем стандартный текст
                    fileNameElement.textContent = 'Файл не выбран';
                    fileNameElement.classList.remove('selected');
                }
            });

            // Дополнительно: сброс при клике на кнопку "прикрепить файл"
            const button = input.closest('.form-file__btn').querySelector('button');
            if (button) {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    input.click();
                });
            }
        });
    }

    // Загрузка фона loading lazy
    const sections = document.querySelectorAll('[data-lazy-desktop]');
    const loadedSections = new Set();

    function loadBackground(element) {
        if (loadedSections.has(element)) return;

        const isMobile = window.innerWidth <= 768;
        const desktopSrc = element.dataset.lazyDesktop;
        const mobileSrc = element.dataset.lazyMobile;
        const src = isMobile && mobileSrc ? mobileSrc : desktopSrc;

        if (!src) return;

        const img = new Image();
        img.onload = function () {
            element.style.backgroundImage = `url(${src})`;
            element.classList.add('loaded');
            loadedSections.add(element);
        };
        img.src = src;
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadBackground(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '200px',
                threshold: 0.1,
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
    } else {
        sections.forEach((section) => {
            loadBackground(section);
        });
    }

    let lastWidth = window.innerWidth;

    window.addEventListener('resize', function () {
        initMobileContact();
        hiddenMobileMenu();

        const currentWidth = window.innerWidth;
        const isMobile = currentWidth <= 768;
        const wasMobile = lastWidth <= 768;

        if (isMobile !== wasMobile) {
            sections.forEach((element) => {
                if (loadedSections.has(element)) {
                    const desktopSrc = element.dataset.lazyDesktop;
                    const mobileSrc = element.dataset.lazyMobile;
                    const src = isMobile && mobileSrc ? mobileSrc : desktopSrc;

                    if (src) {
                        const img = new Image();
                        img.onload = function () {
                            element.style.backgroundImage = `url(${src})`;
                        };
                        img.src = src;
                    }
                }
            });
        }
        lastWidth = currentWidth;
    });
});
