/**
 * A view to create a new datastore. Contains all validation necessary to ensure
 * a properly formatted datastore is submitted.
 * {@img shots/add-datastore.png Add Datastore}
 */
Ext.define('PIT_CP.view.datastore.New',{
	extend:'Ext.form.Panel',
	alias:'widget.newDatastore',
	layout:'vbox',
	defaults:{
		width:'100%'
	},
	items:[{
		flex:1,
		xtype:'fieldset',
		layout:'anchor',
		items:[{
			fieldLabel:'Title',
			name:'datastore_title',
			xtype:'textfield',
			allowBlank:false,
			vtype:'datastoreTitle'
		},{
			fieldLabel:'URL',
			xtype:'textfield',
			name:'datastore_url',
			vtype:'surl',
			emptyText:'https://',
			allowBlank:false
		}]
	}],
	bbar:[{text:'Add Datastore',action:"saveNewDatastore",ui:'bootstrap-primary'}],
	initComponent:function(){
		var me = this;

		var surl = /((^https):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*))\/?)/i;

		Ext.apply(Ext.form.field.VTypes, {
			surl:function(val, field){
				return surl.test(val);
			},
			surlText:'This field should be a Secure URL in the format "https:/'+'/www.example.com"'
		});

		Ext.apply(Ext.form.field.VTypes,{
			datastoreTitle:function(val, field){
				return val.trim().length > 0;
			},
			datastoreTitleText:'This field must not be blank'
		});
		me.callParent(arguments);
	}
});