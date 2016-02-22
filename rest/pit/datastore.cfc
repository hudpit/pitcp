component restpath="/datastore" rest="true"
hint="Handles all requests to /datastore/*."
{
	THIS.auth = createObject("component", "auth");
	/*************************************	
	Returns the *datastore* with the given *id*
	*************************************/
	remote any function getDatastore(string id restargsource="path") httpmethod="GET" restpath="{id}"
	hint="Returns the datastore with the given id. 
	GET /rest/datastore/734"
	{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		if(not isNumeric(arguments.id)){
			request.udf.error(400, "Invalid ID");
			return;
		}		
		request.udf.outputJson(this.getDatastoreById(ARGUMENTS.id))
	}


	/****************************************
	Creates  *datastore* with the given parameters
	*****************************************/
	remote any function addDatastore(string user_id restargsource="form") httpmethod="POST"
	hint="Creates a datastore based on the passed FORM parameters. Performs unique
	checks for the datastore title and datastore url.
	POST /rest/datastore/
	{
		datastore_title:'Test Datastore',
		datastore_url:'http://datastore.com'
	}"
	{
		//check for authorization
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		//make sure the user_id is numeric
		if(not isNumeric(arguments.user_id)){
			request.udf.error(400, "Invalid ID");
			return;
		}
		if(not structKeyExists(form, 'datastore_title') or form.datastore_title eq ""){
			request.udf.error(200, "Missing Datastore Title");
			return;
		}
		if(not structKeyExists(form, "datastore_url") or form.datastore_url eq ""){
			rquest.udf.error(200, "Missing Datastore URL");
			return;
		}

		//do checks to ensure a datastore doesn't already exist with this name
		//or url
		if(getDatastoreByTitle(form.datastore_title, THIS.auth.getCurrentUser()).recordcount gt 0){
			request.udf.error(200, "A datastore already exists with the title '#form.datastore_title#'. Please choose another name");
			return;
		}
		if(getDatastoreByUrl(form.datastore_url, THIS.auth.getCurrentUser()).recordcount gt 0){
			request.udf.error(200, "A datastore already exists for the url '#form.datastore_url#'.");
			return;
		}
		var datastore = {};
		datastore.datastore_id = request.udf.createId('datastore');
		datastore.user_Id = form.user_id;
		datastore.datastore_title = trim(form.datastore_title);
		datastore.datastore_url = form.datastore_url;

		var sql = "
			INSERT INTO datastore(
				datastore_id, 
				datastore_title,
				datastore_url,
				user_id
			)
			VALUES(
				:datastore_id,
				:datastore_title,
				:datastore_url,
				:user_id
			)
			";
		query = new query();
		query.addparam(name="datastore_id", value =datastore.datastore_id, cfsqltype="cf_sql_int");
		query.addparam(name="datastore_title", value=datastore.datastore_title, null=(datastore_title), cfsqltype="cf_sql_varchar");
		query.addparam(name="datastore_url", value=datastore.datastore_url, null=(datastore_url), cfsqltype="cf_sql_varchar");
		query.addparam(name="user_id", value=datastore.user_Id, cfsqltype="cf_sql_int");

		var result = query.execute(sql = sql).getResult();
		request.udf.outputJson({
			success:true,
			msg:'Datastore successfully created',
			data:getDatastoreById(datastore.datastore_id)
		});

	}
	remote any function editDatastore(string datastore_id restargsource="path") httpmethod="POST" restpath="{datastore_id}"
	hint="Edit datastore with the passed datastore_id. Performs unique checks for
	datastore title and datastore url"
	{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		if(not isNumeric(arguments.datastore_id)){
			request.udf.error(400, "Invalid ID");
			return;
		}
		var query = new query();
		query.setSQL("
			SELECT
				datastore_id,
				datastore_title,
				datastore_url
			FROM
				datastore
			WHERE 
				datastore_id = :datastore_id
		");
		query.addParam(name="datastore_id",value="#ARGUMENTS.datastore_id#",cfsqltype="cf_sql_int");
		var result = query.execute().getResult();
		if(result.RECORDCOUNT eq 0){
			request.udf.error(400, "Datastore #datastore_id# does not exist");
			return
		}

		var datastore = {};
		datastore.datastore_id = result.datastore_id[1];

		datastore.datastore_title = (structKeyExists(form, "datastore_title") and form.datastore_title neq "")?trim(form.datastore_title):result.datastore_title[1];
		datastore.datastore_url = (structKeyExists(form, "datastore_url") and form.datastore_url neq "")?form.datastore_url:result.datastore_url[1];

		if(getDatastoreByTitle(datastore.datastore_title, THIS.auth.getCurrentUser(), datastore.datastore_id).recordcount gt 0){
			request.udf.error(200, "A datastore already exists with the title '#datastore.datastore_title#'. Please choose another name");
			return;
		}
		if(getDatastoreByUrl(datastore.datastore_url, THIS.auth.getCurrentUser(), datastore.datastore_id).recordcount gt 0){
			request.udf.error(200, "A datastore already exists for the url '#datastore.datastore_url#'.");
			return;
		}

		var sql = "
		UPDATE datastore
		SET datastore_title = :datastore_title,
			datastore_url = :datastore_url
		WHERE datastore_id = #datastore.datastore_id#
			";
		query = new query();
		query.addParam(name="datastore_title",value="#datastore.datastore_title#",cfsqltype="cf_sql_varchar");
		query.addParam(name="datastore_url",value="#datastore.datastore_url#",cfsqltype="cf_sql_varchar");
		query.execute(sql=sql);

		request.udf.outputJson({
			"datastore"=getDatastoreById(datastore.datastore_id),
			"success" = true,
			"msg" = "Datastore successfully updated"
		});

	}
	remote any function deleteDatastore(numeric datastore_id restargsource="path") httpmethod="DELETE" restpath="{datastore_id}"
	hint="Deletes the datastore with the passed datastore_id. Will provide an 
	error if the datastore_id doesn't exist. Will provide an error if the datastore
	is associated with a project/region still"
	{
		if(not THIS.auth.isLoggedIn()){
			request.udf.error(401, "Not Authorized");
			return;
		}
		var query = new query();

		//Check if datastore_id exists
		query.setSQL("
			SELECT 
				datastore_id 
			FROM
				datastore
			WHERE
				datastore_id = :datastore_id
		");
		query.addparam(name="datastore_id",value="#datastore_id#",cfsqltype="cf_sql_int");
		var result = query.execute().getResult();
		if(result.RECORDCOUNT eq 0){
			request.udf.error(400, "Invalid Datastore ID");
			return
		}

		//Check if datastore is associated with a project/region still
		query.setSQL("
			SELECT
				project_id,
				project_title
			FROM
				project
			WHERE
				datastore_id = :datastore_id
		");
		var result = query.execute().getResult();
		if(result.recordcount gt 0){
			request.udf.error(200, "#result.recordcount# region#(result.recordcount gt 1)?'s are':' is'# currently associated to this datastore. Please remove this datastore from all regions prior to removing it");
			return;
		}
		query.setSQL("
			DELETE
				FROM datastore
			WHERE datastore_id = :datastore_id
		");
		query.execute();
		return {
			"success" = true,
			"datastore_id"=datastore_id,
			"msg" = "Datastore #datastore_id# successfully deleted"
		}
	}

	private query function getDatastoreById(numeric id)
	hint="Private function to return a datastore based on the passed id"
	{
		var query = new query();
		query.addparam(name="id", value=arguments.id, cfsqltype="cf_sql_int");

		var result = query.execute(sql="
			SELECT
				datastore_id,
				datastore_title,
				datastore_url,
				user_id
			FROM
				datastore
			WHERE
				datastore_id = :id
			").getResult();
		return result;
	}

	private query function getDatastoreByTitle(string datastore_title, struct user, numeric datastore_id)
	hint="Private function to return a datastore based on the title. Used when 
	checking for unique datastore titles"
	{
		var query = new query();
		var sql = "
			SELECT
				datastore_id,
				datastore_title,
				datastore_url,
				user_id
			FROM
				datastore
			WHERE
				datastore_title = :datastore_title
			AND user_id = :user_id
		";
		query.addparam(name="datastore_title", value=arguments.datastore_title, cfsqltype="cf_sql_varchar");
		query.addParam(name="user_id",value=arguments.user.user_id,cfsqltype="cf_sql_int");

		/*
			If the datastore_id is provided, we include a != clause, since
			we only want to see if a datastore other than the one provided
			exists with the given name
		 */
		if(structKeyExists(arguments, "datastore_id")){
			sql = sql & " AND datastore_id != :datastore_id";
			query.addParam(name="datastore_id", value=arguments.datastore_id,cfsqltype="cf_sql_int");
		}
		var result = query.execute(sql=sql).getResult();

		return result;
	}

	private query function getDatastoreByUrl(string datastore_url, struct user,numeric datastore_id)
	hint="Private function to return a datastore by the passed url. Used when
	performing a unique check on the datastore url"
	{
		var query = new query();
		
		var sql = "
			SELECT
				datastore_id,
				datastore_title,
				datastore_url,
				user_id
			FROM
				datastore
			WHERE
				datastore_url = :datastore_url
			AND user_id = :user_id
		";
		query.addparam(name="datastore_url", value=arguments.datastore_url, cfsqltype="cf_sql_varchar");
		query.addParam(name="user_id",value=arguments.user.user_id,cfsqltype="cf_sql_int");

		/*
			If the datastore_id is provided, we include a != clause, since
			we only want to see if a datastore other than the one provided
			exists with the given url
		 */
		if(structKeyExists(arguments, "datastore_id")){
			sql = sql & " AND datastore_id != :datastore_id";
			query.addParam(name="datastore_id", value=arguments.datastore_id,cfsqltype="cf_sql_int");
		}
		var result = query.execute(sql=sql).getResult();

		return result;
	}
}