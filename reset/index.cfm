<cfinclude template="include/topBar.cfm">
<cfif isdefined('form.reset') and isdefined('url.token') and isdefined('url.uid')>
	<cfif form.pass neq form.confirmPass>
		<cfset LOCAL.reset.error = "Passwords don't Match">
	<cfelse>
		<cfhttp method="post" url="#application.api.url#/user/#url.uid#/reset" result="httpresult">
			<cfhttpparam name="password" value="#form.pass#" type="formfield" />
			<cfhttpparam name="token" value="#url.token#" type="formfield" />
		</cfhttp>
		<cfif httpresult.status_text neq "OK">
			<cftry>
				<cfset LOCAL.reset.error = deserializejson(httpresult.filecontent).msg>
			<cfcatch>
				<cfset LOCAL.reset.error = httpresult.filecontent>
			</cfcatch>
			</cftry>
		<cfelse>
			<cfsavecontent variable="msg">
				<cfoutput>
					<div class="alert alert-success">
						Password Successfully Updated. 
						<p><a href="../">Click here to login</a>
					</div>
				</cfoutput>
			</cfsavecontent>
			<cfset LOCAL.reset.msg = msg>
		</cfif>
	</cfif>

</cfif>
<cfoutput>
<cfinclude template="include/html_head.cfm">
<cfif not isdefined('url.token') or not isdefined('url.uid')>
	<div class="alert alert-danger">
		Invalid Link!
	</div>
<cfelse>
	<div class="container resetpw">
		<form class="resetpw" method="post">
			<h2>Reset Password</h2>
			<cfif isdefined('LOCAL.reset.error')>
				<div class="alert alert-danger">
					#LOCAL.reset.error#
				</div>
			</cfif>
			<cfif isDefined("LOCAL.reset.msg")>
				#LOCAL.reset.msg#
			<cfelse>
				<div class="form-group">
					<input type="password" class="form-control" required autofocus placeholder="New Password" name="pass" />
				</div>
				<div class="form-group">
					<input type="password" class="form-control" required placeholder="Confirm New Password" name="confirmPass" />
				</div>			

				<button class="btn btn-lg btn-primary btn-block" type="submit" name="reset">Reset Password</button>				
			</cfif>		

		</form>
	</div>
</cfif>
<cfinclude template="include/html_footer.cfm">
</cfoutput>