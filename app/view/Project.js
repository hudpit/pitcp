/**
 * The main Project view, which is loaded into the mainContainer of {@link PIT_CP.view.Main}
 */
Ext.define("PIT_CP.view.Project", {
    extend: 'Ext.tab.Panel',
    alias:'widget.projects',
    title:'Regions',
    layout:'fit',
    items:[{
		xtype:'panel',
		title:'All Regions',
		itemId:'mainProjectList',
		tbar:[
			{text:'Add Region',action:'newProject',ui:'bootstrap-primary'}
		],
		layout:'fit',
		items:[{
			xtype:'projectlist'
		}]    	
    }],
    initComponent:function(){
    	var me = this;

    	me.callParent(arguments);
    }
});