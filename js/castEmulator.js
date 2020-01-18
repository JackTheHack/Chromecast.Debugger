/* eslint-disable no-eval */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const isInChromecast = window.navigator.userAgent.indexOf('CrKey') >= 0;

const castEmulator = isEmulation => ({
  triggerCustomEvent(channelUrl, event) {
    console.log(channelUrl, event);
    if (this.customListeners && this.customListeners[channelUrl]) {
      this.customListeners[channelUrl].forEach((listener) => {
        listener(event);
      });
    }
  },

  triggerEvent(eventName, event) {
    console.log(eventName, event);
    if (this.eventListeners && this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach((listener) => {
        listener(event);
      });
    }
  },

  register(context, manager) {
    this.castContext = context;
    this.castManager = manager;
  },

  addEventListener(eventName, handleCustomEvent) {
    if (!isEmulation) {
      this.castManager.addEventListener(eventName, handleCustomEvent);
    } else {
      this.eventListeners = [];
      if (!this.eventListeners[eventName]) {
        this.eventListeners[eventName] = [];
      }
      this.eventListeners[eventName].push(handleCustomEvent);
    }
  },

  addCustomMessageListener(channelUrl, handleCustomEvent) {
    if (!isEmulation) {
      this.castContext.addCustomEventListener(channelUrl, handleCustomEvent);
    } else {
      this.customListeners = [];
      if (!this.customListeners[channelUrl]) {
        this.customListeners[channelUrl] = [];
      }
      this.customListeners[channelUrl].push(handleCustomEvent);
    }
  },

  isEmulation() {
    return !isInChromecast;
  },
});


if (isInChromecast) {
  console.log('Running in Chromecast');
} else {
  console.warn('Running in Chrome browser');
}

window.quizcast = {};
window.quizcast.CastEmulator = castEmulator(!isInChromecast);
window.quizcast.CastEmulator.IS_EMULATION = !isInChromecast;

window.addEventListener('ChromeCastEmulatorEvent', (evt) => {
  console.log(evt);
  if (evt.detail && evt.detail.action === 'runScript') {
    eval(evt.detail.scriptToRun);
  }
}, false);
