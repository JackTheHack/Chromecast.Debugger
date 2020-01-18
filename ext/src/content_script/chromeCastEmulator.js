chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'runScript') {
    // Page context    
    var event = new CustomEvent("ChromeCastEmulatorEvent", {detail: msg});
    window.dispatchEvent(event);
  }
});