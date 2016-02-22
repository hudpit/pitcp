<cfcomponent>
	<cfscript>
		THIS.Name = "PITAPI";
		THIS.ApplicationTimeout = CreateTimeSpan(0,8,0,0);
		THIS.SessionManagement = true;
		THIS.loginstorage = "session";

		//Ensure the datasource is set-up in Administrator correctly
		THIS.datasource = "pitapi";

		public boolean function OnApplicationStart()
		hint="Runs when the application is first started. Put all set-up code
		here"
		{
			writeLog(text="*********Initializing Application***********");
			application.jsonify = createObject("component","cfc.json");
			application.sessions = loadSessions();;
			application.newidlist = {};


			//include "settings.cfm";
			application.started = true;
			writeLog(text="*********Application Started************");
			return true;
		}

		public void function onApplicationEnd(struct ApplicationScope=StructNew())
		hint="Runs when the application is stopped. Put any clean-up code here"
		{
			writeLog(text="----------Application Stopped------------");
			return;
		}

		public boolean function onRequestStart(string TargetPage)
		hint="Runs at the start of each request. Put any code that needs to be
		run on each request, such as authentication checking, here
		"{

			/*
				We set the Access-Control-Allow-Origin header to "*" so the
				mobile app doesn't block the servers responses due to CORS.
				http://enable-cors.org/server_coldfusion.html
			*/
			var PC = getpagecontext().getresponse();
			PC.setHeader( 'Access-Control-Allow-Origin', "*" );
			if(not structKeyExists(application, "started")){
				return false;
			}

			//add the UDF component to the request scope for easy access
			request.udf = createObject("component", "cfc.udf").init();

			//Check if the body is JSON, and if so, parse it and append it
			//to the form scope
			var postBody = getHTTPRequestData().content;
			if(isJson(postBody)){
				var jsonStruct = deserializeJSON(postBody);
				if(isstruct(jsonStruct)){
					structappend(form, jsonStruct);
				}

			}
			var page = getPageFromTargetPage(targetpage);

			//if ?restart is present in url, restart the application
			if(isdefined('url.restart')){
				writeLog(text="Restarting application");
				ApplicationStop();
				return false;
			}

			return true;
		}

		private struct function loadSessions()
		hint="Load all the sessions into memory to reduce the load on the DB"
		{
			var query = new query();
			var sessionsResult = query.execute(sql = "
				SELECT
					session_id,
					user_id
				FROM
					sessions
				WHERE
					endtime = 0
				").getResult();
			var sessionStruct = {};
			for(i=1;i lte sessionsResult.recordcount;i++){
				sessionStruct[sessionsResult.session_id[i]] = sessionsResult.user_id[i];
			}

			return sessionStruct;
		}

		private string function getPageFromTargetPage(string TargetPage)
		hint="Parses the target page to get just the page name, not the full
		path"
		{
			var re = refind('.*/(.+\.cfc)$', targetpage, 1, true);
			var page = mid(targetpage, re.pos[2], re.len[2]);

			return page;
		}
	</cfscript>
</cfcomponent>
