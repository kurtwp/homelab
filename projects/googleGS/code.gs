
  const wb       = SpreadsheetApp.getActiveSpreadsheet();
  const inputForm    = wb.getSheetByName("Input"); //Data entry Sheet
  const db = wb.getSheetByName("Database"); //Database Sheet
  const data = wb.getSheetByName("Data"); //Data Sheet
  const invoicesheet = wb.getSheetByName("Invoice"); //Auto Create Invoice
  const outSheet = wb.getSheetByName("Output"); //Customer search results
  const testSheet = wb.getSheetByName("test"); // Test Sheet
  const ui = SpreadsheetApp.getUi();
  const menu = SpreadsheetApp.getUi().createMenu('Save to PDF')
  const invoiceFolder = DriveApp.getFolderById('1bEjxb-56qJRzWUYhMX4EhaijqkKis3Mx')
  const archFolder = DriveApp.getFolderById('11QiMdLWL1o3UwaNr_FTXDjcJ0tfARmSt')  
  const archWB = SpreadsheetApp.openById('1IPXxgGXVIIZhfzxNpaQGkMH2pYdNQjYgAZhiTDQXePA') //ID of Workbook Archive
  const archSheet = archWB.getSheetByName('arch')
  const allFiles = DriveApp.getFiles()
  const files = DriveApp.getFolderById('1bEjxb-56qJRzWUYhMX4EhaijqkKis3Mx').getFiles(); // Get all files under folder 2024Invoice

