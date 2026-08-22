document.addEventListener('DOMContentLoaded', function () {
    const body = document.querySelector('body');
    const html = document.querySelector('html');

    // // Кастомный селект
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

        // Кастомный селект для выбора кол-ва товаров на странице
        if (selectElement.closest('.show-select')) {
            new Choices(selectElement, {
                searchEnabled: false,
                itemSelectText: '',
                placeholder: false,
                placeholderValue: '',
                shouldSort: false,
                position: 'auto',
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

    // Слайдер (slider-images)
    const sliderImages = document.querySelectorAll('.slider-images');
    if (sliderImages) {
        sliderImages.forEach((slider) => {
            const parent = slider.closest('.product-item__images');

            let prevEl = null;
            let nextEl = null;

            if (parent) {
                prevEl = parent.querySelector('.slider-button--prev');
                nextEl = parent.querySelector('.slider-button--next');
            }

            const swiper = new Swiper(slider, {
                slidesPerView: 'auto',
                spaceBetween: 14,

                breakpoints: {
                    1281: {
                        slidesPerView: 4,
                        spaceBetween: 18,
                    },
                },

                navigation: {
                    nextEl: nextEl,
                    prevEl: prevEl,
                },
            });

            swiper.on('click', function () {
                const clickedSlide = swiper.clickedSlide;

                if (!clickedSlide) return;

                const slideButton = clickedSlide.querySelector('.product-item__slide');

                if (!slideButton) return;

                if (window.innerWidth > 1280) {
                    if (!parent) return;

                    const mainImage = parent.querySelector('.product-item__image');

                    if (!mainImage) return;

                    const openVideoButton = mainImage.querySelector('.product-item__open-video');

                    if (!openVideoButton) return;

                    const oldVideo = mainImage.querySelector('video');

                    if (oldVideo) {
                        oldVideo.pause();
                        oldVideo.currentTime = 0;
                    }

                    mainImage.querySelectorAll('img, video').forEach((element) => {
                        element.remove();
                    });

                    const slideVideo = slideButton.querySelector('video');

                    if (slideVideo) {
                        const videoClone = slideVideo.cloneNode(true);

                        videoClone.classList.remove('active');

                        mainImage.insertBefore(videoClone, openVideoButton);
                    }

                    const slideImage = slideButton.querySelector('img');

                    if (slideImage) {
                        const imageClone = slideImage.cloneNode(true);

                        imageClone.style.display = '';

                        mainImage.insertBefore(imageClone, openVideoButton);
                    }

                    swiper.slideTo(swiper.clickedIndex, 300);
                } else {
                    const video = slideButton.querySelector('video');
                    const image = slideButton.querySelector('img');

                    if (!video) return;

                    if (image) {
                        image.style.display = 'none';
                    }

                    video.classList.add('active');

                    video.play().catch(() => {
                        console.log('Видео не удалось запустить');
                    });
                }
            });

            if (parent) {
                const openVideoButton = parent.querySelector('.product-item__open-video');

                if (openVideoButton) {
                    openVideoButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (window.innerWidth <= 1280) return;

                        const mainImage = this.closest('.product-item__image');

                        if (!mainImage) return;

                        const image = mainImage.querySelector('img');
                        const video = mainImage.querySelector('video');

                        if (!video) return;

                        if (image) {
                            image.style.display = 'none';
                        }

                        video.classList.add('active');

                        video.play().catch(() => {
                            console.log('Видео не удалось запустить');
                        });
                    });
                }
            }
        });
    }

    // Слайдер (slider-auto)
    const sliderAuto = document.querySelectorAll('.slider-auto');

    sliderAuto.forEach((slider) => {
        const swiper = new Swiper(slider, {
            slidesPerView: 'auto',
            spaceBetween: 9,

            breakpoints: {
                1590: {
                    slidesPerView: 'auto',
                    spaceBetween: 11,
                },
            },
        });

        swiper.on('click', function () {
            if (!swiper.clickedSlide) return;

            swiper.slideTo(swiper.clickedIndex, 300);
        });
    });

    // Слайдер (slider-tabs)
    const sliderTabs = document.querySelectorAll('.slider-tabs');

    sliderTabs.forEach((slider) => {
        const swiper = new Swiper(slider, {
            slidesPerView: 'auto',
            spaceBetween: 8,

            breakpoints: {
                1590: {
                    slidesPerView: 'auto',
                },
            },
        });
    });

    // Слайдер (2)
    const slider2 = document.querySelectorAll('.slider-2');
    if (slider2) {
        slider2.forEach((slider) => {
            const parent = slider.closest('.section');
            const prevEl = parent.querySelector('.slider-button--prev');
            const nextEl = parent.querySelector('.slider-button--next');

            const swiper = new Swiper(slider, {
                slidesPerView: 'auto',
                spaceBetween: 14,
                breakpoints: {
                    992: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                },
                navigation: {
                    nextEl: nextEl,
                    prevEl: prevEl,
                },
            });
        });
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

    // Слайдер (slider-more)
    const sliderMore = document.querySelectorAll('.slider-more');
    if (sliderMore) {
        sliderMore.forEach((slider) => {
            const parent = slider.closest('.section');
            const prevEl = parent.querySelector('.slider-button--prev');
            const nextEl = parent.querySelector('.slider-button--next');

            const swiper = new Swiper(slider, {
                slidesPerView: 'auto',
                spaceBetween: 14,
                breakpoints: {
                    1590: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                    769: {
                        spaceBetween: 14,
                        slidesPerView: 'auto',
                    },
                },
                navigation: {
                    nextEl: nextEl,
                    prevEl: prevEl,
                },
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
                    fileNameElement.textContent = this.files[0].name;
                    fileNameElement.classList.add('selected');
                } else {
                    fileNameElement.textContent = 'Файл не выбран';
                    fileNameElement.classList.remove('selected');
                }
            });

            const button = input.closest('.form-file__btn').querySelector('button');
            if (button) {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    input.click();
                });
            }
        });
    }

    // Модальное окно для сертификата
    const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: false,
        autoplayVideos: true,
        title: true,
        openEffect: 'fade',
        closeEffect: 'fade',
        slideEffect: 'slide',
        moreLength: 60,
        arrows: true,
        closeButton: true,
    });

    window.lightbox = lightbox;

    function addCustomCloseButton() {
        document.querySelectorAll('.gslide-media').forEach(function (media) {
            const slide = media.closest('.gslide');
            if (!slide) return;

            if (media.querySelector('.gslide-custom-close')) return;

            const closeBtn = document.createElement('button');
            closeBtn.className = 'gslide-custom-close';

            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.lightbox) {
                    window.lightbox.close();
                }
            });

            media.style.position = 'relative';
            media.appendChild(closeBtn);

            const originalClose = slide.querySelector('.gslide-close');
            if (originalClose) {
                originalClose.style.display = 'none';
            }
        });
    }

    lightbox.on('open', function () {
        setTimeout(addCustomCloseButton, 50);
    });

    lightbox.on('slide_changed', function () {
        setTimeout(addCustomCloseButton, 50);
    });

    setTimeout(addCustomCloseButton, 200);

    // Табы
    const tabsContainers = document.querySelectorAll('[data-tabs]');

    if (tabsContainers.length) {
        tabsContainers.forEach((container, index) => {
            const tabButtons = container.querySelectorAll('.tabs-item');
            const tabContents = container.querySelectorAll('.tab-content');

            const mobileTab = 'tab-description';
            const desktopTab = 'tab-characteristic';
            const breakpoint = 1280;

            function activateTab(tabId) {
                tabButtons.forEach((btn) => {
                    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
                });

                tabContents.forEach((content) => {
                    content.classList.toggle('active', content.getAttribute('data-tab-content') === tabId);
                });
            }

            function setResponsiveTab() {
                const isMobile = window.innerWidth <= breakpoint;

                if (isMobile) {
                    if (container.querySelector(`[data-tab="${mobileTab}"]`)) {
                        activateTab(mobileTab);
                    }
                } else {
                    if (container.querySelector(`[data-tab="${desktopTab}"]`)) {
                        activateTab(desktopTab);
                    }
                }
            }

            setResponsiveTab();

            window.addEventListener('resize', setResponsiveTab);

            tabButtons.forEach((button) => {
                button.addEventListener('click', function () {
                    const tabId = this.getAttribute('data-tab');
                    activateTab(tabId);
                });
            });
        });
    }

    // Открытие / закрытие dropdown
    const optionSelect = document.querySelectorAll('.option-select');
    const selectList = document.querySelector('.select-list');

    if (optionSelect && selectList) {
        optionSelect.forEach((option) => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();

                const parent = this.closest('.option');

                if (!parent) return;

                const optionDropdown = parent.querySelector('.option-dropdown');

                if (!optionDropdown) return;

                document.querySelectorAll('.option-dropdown.active').forEach((dropdown) => {
                    if (dropdown !== optionDropdown) {
                        dropdown.classList.remove('active');
                    }
                });

                optionDropdown.classList.toggle('active');

                if (optionDropdown.classList.contains('active')) {
                    const dropdownBody = optionDropdown.querySelector('.option-dropdown__body');

                    if (dropdownBody && !dropdownBody.dataset.simplebarInitialized) {
                        new SimpleBar(dropdownBody, {
                            autoHide: true,
                            forceVisible: 'y',
                        });

                        dropdownBody.dataset.simplebarInitialized = 'true';
                    }
                }
            });
        });

        document.querySelectorAll('.option').forEach((option, optionIndex) => {
            const dropdown = option.querySelector('.option-dropdown');
            const optionTitle = option.querySelector('.option-select span');
            const applyButton = option.querySelector('.option-dropdown__button');

            if (!dropdown || !optionTitle || !applyButton || !selectList) {
                return;
            }

            const groupId = `option-${optionIndex}`;

            applyButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const checkedCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');

                let selectItem = selectList.querySelector(`.select-item[data-group="${groupId}"]`);

                if (checkedCheckboxes.length === 0) {
                    if (selectItem) {
                        selectItem.remove();
                    }

                    dropdown.classList.remove('active');

                    return;
                }

                if (!selectItem) {
                    selectItem = document.createElement('div');

                    selectItem.classList.add('select-item');

                    selectItem.dataset.group = groupId;

                    selectItem.innerHTML = `
                <span class="select-item__title">
                    ${optionTitle.textContent.trim()}
                </span>

                <ul class="select-item__list"></ul>
            `;

                    selectList.appendChild(selectItem);
                }

                const itemList = selectItem.querySelector('.select-item__list');

                itemList.innerHTML = '';

                checkedCheckboxes.forEach((checkbox) => {
                    const label = dropdown.querySelector(`label[for="${checkbox.id}"]`);

                    if (!label) return;

                    const li = document.createElement('li');

                    li.dataset.id = checkbox.id;

                    li.innerHTML = `
                <span class="select-item__text">
                    ${label.textContent.trim()}
                </span>

                <button
                    type="button"
                    class="select-item__remove"
                    aria-label="Удалить"
                ></button>
            `;

                    itemList.appendChild(li);
                });

                dropdown.classList.remove('active');
            });
        });

        selectList.addEventListener('click', function (e) {
            const removeButton = e.target.closest('.select-item__remove');

            if (!removeButton) return;

            e.stopPropagation();

            const li = removeButton.closest('li');

            if (!li) return;

            const checkboxId = li.dataset.id;

            const checkbox = document.getElementById(checkboxId);

            if (checkbox) {
                checkbox.checked = false;
            }

            const selectItem = li.closest('.select-item');

            li.remove();

            if (selectItem && selectItem.querySelectorAll('.select-item__list li').length === 0) {
                selectItem.remove();
            }
        });

        document.addEventListener('click', function (e) {
            const isInsideSelect = e.target.closest('.option-select');
            const isInsideDropdown = e.target.closest('.option-dropdown');

            if (!isInsideSelect && !isInsideDropdown) {
                document.querySelectorAll('.option-dropdown.active').forEach((dropdown) => {
                    dropdown.classList.remove('active');
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
