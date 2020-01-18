var STATUS_MESSAGE = 'status';
var ERROR_MESSAGE = 'errorMessage';

// Saves options to chrome.storage
function save_options() {
    var jsonSettings = document.getElementById('jsonSettings').value;
    var defaultNamespace = document.getElementById('defaultNamespace').value;

    if(!IsJsonString(jsonSettings))
    {
        SetStatusText(ERROR_MESSAGE, "JSON is invalid.");
        return;
    }

    chrome.storage.sync.set({
      commands: jsonSettings,
      namespace: defaultNamespace
    }, function() {
      // Update status to let user know options were saved.
      SetStatusText(STATUS_MESSAGE, "Options saved.");
    });
  }

  function SetStatusText(elementId, str)
  {
    var status = document.getElementById(elementId);
      status.textContent = str;
      setTimeout(function() {
        status.textContent = '';
      }, 750);
  }

  function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {

    var textareas = document.getElementsByTagName('textarea');
    var count = textareas.length;
    for(var i=0;i<count;i++){
        textareas[i].onkeydown = function(e){
            if(e.keyCode==9 || e.which==9){
                e.preventDefault();
                var s = this.selectionStart;
                this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                this.selectionEnd = s+1; 
            }
        }
    }

    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      commands: "{\"commands\": [{\"name\": \"Start\", \"command\":{ },\"description\": \"\",\"hasParameter\": true}]}",
      namespace: "urn:x-cast:com.reactnative.googlecast.example"
    }, function(items) {
      document.getElementById('jsonSettings').value = items.commands;
      document.getElementById('defaultNamespace').value = items.namespace;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save_options);