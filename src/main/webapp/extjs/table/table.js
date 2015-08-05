// +--------+-----------------+
// |labelA  |   input field A |
// |--------|-----------------|
// |labelB  |   input field B |
// +--------+-----------------+

// define a date input list inside the table 

Ext.create('Ext.panel.Panel', {

	renderTo : Ext.getBody(),
	title : 'Table Layout',
	layout : {
		type : 'table',
		columns : 2
	},
	items : [ {
		html : 'labelA'
	}, new Ext.form.field.Date({}), {
		html : 'labelB'
	}, new Ext.form.field.Date({}) ]

});
