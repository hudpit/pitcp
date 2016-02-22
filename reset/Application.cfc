<cfcomponent>
	<cfscript>
		THIS.Name = "PIT_CP_RESET";
		THIS.ApplicationTimeout = CreateTimeSpan(0,0,1,0);
		THIS.SessionManagement = false;
		THIS.loginstorage = "session";

		public boolean function OnApplicationStart(){

			include "settings.cfm";
			//structAppend(application, createObject("component", "udf"));
			return true;
		}

		public void function onApplicationEnd(struct ApplicationScope=StructNew()){

			return;
		}

		public void function onSessionStart(){

			return;
		}

		public void function onSessionEnd(struct SessionScope=StructNew()){

			return;
		}

		public boolean function onRequestStart(string TargetPage){
			if(isdefined('url.restart')){
				structClear(application);
				THIS.onApplicationStart();
			}
			return true;

		}
		public void function onRequestEnd(){

			return;
		}

	</cfscript>	
</cfcomponent>
