function onOpen() {
// Add a custom menu to the spreadsheet.
  // SpreadsheetApp.getUi() // Or DocumentApp, SlidesApp, or FormApp.
    ui.createMenu('PDF/Email/Archive')
    .addItem('Process invoices', 'Export2PDF')
    .addItem('Send emails', 'sendEmail')
    .addSeparator()
    .addItem('Archive Customer', 'archCustomer')
    .addItem('Reset template', 'ClearAll')
    .addToUi(); 
}
//-------------------------------------------------------------------------
function archCustomer() {
    let response = ui.prompt('Enter Invoice Number:', ui.ButtonSet.OK_CANCEL);
    if (response.getSelectedButton() == ui.Button.OK) {
    let name = response.getResponseText();
    let str = name;
    let values = wb.getSheetByName("Database").getDataRange().getValues();
    for (let i=0; i<values.length; i++) { 
      let row = values[i];
      if(values[i][2] == str) {
        let j = i + 1;
        let foundRow = db.getRange(j, 1, 1, 12).getValues();
        archSheet.getRange(archSheet.getLastRow()+1, 1, 1, 12).setValues(foundRow);
        moveFiles(str);
      }
    }
    }
}
//---------------------------------------------------------------------------------------
function Export2PDF() {
  let Blob = wb.getAs('application/pdf');
  let fileName = invoicesheet.getRange("G17").getValue();
  inputForm.hideSheet();
  db.hideSheet();
  outSheet.hideSheet();
  data.hideSheet();
  let pdf = invoiceFolder.createFile(Blob).setName(fileName);
  inputForm.showSheet();
  db.showSheet();
  outSheet.showSheet();
  data.showSheet();
  let button = ui.alert('Send Invoice via Email?',
    ui.ButtonSet.YES_NO);
  if (button == ui.Button.YES) {
    let result = ui.prompt('Enter in Customers email address ',
    ui.ButtonSet.OK_CANCEL);
    let button = result.getSelectedButton();
    let str = result.getResponseText();
    if (button == ui.Button.OK) {
        wb.toast('Sending EMail');
        GmailApp.sendEmail(str,'Invoice: '+fileName,'See attachd file', {
        attachments: [pdf]
        });
    } else {
      wb.toast('Request Canceld');
    }
  } else {
    wb.toast("Request Canceled");
  }
}
//------------------------------------------------------------------------------
function sendEmail() {

let response = ui.prompt('Enter Invoice Number:', ui.ButtonSet.OK_CANCEL);

  if (response.getSelectedButton() == ui.Button.OK) {
    let name = response.getResponseText();
    let str = name;
    let values = db.getDataRange().getValues();
    for (let i=0; i<values.length; i++) { 
      let row = values[i];
      if(values[i][2] == str) {
          let j = i + 1;
          let emailAddress = db.getRange(j,10,1,1).getValue();
          var subject = 'Invoice '+ str; // Replace with your email subject
          var body = "Please find the attached file."; // Plain text body of the email
          var file = DriveApp.getFilesByName(str).next(); // Replace 'Example.pdf' with your file's name
          GmailApp.sendEmail(emailAddress, subject, body, {
            attachments: [file.getAs(MimeType.PDF)] 
          });
          break;
      }
      else if(i == values.length -1) {
        wb.toast('Invoice not Found','STATUS',5);
      }
    } 
  }
}
