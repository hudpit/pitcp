<cfoutput>
		<div id="topBar">	
			<div class="container">
				<div class="row">
					
					<div class="pull-left" id="logo">
						<a href="/">
						<img src="/reset/img/logo.png" /></a>
						<span class="title">PointInTime.info</span>

					</div>
					
					<div class="pull-right">
<!---						
						<a href="/" class="mobileHome">Home</a>
						<i class="fa fa-bars fa-2x" id="mobileNav"></i>		
--->
						<div class="login visible-lg visible-md">
						<cfif findnocase("staging",cgi.server_name)>
							<cfset link = "staging.controlpanel.hudpointintime.com">
						<cfelse>
							<cfset link = "#cgi.server_name#">
						</cfif>
						<!---<cfset link = (cgi.server_name eq "staging.hudpointintime.com")?"staging.controlpanel.hudpointintime.com":"controlpanel.hudpointintime.com">--->
						<a href="https://#link#"class="btn btn-default">Go to the Control Panel</a>
						</div>		

					</div>
				</div>

			</div>
			

		</div>
</cfoutput>