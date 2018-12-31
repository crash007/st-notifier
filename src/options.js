function save_options() {
    var intervall = Number(document.getElementById('intervall').value);
    var notify = document.getElementById('notify').checked;
    console.log(intervall);
    console.log(notify);

    chrome.storage.local.set({
      'intervall': intervall,
      'notify': notify
    }, function() {

        chrome.alarms.get("checkerAlarm", function(alarm){
            alarm.periodInMinutes = intervall;
            console.log(alarm);
        });
      

      var status = document.getElementById('status');
      status.textContent = 'Sparat';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        'intervall': true,
        'notify': 15
    }, function(items) {
      document.getElementById('intervall').value = items.intervall;
      document.getElementById('notify').checked = items.notify;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',save_options);