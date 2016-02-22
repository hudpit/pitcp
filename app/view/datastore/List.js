/**
 * A view to list all the datastores available. 
 * {@img shots/datastore-list.png Datastore list}
 */
Ext.define('PIT_CP.view.datastore.List',{
	extend:'Ext.view.View',
	alias:'widget.datastorelist',
	store:'Datastores',
	tpl:[
		'<table class="table table-striped table-hover">',
		'<tr>',
		'	<th>Datastore Name</th>',
		'	<th>URL</th>',
		'	<th></th>',
		'</tr>',
		'<tpl for=".">',
		'<tr class="datastore">',
		'	<td>{datastore_title}</td>',
		'	<td>{datastore_url}</td>',
		'	<td><button class="btn btn-primary" data-datastore_id="{datastore_id}">Edit Datastore</button></td>',
		'</tr>',
		'</tpl>',
		'</table>'
	].join(''),
	itemSelector:'tr.project',
	autoScroll:true,
	initComponent:function(){
		var me = this;
		me.addListener({
			element:'el',
			click:function(e, btn){me.fireEvent('datastorebtnclick', btn.getAttribute('data-datastore_id'));},
			delegate:'button'
		});

		me.callParent(arguments);
	}
});
