// +--------+-----------------+
// |labelA  |   input field A |
// |--------|-----------------|
// |labelB  |   input field B |
// +--------+-----------------+
    

// define a date input list for the table 


var dueDateFields = [ 'dueDate1', 'dueDate2', 'dueDate3', 'dueDate4', 'dueDate5', 'dueDate6', 'dueDate7', 'dueDate8'];

function prepareDueDateItemsForTable(dueDateFields) {
	var dueDateList = [];
	for(var i =0; i< dueDateFields.length; i++){
		
		var label = {
		        xtype: 'label',
		        text: 'Due Date ' + (i+1) + " : ",
		        style:'display:block; padding: 5px 30px 5px 10px;'
		};
		dueDateList.push(label);
		
		var dueDate = {
				xtype : 'datefield',
				format : 'Y-m-d',
				emptyText : 'Select ' + dueDateFields[i],
				itemId : dueDateFields[i],
				name : dueDateFields[i]
			};
			
//			var dueDate = Ext.create('Ext.form.field.Date', {			
//				format : 'Y-m-d',
//				emptyText : 'Select ' + dueDateFields[i],
//				itemId : dueDateFields[i],
//				name : dueDateFields[i]
//			});
		
		dueDateList.push(dueDate);
	}
	return dueDateList;
}


var dueDateItems = prepareDueDateItemsForTable(dueDateFields);
console.log(" got " + dueDateItems.length + " dueDateItems");

Ext.define('DueDateListPanel', {
	extend: 'Ext.panel.Panel',
	extend : 'Ext.form.Panel',  // need this form.Panel rather than panel.Panel to support item.getForm() in AJAX call;
	panelType: 'baseData',  // need this type to gather fields for AJAX call
	itemId : "myDueDateListPanel",
    height: 160,
    width: 362,
    autoScroll: true,	
    title: 'Table Layout',
    layout: {
        type: 'table',            
        columns: 2
    }
});


var container;  // set global for debug

Ext.onReady(function() {
  var a = Ext.create('DueDateListPanel',  {  items: dueDateItems});
  container = Ext.create('Ext.panel.Panel',{
		renderTo: Ext.getBody(),
		width:420
	} );

	container.add(a);

});


function refresh(){
	Ext.resumeLayouts(true);
}


    