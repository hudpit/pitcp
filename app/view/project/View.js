/**
 * The main view for a {@link PIT_CP.model.Project}. Lists all the information
 * about the project and includes buttons to edit/delete it.
 * {@img shots/region-info.png Region Info}
 */
Ext.define('PIT_CP.view.project.View',{
	extend:'Ext.Panel',
	alias:'widget.projectview',
	requires:[
		'Ext.form.FieldSet',
		'Ext.form.field.ComboBox',
		'Ext.form.field.Hidden',
		'Ext.container.ButtonGroup'
	],

	/**
	 * Setup the component in here, since we need to do some permissions
	 * checking to determine which functions to give access to, such as edit/delete
	 */
	initComponent:function(){
		var me = this;

		var thisUser = Ext.getStore('UserLogin').getAt(0);
		if(thisUser.get('user_id') == me.project.get('user_id')){
			me.isOwner = true;
		}else{
			me.isOwner = false;
		}

		Ext.applyIf(me,{
			title:me.project.get('project_title'),
			layout:'vbox',
			defaults:{
				width:'100%'
			},
			items:[{
				xtype:'form',
				fieldDefaults:{
					labelAlign:'top',
					style:{
						width:'100%',
						height:'34px'
					},
					labelStyle:'font-weight:bold'
					
				},
				flex:1,
				items:[{
					xtype:'container',
					padding:10,
					title:'Project Info',
					defaultType:'textfield',					
					items:[{
						xtype:'hiddenfield',
						name:'project_id'
					},{
						xtype:'hiddenfield',
						name:'user_id'
					},{
						xtype:'textfield',
						fieldLabel:'Setup Key',
						name:'setup_key',
						vtype:'setupkey',
						readOnly:!me.isOwner
					},{
						fieldLabel:'Region Name',
						name:'project_title',
						readOnly:!me.isOwner
					},{
						fieldLabel:'Datastore',
						size:'100%',
						xtype:'combo',
						displayField:'datastore_title',
						valueField:'datastore_id',
						store:'Datastores',
						name:'datastore_id',
						readOnly:!me.isOwner

					},{
						xtype:'buttongroup',
						columns:2,
						items:[{
							xtype:'button',
							text:'Update Region',
							action:'updateProject',
							disabled:!me.isOwner,
							ui:'bootstrap-success'	
						},{
							xtype:'button',
							text:'Delete Region',
							action:'deleteProject',
							project:this.project,
							disabled:!me.isOwner,
							ui:'bootstrap-danger'							
						}]
					}]
				}]
			}]
		});
		
        Ext.apply(Ext.form.field.VTypes,{
            setupkey:function(val, field){
                return val.length == 6;
            },
            setupkeyText:'The setup key must be 6 characters long'
        });

        //this is required by ExtJS
		me.callParent(arguments);

		//load the project into the form
		me.down('form').loadRecord(me.project);
	}
});