const handleSwitch = (state) => {
  chrome.storage.local.set({ state });
  chrome.action.setBadgeText({ text: state });
  chrome.action.setBadgeBackgroundColor({
    color: state === 'ON' ? '#90EE90' : '#FF0000',
  });
};

chrome.runtime.onInstalled.addListener(() => {
  handleSwitch('ON');
});

chrome.action.onClicked.addListener(async (tab) => {
  if (
    tab.url.startsWith('https://sketchfab.com') ||
    tab.url.startsWith('http://sketchfab.com')
  ) {
    chrome.storage.local.get(['state']).then(async ({ state }) => {
      if (state === 'ON') {
        chrome.tabs
          .sendMessage(tab.id, {
            state: 'OFF',
          })
          .then(() => {
            handleSwitch('OFF');
          });
      } else {
        chrome.tabs
          .sendMessage(tab.id, {
            state: 'ON',
          })
          .then(() => {
            handleSwitch('ON');
          });
      }
    });
  }
});
