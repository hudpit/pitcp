/**
 * The form to register for an account. This form is included on the same window
 * as the login screen that is displayed when no user is logged in
 * {@img shots/register.png Register}
 */
Ext.define('PIT_CP.view.Register',{
	extend:'Ext.panel.Panel',
	alias:'widget.register',
	config:{
		items:[{
            xtype:'form',
            title:'Register',
            layout:'vbox',
            items:[{
                xtype:'fieldset',
                border:false,
                margin:5,
                layout:'anchor',
                defaults:{
                    xtype:'textfield',
                    anchor:'100%',
                    labelWidth:200
                },                
                items:[{
                    name:'email',
                    fieldLabel:'Email',
                    vtype:'email',
                    allowBlank:false
                },{
                    name:'password',
                    fieldLabel:'Password',
                    inputType:'password',
                    allowBlank:false
                },{
                    name:'confirmpassword',
                    fieldLabel:'Confirm Password',
                    inputType:'password',
                    vtype:'confirmpassword',
                    allowBlank:false
                },{
                    name:'phone',
                    fieldLabel:'Phone Number (optional)'
                }]
            },{
            	xtype:'fieldset',
            	border:false,
            	layout:'fit',
            	items:[{
	            	xtype:'button',
	            	text:'Register',
	            	action:'register',
                    ui:'bootstrap-success'
            	}]
            }]      
		}]
	},
    initComponent:function(){
        var me = this;

        Ext.apply(Ext.form.field.VTypes,{

            //check that password and confirm password fields match
            confirmpassword:function(val, field){
                var values = field.up('form').getValues();
                return val == values.password;
            },
            confirmpasswordText:'Your passwords do not match'
        });
  
        me.callParent(arguments);
    }
});