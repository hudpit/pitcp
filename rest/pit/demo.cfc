component restpath="/demo" rest="true"
hint="Used to receive sruveys sent to the demo datastore. Does not actually store any data"
{
	remote any function demoReceive() httpmethod="POST" 
	hint="Receives any POST requests sent to /rest/demo and replies with a fake success message"
	{
		
		if(isdefined("form.SurveyIDNum")){
			var msg = "Survey ID #form.SurveyIDNum# was successfully submitted to the Demo Datastore";
		}else{
			var msg = "Survey successfully was submitted to the Demo Datastore";
		}
		var result = {
			success=true,
			msg=msg
		};

		request.udf.outputJson(result);
	}
}