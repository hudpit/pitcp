/**
 * The screen for a user to reset their password by having the server
 * send off an email containing a reset link.
 * {@img shots/login.png Login}
 */
Ext.define('PIT_CP.view.ForgotPw',{
	extend:'Ext.panel.Panel',
	alias:'widget.forgotpw',
	config:{
		items:[{
            xtype:'form',
            title:'Forgot Password',
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
                    fieldLabel:'Email'
                }]
            },{
            	xtype:'fieldset',
            	border:false,
            	layout:'fit',
            	items:[{
	            	xtype:'button',
	            	text:'Send Reset Link',
	            	action:'sendResetLink',
                    ui:'bootstrap-success'
            	}]
            }]      
		}]
	}
});