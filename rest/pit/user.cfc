component restpath="/user" rest="true" 
hint="Handles all requests to /rest/user"
{
	THIS.auth = createObject("component", "auth");

	remote any function getUser(string user_id restargsource="form",string project_id restargsource="form") httpmethod="POST" restpath="/getUserInfo"
	hint="Returns the information for the user belonging to the given id"{
		try{
			if(not isNumeric(arguments.user_id)){
				throw message = "Invalid User_ID #arguments.user_id#";
			}
			if(not isNumeric(arguments.project_id)){
				throw message = "Invalid Project_ID";
			}
			var query = new query();
			query.setSQL("
				SELECT
					project_id
				FROM
					project
				WHERE project_id = :project_id
			");
			query.addParam(name="project_id", value="#arguments.project_Id#",cfsqltype="cf_sql_int");
			var projectValidateResult = query.execute().getResult();
			var isProjectValid = (projectValidateResult.recordcount gt 0);

			var userQuery = this.getUserById(arguments.user_id);
			if(userQuery.recordcount eq 1 and isProjectValid){
				var user = request.udf.QueryToStruct(userQuery, 1);

				request.udf.outputJson({
					"success" = true,
					"user" = {
						"fname" = user.fname,
						"lname" = user.lname,
						"phone" = user.phone,
						"email" = user.email
					}
				});

			}else{
				request.udf.outputJson({
					"success" = false,
					"msg" = "No user found that matches User_ID: #arguments.user_id# and Project_ID: #arguments.project_id#"
				});
			}
			return;
		}catch(e){
			var errCode = (structKeyExists(e, "errCode")?e.errCode:500);
			request.udf.error(errCode, e.message);
		}

	}

	remote any function addUser() httpmethod="POST"
	hint="Creates a new user using the given params. Must include the password. 
	Checks to ensure email is unique"
	{
		if(not isdefined('form.email') and form.email neq ""){
			request.udf.error(400, "Missing Email");
			return;
		}
		if(not isdefined('form.password') and form.password neq ""){
			request.udf.error(400, "Missing Password");
			return;
		}
		var response = {};
		var chkQuery = new query(sql ="
			SELECT 
				user_id 
			FROM user 
			WHERE
				email = :email
		");
		chkQuery.addParam(name="email", value="#form.email#", cfsqltype="cf_sql_varchar");
		var result = chkQuery.execute().getResult();

		if(result.RECORDCOUNT){
			response = {
				success = false,
				msg = "An account already exists with the email address #form.email#."
			}
			request.udf.outputJson(response);
			return;	
		}

		var user = {};
		user.user_id = request.udf.createId("user");
		user.email = form.email;
		user.password = hash(form.password, "SHA-512");
		user.fname = (isdefined('form.fname'))?form.fname :"";
		user.lname = (isdefined('form.lname'))?form.lname : "";
		user.phone = (isdefined('form.phone'))?form.phone : "";
		var sql = "
			INSERT INTO user(
				user_id,
				email, 
				password,
				fname,
				lname,
				phone,
				datecreated)
			VALUES(
				:user_id,
				:email,
				:password,
				:fname,
				:lname,
				:phone,
				:datecreated
			)
		";
		var query = new query();
		query.addparam(name="user_id", value=user.user_id, cfsqltype="cf_sql_numeric");
		query.addparam(name="email", value=user.email, cfsqltype="cf_sql_varchar");
		query.addparam(name="password", value=user.password, cfsqltype="cf_sql_char");	
		query.addparam(name="fname", null=(user.fname eq ""), value=user.fname, cfsqltype="cf_sql_varchar");	
		query.addparam(name="lname", null=(user.lname eq ""), value=user.lname, cfsqltype="cf_sql_varchar");
		query.addparam(name="phone", null=(user.phone eq ""), value=user.phone, cfsqltype="cf_sql_varchar");
		query.addparam(name="datecreated", value=now(), cfsqltype="cf_sql_date");
		query.execute(sql=sql);
		response = {
			success = true,
			user = getUserById(user.user_id)
		};
		request.udf.outputJson(response);
		return;	
	}

	remote any function editUser(string id restargsource="path") httpmethod="POST" restpath="{id}"
	hint="Updates a *user* with the given id using the given params. 
	Requires the current password and will check it is correct prior to making
	any changes."
	{
		if(not isNumeric(arguments.id)){
			request.udf.error(400, "Invalid ID");
		}
		if(not structKeyExists(form, "current_password")){
			request.udf.error(200, "Missing current password");
			return;
		}

		var query = new query();
		query.addParam(name="id", value="#ARGUMENTS.id#", cfsqltype="cf_sql_int");
		query.addParam(name="password", value=hash(form.current_password, "SHA-512"), cfsqltype="cf_sql_varchar");
		var checkPassword = query.execute(sql="
			SELECT
				user_id
			FROM
				user
			WHERE
				user_id = :id
			AND password = :password
		").getResult();

		if(checkPassword.recordcount eq 0){
			request.udf.error(200, "Current Password Invalid");
			return;
		}
		var result = query.execute(sql="
			SELECT 
				email,
				password,
				fname,
				lname,
				phone
			FROM user 
			WHERE user_id = :id
		").getResult();

		var colArr = listToArray(result.columnlist);
		var sqlArr = [];
		var query = new query();
		for(var i = 1;i lte arrayLen(colArr);i++){
			if(isdefined("form.#colArr[i]#")){
				var sql =" #colArr[i]# = :#colArr[i]#"; 

				/*
					If it's a password field and its not blank, check for validity, then
					update it. If it's blank, we'll do nothing (won't update existing password)
				 */
				if(colArr[i] eq "password"){
					if(form[colArr[i]] neq ""){
						if(not isPasswordValid(form[colArr[i]])){
							request.udf.error(200, "Invalid Password. Must be greater than 6 characters");
							return;
						}else{
							query.addParam(name="#colArr[i]#", value=hash(form[colArr[i]], "SHA-512"));
							arrayAppend(sqlArr, sql)
						}
					}
				}else{
					query.addParam(name="#colArr[i]#", value="#form[colArr[i]]#");
					arrayAppend(sqlArr, sql)
				}
				
				
			}
		}

		query.addParam(name="id", value="#ARGUMENTS.id#", cfsqltype="cf_sql_int");
		if(arrayLen(sqlarr) eq 0){
			request.udf.error(400, "Missing fields");
			return;
		}
		sql = "UPDATE user SET " & arraytolist(sqlArr) & " WHERE user_id = :id";
		try{
			query.execute(sql=sql);
		}catch(database e){
			var error = {};
			if(e.nativeerrorcode eq 1062){
				error.code = 1062;
				error.msg = "Failed to update. Email address #form.email# already exists";
				request.udf.error(402, application.jsonify.encode(data=error));
			}else{
				request.udf.error(500);
			}
			
		}
		if(not isdefined('error')){
			var user = getUserById(arguments.id);
			if(THIS.auth.isLoggedIn() and user.user_id eq THIS.auth.getCurrentUser().user_id){
				THIS.auth.setCurrentUser(user);	
			}
			
			request.udf.outputJson({
				success="true",
				user=user
			});

			
		}
		
	}

	/*****************************

	*****************************/
	remote any function joinProject(string id restargsource="path",string key restargsource="path") httpmethod="POST" restpath="{id}/project/{key}"
	hint="	Associates the user with the given id to the project with the given key
	POST /user/{user_id}/project/{project_key}"
	{
		if(not isNumeric(ARGUMENTS.id)){
			request.udf.error(400, "Invalid ID");
			return;
		}
		var query = new query();

		/*** Check user table to make sure id is valid ****/
		query.addParam(name="id", value=ARGUMENTS.id, cfsqltype="cf_sql_int");
		var result = query.execute(sql="
			SELECT user_id from user where user_id = :id
		").getResult();
		if(result.recordcount neq 1){
			request.udf.error(400, "No user found for id #ARGUMENTS.id#");
			return;
		}

		/*** Check project table to make sure setup key is valid ****/
		query.clearParams();
		query.addParam(name="key", value=ARGUMENTS.key, cfsqltype="cf_sql_varchar");
		var project = query.execute(sql="
			SELECT project_id, project_title, user_id from project where setup_key = :key
		").getResult();		
		if(result.recordcount neq 1){
			request.udf.error(400, "No project found for key #ARGUMENTS.key#");
			return;
		}
		var project_id = project.project_id[1];

		/**
		* Remove Any Existing links
		* NOTE: This is temporary, until app interface
		* allows for a user to have multiple projects
		**/
		query.clearParams();
		query.addParam(name="user_id", value=ARGUMENTS.id, cfsqltype="cf_sql_int");
		result = query.execute(sql="
			DELETE from project_user where user_id = :user_id
		")
		/*** Add link between user and projectr ***/

		query.clearParams();
		query.addParam(name="user_id", value=ARGUMENTS.id, cfsqltype="cf_sql_int");
		query.addParam(name="project_id", value=project_id, cfsqltype="cf_sql_int");
		result = query.execute(sql="
			INSERT INTO project_user(project_id, user_id) values(:project_id, :user_id)
		").getResult();

		request.udf.outputJson(project);
	}

	remote any function listProjects(string id restargsource="path") httpmethod="GET" restpath="{id}/project"
	hint="Returns the list of projects a user owns or belongs to"
	{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		if(not isNumeric(ARGUMENTS.id)){
			request.udf.error(400, "Invalid User ID");
			return;
		}
		var query = new query();	
		query.addParam(name="id", value=ARGUMENTS.id, cfsqltype="cf_sql_int");

		var result = query.execute(sql="
			SELECT 
				project.project_id, 
				project_title, 
				project.setup_key,
				if(project.user_id = :id, 1, 0) as owner,
				project.user_id,
				datastore.datastore_id,
				datastore.datastore_title,
				datastore.datastore_url,
				project.datecreated,
				project.dateupdated 
			FROM
				(project left join datastore on project.datastore_id = datastore.datastore_id)				
				left join project_user on (project.project_id = project_user.project_id)
			WHERE
			project_user.user_id = :id
			or project.user_id = :id
		").getResult();

		request.udf.outputJson(result);
	}

	remote any function createDatastore(string user_id restargsource="path") httpmethod="POST" restpath="{user_id}/datastore"
	hint="shortcut to creating a datastore through the user endpoint. 
	See datastore.addDatastore for more info"
	{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		var datastore = createObject("component","datastore");
		return datastore.addDatastore(user_id);
	}
	
	remote any function listDatastores(string id restargsource="path") httpmethod="GET" restpath="{id}/datastore"
	hint="Returns the list of datastores a user owns or belongs to"
	{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		if(not isNumeric(ARGUMENTS.id)){
			request.udf.error(400, "Invalid User ID");
			return;
		}
		var query = new query();	
		query.addParam(name="id", value=ARGUMENTS.id, cfsqltype="cf_sql_int");
		var result = query.execute(sql="
			SELECT 
				datastore.datastore_id, 
				datastore_title, 
				datastore_url,
				datastore.user_id
			FROM
				datastore 
			WHERE datastore.user_id = :id
			order by datastore_title ASC
		").getResult();
		request.udf.outputJson(result);
	}	

	remote any function login(string email restargsource="form", string password restargsource="form") httpmethod="POST" restpath="login"
	hint="Logs a user into the app. Returns a token the app can use to 
	authenticate with the server. NOTE: For the function handling logging into
	the control panel, see auth.login"
	{
 			
		if(ARGUMENTS.email eq ""){
			request.udf.error(400, "Missing Email");
		}
		if(ARGUMENTS.password eq ""){
			request.udf.error(400, "Missing Password");
		}
		query = new query();
		query.addparam(name="email", value=ARGUMENTS.email, cfsqltype="cf_sql_varchar");
		query.addParam(name="password", value=hash(ARGUMENTS.password, "SHA-512"), cfsqltype="cf_sql_varchar");
		var result = query.execute(sql="
			SELECT
				session_id,
				user.user_id,
				fname,
				lname,
				email,
				phone
			FROM
				user left join sessions on(user.user_id = sessions.user_id and sessions.endtime = 0)
			WHERE
				email = :email
				and password = :password
		").getResult();
		var response = {};
		if(result.recordcount eq 0){
			response.error = "NOT_FOUND"
			response.msg = "Username/Password combination not found";
		}else{
			response.user = {
				user_id = result.user_id[1],
				email = result.email[1],
				fname = result.fname[1],
				lname = result.lname[1],
				phone = result.phone[1]
			};
			var session_id = result.session_id ;
			if(session_id eq ""){
				session_id = createuuid();
				query.clearParams();
				query.addParam(name="user_id", value=result.user_id[1], cfsqltype="cf_sql_varchar");
				query.addParam(name="session_id", value=session_id, cfsqltype="cf_sql_varchar");
				var result = query.execute(sql="
					INSERT into sessions (
							session_id,
							user_id
						)
					VALUES (:session_id, :user_id) 
				").getResult();			
			}
			
			lock scope="application" type="exclusive" timeout="5"{
				application.sessions[session_id] = response.user.user_id;	
			}	
			
			response.token = session_id;			
		}

		request.udf.outputJson(response);
	}

	remote any function logout(numeric id restargsource="path", string token restargsource="url") httpmethod="POST" restpath="{id}/logout"
	hint="Logs a user out of the app. Invalidates the passed token. NOTE: for 
	logic used to a log a user out of the control panel, see auth.logout"
	{
		query = new query();
		query.addParam(name="session_id", value=ARGUMENTS.token, cfsqltype="cf_sql_varchar");
		query.addParam(name="user_id", value=ARGUMENTS.id, cfsqltype="cf_sql_int");
		query.addParam(name="now", value=NOW(), cfsqltype="cf_sql_timestamp");
		var result = query.execute(sql="
			UPDATE sessions SET endtime = :now WHERE session_id = :session_id and user_id = :user_id
		").getResult();
	}

	remote any function sendResetLink() httpmethod="POST" restpath="reset"
	hint="Sends an email to the user's email address with a link to reset their password. 
	If no account exists for the given email address, an error will be returned 
	and no email will be sent"
	{
		if(not structKeyExists(form, "email")){
			request.udf.error(403, "Missing email");
			return;
		}
		var response = {};
		var query = new query();
		query.addParam(name="email", value="#form.email#", cfsqltype="cf_sql_varchar");
		var userResult = query.execute(sql="
			SELECT 
				user_id
			FROM
				user
			WHERE
				email = :email
			").getResult();
		if(userResult.RECORDCOUNT neq 1){
			response.success = false;
			response.msg = "No Account with the email address #form.email# was found";

			request.udf.outputJson(response);
			
			return;
		}

		query = new query();
		query.addParam(name="user_id", value="#userResult.user_id#", cfsqltype="cf_sql_int");

		//Delete any tokens requested more than 24 hours ago
		query.execute(sql="
			DELETE FROM
				reset_token
			WHERE user_id = :user_id
			AND date_sub(now(), INTERVAL 24 HOUR) > time_requested
		")
		
		//Look for an existing token
		var existingToken = query.execute(sql="
			SELECT
				reset_token
			FROM reset_token
			WHERE user_id = :user_id
		").getResult();
		
		//If the existing token exists, we'll send that, otherwise, we'll create
		//a new one using the built-in createUUID() function
		if(existingToken.recordcount){
			token = existingToken.reset_token[1];
		}else{
			var token = createUUID();
			query.addParam(name="reset_token", value="#token#", cfsqltype="cf_sql_varchar");
			query.execute(sql="
				INSERT INTO reset_token VALUES(:reset_token, :user_id, NULL)
			");
		}


		var link = "https://#CGI.SERVER_NAME#";
		if(cgi.SERVER_PORT neq 80 and cgi.SERVER_PORT neq 443){
			link &= ":#cgi.SERVER_PORT#";
		}
		link &="/reset/?token=#token#&uid=#userResult.user_id#";
		
		//Create the email body here. More advanced formatting can be added if
		//desired
		savecontent variable = "emailTxt"{
			writeOutput("
			<html>
			<h2>Password Reset</h2>
			<p>We have received a request to reset your password. Please follow the link below to reset your password
			<p><a href='#link#'>#link#</a>
			<p>If you did not request this, please ignore this email
			</html>
			");
		}


		var mail = new mail(
			from="DONOTREPLY@pointintime.info",
			to="#form.email#",
			subject="Reset Password for Point In Time",
			type="html",
			body=emailTxt
		).send();

		response.success = true;
		response.msg = "Instructions for resetting your password have been sent to #form.email#";
		request.udf.outputJson(response);

	}

	remote any function resetPassword(numeric user_id restargsource="path", string token restargsource="form") httpmethod="POST" restpath="{user_id}/reset"
	hint="Reset the user's password. Checks that the token is valid, and that 
	the password is valid, and then updates the database to the new password"
	{
		if(not isdefined('form.password')){
			request.udf.error(400, "Missing Password");
			return;
		}
		if(ARGUMENTS.token eq ""){
			request.udf.error(400, "Missing Token");
			return;
		}
		var query = new query();
		query.addParam(name="user_id", value=ARGUMENTS.user_id, cfsqltype="cf_sql_int");
		query.addParam(name="token", value=ARGUMENTS.token, cfsqltype="cf_sql_varchar");
		var result = query.execute(sql="
			SELECT
				reset_token,
				user_id
			FROM
				reset_token
			WHERE
				reset_token = :token
				and user_id = :user_Id
			").getResult();

		if(result.RECORDCOUNT lt 1){
			request.udf.error(400, "Invalid token/user_id combination");
			return;
		}
		
		query.addParam(name="pass", value=hash(FORM.password,"SHA-512"), cfsqltype="cf_sql_varchar");

		query.execute(sql="
			UPDATE user
				SET password = :pass
				WHERE user_id = :user_id
		");
		query.execute(sql="
			DELETE from reset_token
			where user_id = :user_id
		");
	}


	package query function getUserById(string id) 
	hint="Get the user with the passed id"
	{
		var query = new query();
		query.addParam(name="id", value=arguments.id, cfsqltype="cf_sql_int");

		var result = query.execute(sql="
				SELECT 
					user_id,
					email,
					fname,
					lname,
					phone,
					datecreated,
					dateupdated
				FROM
					user
				WHERE
					user_id = :id
			").getResult();
		return result;
	}	

	private boolean function isPasswordValid(string password) 
	hint="Check if password meets the complexity requirements. Add more Checks
	here to require a stronger password"
	{
		return (Len(password) gte 6);
	}
}
