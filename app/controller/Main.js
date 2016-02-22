/**
 *  ## Overview
 *  Main Controller for the Control Panel. All business logic rests inside here.
 *
 * This will automatically be instantiated by ExtJS, and the {@link PIT_CP.controller.Main#init} function is called.
 */
Ext.define('PIT_CP.controller.Main', {
    extend: 'Ext.app.Controller',
    requires:[
        'Ext.data.proxy.Rest',
        'PIT_CP.util.CallbackHandler'
    ],
    config:{
    	activeView:null,
        openProjects:{}
    },
    stores:['UserLogin','Projects','Datastores'],
    views:['project.List','project.New','project.View','datastore.New','datastore.List','datastore.Edit'],
    refs:[{
        ref:'viewport',
        selector:'viewport'
    },{
        ref:'mainView',
        selector:'mainview'
    },{
    	ref:'mainContainer',
    	selector:'mainview #mainContainer'
    },{
        ref:'loginForm',
        selector:'login form'
    },{
        ref:'profilePanel',
        selector:'profile'
    },{
        ref:'ProjectTabPanel',
        selector:'projects'
    }],
    /**
     * Perform basic set-up tasks here, such as all the event handlers
     * this controller listens for.  This method is called automatically.
     */
    init:function(){
    	var me = this;
    	me.control({
    		'#nav':{
    			itemclick:{
    				fn:'onNavItemClick',
    				scope:me
    			}
    		},
            'projects':{
                beforeremove:{
                    fn:'onProjectPanelRemove',
                    scope:me
                }
            },
    		'projectlist':{
    			projectbtnclick:{
    				fn:'onProjectBtnClick',
    				scope:me
    			}
    		},
            'datastorelist':{
                datastorebtnclick:{
                    fn:'onDatastoreBtnClick',
                    scope:me
                }
            },
            'button[action=login]':{
                click:{
                    fn:'login',
                    scope:me
                }
            },
            'button[action=newProject]':{
                click:{
                    fn:'onNewProjectBtnClick',
                    scope:me
                }
            },
            'button[action=saveNewProject]':{
                click:{
                    fn:'onSaveNewProjectBtnClick',
                    scope:me
                }
            },
            'newProject':{
                linkclick:{
                    fn:'onNewDSLinkClick',
                    scope:me
                }
            },
            'button[action=saveNewDatastore]':{
                click:{
                    fn:'onSaveNewDatastoreBtnClick',
                    scope:me
                }
            },
            'button[action=updateDatastore]':{
                click:{
                    fn:'onEditDatastoreBtnClick',
                    scope:me
                }
            }, 
            'button[action=deleteDatastore]':{
                click:{
                    fn:'onDeleteDatastoreBtnClick',
                    scope:me
                }
            },                       
            'button[action=deleteProject]':{
                click:{
                    fn:'onDeleteProjectBtnClick',
                    scope:me
                }
            },
            'button[action=updateProject]':{
                click:{
                    fn:'updateProject',
                    scope:me
                }
            },            
            'button[action=addNewDatastore]':{
                click:{
                    fn:'onNewDSLinkClick',
                    scope:me
                }
            },
            'button[action=logout]':{
                click:{
                    fn:'logout',
                    scope:me
                }
            },
            'login':{
                forgotpw:{
                    fn:'onForgotPwClick',
                    scope:me
                }
            },
            'button[action=sendResetLink]':{
                click:{
                    fn:'sendPwResetLink',
                    scope:me
                }
            },
            'button[action=register]':{
                click:{
                    fn:'register',
                    scope:me
                }
            },
            'button[action=updateUserInfo]':{
                click:{
                    fn:'updateUserInfo',
                    scope:me
                }
            },
            'button[action=updateUserPassword]':{
                click:{
                    fn:'updateUserPassword',
                    scope:me
                }
            }

    	});

        //load the version number for version.json and render it in the footer
        Ext.Ajax.request({
            url:'version.json',
            method:'GET',
            success:function(response){
                PIT_CP.app.version = Ext.JSON.decode(response.responseText);
                me.getMainView().down('#bottomBar').update(PIT_CP.app.version);
            }
        });

        //set the proxy for the project model
        PIT_CP.model.Project.setProxy({
            type:'rest',
            url:'/rest/project'  
        });
    },
    /**
     * This method is called automatically when the controller is started. We use
     * it here as a point to call {@link PIT_CP.controller.Main#checkLogin}
     */
    onLaunch:function(){
        this.checkLogin();
    },
    /**
     * Called when an item in the Navigation is clicked. This function checks that
     * the user is still logged in, and if so, will open the view they clicked
     *
     * @param {Ext.tree.Panel} nav The treepanel that called this function
     * @param {Ext.data.Model} record The TreeNode that was clicked
     */
    onNavItemClick:function(nav, record){
        var me = this;
        me.checkLogin(function(){
            me.openView(record.get('xtype'));  
        });
        
    },
    /**
     * Called when the project button is clicked
     * 
     * @param  {number} project_id The project_id of the project where the 
     * button was clicked
     */
    onProjectBtnClick:function(project_id){
        var project = Ext.getStore('Projects').getById(parseInt(project_id));
        this.openProject(project);
    },
    /**
     * Called when the "New Project" button is clicked. Opens a new window and 
     * renders PIT_CP.view.project.New to allow a user to create a new project
     */
    onNewProjectBtnClick:function(){
        var newProjectWindow = Ext.create('Ext.window.Window',{
            layout:'fit',
            height:300,
            width:500,
            title:'Add New Region',
            items:[{
                xtype:'newProject'
            }]
        }).show();
    },

    /**
     * Called when a user clicks the "Save" button in the New Project view. Calls 
     * {@link PIT_CP.controller.Main#createNewProject}
     * 
     * @param  {Ext.button.Button} btn The button that was clicked
     */
    onSaveNewProjectBtnClick:function(btn){
        var form = btn.up('form');
        this.createNewProject(form.getValues(),function(){
            btn.up('window').close();
        });
    }, 
    /**
     * Called when a user clicks the "Save" button in the New Datastore view. 
     * Checks form validity and if it passes it calls
     * {@link PIT_CP.controller.Main#createNewDatastore}
     * 
     * @param  {Ext.button.Button} btn The button that was clicked
     */
    onSaveNewDatastoreBtnClick:function(btn){
        var form = btn.up('form');
        if(form.isValid()){
            this.createNewDatastore(form.getValues(),function(){
                form.up('window').close();
            });
        }else{
            Ext.Msg.alert("Error", "Please fix the fields marked in red");
        }

    },   
    /**
     * Called when a user clicks the "Edit" button next to a Datastore. 
     * Checks form validity and if it passes it calls
     * {@link PIT_CP.controller.Main#updateDatastore}
     * 
     * @param  {Ext.button.Button} btn The button that was clicked
     */
    onEditDatastoreBtnClick:function(btn){
        var form = btn.up('form');
        var values = form.getValues();
        if(form.isValid()){
            this.updateDatastore(values, function(){
                btn.up('window').close();
            });
        }else{
            Ext.Msg.alert("Error", "Please fix the fields marked in red");
        }
    },

    /**
     * Runs logic needed whenever a user logs in. Includes loading all the stores
     * with the appropriate, user-specific data and opening the default view, 
     * {@link PIT_CP.view.Project}
     * @param  {PIT_CP.model.User} newUser The user that logged in
     */
    onLogin:function(newUser){
        var me =this;
        var user = Ext.create('PIT_CP.model.User', newUser);
        Ext.getStore('UserLogin').removeAll();
        Ext.getStore('UserLogin').add(user);
        me.isLoggedIn = true;  
        
        if(me.loginWindow){
            me.loginWindow.close();
            delete me.loginWindow;
        }     
        me.getProfilePanel().loadUser(user);

        me.loadStores();
        me.getMainView().setDisabled(false);
        me.openView('projects');
    },

    /**
     * Runs logic needed when a user logs out. Includes clearing all the stores,
     * and rendering the Login window so another user can login.
     */
    onLogout:function(){
        var me = this;
        me.isLoggedIn = false;
        me.getMainView().setDisabled(true);
        Ext.getStore('UserLogin').removeAll();
        me.clearStores();
        if(!me.loginWindow){
             me.loginWindow = Ext.create('Ext.window.Window',{
                title:'Welcome to the Point in Time Control Panel',
                width:425,
                height:275,
                closable:false,
                layout:'border',
                items:[{
                    xtype:'tabpanel',
                    region:'center',
                    tabBar:{
                        defaults:{
                            flex:1
                        },
                        layout:{
                            pack:'center'
                        }
                    },
                    items:[{
                        title:"Login",
                        xtype:'login'
                    },{
                        title:'Register',
                        xtype:'register'
                    }]
                }]
            }).show();    
        }else{
            me.loginWindow.show();
        }
       
    },

    /**
     * Called when the link on the Datastore list is clicked. This function 
     * creates and renders a new window to show the {@link PIT_CP.view.datastore.New}
     * view, to allow a user to create a new datastore
     */
    onNewDSLinkClick:function(){
        var newDsWindow = Ext.create('Ext.window.Window',{
            layout:'fit',
            height:300,
            width:500,
            title:'Add New Datastore',
            items:[{
                xtype:'newDatastore'
            }]            
        }).show();
    },

    /**
     * Called when the Delete Project button is clicked. Asks for confirmation 
     * and if confirmed, calls {@link PIT_CP.controller.Main#deleteProject}
     * @param  {Ext.button.button} btn The Delete Project button that was clicked
     */
    onDeleteProjectBtnClick:function(btn){
        var me = this;
        var project = btn.project;
        Ext.Msg.confirm('Are you sure?', "Are you sure you would like delete the project " + project.get('project_title') + '?', function(btn){
            if(btn == "yes"){
                me.deleteProject(project);
            }
        });
    },

    /**
     * Called when a project panel is closed. Removes the project from {@link PIT_CP.controller.main#openProjects}
     * @param  {Ext.tab.Panel} tabPanel     The tab panel the project panel is removed from
     * @param  {Ext.panel.Panel} projectPanel The panel that was removed
     */
    onProjectPanelRemove:function(tabPanel, projectPanel){
        delete this.openProjects[projectPanel.project.get('project_id')];
    },
    /**
     * Called when the Forgot Password button is clicked on the Login screen. 
     * Creates and renders the Forgot Password view
     */
    onForgotPwClick:function(){
        var forgotPwWindow = Ext.create('Ext.window.Window',{
            height:200,
            width:400,
            items:[{
                xtype:'forgotpw'
            }]
        }).show();
    },
    /**
     * Called when the edit Datastore button is clicked. Creates and renders the 
     * Edit Datastore view.
     * @param {number} datastore_id The id of the datastore that needs to be edited
     */
    onDatastoreBtnClick:function(datastore_id){
        var datastore = Ext.getStore('Datastores').getById(parseInt(datastore_id));
        var editDatastoreWindow = Ext.create('Ext.window.Window',{
            height:200,
            width:500,
            items:[{
                xtype:'editDatastore',
                datastore:datastore
            }]
        }).show();
    },

    /**
     * Called when the Delete Datastore button on the Edit Datastore window is 
     * clicked. Asks for confirmation and if received, calls {@link #deleteDatastore}
     * @param {Ext.button.Button} btn The Delete Datastore button that was clicked
     */
    onDeleteDatastoreBtnClick:function(btn){
        var me = this;
        var datastore = btn.datastore;
        Ext.Msg.confirm('Are you sure?', "Are you sure you would like delete the datastore " + datastore.get('datastore_title') + '?', function(msgBtn){
            if(msgBtn == "yes"){
                me.deleteDatastore(datastore, function(){btn.up('window').close();});
            }
        });
    },

    /**
     * Performs an AJAX request to the server to check and see if the User is 
     * logged in. If the user is logged in, {@link #onLogin} is called, passing 
     * the user object that the server returns. If the user is not logged in,
     * {@link #onLogout} is called.
     * @param {Function} callback A callback that will be called once the server
     * returns a response, regardless of whether the user is logged in or out.
     */
    checkLogin:function(callback){
        var me = this;
        Ext.Ajax.request({
            url:'/rest/pit/auth',
            method:'GET',
            success:function(response){
                var responseObj = Ext.JSON.decode(response.responseText);
                if(responseObj.success === true){
                    me.onLogin(responseObj.user);
                }else{
                    me.onLogout();
                }
        
            },
            failure:function(){

                me.onLogout();
            },
            callback:function(){
                if(typeof callback === "function")
                    callback();
            }
        });
    },     

    /**
     * Handles the login process. Gets the values from the Login form and uses
     * an AJAX request to send them to the server. If the login is successful, 
     * {@link #onLogin} is called, passing the User object that the server responds.
     * If the login is not successful, the Login window is updated with the relevant
     * error message.
     */
    login:function(){
        var me = this;
        var values = me.getLoginForm().getValues();
        if(values.email && values.password){
            Ext.Ajax.request({
                url:"/rest/pit/auth",
                method:'POST',
                params:values,
                success:function(response){
                    var responseObj = Ext.JSON.decode(response.responseText);
                    if(responseObj.success === true){
                        me.onLogin(responseObj.user);
                    }else{
                        if(me.loginWindow){
                            me.loginWindow.down('#errMsg').update(responseObj.msg);
                            me.loginWindow.down('#errMsg').setVisible(true);
                            
                        }
                    }

                }
            });
        }
    },

    /**
     * Handles the login process. Performs a DELETE AJAX request to the server. 
     * On successful logout, {@link #onLogout} is called. If an error occurs, an 
     * alert is displayed
     */
    logout:function(){
        var me = this;
        Ext.Ajax.request({
            method:'DELETE',
            url:"/rest/pit/auth",
            success:function(){
                me.onLogout();
            },
            failure:function(){
                Ext.Msg.alert('Error', "An error occured while attempting to log out. Please try again");
            }
        });

    }, 

    /**
     * Load all the stores needed for the App. We use this function to dynamically
     * set the proxy url, since it requires the user id to be built into it. So
     * this will be called after a user is logged in. The function gets the user 
     * info, then sets the Proxy url, then loads each one.
     */
    loadStores:function(){
        var user = Ext.getStore('UserLogin').getAt(0);

        Ext.getStore('Projects').setProxy({
            type:'rest',
            url:'/rest/pit/user/'+user.get('user_id')+'/project'
            
        });
        Ext.getStore('Datastores').setProxy({
            type:'rest',
            url:'/rest/pit/user/'+user.get('user_id')+'/datastore'
        });       
        var storesToLoad = ["Datastores", "Projects"];
        Ext.Array.each(storesToLoad, function(storeName){
            Ext.getStore(storeName).load();
        });
    },   

    /**
     * Loops through the Datastores and Projects stores and clears each one.
     * Called when a User is logged out, so no data from the user remains in the
     * app
     */
    clearStores:function(){
        var storesToClear = ["Datastores", "Projects"];
        Ext.Array.each(storesToClear, function(storeName){
            Ext.getStore(storeName).removeAll();
        });
    },

    /**
     * Handles creating a new {@link PIT_CP.model.Project}. 
     * @param {Object} values The values from the New Project form
     * @param  {Function} callback A callback to be executed after the server 
     * completes the request
     */
    createNewProject:function(values,callback){
        callback = callback || Ext.emptyFn;
        var user = Ext.getStore('UserLogin').getAt(0);
        values.user_id = user.get('user_id');
        var newProject = Ext.create('PIT_CP.model.Project', values);
        var projectStore = Ext.getStore('Projects');

        Ext.Ajax.request({
            url:'/rest/pit/project/',
            method:'POST',
            params:values,
            callback:PIT_CP.util.CallbackHandler.create({
                callback:function(resObj){
                    projectStore.load();
                    callback.call(this);
                }
            })
        });
    },

    /**
     * Handles creating a new {@link PIT_CP.model.Datastore}
     * @param  {Object}   values   The values from the New Datastore form
     * @param  {Function} callback A callback to be executed after the server
     * completes the request
     */
    createNewDatastore:function(values,callback){
        callback = callback || Ext.emptyFn;
        var user = Ext.getStore('UserLogin').getAt(0);
        values.user_id = user.get('user_id');
        var newDatastore = Ext.create('PIT_CP.model.Datastore', values);
        var dsStore = Ext.getStore('Datastores');
        
        Ext.Ajax.request({
            type:'POST',
            url:'/rest/pit/datastore/',
            params:values,
            callback:PIT_CP.util.CallbackHandler.create({
                callback:function(resObj){
                    dsStore.load();
                    callback.call(this);
                }
            }) 
        });
    },

    /**
     * Updates the {@link PIT_CP.model.Datastore} on the server. 
     * @param  {Object}   values   The values from the Edit Datastore form
     * @param  {Function} callback A callback to be execute when the server
     * completes the request
     */
    updateDatastore:function(values,callback){
        Ext.Ajax.request({
            type:'POST',
            url:'/rest/pit/datastore/'+values.datastore_id,
            params:values,
            callback:PIT_CP.util.CallbackHandler.create({
                callback:function(res){
                    updatedDatastoreInfo = res.datastore[1];
                    var datastore = Ext.getStore('Datastores').getById(parseInt(values.datastore_id));
                    datastore.set(updatedDatastoreInfo);
                    Ext.getStore('Datastores').reload();
                    Ext.Msg.alert('Datastore Updated', "The Datastore Has Been Updated");
                    if(typeof callback === 'function'){
                        callback.call(this);
                    }
                }
            })
        });
    },

    /**
     * Deletes the given {@link PIT_CP.model.Datastore} from the server
     * @param  {PIT_CP.model.Datastore}   datastore The datastore to delete
     * @param  {Function} callback  A callback to be exeucted when the server
     * completes the request
     */
    deleteDatastore:function(datastore,callback){
        callback = callback || Ext.emptyFn;
        Ext.Ajax.request({
            method:'DELETE',
            url:'/rest/pit/datastore/' + datastore.getId(),
            callback:PIT_CP.util.CallbackHandler.create({
                callback:function(res){
                    Ext.getStore('Datastores').load();
                    callback();
                }
            })
        });
    },

    /**
     * Opens a view based on the passed xtype. Places it into the mainContainer 
     * of {@link PIT_CP.view.Main}
     * @param  {string} xtype The xtype of the view to open
     */
    openView:function(xtype){
    	this.getMainContainer().items.each(function(view){view.setVisible(false);});
    	var view = this.getMainContainer().down(xtype);
    	view.setVisible(true);
    },

    /**
     * Opens a new tab to display the passed {@link PIT_CP.model.Project}
     * @param  {PIT_CP.model.Project} project The Project to open
     */
    openProject:function(project){
        if(!this.openProjects[project.get('project_id')]){
            this.openProjects[project.get('project_id')] = this.getProjectTabPanel().add({
                xtype:'projectview',
                project:project,
                closable:true
            });            
        }

        this.getProjectTabPanel().setActiveTab(this.openProjects[project.get('project_id')])
    },

    /**
     * Deletes the passed {@link PIT_CP.model.Project} from the server
     * @param  {PIT_CP.model.Project} project The Project to delete
     */
    deleteProject:function(project){
        var me = this;
        me.getProjectTabPanel().remove(me.openProjects[project.get('project_id')]);
        Ext.getStore('Projects').remove(project);
        project.destroy();
        

    },

    /**
     * Sends a request to the server to send the password reset email to the user
     * that requested it.
     * @param  {Ext.button.Button} btn The forgot password button that was clicked
     */
    sendPwResetLink:function(btn){
        var forgotPwForm = btn.up('form');
        var email = forgotPwForm.getValues().email;
        Ext.Ajax.request({
            url:'/rest/pit/user/reset/',
            params:{
                email:email
            },
            method:'POST',
            callback:function(opt, success, response){
                if(!success){
                    Ext.Msg.alert('Error', "Your password could not be reset");
                    if(response.responseText){
                        console.error(response.responseText);
                    }
                    return;
                }else{
                    var responseObj = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert('Success', responseObj.msg);
                    btn.up('window').close();
                }
            }
        });
    },

    /**
     * Handles registering a new account. Collects the values from the Register 
     * form and submits them to the server. Provides an error message with reason
     * if the registration fails for any reason.
     * @param  {Ext.button.Button} btn The button that was pressent to submit the registration
     */
    register:function(btn){
        if(btn.up('form').isValid()){
            Ext.Ajax.request({
                url:"/rest/pit/user",
                method:"POST",
                params:btn.up('form').getValues(),
                callback:function(opts, success, response){
                    try{
                        responseObj = Ext.JSON.decode(response.responseText);
                        if(responseObj.success){
                            Ext.Msg.alert('Registration Successful', "Registration Successful, please Log In");
                            btn.up('form').getForm().reset();
                            btn.up('tabpanel').setActiveTab(0);
                        }else{
                            Ext.Msg.alert('Registration Failed', responseObj.msg);
                        }
                    }catch(e){
                        Ext.Msg.alert('Registration Failed', "An Unknown error occurred");
                        console.error(response.responseText);
                    }                   
                }
            });
        }else{
            Ext.Msg.alert('Invalid', "Please go back and correct the errors on the form");
        }
    
    },

    /**
     * Updates a users info on the server.
     * @param  {Ext.button.Button} btn The submit button on the update user form
     */
    updateUserInfo:function(btn){
        var me = this;
        var form = btn.up('form');
        if(!form.isValid()){
            Ext.Msg.alert("Error", "Please fix the fields in red");
            return;
        }
        var values = form.getValues();
        Ext.Ajax.request({
            type:'POST',
            params:values,
            url:'/rest/pit/user/'+values.user_id,
            callback:PIT_CP.util.CallbackHandler.create({
                callback:function(res){
                    var user = Ext.getStore('UserLogin').getAt(0);
                    user.set(res.user[0]);
                    me.getProfilePanel().down('form').getForm().reset();
                    me.getProfilePanel().loadUser(user);
                    Ext.Msg.alert('Information Updated', "Your information has been successfully updated");
                }
            })
        });
    },

    /**
     * Updates the user's password.
     * @param  {Ext.button.Button} btn The submit button on the update password
     * form
     */
    updateUserPassword:function(btn){
        var me = this;
        var form = btn.up('form');
        if(!form.isValid()){
            return;
        }        
        var values = form.getValues();
        var user = Ext.getStore('UserLogin').getAt(0);
        Ext.Ajax.request({
            type:'POST',
            params:values,
            url:'/rest/pit/user/'+user.get('user_id'),
            callback:function(opt, success, response){
                    if(!success){
                        Ext.Msg.alert('Error', "An unknown error occurred while updating your info. Please try again");
                        return;
                    }else{
                        var resObj = Ext.JSON.decode(response.responseText);
                        var msg = "";
                        if(!resObj.success){
                            msg = resObj.msg || "An unknown error occurred";
                        }else{
                            msg = resObj.msg || "Your password has been successfully changed";
                            form.getForm().reset();
                        }

                        Ext.Msg.alert((resObj.success)?'Success':'Failure', msg);
                    }
            }
        });
    },

    /**
     * Updates a {@link PIT_CP.model.Project}
     * @param  {Ext.button.Button} btn The submit button on the update project 
     * form
     */
    updateProject:function(btn){
        var form = btn.up('form');
        var values = form.getValues();

        Ext.Ajax.request({
            type:'POST',
            params:values,
            url:'/rest/project/' + values.project_id,
            callback:PIT_CP.util.CallbackHandler.create({
                callback:function(res){
                    updatedProjectInfo = res.data[0];
                    var project = Ext.getStore('Projects').getById(parseInt(values.project_id));
                    project.set(updatedProjectInfo);
                    btn.up('form').loadRecord(project);
                    btn.up('projectview').setTitle(project.get('project_title'));
                    Ext.Msg.alert('Region Updated', res.msg);
                }
            })
        });
    }
});
