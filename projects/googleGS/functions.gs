function moveFiles(fileName) {
  // let fileName = "1050";
  let i = 1;
 while (files.hasNext()) {
  const file = files.next();
  console.log(file.getName());
  if (fileName == file.getName()) {
      file.moveTo(archFolder); // Will move file to a new folder
      //file.setTrashed(true) //will move file to trash
      break;
  }
  i++;
 }
 Logger.log(i);
}
//--------------------------------------------------------------------  
function Deletes(str) {
  let INT_R = 0;
  //Processing the user's response
    let values = wb.getSheetByName("Database").getDataRange().getValues();
    let lastRow = db.getLastRow();
    for (let i=0; i<values.length; i++) { 
      if(values[i][2] != str) {
       // Doing nothing.
      }
      else  {  
         //  Custoemr Found
        let INT_R = i+1;
        db.deleteRow(INT_R)
        wb.toast("",str+" Found and Deleted");
        break;
      }
    }
    // Customer not found check
    let lastRow1 = db.getLastRow();
    console.log("last Row = ",lastRow1);
    if (lastRow1 == lastRow) {
      wb.toast("",str+ " Not Found",10);
    }
  }
 //------------------------------------------------------------------------
function Updates(str) {
  //let values = wb.getSheetByName("Database").getDataRange().getValues();
  let values = db.getDataRange().getValues();
  for (let i=0; i<values.length; i++) { 
    if(values[i][2] == str) {
      let INT_R = i+1;
        console.log(INT_R);
        let values1 = [[inputForm.getRange("E11").getValue(), // Name
                 inputForm.getRange("E12").getValue(), // Address1
                 inputForm.getRange("E13").getValue(), //Adress2
                 inputForm.getRange("E14").getValue(), // City
                 inputForm.getRange("E15").getValue(), // State
                 inputForm.getRange("E16").getValue(), // Zip
                 inputForm.getRange("E17").getValue(), // email
                 inputForm.getRange("E18").getValue(), // Phone
                 inputForm.getRange("E19").getValue(), // Product
                 inputForm.getRange("E20").getValue(), // Cost
                 inputForm.getRange("E21").getValue(), // Paint
                 inputForm.getRange("E22").getValue()]]; //Notes
        debugger;
        if (values1[0][0].length == 0){
          //wb.toast('Name is blank');
          let new1 = db.getRange(INT_R,4,1,1).getValues();
          values1[0][0] = new1;
        }
        if (values1[0][1].length == 0){
          //wb.toast('Address 1 is blank');
          let new1 = db.getRange(INT_R,5,1,1).getValues();
          values1[0][1] = new1;
        }
        if (values1[0][2].length == 0){
          //wb.toast('Address 2 is blank');
          let new1 = db.getRange(INT_R,6,1,1).getValues();
          values1[0][2] = new1;
        }
        if (values1[0][3].length == 0){
          //wb.toast('City is blank');
          let new1 = db.getRange(INT_R,7,1,1).getValues();
          values1[0][3] = new1;
        }
        if (values1[0][4].length == 0){
          //wb.toast('State is blank');
          let new1 = db.getRange(INT_R,8,1,1).getValues();
          values1[0][4] = new1;
        }
        if (values1[0][5].length == 0){
          //wb.toast('Zip Code is blank');
          let new1 = db.getRange(INT_R,9,1,1).getValues();
          values1[0][5] = new1;
        }
        if (values1[0][6].length == 0){
          //wb.toast('Email is blank');
          let new1 = db.getRange(INT_R,10,1,1).getValues();
          values1[0][6] = new1;
        }
        if (values1[0][7].length == 0){
          //wb.toast('Phone is blank');
          let new1 = db.getRange(INT_R,11,1,1).getValues();
          values1[0][7] = new1;
        }
        if (values1[0][8].length == 0){
          //wb.toast('Product is blank');
          let new1 = db.getRange(INT_R,12,1,1).getValues();
          values1[0][8] = new1;
        }
        if (values1[0][9].length == 0){
          //wb.toast('Cost is blank');
          let new1 = db.getRange(INT_R,13,1,1).getValues();
          values1[0][9] = new1;
        }
        if (values1[0][10].length == 0){
          //wb.toast('Paint is blank');
          let new1 = db.getRange(INT_R,14,1,1).getValues();
          values1[0][10] = new1;
        }
        if (values1[0][11].length == 0){
          //wb.toast('Notes is blank');
          let new1 = db.getRange(INT_R,15,1,1).getValues();
          values1[0][11] = new1;
        }
        db.getRange(INT_R,4,1,12).setValues(values1);
        SpreadsheetApp.getUi().alert('"Data Updated"');
    }
  }
}
//------------------------------------------------------------------------------------------------------------
function ClearInput() {
  let rangesToClear = ['E11:G23'];
  for (let i=0; i<rangesToClear.length; i++) { 
    inputForm.getRange(rangesToClear[i]).clearContent();
  }
}
//------------------------------------------------------------------------------------------------------------
function getInvoiceNumber() {
  let cell = db.getRange("C4")
  if (!cell.isBlank()) {
    let ID = db.getRange(db.getLastRow(),3).getValue()
    console.log(ID);
    ID++;
    let blankRow = db.getLastRow()+1;
    db.getRange(blankRow, 2).setValue(new Date()).setNumberFormat('yyyy-mm-dd');
    db.getRange(blankRow, 3).setValue(ID);
    console.log(ID);
  } else {
    console.log("in Else")
    let blankRow = db.getLastRow()+1;
    db.getRange(blankRow, 2).setValue(new Date()).setNumberFormat('yyyy-mm-dd');
    db.getRange(blankRow, 3).setValue("1000");
  }
}
