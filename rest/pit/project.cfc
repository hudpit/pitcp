component restpath="/project" rest="true"
hint="Handles all request to /rest/project."
{
	THIS.auth = createObject("component", "auth");

	remote any function getProject() httpmethod="POST" restpath="lookup"
	hint="Returns the *project* with the given id in the FORM scope. POST /rest/project/456"
	{
		if(structkeyexists(form, "id") and isNumeric(form.id)){
			//If numeric, ID was given
			request.udf.outputJson(this.getProjectById(ARGUMENTS.id));
			return;
		}else if(structKeyExists(form, "setup_key")){
			//If not numeric, Setup Key was given
			var query = new query();
			query.addparam(name="key", value=form.setup_key, cfsqltype="cf_sql_char");

			var result = query.execute(sql="
				SELECT
					project_id,
					project_title,
					setup_key,
					project.user_id,
					project.datastore_id,
					datastore.datastore_title,
					datastore.datastore_url,
					datecreated,
					dateupdated
				FROM project
					left join datastore on project.datastore_id = datastore.datastore_id
				WHERE
					setup_key = :key
				").getResult();	
			request.udf.outputJson(result);	
			return ;
		}else{
			request.udf.error(400, "Missing ID or setup_key");
		}

		
	}

	remote any function addProject() httpmethod="POST" 
	hint="Creates a project with the given parameters in the FORM scope. POST /rest/project. 
	Requires the user_id of the user creating the project and the project_title."{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		try{
			if(not isdefined('form.user_id')){
				request.udf.error(400, "Missing User ID");
				return;
			}
			if(not structKeyExists(form, "project_title") or form.project_title eq ""){
				request.udf.error(200, "Missing Project Title");
				return;
			}

			if(getProjectByTitle(project_title=form.project_title, user=THIS.auth.getCurrentUser()).recordcount gt 0){
				request.udf.error(200, "A Region already exists with the name '#form.project_title#'");
				return;
			}
			var project = {};
			project.project_id = request.udf.createId('project');
			project.user_id = form.user_id;
			project.setup_key = request.udf.createRandString(6);
			project.project_title = trim(form.project_title);
			project.datastore_id = (isdefined('form.datastore_id'))?form.datastore_id:"";

			var sql = "
				INSERT INTO project(
					project_id, 
					project_title,
					setup_key,
					user_id,
					datastore_id,
					datecreated)
				VALUES(
					:project_id,
					:project_title,
					:setup_key,
					:user_id,
					:datastore_id,
					:date
				)
				";
			query = new query();
			query.addparam(name="project_id", value =project.project_id, cfsqltype="cf_sql_int");
			query.addparam(name="project_title", value=project.project_title, null=(project.project_title eq ""), cfsqltype="cf_sql_varchar");
			query.addparam(name="setup_key", value=project.setup_key, cfsqltype="cf_sql_char");
			query.addparam(name="user_id", value=project.user_id, cfsqltype="cf_sql_int");
			query.addparam(name="datastore_id", value=project.datastore_id, null=(project.datastore_id eq ""), cfsqltype="cf_sql_int");
			query.addparam(name="date", value=now(), cfsqltype="cf_sql_timestamp")

			var result = query.execute(sql = sql).getResult();
			request.udf.outputJson({
				"success" = true,
				"msg" = "#project.project_title# successfully created",
				"data"=getProjectById(project.project_id)
			});
		}catch(e){
			writeDump(var="#e#",output="#getTempDirectory()#/e-#createUUID()#.html",format="html");
			request.udf.error(200, e.message);
		}
	}

	remote any function editProject(string id restargsource="path") httpmethod="POST" restpath="{id}"
	hint="Updates the project with the given id. Checks for uniqueness of the setup key and title"{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		if(not isNumeric(arguments.id)){
			request.udf.error(400, "Invalid Id");
			return;
		}

		var query = new query();
		query.addparam(name="id", value=arguments.id, cfsqltype="cf_sql_int");
		if(isdefined('form.setup_key')){
			query.addParam(name="setup_key", value="#form.setup_key#", cfsqltype="cf_sql_varchar");
			result = query.setSql(sql="
				Select project_id
				FROM project
				where setup_key = :setup_key
				and project_id != :id
			").execute().getResult();

			if(result.recordcount gt 0){
				request.udf.error(200, "Setup Key already exists");
				return;
			}
		}
		if(structKeyExists(form, "project_title") and form.project_title neq "" and getProjectByTitle(trim(form.project_title), THIS.auth.getCurrentUser(),arguments.id).recordcount gt 0){
			request.udf.error(200, "The region name '#form.project_title#' is already in use by another region");
			return;
		}
		query = new query(sql="
			SELECT
				project_title,
				setup_key,
				user_id, 
				datastore_id
			FROM
				project
			WHERE
				user_id = :id
		");		
		query.addparam(name="id", value=arguments.id, cfsqltype="cf_sql_int");
		var result = query.execute().getResult();

		var project = {
			project_title = result.project_title[1],
			setup_key = result.setup_key[1],
			user_id = result.user_id[1],
			datastore_id = result.datastore_id[1]
		};

		query = new query(sql="
			UPDATE project
			SET 
				project_title = :project_title,
				setup_key = :setup_key,
				user_id = :user_id,
				datastore_id = :datastore_id
			WHERE project_id = :project_id
		");

		query.addParam(name="project_title", value=(isdefined('form.project_title')?form.project_title:project.project_title), cfsqltype="cf_sql_varchar");
		query.addParam(name="setup_key", value=(isdefined('form.setup_key')?form.setup_key:project.setup_key), cfsqltype="cf_sql_varchar");
		query.addParam(name="user_id", value=(isdefined('form.user_id')?form.user_id:project.user_id), cfsqltype="cf_sql_int");
		query.addParam(name="datastore_id", value=(isdefined('form.datastore_id')?form.datastore_id:project.datastore_id), cfsqltype="cf_sql_int");		
		query.addParam(name="project_id", value=arguments.id, cfsqltype="cf_sql_int");		

		query.execute();


		request.udf.outputJson({
			"success":true,
			"msg":"Region successfully updated",
			"data":getProjectById(id)
			});
		return;
	}

	remote any function removeProject(string id restargsource="path") httpmethod="DELETE" restpath="{id}"
	hint="Removes the project with the passed id"{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		if(not isNumeric(arguments.id)){
			request.udf.error(400, "Invalid Id");
			return;
		}

		var query = new query();
		query.addParam(name="id", value=arguments.id, cfsqltype="cf_sql_int");
		var result = query.execute(sql="
			DELETE FROM project
			WHERE project_id = :id
			").getResult();
		var project ={project_id=arguments.id};
		request.udf.outputJson(project);
	}	return;


	private query function getProjectById(numeric id) 
	hint="Private function to retrieve a project by the passed ID"
	{
		var query = new query();
		query.addparam(name="id", value=arguments.id, cfsqltype="cf_sql_int");

		var result = query.execute(sql="
			SELECT
				project_id,
				project_title,
				setup_key,
				user_id,
				datastore_id,
				datecreated,
				dateupdated
			FROM
				project
			WHERE
				project_id = :id
			").getResult();
		return result;
	}

	private query function getProjectByTitle(string project_title, struct user, string project_id = "") 
	hint="Private function to retrieve a project by title. Used for checking uniqueness of title"
	{
		var query = new query();

		var sql = "
			SELECT
				project_id,
				project_title,
				setup_key,
				user_id,
				datastore_id,
				datecreated,
				dateupdated
			FROM
				project
			WHERE
				project_title = :project_title
			AND user_id = :user_id
		";
		query.addParam(name="project_title", value=arguments.project_title, cfsqltype="cf_sql_varchar");
		query.addParam(name="user_id", value=arguments.user.user_id, cfsqltype="cf_sql_int");
		if(isNumeric(arguments.project_id)){
			sql = sql & " AND project_id != :id";
			query.addparam(name="id", value=arguments.project_id, cfsqltype="cf_sql_int");
		}
		return query.execute(sql=sql).getResult();
	}

}