//--------------------------------------------------------------------------------------------------------
function SubmitData() {
 getInvoiceNumber() // Calling function
  //Input Values
  let values = [[inputForm.getRange("E11").getValue(),
                 inputForm.getRange("E12").getValue(),
                 inputForm.getRange("E13").getValue(),
                 inputForm.getRange("E14").getValue(),
                 inputForm.getRange("E15").getValue(),
                 inputForm.getRange("E16").getValue(),
                 inputForm.getRange("E17").getValue(),
                 inputForm.getRange("E18").getValue(),
                 inputForm.getRange("E19").getValue(),
                 inputForm.getRange("E20").getValue(),
                 inputForm.getRange("E21").getValue(),
                 inputForm.getRange("E22").getValue()]];
  let blankRow = db.getLastRow()
  db.getRange(db.getLastRow(), 4, 1, 12).setValues(values);
  //Filling out Invoice
  let getNumber = db.getRange(blankRow,3).getValue();
  invoicesheet.getRange("G17").setValue(getNumber);
  //Using the Array to pull data 
  invoicesheet.getRange("D14").setValue(new Date()).setNumberFormat('yyyy-mm-dd');
  invoicesheet.getRange("C17").setValue(values[0][0]);
  invoicesheet.getRange("C19").setValue(values[0][1]);
  invoicesheet.getRange("C21").setValue(values[0][7]);
  invoicesheet.getRange("E20").setValue(values[0][8]);
  invoicesheet.getRange("C24").setValue(values[0][8]);
  invoicesheet.getRange("G24").setValue(values[0][9]);
  // Combining the CITY, STATE, and ZIP CODE and storing the values in address
  let address = inputForm.getRange("E14").getValue() + " " + inputForm.getRange("E15").getValue() + " " + inputForm.getRange("E16").getValue();
  invoicesheet.getRange("C20").setValue(address);
  //--------------------------------------------------------------
  let getCell = invoicesheet.getRange("C18").getValue();
  if (getCell == "Company Name") {
    invoicesheet.getRange("C18").setValue(" ");
  }
  ClearInput()  // Calling Function
  wb.setActiveSheet(wb.getSheetByName('Invoice'), true);  // redirects sheet Database
}
//------------------------------------------------------------------------------------------------------------------
function ClearAll(){
  //wb.getRange("Input!E11:E23").clearContent();
  ClearInput();
  let rangesToClear = ['Invoice!D14', "Invoice!C17", "Invoice!C18", "Invoice!C19", "Invoice!C20", "Invoice!E17", "Invoice!E20", "Invoice!G17", "Invoice!G20", "Invoice!C24:C28"];
  console.log(rangesToClear.length)
  console.log(rangesToClear)
  console.log(rangesToClear[0])
  console.log(rangesToClear[4])
  for (let i=0; i<rangesToClear.length; i++) { 
    wb.getRange(rangesToClear[i]).clearContent();
  }
  wb.getRange("Invoice!C24:C28").clearContent();
  // Add default values to cells
  invoicesheet.getRange("C17").setValue("Name");
  wb.getRange("Invoice!C18").setValue("Company Name");
  wb.getRange("Invoice!C19").setValue("Street Addres");
  wb.getRange("Invoice!C20").setValue("City, State, Zip");
  wb.getRange("Invoice!C21").setValue("Phone Number");
  invoicesheet.getRange("G24:G29").setValue(0);
  /* **********************************
   invoicesheet.getRange("C24:C28").setValue("Items");
    Or the same can be done as below
  wb.getRange("Invoice!C24:C28").setValue("Items");
  ***************************************
  */
  wb.getRange("Invoice!E17").setValue("Name  ");
  wb.getRange("Invoice!E20").setValue("Project Name");
  wb.getRange("Invoice!G17").setValue("Invoice Number  ");
  wb.getRange("Invoice!G20").setValue(" ");
  debugger;
}
//------------------------------------------------------------------------------------------------------------------
function Search() {
  let i = 0;
  let response = ui.prompt('Please enter your name:', ui.ButtonSet.OK_CANCEL);
  let lastR = outSheet.getRange("B1:B1");
  if (response.getSelectedButton() == ui.Button.OK && !lastR.isBlank()) {
    let name = response.getResponseText();
    let str = name;
    // let values = wb.getSheetByName("Database").getDataRange().getValues();
    let foundText = db.createTextFinder(str);
    let foundItems = foundText.findAll();
    outSheet.getRange(1,1,outSheet.getLastRow(), outSheet.getLastColumn()).clearContent();
    foundItems.forEach(cell=>{
      let row = cell.getRow();
      let foundRow = db.getRange(row, 1, 1, 12).getValues();
      outSheet.getRange(outSheet.getLastRow()+1, 1, 1, 12).setValues(foundRow);
      i++;
    })
    if (i == 0) {
      wb.toast('',str+"Customer not found",5);
    }
    wb.setActiveSheet(wb.getSheetByName('Output'), true); // redirects to sheet output
  } else if (response.getSelectedButton() == ui.Button.OK && lastR.isBlank()) {
    let name = response.getResponseText();
    let str = name;
    let foundText = db.createTextFinder(str);
    let foundItems = foundText.findAll();
    foundItems.forEach(cell=>{
      let row = cell.getRow();
      let foundRow = db.getRange(row, 1, 1, 12).getValues();
      outSheet.getRange(outSheet.getLastRow()+1, 1, 1, 12).setValues(foundRow);
      i++;
  })
    if (i == 0) {
      wb.toast("",str+'Not old Found',5);
    } else if (i== 1) {

    }
    wb.setActiveSheet(wb.getSheetByName('Output'), true);  // redirects sheet Output
 }
}
//------------------------------------------------------------------------------------------------------------------
function Update() {

  let result = ui.prompt("Enter Invoice number being updated ",
  ui.ButtonSet.OK_CANCEL);
  let button = result.getSelectedButton();
  let str = result.getResponseText();
  Logger.log(str);
  if (button == ui.Button.OK) {
    // call function and pass the value
    Updates1(str);
    ClearInput();
  } else {
    wb.toast('Exiting Update',5);
  }
  
}
//------------------------------------------------------------------------------------------------------------------
function Delete() {
 
  let result = ui.prompt("Confirm Delete!!","Enter Invoice number being deleted ",
  ui.ButtonSet.OK_CANCEL);
  let button = result.getSelectedButton();
  let str = result.getResponseText();
  Logger.log(str);
  if (button == ui.Button.OK) {
    // call function and pass the value
    Deletes(str);
  } else if (str || str.trim() === "" || (str.trim()).length === 0) {
    wb.toast('Exiting Delete',5);
  } else {
    wb.toast('Exiting Delete',5);
  }
  
}
//-----------------------------------------------------------------------------
