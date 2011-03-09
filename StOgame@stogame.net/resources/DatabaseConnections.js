	var EXPORTED_SYMBOLS =[
			"StOgameDB",
			"accountdatabases",
			"st_accountspool"
		]
	var StOgameDBfile=Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties)
		.get("ProfD", Components.interfaces.nsIFile);
	var StOgameDBdir=Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties)
		.get("ProfD", Components.interfaces.nsIFile);
	StOgameDBfile.append("StOgame")
	if(!StOgameDBfile.exists()){
		StOgameDBfile.create(Components.interfaces.nsIFile.DIRECTORY_TYPE,0777);
	}
	StOgameDBdir.append("StOgame")
	StOgameDBfile.append("Main.sqlite")
	if(!StOgameDBfile.exists()){
		var EXT_ID="StOgame@stogame.net";
		var em=Components.classes["@mozilla.org/extensions/manager;1"]
			.getService(Components.interfaces.nsIExtensionManager);
		var SampleDB=em.getInstallLocation(EXT_ID).getItemFile(EXT_ID,"content");
		SampleDB.append("includes");
		SampleDB.append("Main.sqlite");
		if(SampleDB.exists()){
			SampleDB.copyTo(StOgameDBdir,"Main.sqlite");
		}
	}
	if(!StOgameDBfile.isReadable()||!StOgameDBfile.isWritable()){
		StOgameDBfile.permissions=0666;
	}
	var StOgameDB=Components.classes["@mozilla.org/storage/service;1"]
		.getService(Components.interfaces.mozIStorageService)
		.openDatabase(StOgameDBfile);
	
	//THIS CODE BECOMES UNNECESSARY BECAUSE OF THE NEW SAMPLE FILES INCLUDED IN THE STOGAME3 XPI
	/*
	StOgameDB.executeSimpleSQL(
		"CREATE TABLE IF NOT EXISTS "
			+"localization_strings "
				+"("
					+"language TEXT, "
					+"type TEXT, "
					+"name INTEGER, "
					+"value TEXT, "
					+"PRIMARY KEY "
						+"("
							+"language,"
							+"type,"
							+"name"
						+") "
						+"ON CONFLICT REPLACE"
				+") "
	);
	StOgameDB.executeSimpleSQL(
		"CREATE TABLE IF NOT EXISTS "
			+"universes "
				+"("
					+"language TEXT, "
					+"universe INTEGER, "
					+"domain TEXT, "
					+"speed INTEGER, "
					+"PRIMARY KEY "
						+"("
							+"language,"
							+"universe"
						+") "
						+"ON CONFLICT REPLACE"
				+") "
	);
	StOgameDB.executeSimpleSQL(
		"CREATE TABLE IF NOT EXISTS "
			+"last_updates "
				+"("
					+"name TEXT,"
					+"timestamp INTEGER,"
					+"PRIMARY KEY "
						+"("
							+"name"
						+") "
						+"ON CONFLICT REPLACE"
				+") "
	);
	StOgameDB.executeSimpleSQL(
		"CREATE TABLE IF NOT EXISTS "
			+"accounts "
				+"("
					+"language TEXT,"
					+"universe INTEGER,"
					+"ogameid INTEGER,"
					+"updated TEXT DEFAULT CURRENT_TIMESTAMP, "
					+"PRIMARY KEY "
						+"( "
							+"language,"
							+"universe,"
							+"ogameid"
						+") "
						+"ON CONFLICT IGNORE"
				+") "
	);
	StOgameDB.executeSimpleSQL(
		"CREATE TABLE IF NOT EXISTS "
			+"last_accounts "
				+"("
					+"language TEXT,"
					+"universe INTEGER,"
					+"ogameid INTEGER,"
					+"updated TEXT DEFAULT CURRENT_TIMESTAMP, "
					+"PRIMARY KEY "
						+"("
							+"language,"
							+"universe"
						+") "
						+"ON CONFLICT REPLACE"
				+") "
	);*/
	StOgameDB.executeSimpleSQL(
		"CREATE TABLE IF NOT EXISTS "
			+"options "
				+"("
					+"type TEXT, "
					+"name TEXT, "
					+"number INTEGER, "
					+"value TEXT, "
					+"updated INTEGER,"
					+"PRIMARY KEY "
						+"("
							+"type,"
							+"name, "
							+"number "
						+") "
						+"ON CONFLICT REPLACE"
				+") "
	);
	
	function AccountDatabases(){
		this.accountdatabases=new Array()
	}
	
	AccountDatabases.prototype.getDataBase=function(language,universe,ogameid){
		if(
			typeof this.accountdatabases[language]=="undefined"
			|| typeof this.accountdatabases[language][universe]=="undefined"
			|| typeof this.accountdatabases[language][universe][ogameid]=="undefined"
		){
			if(typeof this.accountdatabases[language]=="undefined"){
				this.accountdatabases[language]=new Array();
			}
			if(typeof this.accountdatabases[language][universe]=="undefined"){
				this.accountdatabases[language][universe]=new Array();
			}
			var AccountDBfile=Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("ProfD", Components.interfaces.nsIFile);
			AccountDBfile.append("StOgame")
			AccountDBfile.append("account_"+language+"_"+universe+"_"+ogameid+".sqlite")
			if(!AccountDBfile.exists()){
				var EXT_ID="StOgame@stogame.net";
				var em=Components.classes["@mozilla.org/extensions/manager;1"]
					.getService(Components.interfaces.nsIExtensionManager);
				var SampleDB=em.getInstallLocation(EXT_ID).getItemFile(EXT_ID,"content");
				SampleDB.append("includes");
				SampleDB.append("account_XX_YY_ZZZZZZ.sqlite");
				if(SampleDB.exists()){
					SampleDB.copyTo(StOgameDBdir,"account_"+language+"_"+universe+"_"+ogameid+".sqlite");
				}
			}
			if(!AccountDBfile.isReadable()||!AccountDBfile.isWritable()){
				AccountDBfile.permissions=0666;
			}
			this.accountdatabases[language][universe][ogameid]=Components.classes["@mozilla.org/storage/service;1"]
				.getService(Components.interfaces.mozIStorageService)
				.openDatabase(AccountDBfile);
			return this.accountdatabases[language][universe][ogameid];
		}else{
			return this.accountdatabases[language][universe][ogameid];
		}
	}
	
	accountdatabases=new AccountDatabases()
	
	var st_accountspool={
		"accounts":new Array(),
		"accountindex":new Array(),
		"lastaccounts":new Array()
	};