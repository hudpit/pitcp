/**
 * A view to list every available {@link PIT_CP.model.Project}.
 * {@img shots/region-list.png Project List}
 */
Ext.define('PIT_CP.view.project.List',{
	extend:'Ext.view.View',
	alias:'widget.projectlist',
	store:'Projects',
	tpl:[
		'<table class="table table-striped table-hover">',
		'<tr>',
		'	<th>Region Name</th>',
		'	<th>Setup Key</th>',
		'	<th></th>',
		'</tr>',
		'<tpl for=".">',
		'<tr class="project">',
		'	<td>{project_title}</td>',
		'	<td>{setup_key}</td>',
		'	<td><button class="btn btn-primary" data-project_id="{project_id}">View Region</button></td>',
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
			click:function(e, btn){me.fireEvent('projectbtnclick', btn.getAttribute('data-project_id'))},
			delegate:'button'
		});

		me.callParent(arguments);
	}
})