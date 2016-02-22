/**
 * The user profile screen. Provides the form necessary for a user to edit their
 * account info and change their password.  
 * {@img shots/user-profile.png User Profile}
 */
Ext.define("PIT_CP.view.User", {
    extend: 'Ext.Panel',
    alias:'widget.profile',
    title:'Profile',
    layout:'vbox',
    defaults:{
        width:'100%'
    },
    items:[{
		xtype:'form',
		bodyPadding:10,
		
		title:'User Information',
		items:[{
			xtype:'fieldset',
			defaultType:'textfield',
			title:'Basic Information',
			items:[{
				fieldLabel:'User Id',
				name:'user_id',
				readOnly:true,
				hidden:true
			},{
				fieldLabel:'First Name',
				name:'fname'
			},{
				fieldLabel:'Last Name',
				name:'lname'
			},{
				fieldLabel:'Email Address',
				name:'email',
	            vtype:'email'
			},{
				fieldLabel:'Phone Number',
				name:'phone'
			}]
		},{
			xtype:'fieldset',
			title:'Change Password',
			defaultType:'textfield',
			items:[{
				fieldLabel:'New Password',
				name:'password',
	            inputType:'password'
			},{
				fieldLabel:'Confirm New Password',
				name:'confirmNewPass',
	            vtype:'confirmpassword',            
	            inputType:'password'
			}]
		},{
			xtype:'fieldset',
			items:[{
				xtype:'textfield',
				fieldLabel:'Current Password',
				name:'current_password',
				inputType:'password',
				allowBlank:false
			}]
		},{
			xtype:'button',
			text:'Update Information',
            action:'updateUserInfo',
            ui:'bootstrap-success'
		}]

	}],
    initComponent:function(){
    	var me = this;

        Ext.apply(Ext.form.field.VTypes,{
            confirmpassword:function(val, field){
                var values = field.up('form').getValues();
                return val == values.password;
            },
            confirmpasswordText:'Your passwords do not match'
        });

    	me.callParent(arguments);
    },
    /**
     * Loads a user record into the form
     * @param  {PIT_CP.model.User} user The user to be edited
     */
    loadUser:function(user){
    	this.down('form').loadRecord(user);
    },

    /**
     * Clears the current password from the form
     */
    clearCurrentPassword:function(){
    	this.down('textfield[name=current_password]').setValue('');
    }
});