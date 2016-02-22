/**
 * The login form. This is included as part of the window that is displayed when
 * no user is logged in. 
 * {@img shots/forgot-pw.png Forgot Password}
 */
Ext.define('PIT_CP.view.Login',{
	extend:'Ext.panel.Panel',
	alias:'widget.login',
    initComponent:function(){
        var me = this;

        Ext.applyIf(me, {
            items:[{
                xtype:'form',
                title:'Login',
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
                        xtype:'container',
                        cls:'alert alert-danger',
                        itemId:'errMsg',
                        hidden:true
                    },{
                        name:'email',
                        fieldLabel:'Email'
                    },{
                        name:'password',
                        fieldLabel:'Password',
                        inputType:'password'
                    }]
                },{
                    xtype:'fieldset',
                    border:false,
                    layout:'vbox',
                    items:[{
                        xtype:'button',
                        text:'Login',
                        action:'login',
                        ui:'bootstrap-success'
                    },{
                        xtype:'label',
                        html:'<a class="forgotPw" href="#">Forgot Password</a>'
                    }]
                }]      
            }]            
        });
        me.addListener({
            element:'el',
            click:function(e, btn){me.fireEvent('forgotpw', this);},
            delegate:'a.forgotPw'
        });
        me.callParent(arguments);
    }
});