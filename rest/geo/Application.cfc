component {
	THIS.name = "PIT_API";


	public boolean function onApplicationStart(){
		application.GIS_DSN = "gis";
		
		application.init = true;

		return true;
	}
	public boolean function onRequestStart(required string TargetPage) {
		if(!isDefined("application.init")){
			onApplicationStart();
		}
		if(structKeyExists(url,"restart")){
			structClear(application);
			onApplicationStart();
		}
		var PC = getpagecontext().getresponse();
		PC.setHeader( 'Access-Control-Allow-Origin', "*" );
		return true;
	}


}