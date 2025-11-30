const sliderData = [
  {
    title: 'Užutrakio Dvaras',
    location: 'Trakai',
    description:
      'Užutrakio dvaras – dvaras, stovintis prie Galvės ežero, Užutrakyje. Kraštovaizdžio architektūros draustinis nuo 1993 m.',
    image: 'assets/card1.jpg',
  },
  {
    title: 'Kryžių Kalnas',
    location: 'Šiauliai',
    description:
      'Piligriminė vieta su tūkstančiais kryžių iš Lietuvos ir užsienio. Įtraukta į Kultūros vertybių registrą.',
    image: 'assets/card5.jpg',
  },
  {
    title: 'Merkinės Piramidė',
    location: 'Česukai',
    description:
      'Vienas lankomiausių Dzūkijos objektų, garsėjantis sveikatinimo istorijomis ir vis augančiu lankytojų skaičiumi.',
    image: 'assets/card7.jpg',
  },
];

const elements = {
  title: document.querySelector('[data-slider-title]'),
  location: document.querySelector('[data-slider-location]'),
  description: document.querySelector('[data-slider-description]'),
  primary: document.querySelector('[data-slider-primary]'),
  secondary: document.querySelector('[data-slider-secondary]'),
  track: document.querySelector('[data-slider-track]'),
  carousel: document.querySelector('.feature-slider__carousel'),
  prevButton: document.querySelector('.feature-slider__arrow--prev'),
  nextButton: document.querySelector('.feature-slider__arrow--next'),
};

let currentIndex = 0;
let cards = [];
let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;

const isMobile = () => window.innerWidth <= 1024;

const updateSlide = (index) => {
  const slide = sliderData[index];
  if (!slide) return;

  elements.title.textContent = slide.title;
  elements.location.textContent = slide.location;
  elements.description.textContent = slide.description;
  elements.primary.setAttribute('href', '#');
  elements.secondary.setAttribute('href', '#');

  if (isMobile()) {
    cards.forEach((card) => {
      const isActiveCard = Number(card.dataset.index) === index && card.dataset.clone !== 'true';
      card.classList.toggle('is-active', isActiveCard);
    });
  } else {
    cards.forEach((card) => {
      const isActiveCard =
        Number(card.dataset.index) === index && card.dataset.clone !== 'true';
      card.classList.toggle('is-active', isActiveCard);
    });

    const activeCard = cards.find(
      (card) => card.classList.contains('is-active'),
    );
    if (elements.track && elements.carousel && activeCard) {
      const carouselWidth = elements.carousel.offsetWidth;
      const cardWidth = activeCard.offsetWidth;
      const offset = activeCard.offsetLeft - (carouselWidth - cardWidth) / 2;
      elements.track.style.transform = `translateX(-${offset}px)`;
    }
  }
};

const clampIndex = (value) => {
  if (value < 0) return sliderData.length - 1;
  if (value >= sliderData.length) return 0;
  return value;
};

const goToSlide = (index) => {
  currentIndex = clampIndex(index);
  updateSlide(currentIndex);
};

const buildExtendedSlides = () => {
  if (sliderData.length <= 1) {
    return sliderData.map((slide, index) => ({
      slide,
      index,
      isClone: false,
    }));
  }

  const lastIndex = sliderData.length - 1;
  return [
    { slide: sliderData[lastIndex], index: lastIndex, isClone: true },
    ...sliderData.map((slide, index) => ({ slide, index, isClone: false })),
    { slide: sliderData[0], index: 0, isClone: true },
  ];
};

const initTrack = () => {
  if (!elements.track) return;
  elements.track.innerHTML = '';
  
  if (isMobile()) {
    if (elements.track) {
      elements.track.style.transform = 'none';
    }
    cards = sliderData.map((slide, index) => {
      const card = document.createElement('article');
      card.className = 'feature-slider__card';
      card.dataset.index = String(index);
      card.innerHTML = `
        <div class="feature-slider__card-inner">
          <img src="${slide.image}" alt="${slide.title}" />
        </div>
      `;
      elements.track.appendChild(card);
      return card;
    });
  } else {
    const slides = buildExtendedSlides();
    cards = slides.map(({ slide, index, isClone }) => {
      const card = document.createElement('article');
      card.className = 'feature-slider__card';
      card.dataset.index = String(index);
      if (isClone) {
        card.dataset.clone = 'true';
      }
      card.innerHTML = `
        <div class="feature-slider__card-inner">
          <img src="${slide.image}" alt="${slide.title}" />
        </div>
      `;
      elements.track.appendChild(card);
      return card;
    });
  }
};

const handleSwipe = () => {
  const swipeDistance = touchStartX - touchEndX;
  const minSwipeDistance = 50;

  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(currentIndex - 1);
    }
  }
};

if (
  elements.title &&
  elements.location &&
  elements.description &&
  elements.track
) {
  initTrack();
  updateSlide(currentIndex);

  elements.prevButton?.addEventListener('click', () => goToSlide(currentIndex - 1));
  elements.nextButton?.addEventListener('click', () => goToSlide(currentIndex + 1));

  window.addEventListener('resize', () => {
    initTrack();
    updateSlide(currentIndex);
  });

  if (elements.carousel && isMobile()) {
    elements.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isSwiping = true;
    });

    elements.carousel.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      const touchCurrentX = e.changedTouches[0].screenX;
      const swipeDistance = Math.abs(touchStartX - touchCurrentX);
      
      if (swipeDistance > 10) {
        e.preventDefault();
      }
    });

    elements.carousel.addEventListener('touchend', (e) => {
      if (isSwiping) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        isSwiping = false;
      }
    });
  }
}

