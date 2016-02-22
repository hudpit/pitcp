/**
 * ##Overview
 * This class provides a simplified interface for setting up a callback to AJAX
 * requests. It automatically handles error checking and allows for an additional
 * callback to be called after all error checking has passed
 *
 * Example:
 *         
 *         Ext.Ajax.request({
 *          url:'/rest/pit/project/',
 *          method:'POST',
 *          params:values,
 *          callback:PIT_CP.util.CallbackHandler.create({
 *              callback:function(resObj){
 *              	//load the projects after the new project is created
 *                  projectStore.load();
 *              }
 *          })
 *      });
 */
Ext.define('PIT_CP.util.CallbackHandler', {
	singleton:true,
	/**
	 * Creates a new callback handler for an Ext.AJAX request. 
	 * @param  {Object} config The basic config for the callback handler. Expects
	 * the following properties:
	 *
	 * @param {String} config.successField The name of the field the 
	 * server will send back to indicate whether the request was successful. Defaults
	 * to 'success'
	 *
	 * @param {String} config.successValue The value 'successField' must be for the request
	 * to be considered a sucess. Defaults to true
	 *
	 * @param {String} config.msgField The name of the field the 'msg' object return from
	 * the server wil be held in.
	 *
	 * @param {String} config.defaultErrorMsg The message to display if the request fails
	 * but no msg is provided by the Server
	 * 
	 */
	create:function(config){
		//Set the defaults
		Ext.applyIf(config, {
			successField:'success',
			successValue:true,
			msgField:'msg',
			defaultErrorMsg:'Could not perform action'
		});
		var fn = function(opt, success, res){
			var msg;

			//Check for connection success (i.e. responseCode 200)
			if(!success){
				//fires if connection was unsuccessful
				msg = "An error occurred" + (res.statusText)?':'+res.statusText:'';
				Ext.Msg.alert('Error', msg);
				return;
			}

			var resObj = Ext.JSON.decode(res.responseText);
			//Connection was successful, now lets check if the server
			//did what we wanted it to
			if(resObj[config.successField] !== config.successValue){
				msg = resObj[config.msgField] || config.defaultErrorMsg;
				Ext.Msg.alert('Error',msg);
				return;
			}

			//If a callback is provided, run that. Otherwise, just exit
			if(config.callback && typeof config.callback === "function"){
				config.callback.call(config.scope || this, resObj);
			}else{
				return;
			}
		};
		return (fn);
	}
});