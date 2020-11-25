import galleryItems from './gallery-items.js';

const refs = {
  jsGallery: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  modalImage: document.querySelector('.lightbox__image'),
  closeModalBtn: document.querySelector('[data-action="close-lightbox"]'),
  modalOverlay: document.querySelector('.lightbox__overlay'),
};

//добавляем слушатели события 'click'
refs.jsGallery.addEventListener('click', clickElementGallery);
refs.closeModalBtn.addEventListener('click', onCloseModal);
refs.modalOverlay.addEventListener('click', onOverlayClick);
refs.modalImage.addEventListener('click', onClickImage);

const createLiElement = () => {
  const createGalleryMarkup = galleryItems.reduce((acc, el, index) => {
    acc += `
    <li class="gallery__item">
        <a
            class="gallery__link"
            href=${el.original}
        >
            <img
            class="gallery__image"
            src=${el.preview}
            data-source=${el.original}
            data-id=${index}
            alt=${el.description}
            />
        </a>
    </li>   
    `;
    return acc;
  }, '');

  refs.jsGallery.insertAdjacentHTML('afterBegin', createGalleryMarkup);
};

createLiElement();


function setBigImg(src, alt, id) {
  refs.modalImage.setAttribute('src', src);
  refs.modalImage.setAttribute('alt', alt);
  refs.modalImage.dataset.id = id;
}

function clickElementGallery(event) {
  event.preventDefault();

  //если не IMG то возврат 
  const smallImg = event.target;
  if (smallImg.nodeName !== 'IMG') {
    return;
  }

  //добавление в модалку большой картинки
  setBigImg(smallImg.dataset.source, smallImg.alt, smallImg.dataset.id);

  
  refs.modal.classList.add('is-open');
  window.addEventListener('keydown', onButtonKeyPress);
}

function onCloseModal() {
  window.removeEventListener('keydown', onButtonKeyPress);

  //чистим атрибуты чтобы не мигали артефакты при закрытии и повторном открытии модалки
  refs.modalImage.setAttribute('alt', '');
  refs.modalImage.setAttribute('src', '');

  refs.modal.classList.remove('is-open');
}

// закрытие картинки при нажатии на оверлее
function onOverlayClick(event) {
  if (event.currentTarget === event.target) {
    onCloseModal();
  }
}

function getBigIMG(currentId, add) {
  let newId = Number(currentId) + add;
  if (newId === -1) {
    //зациклип
    newId = galleryItems.length - 1;
  }
  if (newId === galleryItems.length) {
    //зациклип
    newId = 0;
  }

  setBigImg(
    galleryItems[newId].original,
    galleryItems[newId].description,
    newId,
  );
}

function onButtonKeyPress(event) {
  const ESC = 'Escape';
  const ARROW_RIGHT = 'ArrowRight';
  const ARROW_LEFT = 'ArrowLeft';

  switch (event.code) {
    case ESC:
      onCloseModal();
      break;
    case ARROW_RIGHT:
      getBigIMG(refs.modalImage.dataset.id, +1);
      break;
    case ARROW_LEFT:
      getBigIMG(refs.modalImage.dataset.id, -1);
      break;
  }
}

function onClickImage(event) {
  getBigIMG(refs.modalImage.dataset.id, +1);
}

