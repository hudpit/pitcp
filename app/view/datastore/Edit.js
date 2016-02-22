/**
 * ##Overview
 * A view for editing a {@link PIT_CP.model.Datastore}. Contains all the validation
 * necessary to ensure the datastore is edited properly.
 * {@img shots/edit-datastore.png Datastore Info}
 */
Ext.define('PIT_CP.view.datastore.Edit',{
	extend:'Ext.form.Panel',
	alias:'widget.editDatastore',
	layout:'vbox',
	defaults:{
		width:'100%'
	},

	initComponent:function(){
		var me = this;
		var surl = /((^https):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*))\/?)/i;

		Ext.apply(Ext.form.field.VTypes, {
			surl:function(val, field){
				return surl.test(val);
			},
			surlText:'This field should be a Secure URL in the format "https:/'+'/www.example.com"'
		});
		Ext.applyIf(me, {
			items:[{
				flex:1,
				xtype:'fieldset',
				layout:'anchor',
				items:[{
					xtype:'hiddenfield',
					name:'datastore_id'
				},{
					fieldLabel:'Title',
					name:'datastore_title',
					xtype:'textfield'
				},{
					fieldLabel:'URL',
					xtype:'textfield',
					name:'datastore_url',
					vtype:'surl'
				}]
			}],
			bbar:[{text:'Update Datastore',action:"updateDatastore",ui:'bootstrap-primary'},'->', {text:"Delete Datastore", action:'deleteDatastore', datastore:me.datastore, ui:'bootstrap-danger'}],			
		});
		me.callParent(arguments);
		me.loadRecord(me.datastore);
	}
});