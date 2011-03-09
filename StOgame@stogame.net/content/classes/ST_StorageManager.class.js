function ST_StorageManager(account){
	try{
		this.language			=	account.language;
		this.universe			=	account.universe;
		this.ogameid			=	account.ogameid;
		this.queries			=	new Array();
		this.DB					=	account.AccountDB;
		if(typeof this.DB.executeAsync!="undefined"){
			var ST_StorageManager=this;
			this.push=function(statement){
				try{
					ST_StorageManager.queries.push(statement);
				}catch(e){
					st_errors.adderror(
						e,
						"push (FF3.5)",
						"see_how_to_retrieve_html",
						"no_interesting_vars"
					)
				}
			}
			this.poller=window.setInterval(
				function(){
					ST_StorageManager.run_async();
				},
				4000,
				false
			);
		}else{
			this.push=function(statement){
				try{
					statement.execute();
				}catch(e){
					st_errors.adderror(
						e,
						"push (FF3.0)",
						"see_how_to_retrieve_html",
						"no_interesting_vars"
					)
				}
			}
		}
	}catch(e){
		st_errors.adderror
		(
			e,
			"constructor",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

ST_StorageManager.prototype.run_async=function()
{
	try{
		var maxlen=this.queries.length;
		if(maxlen){
			this.DB.executeAsync(
				this.queries.splice(0,maxlen),
				maxlen,
				function(){/*alert("done saving!")*/}
			);
		}
	}catch(e){
		st_errors.adderror(
			e,
			"run_async",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		);
	}
}