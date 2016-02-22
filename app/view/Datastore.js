/**
 * Main datastore view. This panel will be placed in the mainContainer of
 * {@link PIT_CP.view.Main}.
 */
Ext.define("PIT_CP.view.Datastore", {
    extend: 'Ext.Panel',
    alias:'widget.datastores',
    title:'Datastore',
    layout:'fit',
    tbar:[{
    	text:'Add New Datastore',
    	action:'addNewDatastore',
        ui:'bootstrap-primary'
    }],
    items:[{
    	xtype:'datastorelist'
    }]
});