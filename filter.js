const paid = [];
const hide = () => {
  try {
    const items = document.getElementsByClassName('c-grid__item item');
    const store = 'Download 3D model';
    for (let i = 0; i < items.length; i++) {
      if (!items[i].textContent.includes(store) && !paid.includes(items[i])) {
        paid.push(items[i]);
        const item_name =
          items[i].querySelector('.model-name__label').textContent;
        console.log('Removed : ' + item_name);
        items[i].style.display = 'none';
      }
    }
  } catch (e) {}
};

const show = () => {
  for (let i = 0; i < paid.length; i++) {
    paid[i].style.display = 'block';
  }
  paid.length = 0;
};

const handleRequest = (state) => {
  if (state === 'OFF') {
    document.removeEventListener('DOMSubtreeModified', hide);
    show();
  } else {
    hide();
    document.addEventListener('DOMSubtreeModified', hide);
  }
};

chrome.storage.local.get(['state']).then(({ state }) => {
  handleRequest(state);
});

chrome.runtime.onMessage.addListener((request) => {
  handleRequest(request.state);
});
