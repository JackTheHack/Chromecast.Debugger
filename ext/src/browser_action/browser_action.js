function initCookie() {

}

//Emulates the command to the Chromecast
function runCommand(srcCommand, parameter)
{
  chrome.storage.sync.get({
    commands: "{\"commands\": [{\"name\": \"Start\", \"command\":{ },\"description\": \"\",\"hasParameter\": true}]}",
    namespace: "urn:x-cast:com.reactnative.googlecast.example"
  }, function(items) {
    document.getElementById('defaultNamespace').value = items.namespace;
  });

  var commandJson = JSON.stringify(srcCommand.command);

  if(srcCommand.hasParameter)
  {
    commandJson = commandJson.replace("[PAREMETER]", parameter);
  }

  var scriptToRun = '';
  if(!srcCommand.isEvent)
  {
    var namespaceValue = srcCommand.namespace && srcCommand.namespace.length ? srcCommand.namespace : window.defaultNamespace;
    var customEventCode = "quizcast.CastEmulator.triggerCustomEvent('"+ namespaceValue +"', {data:"+commandJson+"})";
    scriptToRun = customEventCode;
  }else
  {
    var eventCode = "quizcast.CastEmulator.triggerEvent('"+srcCommand.eventName+"', {data:"+commandJson+"})";;  
    scriptToRun = eventCode;
  }

  chrome.tabs.getSelected(null, function(tab){
    //chrome.tabs.executeScript(tab.id, {code: scriptToRun}, function(response) {
        //console.log('Script executed - '+response);
    //});
    chrome.tabs.sendMessage(tab.id, {action:'runScript', scriptToRun: scriptToRun}, function(){});
    //chrome.runtime.sendMessage({action: "runScript", scriptToRun: scriptToRun}, function(response) {});
  });
}

function initCommandsUi(commands) {
  var commandsContainer = document.getElementById("commandsContainer");

  console.log('Creating commands UI');

  commands.forEach(element => {
    console.log("Creating elements for " + element.name);
    var commandDiv = document.createElement("div");

    var commandTitle = document.createElement("span");
    commandTitle.innerText = element.name;
    commandTitle.className = element.hasParameter ? "commandTitleWithParameter" : "commandTitle";
    commandDiv.appendChild(commandTitle);

    if(element.hasParameter)
    {
      var commandParameter = document.createElement("input");
      commandParameter.innerText = element.name;
      commandParameter.className = "commandParameter";
      commandDiv.appendChild(commandParameter);
    }

    var commandRun = document.createElement("button");
    commandRun.innerText = "Run";
    commandRun.className = "commandRun";    
    commandRun.command = element;
    commandRun.parameterElement = commandParameter;
    commandRun.onclick = function(ev){
      
      var srcCommand = ev.srcElement.command;
      var parameter = '';

      if(srcCommand.hasParameter)
      {
        parameter = ev.srcElement.parameterElement.value;
      }

      runCommand(srcCommand, parameter);      
    }
    commandDiv.appendChild(commandRun);

    
  
    commandsContainer.appendChild(commandDiv);
  });

  

}

document.addEventListener("DOMContentLoaded", function () {

      // Use default value color = 'red' and likesColor = true.
      chrome.storage.sync.get({
        commands: "[{\"name\": \"Start\",\"description\": \"\",\"hasParameter\": true}]",
        namespace: "urn:x-cast:com.reactnative.googlecast.example"
      }, function(items) {
        var parsedSettings = JSON.parse(items.commands);
        console.log("Settings loaded...");
        if(parsedSettings)
        {
          commandList = parsedSettings;
          window.defaultNamespace = items.namespace;
          initCommandsUi(commandList);
        }
      });

});