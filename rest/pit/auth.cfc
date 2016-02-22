component restpath="/auth" rest="true" hint="Controller to handle all things related to authentication"{
	remote any function checkAuth() httpmethod="GET" 
	hint="Checks to see if the current session user is authorized. If so, returns the current user"{
		var response  = {};
		response.success = isLoggedIn();
		if(response.success){
			response.user = getCurrentUser();
		}
		request.udf.outputJson(response);
	}

	remote any function login(string email restargsource="form", string password restargsource="form") httpMethod="POST" 
	hint="Logs a user into the control panel based on the passed email and password. 
	Returns the message to be displayed to the user if no email/password 
	combination is found. NOTE: For the function handling login to the app itself,
	see user.login"
	{
		var response  = {};

		//checks the database to see if the email/password combo is valid.
		var query = new query();
		query.setSql("
			SELECT 
				user.user_id,
				user.fname,
				user.lname,
				user.email,
				user.phone
			FROM user
			WHERE user.email = :email
			and user.password = :password
		");

		query.addParam(name="email", value=ARGUMENTS.email, cfsqltype="cf_sql_varchar");

		//hash the password using SHA-512
		query.addParam(name="password", value=hash(ARGUMENTS.password, "SHA-512"), cfsqltype="cf_sql_char");

		var result = query.execute().getResult();
		if(result.recordcount){
			setCurrentUser(result);
			response.success = true;
			response.user = getCurrentUser();
		}else{
			response.success = false;
			//simply tell the user it's an invalid combination. Don't let them
			//know whether or not it was the email, password, or both that
			//was invalid.
			response.msg = "Invalid User/Password Combination"
		}

		request.udf.outputJson(response);
		
	}	

	remote any function logout() httpmethod="DELETE"
	hint="Logs out the current user."
	{
		var response  = {};
		lock scope="session" type="exclusive" timeout="10"{
			structClear(session);
			response.success = true;
		}

		request.udf.outputJson(response);
	}				

	package boolean function isLoggedIn()
	hint="checks if the current session is logged in"
	{
		lock scope="Session" timeout="10" type="exclusive"{
			var isLoggedIn = structKeyExists(session, "user");
		}
		
		return isLoggedIn;
	}

	package struct function getCurrentUser()
	hint="Returns the currently logged in user"
	{
		lock scope="Session" timeout="10" type="exclusive"{
			var user_id = session.user_id;
		}
		var query = new query();
		query.setSql("
			SELECT 
				user.user_id,
				user.fname,
				user.lname,
				user.email,
				user.phone
			FROM user
			WHERE user.user_id = :user_id
		");
		query.addParam(name="user_id",value=user_id,cfsqltype="cf_sql_int");
		var result = query.execute().getResult();
		var user = {
			"user_id" = result.user_id[1],
			"email" = result.email[1],
			"fname" = result.fname[1],
			"lname" = result.lname[1],
			"phone" = result.phone[1]	
		};
		setCurrentUser(user);
		return user;
	}

	package void function setCurrentUser(user) 
	hint="Sets the user variable in the session scope"
	{
		lock scope="session" type="exclusive" timeout="10"{
			SESSION.user = {
				"user_id" = user.user_id,
				"email" = user.email,
				"fname" = user.fname,
				"lname" = user.lname,
				"phone" = user.phone
			};
			SESSION.user_id = user.user_id;
		}
	}
}