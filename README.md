# Chromecast.Debugger
Debugger extension for Chromecast receiver apps

# How to use:
- Install the extension by manually adding the extension and pointing to the "ext" folder
- Configure the commands for the extension in the options
- Add the script on the receiver page (already done in the Quizcast app)
- Use the script proxy calls to subscribe to Chromecast events instead of original one (the proxy will detect whether page is in Chromecast or emulated automatically)
- Run the commands from the extension icon in the top-right corner

# Example of the receiver registration:

`window.quizcast.CastEmulator.register(context, playerManager);
window.quizcast.CastEmulator.addCustomMessageListener(CHANNEL_URL, (customEvent) => {
    console.log('>>>>>>>>>>>>>>>>> CUSTOM EVENT <<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log(customEvent);    
    // handle customEvent.
  });`

 `window.quizcast.CastEmulator.addEventListener(
    cast.framework.events.EventType.MEDIA_STATUS,
    handleMediaStatusEvent,
  );`

# Example of the commands configuration:

`name` - command name  
`description` - command description  
`command` - data that would be sent to the Chromecast receiver on the button click  
`hasParameter` - if true the parameter could be supplied with the data and all occurances of [PARAMETER] in the data would be replaced with the parameter value  
`namespace` - if supplied would override the default namespace for custom events  
`isEvent` - if true data would be passed as event instead of custome event  
`eventName` - if isEvent is true eventName is required to specify the name of the event to trigger  
