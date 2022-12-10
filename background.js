const handleSwitch = (state) => {
  chrome.storage.sync.set({ state });
  chrome.action.setBadgeText({ text: state });
  chrome.action.setBadgeBackgroundColor({
    color: state === 'ON' ? '#90EE90' : '#FF0000',
  });
};

chrome.runtime.onInstalled.addListener((object) => {
  const externalUrl = 'https://sketchfab.com/';
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl });
  }
  handleSwitch('ON');
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['state']).then(({ state }) => {
    handleSwitch(state);
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (
    tab.url.startsWith('https://sketchfab.com') ||
    tab.url.startsWith('http://sketchfab.com')
  ) {
    chrome.storage.sync.get(['state']).then(async ({ state }) => {
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
