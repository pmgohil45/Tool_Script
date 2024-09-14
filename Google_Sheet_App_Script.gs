var sheetName = 'YOUR_SHEET_NAME'
var scriptProp = PropertiesService.getScriptProperties()

function intialSetup() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost(e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1

    var newRow = headers.map(function (header) {
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}


<!---========================== HTML Form, JS Script, Custome Toast Code ==========================--->

<html>
<head>
  <style>
    /* Toast container */
    #toast {
      visibility: hidden;
      min-width: 250px;
      margin-left: -125px;
      background-color: #FF6600;
      color: #000;
      text-align: center;
      border-radius: 5px;
      padding: 16px;
      position: fixed;
      z-index: 1;
      left: 50%;
      bottom: 30px;
      font-size: 17px;
      opacity: 0;
      transition: opacity 0.5s, bottom 0.5s;
    }
    
    /* Show the toast */
    #toast.show {
      visibility: visible;
      opacity: 1;
      bottom: 50px;
    }
  </style>
</head>
<body>
  <!-- Your Form filed name is same as in google sheet -->
  <form name="google-sheet" method="post" role="form">
    <input type="text" name="name" id="name" placeholder="Name" required />
    <input type="number" name="number" id="number" placeholder="Number" required />
    <input type="email" name="email" id="email" placeholder="Email" required />
    <input type="text" name="message" id="message" placeholder="Message" required />
    <button type="submit">Sign Up Now</button>
  </form>
  <!-- Toast container -->
  <div id="toast"></div>

  <!-- Google Sheet Script -->
  <script>
    const scriptURL = 'YOUR_SCRIPT_URL_GENERATE_FROM_THE_APP_SCRIPT_IN_GOOGLE_SHEETS'
    const form = document.forms['google-sheet']

    form.addEventListener('submit', e => {
      e.preventDefault()
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => showToast("Registered Successfully... Thank you "+document.getElementById('name').value+" !"))
        .catch(error => console.error('Error!',error.message))
    })

    function showToast(message) {
       const toast = document.getElementById("toast");
       toast.innerHTML = message;
       toast.className = "show";
       setTimeout(() => {
         toast.className = toast.className.replace("show", "");
        }, 3000); // Toast disappears after 3 seconds
    }
  </script>
</body>
</html>
