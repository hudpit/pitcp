/**
 * A view containing the form to create a new {@link PIT_CP.model.Project}.
  * {@img shots/add-region.png New Project}
 */
Ext.define('PIT_CP.view.project.New',{
	extend:'Ext.form.Panel',
	alias:'widget.newProject',
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
			name:'project_title',
			xtype:'textfield'
		},{
			fieldLabel:'Datastore',
			xtype:'combo',
			name:'datastore_id',
			store:'Datastores',
			displayField:'datastore_title',
			valueField:'datastore_id'
		},{
			xtype:'label',
			html:'<a class="newDs" href="#">Create New Datastore</a>'
		}]
	}],
	bbar:[{text:'Add Region',action:"saveNewProject",ui:'bootstrap-primary'}],
	initComponent:function(){
		var me = this;

		me.addListener({
			element:'el',
			click:function(e, btn){me.fireEvent('linkclick', this)},
			delegate:'a.newDs'
		})
		me.callParent(arguments)
	}
})