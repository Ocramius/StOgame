/*	Copyright 2007-2009 by Marco Pivetta (ocramius@gmail.com)
    This file is part of StOgame.

    StOgame is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    StOgame is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with StOgame.  If not, see <http://www.gnu.org/licenses/>. */
function StOGalaxy(language,universe,ogameid,AccountDB,email)
{
	try
	{
		this.language=language;
		this.universe=universe;
		this.ogameid=ogameid;
		this.AccountDB=AccountDB;
		//THIS CODE BECOMES UNNECESSARY BECAUSE OF THE NEW SAMPLE FILES INCLUDED IN THE STOGAME3 XPI
		/*
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"stogalaxy_accountdata "
					+"( "
						+"id INTEGER DEFAULT 1, "
						+"email TEXT DEFAULT '', "
						+"password TEXT DEFAULT '', "
						+"sessionid TEXT DEFAULT '', "
						+"sessionid_updatetimestamp INTEGER DEFAULT 0, "
						+"status TEXT DEFAULT 'pending_registration', "
						+"galaxy_updatetimestamp INTEGER DEFAULT 0, "
						+"ranks_updatetimestamp INTEGER DEFAULT 0, "
						+"commercetransactions_updatetimestamp INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"id "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"stogalaxy_player_rankupdates "
					+"( "
						+"rankgroup INTEGER, "
						+"points_update_timestamp INTEGER DEFAULT 0, "
						+"fleet_update_timestamp INTEGER DEFAULT 0, "
						+"research_update_timestamp INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"rankgroup "
							+") "
							+"ON CONFLICT IGNORE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"stogalaxy_alliance_rankupdates "
					+"( "
						+"rankgroup INTEGER, "
						+"points_update_timestamp INTEGER DEFAULT 0, "
						+"fleet_update_timestamp INTEGER DEFAULT 0, "
						+"research_update_timestamp INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"rankgroup "
							+") "
							+"ON CONFLICT IGNORE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"stogalaxy_galaxy_systemupdates "
					+"( "
						+"x INTEGER, "
						+"y INTEGER, "
						+"update_timestamp INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"x, "
								+"y "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);*/
		var getstogalaxyaccountinfoquery=this.AccountDB.createStatement(
			"SELECT "
				+"email, "
				+"password, "
				+"sessionid, "
				+"sessionid_updatetimestamp, "
				+"status, "
				+"galaxy_updatetimestamp, "
				+"ranks_updatetimestamp, "
				+"commercetransactions_updatetimestamp "
			+"FROM "
				+"stogalaxy_accountdata "
			+"WHERE "
				+"id = 1 "
			+"LIMIT "
				+"0, 1 "
		);
		if(getstogalaxyaccountinfoquery.executeStep())
		{
			this.email									=	getstogalaxyaccountinfoquery.getUTF8String	(0);
			this.password								=	getstogalaxyaccountinfoquery.getUTF8String	(1);
			this.sessionid								=	getstogalaxyaccountinfoquery.getUTF8String	(2);
			this.sessionid_updatetimestamp				=	getstogalaxyaccountinfoquery.getInt64		(3);
			this.status									=	getstogalaxyaccountinfoquery.getUTF8String	(4);
			this.galaxy_updatetimestamp					=	getstogalaxyaccountinfoquery.getInt64		(5);
			this.ranks_updatetimestamp					=	getstogalaxyaccountinfoquery.getInt64		(6);
			this.commercetransactions_updatetimestamp	=	getstogalaxyaccountinfoquery.getInt64		(7);
		}
		else
		{
			this.email=email;
			this.password="";
			this.sessionid="";
			this.sessionid_updatetimestamp=0;
			this.status="pending_registration";
			var pref=Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("standardogame.");
			this.galaxy_updatetimestamp=0;
			this.playerranks_updatetimestamp=0;
			this.allianceranks_updatetimestamp=0;
			this.commercetransactions_updatetimestamp=0;
			var createstogalaxyaccountinfo=this.AccountDB.createStatement(
				"INSERT INTO "
					+"stogalaxy_accountdata "
						+"( "
							+"id, "
							+"email, "
							+"password, "
							+"sessionid, "
							+"sessionid_updatetimestamp, "
							+"status "
						+") "
						+"VALUES "
						+"( "
							+"1, "
							+"?1, "
							+"?2, "
							+"?3, "
							+"?4, "
							+"?5 "
						+") "
			);
			createstogalaxyaccountinfo.bindUTF8StringParameter		(0, this.email);
			createstogalaxyaccountinfo.bindUTF8StringParameter		(1, this.password);
			createstogalaxyaccountinfo.bindUTF8StringParameter		(2, this.sessionid);
			createstogalaxyaccountinfo.bindInt64Parameter			(3, this.sessionid_updatetimestamp);
			createstogalaxyaccountinfo.bindUTF8StringParameter		(4, this.status);
			createstogalaxyaccountinfo.execute();
			//allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(createstogalaxyaccountinfo);
			//createstogalaxyaccountinfo.execute();
		}
		this.firststatuscheck=setTimeout(
			function(stogalaxyobject)
			{
				stogalaxyobject.checkStOGalaxyStatus();
			},
			15000,
			this
		);
		this.statuspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.checkStOGalaxyStatus();
			},
			600000,
			this
		);
		this.getranksupdatespoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.getRanksUpdates();
			},
			135000,
			this
		);
		this.sendpointsrankspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendPlayerPointRanks();
			},
			180000,
			this
		);
		this.sendfleetrankspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendPlayerFleetRanks();
			},
			182000,
			this
		);
		this.sendresearchrankspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendPlayerResearchRanks();
			},
			184000,
			this
		);
		this.sendallypointsrankspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendAlliancePointRanks();
			},
			190000,
			this
		);
		this.sendallyfleetrankspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendAllianceFleetRanks();
			},
			192000,
			this
		);
		this.sendallyresearchrankspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendAllianceResearchRanks();
			},
			194000,
			this
		);
		this.getgalaxiesupdatespoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.getGalaxiesUpdates();
			},
			160000,
			this
		);
		this.sendgalaxiespoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendGalaxies();
			},
			200000,
			this
		);
		this.sendspyreportspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendSpyReports();
			},
			300000,
			this
		);
		this.sendspyresearchespoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendSpyResearches();
			},
			310000,
			this
		);
		this.sendspylogspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendSpyLogs();
			},
			320000,
			this
		);
		this.sendmessagespoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendMessages();
			},
			250000,
			this
		);
		this.sendsentmessagespoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendSentMessages();
			},
			270000,
			this
		);
		this.sendcircularmailspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendCircularMails();
			},
			220000,
			this
		);
		this.sendcombatreportspoller=setInterval(
			function(stogalaxyobject)
			{
				stogalaxyobject.sendCombatReports();
			},
			400000,
			this
		);
		this.xmpp=new XMPPConnection	(this.language,this.universe,this.ogameid);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"constructor",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}


/*********************************************************************
				STOGALAXY ACCOUNT MANAGEMENT
*********************************************************************/
StOGalaxy.prototype.checkStOGalaxyStatus=function()
{
	/************************************************************************************************
		Statuses:
		pending_registration		//not active
		pending_email_approval	//active
		enabled			//active - all running
		disabled			//not active
		wrong_password		//not active
		already_registered		//not active
		password_changed		//not active
	************************************************************************************************/
	switch(this.status)
	{
		case "pending_registration":
			this.registerNewAccount();
		break;
		case "pending_email_approval":
			globaltooltip.tip(this.language,this.universe,this.ogameid,"stogalaxy_email_approval","stogalaxy_email_approval","stogalaxy_email_approval",localization.getLocalizationString(this.language,"stogalaxy","email_approval"),localization.getLocalizationString(this.language,"stogalaxy","email_approval_detailed"),"");
			if(Math.abs(this.sessionid_updatetimestamp-allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp())>43200000)
			{
				this.getNewSession();
			}
		break;
		case "enabled":
			this.xmpp.checkconnection(); //DISABLED DURING THESE TESTS!!!!
			if(Math.abs(this.sessionid_updatetimestamp-allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp())>43200000)
			{
				this.getNewSession();
			}
		break;
		case "wrong_password":
			globaltooltip.tip(this.language,this.universe,this.ogameid,"stogalaxy_wrong_settings","stogalaxy_wrong_settings","stogalaxy_wrong_settings",localization.getLocalizationString(this.language,"stogalaxy","wrong_password"),localization.getLocalizationString(this.language,"stogalaxy","wrong_password_detailed"),"");
		break;
		case "already_registered":
			globaltooltip.tip(this.language,this.universe,this.ogameid,"stogalaxy_wrong_settings","stogalaxy_wrong_settings","stogalaxy_wrong_settings",localization.getLocalizationString(this.language,"stogalaxy","already_registered"),localization.getLocalizationString(this.language,"stogalaxy","already_registered_detailed"),"");
		break;
		case "password_changed":
			globaltooltip.tip(this.language,this.universe,this.ogameid,"stogalaxy_wrong_settings","stogalaxy_wrong_settings","stogalaxy_wrong_settings",localization.getLocalizationString(this.language,"stogalaxy","password_changed"),localization.getLocalizationString(this.language,"stogalaxy","password_changed_detailed"),"");
		break;
		case "disabled":
		break;
		default:
		break;
	}
}

StOGalaxy.prototype.getNewSession=function()
{
	try
	{
		var language=this.language;
		var universe=this.universe;
		var ogameid=this.ogameid;
		var req=new XMLHttpRequest();
		var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&p="+this.password+"&e="+this.email;
		req.mozBackgroundRequest=true;
		req.onload=function()
			{
				try
				{
					if(
						(req.status==200)
						&&(req.readyState==4)
					)
					{
						switch(req.responseText)
						{
							case "0":
								//WRONG DATA (CORRUPTED DATA)
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_corrupt_data","stogalaxy_corrupt_data","stogalaxy_corrupt_data",localization.getLocalizationString(language,"stogalaxy","corrupt_data"),localization.getLocalizationString(language,"stogalaxy","corrupt_data_detailed"),"");
							break;
							case "1":
								//SERVER INTERNAL ERROR
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
							break;
							case "2":
								//ACCOUNT DOES NOT EXIST
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_not_registered","stogalaxy_not_registered","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","not_registered"),localization.getLocalizationString(language,"stogalaxy","not_registered_detailed"),"");
								allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.status="pending_registration";
								var stogalaxysessionupdate=allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.AccountDB
									.createStatement
									(
										"UPDATE "
											+"stogalaxy_accountdata "
										+"SET "
											+"status = ?1 "
									);
								stogalaxysessionupdate.bindUTF8StringParameter		(0, "pending_registration");
								allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
								//stogalaxysessionupdate.execute();
							break;
							case "3":
								//WRONG PASSWORD
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_wrong_settings","stogalaxy_wrong_settings","stogalaxy_wrong_settings",localization.getLocalizationString(language,"stogalaxy","wrong_password"),localization.getLocalizationString(language,"stogalaxy","wrong_password_detailed"),"");
								allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.status="wrong_password";
								var stogalaxysessionupdate=allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.AccountDB
									.createStatement
									(
										"UPDATE "
											+"stogalaxy_accountdata "
										+"SET "
											+"status = ?1 "
									);
								stogalaxysessionupdate.bindUTF8StringParameter		(0, "wrong_password");
								allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
								//stogalaxysessionupdate.execute();
							break;
							case "4":
								//ACCOUNT IS NOT ACTIVE
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_email_approval","stogalaxy_email_approval","stogalaxy_email_approval",localization.getLocalizationString(language,"stogalaxy","email_approval"),localization.getLocalizationString(language,"stogalaxy","email_approval_detailed"),"");
								allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.status="pending_email_approval";
								var stogalaxysessionupdate=allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.AccountDB
									.createStatement
									(
										"UPDATE "
											+"stogalaxy_accountdata "
										+"SET "
											+"status = ?1 "
									);
								stogalaxysessionupdate.bindUTF8StringParameter		(0, "pending_email_approval");
								allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
								//stogalaxysessionupdate.execute();
							break;
							default:
								var responseText=req.responseText.split("\n");
								if
								(
									responseText.length==2
									&& responseText[0].length==8
								)
								{
									allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.status="enabled";
									allaccounts
										.accounts[allaccounts.accountindex[language][universe][ogameid]]
										.stogalaxy
										.sessionid_updatetimestamp=allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].getServerTimestamp();
									allaccounts
										.accounts[allaccounts.accountindex[language][universe][ogameid]]
										.stogalaxy
										.sessionid=responseText[0];
									var stogalaxysessionupdate=allaccounts
										.accounts[allaccounts.accountindex[language][universe][ogameid]]
										.stogalaxy
										.AccountDB
										.createStatement
										(
											"UPDATE "
												+"stogalaxy_accountdata "
											+"SET "
												+"sessionid = ?1, "
												+"sessionid_updatetimestamp = ?2, "
												+"status = ?3 "
										);
									stogalaxysessionupdate.bindUTF8StringParameter		(0, responseText[0]);
									stogalaxysessionupdate.bindInt64Parameter			(1, allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].getServerTimestamp());
									stogalaxysessionupdate.bindUTF8StringParameter		(2, "enabled");
									allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
									//stogalaxysessionupdate.execute();
								}
								else
								{
									globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
								}
							break;
						}
					}
					else
					{
						globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
					}
				}
				catch(e)
				{
					st_errors.adderror
					(
						e,
						"getNewSession.req.onload",
						"see_how_to_retrieve_html",
						"no_interesting_vars"
					)
				}
			};
		req.open('POST', "http://data.stogame.net/"+GlobalVars.stogame_version+"/session/getsession.php", true);
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.setRequestHeader("Content-length", postdata.length);
		req.setRequestHeader("Connection", "close");
		req.overrideMimeType('text/plain');
		req.send(postdata);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getNewSession",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.requestNewPassword=function()
{
	try
	{
		var language	=	this.language;
		var universe	=	this.universe;
		var ogameid		=	this.ogameid;
		var email		=	this.email;
		var req=new XMLHttpRequest();
		var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&e="+this.email;
		req.mozBackgroundRequest=true;
		req.onload=function()
			{
				try
				{
					var responseText=ST_trim(req.responseText);
					if(
						(req.status==200)
						&&(req.readyState==4)
					)
					{
						switch(responseText)
						{
							case email:
								//CORRECT
								allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.status="password_changed";
								var stogalaxysessionupdate=allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.AccountDB
									.createStatement
									(
										"UPDATE "
											+"stogalaxy_accountdata "
										+"SET "
											+"status = ?1 "
									);
								stogalaxysessionupdate.bindUTF8StringParameter		(0, "password_changed");
								//stogalaxysessionupdate.execute();
								allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_new_password","stogalaxy_new_password","stogalaxy_new_password",localization.getLocalizationString(language,"stogalaxy","new_password"),localization.getLocalizationString(language,"stogalaxy","new_password_detailed"),"");
							break;
							case "0":
								//WRONG DATA (CORRUPTED DATA)
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_corrupt_data","stogalaxy_corrupt_data","stogalaxy_corrupt_data",localization.getLocalizationString(language,"stogalaxy","corrupt_data"),localization.getLocalizationString(language,"stogalaxy","corrupt_data_detailed"),"");
							break;
							case "1":
								//SERVER INTERNAL ERROR
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
							break;
							case "2":
								//ACCOUNT DOES NOT EXIST
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_not_registered","stogalaxy_not_registered","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","not_registered"),localization.getLocalizationString(language,"stogalaxy","not_registered_detailed"),"");
								allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.status="pending_registration";
								var stogalaxysessionupdate=allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.AccountDB
									.createStatement
									(
										"UPDATE "
											+"stogalaxy_accountdata "
										+"SET "
											+"status = ?1 "
									);
								stogalaxysessionupdate.bindUTF8StringParameter		(0, "pending_registration");
								//stogalaxysessionupdate.execute();
								allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
							break;
							case "3":
								allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.status="already_registered";
								var stogalaxysessionupdate=allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.AccountDB
									.createStatement
									(
										"UPDATE "
											+"stogalaxy_accountdata "
										+"SET "
											+"status = ?1 "
									);
								stogalaxysessionupdate.bindUTF8StringParameter		(0, "already_registered");
								//stogalaxysessionupdate.execute();
								allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
								//WRONG EMAIL - REQUESTING CHANGE
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_new_password","stogalaxy_new_password","stogalaxy_new_password",localization.getLocalizationString(language,"stogalaxy","new_password"),localization.getLocalizationString(language,"stogalaxy","new_password_detailed"),"");
							break;
							case "4":
								allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.status="pending_email_approval";
								var stogalaxysessionupdate=allaccounts
									.accounts[allaccounts.accountindex[language][universe][ogameid]]
									.stogalaxy
									.AccountDB
									.createStatement
									(
										"UPDATE "
											+"stogalaxy_accountdata "
										+"SET "
											+"status = ?1 "
									);
								stogalaxysessionupdate.bindUTF8StringParameter		(0, "pending_email_approval");
								allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
								//stogalaxysessionupdate.execute();
								//ACCOUNT IS NOT ACTIVE
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_email_approval","stogalaxy_email_approval","stogalaxy_email_approval",localization.getLocalizationString(language,"stogalaxy","email_approval"),localization.getLocalizationString(language,"stogalaxy","email_approval_detailed"),"");
							break;
							default:
								globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
							break;
						}
					}
					else
					{
						globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
					}
				}
				catch(e)
				{
					st_errors.adderror
					(
						e,
						"requestNewPassword.req.onload",
						"see_how_to_retrieve_html",
						"no_interesting_vars"
					)
				}
			};
		req.open('POST', "http://data.stogame.net/"+GlobalVars.stogame_version+"/session/getpassword.php", true);
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.setRequestHeader("Content-length", postdata.length);
		req.setRequestHeader("Connection", "close");
		req.overrideMimeType('text/plain');
		req.send(postdata);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"requestNewPassword",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.registerNewAccount=function()
{
	try
	{
		if(!confirm(localization.getLocalizationString(this.language,"stogalaxy","use_stogalaxy")))
		{
			this.disable();
		}
		else
		{
			if
			(
				this.email.indexOf("@")>1
				&& this.email.indexOf("@",this.email.indexOf("@")+1)==-1
				&& this.email.indexOf(".",this.email.indexOf("@")+1)>1
				&& this.email.split(".")[this.email.split(".").length-1].length>0
			)
			{
				var defaultemail=confirm(localization.getLocalizationString(this.language,"stogalaxy","default_email")+this.email+"\n"+localization.getLocalizationString(this.language,"stogalaxy","use_default_email"));
			}
			else
			{
				var defaultemail=false;
			}
			if(!defaultemail)
			{
				var getmail=function(email)
				{
					if(
						email.indexOf("@")>1
						&& email.indexOf("@",email.indexOf("@")+1)==-1
						&& email.indexOf(".",email.indexOf("@")+1)>1
						&& email.split(".")[email.split(".").length-1].length>0
					)
					{
						return email;
					}
					else
					{
						return getmail(String(prompt(localization.getLocalizationString(this.language,"stogalaxy","insert_email"))));
					}
				}
				var mail=getmail("");
				this.setEmail(mail);
			}
			
			var language=this.language;
			var universe=this.universe;
			var ogameid=this.ogameid;
			var req=new XMLHttpRequest();
			var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&e="+this.email;
			req.mozBackgroundRequest=true;
			req.onload=function()
				{
					try
					{
						var responseText=ST_trim(req.responseText);
						if(
							(req.status==200)
							&&(req.readyState==4)
						)
						{
							switch(responseText)
							{
								case "0":
									//INCORRECT DATA
									globaltooltip.tip(language,universe,ogameid,"stogalaxy_corrupt_data","stogalaxy_corrupt_data","stogalaxy_corrupt_data",localization.getLocalizationString(language,"stogalaxy","corrupt_data"),localization.getLocalizationString(language,"stogalaxy","corrupt_data_detailed"),"");
								break;
								case "1":
									globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
									//INCORRECT DATA
								break;
								case "2":
									//INCORRECT DATA
									globaltooltip.tip(language,universe,ogameid,"stogalaxy_wrong_settings","stogalaxy_wrong_settings","stogalaxy_wrong_settings",localization.getLocalizationString(language,"stogalaxy","already_registered"),localization.getLocalizationString(language,"stogalaxy","already_registered_detailed"),"");
									allaccounts
										.accounts[allaccounts.accountindex[language][universe][ogameid]]
										.stogalaxy
										.status="already_registered";
									var stogalaxysessionupdate=allaccounts
										.accounts[allaccounts.accountindex[language][universe][ogameid]]
										.stogalaxy
										.AccountDB
										.createStatement
										(
											"UPDATE "
												+"stogalaxy_accountdata "
											+"SET "
												+"status = ?1 "
										);
									stogalaxysessionupdate.bindUTF8StringParameter		(0, "already_registered");
									allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
									//stogalaxysessionupdate.execute();
								break;
								default:
									if(responseText.length==32)
									{
										allaccounts
											.accounts[allaccounts.accountindex[language][universe][ogameid]]
											.stogalaxy
											.password=responseText;
										allaccounts
											.accounts[allaccounts.accountindex[language][universe][ogameid]]
											.stogalaxy
											.status="pending_email_approval";
										var stogalaxysessionupdate=allaccounts
											.accounts[allaccounts.accountindex[language][universe][ogameid]]
											.stogalaxy
											.AccountDB
											.createStatement
											(
												"UPDATE "
													+"stogalaxy_accountdata "
												+"SET "
													+"password = ?1, "
													+"status = ?2 "
											);
										stogalaxysessionupdate.bindUTF8StringParameter		(0, responseText);
										stogalaxysessionupdate.bindUTF8StringParameter		(1, "pending_email_approval");
										//stogalaxysessionupdate.execute();
										allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(stogalaxysessionupdate);
										globaltooltip.tip(language,universe,ogameid,"stogalaxy_registered","stogalaxy_registered","stogalaxy_registered",localization.getLocalizationString(language,"stogalaxy","registered"),localization.getLocalizationString(language,"stogalaxy","registered_detailed"),"");
									}
									else
									{
										globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
									}
								break;
							}
						}
						else
						{
							globaltooltip.tip(language,universe,ogameid,"stogalaxy_server_error","stogalaxy_server_error","stogalaxy_server_error",localization.getLocalizationString(language,"stogalaxy","server_error"),localization.getLocalizationString(language,"stogalaxy","server_error_detailed"),"");
							/************************************************************************************************
								Statuses:
								pending_registration
								pending_email_approval
								enabled
								disabled
								wrong_password
								wrong_email
								already_registered
								password_changed
							************************************************************************************************/
						}
					}
					catch(e)
					{
						st_errors.adderror
						(
							e,
							"registerNewAccount.req.onload",
							"see_how_to_retrieve_html",
							"no_interesting_vars"
						)
					}
				};
			req.open('POST', "http://data.stogame.net/"+GlobalVars.stogame_version+"/session/registeraccount.php", true);
			req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			req.setRequestHeader("Content-length", postdata.length);
			req.setRequestHeader("Connection", "close");
			req.overrideMimeType('text/plain');
			req.send(postdata);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"registerNewAccount",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.setPassword=function(password)
{
	if(password.length==32)
	{
		this.password=password;
		var stogalaxyupdate=allaccounts
			.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.stogalaxy
			.AccountDB
			.createStatement
			(
				"UPDATE "
					+"stogalaxy_accountdata "
				+"SET "
					+"password = ?1, "
					+"status = ?2 "
			);
		stogalaxyupdate.bindUTF8StringParameter		(0, password);
		stogalaxyupdate.bindUTF8StringParameter		(1, "enabled");
		//stogalaxyupdate.execute();
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(stogalaxyupdate);
		return true;
	}
	else
	{
		return false;
	}
}

StOGalaxy.prototype.setEmail=function(email)
{
	if
	(
		email.indexOf("@")>1
		&& email.indexOf("@",email.indexOf("@")+1)==-1
		&& email.indexOf(".",email.indexOf("@")+1)>1
		&& email.split(".")[email.split(".").length-1].length>0
	)
	{
		this.email=email;
		var stogalaxyupdate=allaccounts
			.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.stogalaxy
			.AccountDB
			.createStatement
			(
				"UPDATE "
					+"stogalaxy_accountdata "
				+"SET "
					+"email = ?1, "
					+"status = ?2 "
			);
		stogalaxyupdate.bindUTF8StringParameter		(0, email);
		stogalaxyupdate.bindUTF8StringParameter		(1, "enabled");
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(stogalaxyupdate);
		//stogalaxyupdate.execute();
		return true;
	}
	else
	{
		return false;
	}
}

StOGalaxy.prototype.enable=function()
{
	this.status="enabled";
	var stogalaxyupdate=allaccounts
		.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
		.stogalaxy
		.AccountDB
		.createStatement
		(
			"UPDATE "
				+"stogalaxy_accountdata "
			+"SET "
				+"status = ?1 "
		);
	stogalaxyupdate.bindUTF8StringParameter		(0, "enabled");
	//stogalaxyupdate.execute();
	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(stogalaxyupdate);
	this.checkStOGalaxyStatus();
}

StOGalaxy.prototype.disable=function()
{
	this.status="disabled";
	var stogalaxyupdate=allaccounts
		.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
		.stogalaxy
		.AccountDB
		.createStatement
		(
			"UPDATE "
				+"stogalaxy_accountdata "
			+"SET "
				+"status = ?1 "
		);
	stogalaxyupdate.bindUTF8StringParameter		(0, "disabled");
	//stogalaxyupdate.execute();
	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(stogalaxyupdate);
}

StOGalaxy.prototype.checkStatus=function()
{
	return (
			this.status=="enabled"
			&& Math.abs(this.sessionid_updatetimestamp-allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp())<43200000
		);
}

/*********************************************************************
					RANKS MANAGEMENT
*********************************************************************/
StOGalaxy.prototype.setRankUpdates=function(type,ranktype,returndata)
{
	try
	{
		var returndata=returndata.split("\n");
		for(var i=0;i<returndata.length;i++)
		{
			if(returndata[i].length>3)
			{
				var rankgroup=ST_parseInt(returndata[i]);
				var timestamp=ST_parseInt(returndata[i].substring(returndata[i].indexOf(":")+1,returndata[i].length))*1000;
				var insertranksstatusupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].stogalaxy.AccountDB
					.createStatement
					(
						"INSERT INTO "
							+"stogalaxy_"+(type==1?"player":"alliance")+"_rankupdates "
								+"( "
									+"rankgroup, "
									+(ranktype==1?"points":(ranktype==2?"fleet":"research"))+"_update_timestamp "
								+") "
								+"VALUES "
								+"( "
									+"?1, "
									+"?2 "
								+") "
					);
				insertranksstatusupdate.bindInt32Parameter(0,rankgroup);
				insertranksstatusupdate.bindInt64Parameter(1,timestamp);
				//insertranksstatusupdate.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertranksstatusupdate);
				var updateranksstatusupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].stogalaxy.AccountDB
					.createStatement
					(
						"UPDATE "
							+"stogalaxy_"+(type==1?"player":"alliance")+"_rankupdates "
						+"SET "
							+(ranktype==1?"points":(ranktype==2?"fleet":"research"))+"_update_timestamp=?1 "
						+"WHERE "
							+"rankgroup=?2 "
					);
				updateranksstatusupdate.bindInt64Parameter(0,timestamp);
				updateranksstatusupdate.bindInt32Parameter(1,rankgroup);
				//updateranksstatusupdate.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateranksstatusupdate);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setRankUpdates",
			"see_how_to_retrieve_html",
			"type="+type+"/***/ranktype="+ranktype+"/***/returndata="+returndata
		)
	}
}

StOGalaxy.prototype.getRanksUpdates=function()
{
	try
	{
		//CHECK EVERY 12 HOURS
		if
		(
			(this.ranks_updatetimestamp)<(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()-43200000)
			&& this.checkStatus()
		)
		{
			var stogalaxy=this;
			var preq=new XMLHttpRequest();
			var freq=new XMLHttpRequest();
			var rreq=new XMLHttpRequest();
			var apreq=new XMLHttpRequest();
			var afreq=new XMLHttpRequest();
			var arreq=new XMLHttpRequest();
			var postdata="l="+this.language+"&u="+this.universe;
			preq.mozBackgroundRequest=true;
			freq.mozBackgroundRequest=true;
			rreq.mozBackgroundRequest=true;
			apreq.mozBackgroundRequest=true;
			afreq.mozBackgroundRequest=true;
			arreq.mozBackgroundRequest=true;
			preq.onload=function()
			{
				if(
					(this.status==200)
					&&(this.readyState==4)
				)
				{
					stogalaxy.setRankUpdates(1,1,this.responseText);
					freq.send(postdata);
				}
			}
			freq.onload=function()
			{
				if(
					(this.status==200)
					&&(this.readyState==4)
				)
				{
					stogalaxy.setRankUpdates(1,2,this.responseText);
					rreq.send(postdata);
				}
			}
			rreq.onload=function()
			{
				if(
					(this.status==200)
					&&(this.readyState==4)
				)
				{
					stogalaxy.setRankUpdates(1,3,this.responseText);
					apreq.send(postdata);
				}
			}
			apreq.onload=function()
			{
				if(
					(this.status==200)
					&&(this.readyState==4)
				)
				{
					stogalaxy.setRankUpdates(2,1,this.responseText);
					afreq.send(postdata);
				}
			}
			afreq.onload=function()
			{
				if(
					(this.status==200)
					&&(this.readyState==4)
				)
				{
					stogalaxy.setRankUpdates(2,2,this.responseText);
					arreq.send(postdata);
				}
			}
			arreq.onload=function()
			{
				if(
					(this.status==200)
					&&(this.readyState==4)
				)
				{
					stogalaxy.setRankUpdates(2,3,this.responseText);
					var setstogalaxylastsyncronizationupdates=allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].stogalaxy.AccountDB
						.createStatement
						(
							"UPDATE "
								+"stogalaxy_accountdata "
							+"SET "
								+"ranks_updatetimestamp = ?1 "
							+"WHERE "
								+"id = 1 "
						);
					setstogalaxylastsyncronizationupdates.bindInt64Parameter		(0,allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].getServerTimestamp());
					allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].storagemanager.push(setstogalaxylastsyncronizationupdates);
					//setstogalaxylastsyncronizationupdates.execute();
					allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].stogalaxy.ranks_updatetimestamp=allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].getServerTimestamp();
				}
			}
			preq.open('POST', "http://standardogame.mozdev.org/autoupdates/players/player_points_updatetimes.php", true);
			preq.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			preq.setRequestHeader("Content-length", postdata.length);
			preq.setRequestHeader("Connection", "close");
			preq.overrideMimeType('text/plain');
			freq.open('POST', "http://standardogame.mozdev.org/autoupdates/players/player_fleet_updatetimes.php", true);
			freq.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			freq.setRequestHeader("Content-length", postdata.length);
			freq.setRequestHeader("Connection", "close");
			freq.overrideMimeType('text/plain');
			rreq.open('POST', "http://standardogame.mozdev.org/autoupdates/players/player_research_updatetimes.php", true);
			rreq.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			rreq.setRequestHeader("Content-length", postdata.length);
			rreq.setRequestHeader("Connection", "close");
			rreq.overrideMimeType('text/plain');
			apreq.open('POST', "http://standardogame.mozdev.org/autoupdates/alliances/alliance_points_updatetimes.php", true);
			apreq.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			apreq.setRequestHeader("Content-length", postdata.length);
			apreq.setRequestHeader("Connection", "close");
			apreq.overrideMimeType('text/plain');
			afreq.open('POST', "http://standardogame.mozdev.org/autoupdates/alliances/alliance_fleet_updatetimes.php", true);
			afreq.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			afreq.setRequestHeader("Content-length", postdata.length);
			afreq.setRequestHeader("Connection", "close");
			afreq.overrideMimeType('text/plain');
			arreq.open('POST', "http://standardogame.mozdev.org/autoupdates/alliances/alliance_research_updatetimes.php", true);
			arreq.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			arreq.setRequestHeader("Content-length", postdata.length);
			arreq.setRequestHeader("Connection", "close");
			arreq.overrideMimeType('text/plain');
			preq.send(postdata);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getRanksUpdates",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendPlayerPointRanks=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countrankstosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS ranks_to_send, "
							+"1 AS grouping "
						+"FROM "
							+"( "
								+"SELECT "
									+"1 "
								+"FROM "
									+"players AS p "
								+"JOIN "
									+"stogalaxy_player_rankupdates AS u "
								+"ON "
									+"p.pointsrank>=1 "
									+"AND "
									+"((p.pointsrank-p.pointsrank%100)/100)=u.rankgroup "
									+"AND "
									+"p.pointsupdate>(u.points_update_timestamp+86400000) "
							+") AS a "
						+"GROUP BY "
							+"grouping "
						+"HAVING "
							+"ranks_to_send>10 "
					);
			if(countrankstosend.executeStep())
			{
				var rankstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"p.ogameid, "
								+"p.nickname, "
								+"p.allyid, "
								+"p.x, "
								+"p.y, "
								+"p.z, "
								+"p.pointsrank, "
								+"p.points, "
								+"p.pointsvariation, "
								+"p.pointsupdate "
							+"FROM "
								+"players AS p "
							+"JOIN "
								+"stogalaxy_player_rankupdates AS u "
							+"ON "
								+"p.pointsrank>=1 "
								+"AND "
								+"((p.pointsrank-p.pointsrank%100)/100)=u.rankgroup "
								+"AND "
								+"p.pointsupdate>(u.points_update_timestamp+86400000) "
								+"AND "
								+"u.rankgroup IN ( "
									+"SELECT "
										+"u.rankgroup "
									+"FROM "
										+"players AS p "
									+"JOIN "
										+"stogalaxy_player_rankupdates AS u "
									+"ON "
										+"p.pointsrank>=1 "
										+"AND "
										+"((p.pointsrank-p.pointsrank%100)/100)=u.rankgroup "
										+"AND "
										+"p.pointsupdate>(u.points_update_timestamp+86400000) "
									+"GROUP BY "
										+"u.rankgroup "
									+"LIMIT "
										+"0,5 "
								+") "
						);
				var updatesentranks=this
					.AccountDB
					.createStatement
						(
							"UPDATE "
								+"stogalaxy_player_rankupdates "
							+"SET "
								+"points_update_timestamp="+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+" "
							+"WHERE "
								+"rankgroup "
									+"IN"
										+"( "
											+"SELECT "
												+"u.rankgroup "
											+"FROM "
												+"players AS p "
											+"JOIN "
												+"stogalaxy_player_rankupdates AS u "
											+"ON "
												+"p.pointsrank>=1 "
												+"AND "
												+"((p.pointsrank-p.pointsrank%100)/100)=u.rankgroup "
												+"AND "
												+"p.pointsupdate>(u.points_update_timestamp+86400000) "
											+"GROUP BY "
												+"u.rankgroup "
											+"LIMIT "
												+"0,5 "
										+") "
						);
				var language=this.language;
				var universe=this.universe;
				var ogameid=this.ogameid;
				var req=new XMLHttpRequest();
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var i=0;
				while(rankstosend.executeStep())
				{
					if
					(
						(
							rankstosend.getInt32(3)==0
							|| rankstosend.getInt32(4)==0
							|| rankstosend.getInt32(5)==0
						)
						&& rankstosend.getInt32(0)==this.ogameid
					)
					{
						var gethomeplanet=this.AccountDB.createStatement
						(
							"SELECT "
								+"x, "
								+"y, "
								+"z "
							+"FROM "
								+"planets "
							+"ORDER BY "
								+"cp ASC "
							+"LIMIT "
								+"0,1 "
						);
						if(gethomeplanet.executeStep())
						{
							var x=gethomeplanet.getInt32(0);
							var y=gethomeplanet.getInt32(1);
							var z=gethomeplanet.getInt32(2);
						}
						else
						{
							var x=0;
							var y=0;
							var z=0;
						}
					}
					else
					{
						var x=rankstosend.getInt32(3);
						var y=rankstosend.getInt32(4);
						var z=rankstosend.getInt32(5);
					}
					postdata+="&o"+i+"="+rankstosend.getInt32			(0);	//ogameid
					postdata+="&n"+i+"="+rankstosend.getUTF8String		(1);	//nickname
					postdata+="&t"+i+"="+rankstosend.getInt64			(2);	//allyid
					postdata+="&x"+i+"="+x;										//x
					postdata+="&y"+i+"="+y;										//y
					postdata+="&z"+i+"="+z;										//z
					postdata+="&r"+i+"="+rankstosend.getInt32			(6);	//pointsrank
					postdata+="&p"+i+"="+rankstosend.getInt64			(7);	//points
					postdata+="&v"+i+"="+rankstosend.getInt32			(8);	//pointsvariation
					postdata+="&u"+i+"="+rankstosend.getInt64			(9);	//pointsupdate
					i++;
				}
				var totalplayers=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].ranks.getTotalPlayers();
				if(totalplayers)
				{
					postdata+="&tp="+totalplayers;
				}
				//alert(i+"\n"+postdata);
				//MAYBE WE SHOULD USE THE SAME METOD USED FOR THE OTHER POLLERS... CHECKING IF RESPONSE==1
				//updatesentranks.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatesentranks);
				req.mozBackgroundRequest=true;
				req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								if(parseInt(req.responseText)==1)
								{
									//
									(req.responseText);
									//OK, DATA RECEIVED...
								}
							}
							else
							{
								//alert("errore:"+req.responseText)
								//ERRORE 404, PHP, SQL, ECC...
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerPointRanks.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onprogress=function(e)
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("position: "+e.position+"\nototalSize: "+e.totalSize)
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerPointRanks.req.onprogress",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onreadystatechange=function()
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("readyState: "+req.readyState+"\nstatus: "+req.status);
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerPointRanks.req.onreadystatechange",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onerror=function()
					{
						try
						{
							//alert("error!!!")
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerPointRanks.req.onerror",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/ranks_players/saveplayerpointranks.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendPlayerPointRanks",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendPlayerFleetRanks=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countrankstosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS ranks_to_send, "
							+"1 AS grouping "
						+"FROM "
							+"( "
								+"SELECT "
									+"1 "
								+"FROM "
									+"players AS p "
								+"JOIN "
									+"stogalaxy_player_rankupdates AS u "
								+"ON "
									+"p.fleetrank>=1 "
									+"AND "
									+"((p.fleetrank-p.fleetrank%100)/100)=u.rankgroup "
									+"AND "
									+"p.fleetupdate>(u.fleet_update_timestamp+86400000) "
							+") AS a "
						+"GROUP BY "
							+"grouping "
						+"HAVING "
							+"ranks_to_send>10 "
					);
			if(countrankstosend.executeStep())
			{
				var rankstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"p.ogameid, "
								+"p.nickname, "
								+"p.allyid, "
								+"p.x, "
								+"p.y, "
								+"p.z, "
								+"p.fleetrank, "
								+"p.fleet, "
								+"p.fleetvariation, "
								+"p.fleetupdate "
							+"FROM "
								+"players AS p "
							+"JOIN "
								+"stogalaxy_player_rankupdates AS u "
							+"ON "
								+"p.fleetrank>=1 "
								+"AND "
								+"((p.fleetrank-p.fleetrank%100)/100)=u.rankgroup "
								+"AND "
								+"p.fleetupdate>(u.fleet_update_timestamp+86400000) "
								+"AND "
								+"u.rankgroup IN ( "
									+"SELECT "
										+"u.rankgroup "
									+"FROM "
										+"players AS p "
									+"JOIN "
										+"stogalaxy_player_rankupdates AS u "
									+"ON "
										+"p.fleetrank>=1 "
										+"AND "
										+"((p.fleetrank-p.fleetrank%100)/100)=u.rankgroup "
										+"AND "
										+"p.fleetupdate>(u.fleet_update_timestamp+86400000) "
									+"GROUP BY "
										+"u.rankgroup "
									+"LIMIT "
										+"0,5 "
								+") "
						);
				var updatesentranks=this
					.AccountDB
					.createStatement
						(
							"UPDATE "
								+"stogalaxy_player_rankupdates "
							+"SET "
								+"fleet_update_timestamp="+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+" "
							+"WHERE "
								+"rankgroup "
									+"IN"
										+"( "
											+"SELECT "
												+"u.rankgroup "
											+"FROM "
												+"players AS p "
											+"JOIN "
												+"stogalaxy_player_rankupdates AS u "
											+"ON "
												+"p.fleetrank>=1 "
												+"AND "
												+"((p.fleetrank-p.fleetrank%100)/100)=u.rankgroup "
												+"AND "
												+"p.fleetupdate>(u.fleet_update_timestamp+86400000) "
											+"GROUP BY "
												+"u.rankgroup "
											+"LIMIT "
												+"0,5 "
										+") "
						);
				var language=this.language;
				var universe=this.universe;
				var ogameid=this.ogameid;
				var req=new XMLHttpRequest();
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var i=0;
				while(rankstosend.executeStep())
				{
					if
					(
						(
							rankstosend.getInt32(3)==0
							|| rankstosend.getInt32(4)==0
							|| rankstosend.getInt32(5)==0
						)
						&& rankstosend.getInt32(0)==this.ogameid
					)
					{
						var gethomeplanet=this.AccountDB.createStatement
						(
							"SELECT "
								+"x, "
								+"y, "
								+"z "
							+"FROM "
								+"planets "
							+"ORDER BY "
								+"cp ASC "
							+"LIMIT "
								+"0,1 "
						);
						if(gethomeplanet.executeStep())
						{
							var x=gethomeplanet.getInt32(0);
							var y=gethomeplanet.getInt32(1);
							var z=gethomeplanet.getInt32(2);
						}
						else
						{
							var x=0;
							var y=0;
							var z=0;
						}
					}
					else
					{
						var x=rankstosend.getInt32(3);
						var y=rankstosend.getInt32(4);
						var z=rankstosend.getInt32(5);
					}
					postdata+="&o"+i+"="+rankstosend.getInt32			(0);	//ogameid
					postdata+="&n"+i+"="+rankstosend.getUTF8String		(1);	//nickname
					postdata+="&t"+i+"="+rankstosend.getInt64			(2);	//allyid
					postdata+="&x"+i+"="+x;										//x
					postdata+="&y"+i+"="+y;										//y
					postdata+="&z"+i+"="+z;										//z
					postdata+="&r"+i+"="+rankstosend.getInt32			(6);	//fleetrank
					postdata+="&p"+i+"="+rankstosend.getInt64			(7);	//fleet
					postdata+="&v"+i+"="+rankstosend.getInt32			(8);	//fleetvariation
					postdata+="&u"+i+"="+rankstosend.getInt64			(9);	//fleetupdate
					i++;
				}
				var totalplayers=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].ranks.getTotalPlayers();
				if(totalplayers)
				{
					postdata+="&tp="+totalplayers;
				}
				//updatesentranks.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatesentranks);
				req.mozBackgroundRequest=true;
				req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								if(parseInt(req.responseText)==1)
								{
									//alert(req.responseText);
									//OK, DATA RECEIVED...
								}
							}
							else
							{
								//alert("errore:"+req.responseText)
								//ERRORE 404, PHP, SQL, ECC...
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerFleetRanks.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onprogress=function(e)
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("position: "+e.position+"\nototalSize: "+e.totalSize)
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerFleetRanks.req.onprogress",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onreadystatechange=function()
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("readyState: "+req.readyState+"\nstatus: "+req.status);
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerFleetRanks.req.onreadystatechange",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onerror=function()
					{
						try
						{
							//alert("error!!!")
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerFleetRanks.req.onerror",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/ranks_players/saveplayerfleetranks.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendPlayerFleetRanks",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendPlayerResearchRanks=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countrankstosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS ranks_to_send, "
							+"1 AS grouping "
						+"FROM "
							+"( "
								+"SELECT "
									+"1 "
								+"FROM "
									+"players AS p "
								+"JOIN "
									+"stogalaxy_player_rankupdates AS u "
								+"ON "
									+"p.researchrank>=1 "
									+"AND "
									+"((p.researchrank-p.researchrank%100)/100)=u.rankgroup "
									+"AND "
									+"p.researchupdate>(u.research_update_timestamp+86400000) "
							+") AS a "
						+"GROUP BY "
							+"grouping "
						+"HAVING "
							+"ranks_to_send>10 "
					);
			if(countrankstosend.executeStep())
			{
				var rankstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"p.ogameid, "
								+"p.nickname, "
								+"p.allyid, "
								+"p.x, "
								+"p.y, "
								+"p.z, "
								+"p.researchrank, "
								+"p.research, "
								+"p.researchvariation, "
								+"p.researchupdate "
							+"FROM "
								+"players AS p "
							+"JOIN "
								+"stogalaxy_player_rankupdates AS u "
							+"ON "
								+"p.researchrank>=1 "
								+"AND "
								+"((p.researchrank-p.researchrank%100)/100)=u.rankgroup "
								+"AND "
								+"p.researchupdate>(u.research_update_timestamp+86400000) "
								+"AND "
								+"u.rankgroup IN ( "
									+"SELECT "
										+"u.rankgroup "
									+"FROM "
										+"players AS p "
									+"JOIN "
										+"stogalaxy_player_rankupdates AS u "
									+"ON "
										+"p.researchrank>=1 "
										+"AND "
										+"((p.researchrank-p.researchrank%100)/100)=u.rankgroup "
										+"AND "
										+"p.researchupdate>(u.research_update_timestamp+86400000) "
									+"GROUP BY "
										+"u.rankgroup "
									+"LIMIT "
										+"0,5 "
								+") "
						);
				var updatesentranks=this
					.AccountDB
					.createStatement
						(
							"UPDATE "
								+"stogalaxy_player_rankupdates "
							+"SET "
								+"research_update_timestamp="+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+" "
							+"WHERE "
								+"rankgroup "
									+"IN"
										+"( "
											+"SELECT "
												+"u.rankgroup "
											+"FROM "
												+"players AS p "
											+"JOIN "
												+"stogalaxy_player_rankupdates AS u "
											+"ON "
												+"p.researchrank>=1 "
												+"AND "
												+"((p.researchrank-p.researchrank%100)/100)=u.rankgroup "
												+"AND "
												+"p.researchupdate>(u.research_update_timestamp+86400000) "
											+"GROUP BY "
												+"u.rankgroup "
											+"LIMIT "
												+"0,5 "
										+") "
						);
				var language=this.language;
				var universe=this.universe;
				var ogameid=this.ogameid;
				var req=new XMLHttpRequest();
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var i=0;
				while(rankstosend.executeStep())
				{
					if
					(
						(
							rankstosend.getInt32(3)==0
							|| rankstosend.getInt32(4)==0
							|| rankstosend.getInt32(5)==0
						)
						&& rankstosend.getInt32(0)==this.ogameid
					)
					{
						var gethomeplanet=this.AccountDB.createStatement
						(
							"SELECT "
								+"x, "
								+"y, "
								+"z "
							+"FROM "
								+"planets "
							+"ORDER BY "
								+"cp ASC "
							+"LIMIT "
								+"0,1 "
						);
						if(gethomeplanet.executeStep())
						{
							var x=gethomeplanet.getInt32(0);
							var y=gethomeplanet.getInt32(1);
							var z=gethomeplanet.getInt32(2);
						}
						else
						{
							var x=0;
							var y=0;
							var z=0;
						}
					}
					else
					{
						var x=rankstosend.getInt32(3);
						var y=rankstosend.getInt32(4);
						var z=rankstosend.getInt32(5);
					}
					postdata+="&o"+i+"="+rankstosend.getInt32			(0);	//ogameid
					postdata+="&n"+i+"="+rankstosend.getUTF8String		(1);	//nickname
					postdata+="&t"+i+"="+rankstosend.getInt64			(2);	//allyid
					postdata+="&x"+i+"="+x;										//x
					postdata+="&y"+i+"="+y;										//y
					postdata+="&z"+i+"="+z;										//z
					postdata+="&r"+i+"="+rankstosend.getInt32			(6);	//researchrank
					postdata+="&p"+i+"="+rankstosend.getInt32			(7);	//research
					postdata+="&v"+i+"="+rankstosend.getInt32			(8);	//researchvariation
					postdata+="&u"+i+"="+rankstosend.getInt64			(9);	//researchupdate
					i++;
				}
				var totalplayers=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].ranks.getTotalPlayers();
				if(totalplayers)
				{
					postdata+="&tp="+totalplayers;
				}
				//updatesentranks.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatesentranks);
				req.mozBackgroundRequest=true;
				req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								if(parseInt(req.responseText)==1)
								{
									//alert(req.responseText);
									//OK, DATA RECEIVED...
								}
							}
							else
							{
								//alert("errore:"+req.responseText)
								//ERRORE 404, PHP, SQL, ECC...
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerResearchRanks.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onprogress=function(e)
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("position: "+e.position+"\nototalSize: "+e.totalSize)
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerResearchRanks.req.onprogress",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onreadystatechange=function()
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("readyState: "+req.readyState+"\nstatus: "+req.status);
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerResearchRanks.req.onreadystatechange",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onerror=function()
					{
						try
						{
							//alert("error!!!")
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendPlayerResearchRanks.req.onerror",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/ranks_players/saveplayerresearchranks.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendPlayerResearchRanks",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendAlliancePointRanks=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countrankstosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS ranks_to_send, "
							+"1 AS grouping "
						+"FROM "
							+"( "
								+"SELECT "
									+"1 "
								+"FROM "
									+"alliances AS p "
								+"JOIN "
									+"stogalaxy_alliance_rankupdates AS u "
								+"ON "
									+"p.pointsrank>=1 "
									+"AND "
									+"((p.pointsrank-p.pointsrank%100)/100)=u.rankgroup "
									+"AND "
									+"p.pointsupdate>(u.points_update_timestamp+86400000) "
							+") AS a "
						+"GROUP BY "
							+"grouping "
						+"HAVING "
							+"ranks_to_send>10 "
					);
			if(countrankstosend.executeStep())
			{
				var rankstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"p.id, "
								+"p.tag, "
								+"p.members, "
								+"p.pointsrank, "
								+"p.points, "
								+"p.avgpoints, "
								+"p.pointsvariation, "
								+"p.pointsupdate "
							+"FROM "
								+"alliances AS p "
							+"JOIN "
								+"stogalaxy_alliance_rankupdates AS u "
							+"ON "
								+"p.pointsrank>=1 "
								+"AND "
								+"((p.pointsrank-p.pointsrank%100)/100)=u.rankgroup "
								+"AND "
								+"p.pointsupdate>(u.points_update_timestamp+86400000) "
								+"AND "
								+"u.rankgroup IN ( "
									+"SELECT "
										+"u.rankgroup "
									+"FROM "
										+"alliances AS p "
									+"JOIN "
										+"stogalaxy_alliance_rankupdates AS u "
									+"ON "
										+"p.pointsrank>=1 "
										+"AND "
										+"((p.pointsrank-p.pointsrank%100)/100)=u.rankgroup "
										+"AND "
										+"p.pointsupdate>(u.points_update_timestamp+86400000) "
									+"GROUP BY "
										+"u.rankgroup "
									+"LIMIT "
										+"0,5 "
								+") "
						);
				var updatesentranks=this
					.AccountDB
					.createStatement
						(
							"UPDATE "
								+"stogalaxy_alliance_rankupdates "
							+"SET "
								+"points_update_timestamp="+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+" "
							+"WHERE "
								+"rankgroup "
									+"IN"
										+"( "
											+"SELECT "
												+"u.rankgroup "
											+"FROM "
												+"alliances AS p "
											+"JOIN "
												+"stogalaxy_alliance_rankupdates AS u "
											+"ON "
												+"p.pointsrank>=1 "
												+"AND "
												+"((p.pointsrank-p.pointsrank%100)/100)=u.rankgroup "
												+"AND "
												+"p.pointsupdate>(u.points_update_timestamp+86400000) "
											+"GROUP BY "
												+"u.rankgroup "
											+"LIMIT "
												+"0,5 "
										+") "
						);
				var language=this.language;
				var universe=this.universe;
				var ogameid=this.ogameid;
				var req=new XMLHttpRequest();
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var i=0;
				while(rankstosend.executeStep())
				{
					if(rankstosend.getInt64(0)!=0)
					{
						postdata+="&i"+i+"="+rankstosend.getInt64			(0);	//id
						postdata+="&t"+i+"="+rankstosend.getUTF8String		(1);	//tag
						postdata+="&m"+i+"="+rankstosend.getInt32			(2);	//members
						postdata+="&r"+i+"="+rankstosend.getInt32			(3);	//pointsrank
						postdata+="&p"+i+"="+rankstosend.getInt64			(4);	//points
						postdata+="&a"+i+"="+rankstosend.getInt64			(5);	//avgpoints
						postdata+="&v"+i+"="+rankstosend.getInt32			(6);	//pointsvariation
						postdata+="&u"+i+"="+rankstosend.getInt64			(7);	//pointsupdate
						i++;
					}
				}
				//updatesentranks.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatesentranks);
				req.mozBackgroundRequest=true;
				req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								//alert(req.responseText)
								if(parseInt(req.responseText)==1)
								{
									//alert(req.responseText);
									//OK, DATA RECEIVED...
								}
							}
							else
							{
								//alert("errore:"+req.responseText)
								//ERRORE 404, PHP, SQL, ECC...
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAlliancePointRanks.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onprogress=function(e)
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("position: "+e.position+"\nototalSize: "+e.totalSize)
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAlliancePointRanks.req.onprogress",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onreadystatechange=function()
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("readyState: "+req.readyState+"\nstatus: "+req.status);
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAlliancePointRanks.req.onreadystatechange",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onerror=function()
					{
						try
						{
							//alert("error!!!")
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAlliancePointRanks.req.onerror",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/ranks_alliances/savealliancepointranks.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendAlliancePointRanks",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendAllianceFleetRanks=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countrankstosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS ranks_to_send, "
							+"1 AS grouping "
						+"FROM "
							+"( "
								+"SELECT "
									+"1 "
								+"FROM "
									+"alliances AS p "
								+"JOIN "
									+"stogalaxy_alliance_rankupdates AS u "
								+"ON "
									+"p.fleetrank>=1 "
									+"AND "
									+"((p.fleetrank-p.fleetrank%100)/100)=u.rankgroup "
									+"AND "
									+"p.fleetupdate>(u.fleet_update_timestamp+86400000) "
							+") AS a "
						+"GROUP BY "
							+"grouping "
						+"HAVING "
							+"ranks_to_send>10 "
					);
			if(countrankstosend.executeStep())
			{
				var rankstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"p.id, "
								+"p.tag, "
								+"p.members, "
								+"p.fleetrank, "
								+"p.fleet, "
								+"p.avgfleet, "
								+"p.fleetvariation, "
								+"p.fleetupdate "
							+"FROM "
								+"alliances AS p "
							+"JOIN "
								+"stogalaxy_alliance_rankupdates AS u "
							+"ON "
								+"p.fleetrank>=1 "
								+"AND "
								+"((p.fleetrank-p.fleetrank%100)/100)=u.rankgroup "
								+"AND "
								+"p.fleetupdate>(u.fleet_update_timestamp+86400000) "
								+"AND "
								+"u.rankgroup IN ( "
									+"SELECT "
										+"u.rankgroup "
									+"FROM "
										+"alliances AS p "
									+"JOIN "
										+"stogalaxy_alliance_rankupdates AS u "
									+"ON "
										+"p.fleetrank>=1 "
										+"AND "
										+"((p.fleetrank-p.fleetrank%100)/100)=u.rankgroup "
										+"AND "
										+"p.fleetupdate>(u.fleet_update_timestamp+86400000) "
									+"GROUP BY "
										+"u.rankgroup "
									+"LIMIT "
										+"0,5 "
								+") "
						);
				var updatesentranks=this
					.AccountDB
					.createStatement
						(
							"UPDATE "
								+"stogalaxy_alliance_rankupdates "
							+"SET "
								+"fleet_update_timestamp="+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+" "
							+"WHERE "
								+"rankgroup "
									+"IN"
										+"( "
											+"SELECT "
												+"u.rankgroup "
											+"FROM "
												+"alliances AS p "
											+"JOIN "
												+"stogalaxy_alliance_rankupdates AS u "
											+"ON "
												+"p.fleetrank>=1 "
												+"AND "
												+"((p.fleetrank-p.fleetrank%100)/100)=u.rankgroup "
												+"AND "
												+"p.fleetupdate>(u.fleet_update_timestamp+86400000) "
											+"GROUP BY "
												+"u.rankgroup "
											+"LIMIT "
												+"0,5 "
										+") "
						);
				var language=this.language;
				var universe=this.universe;
				var ogameid=this.ogameid;
				var req=new XMLHttpRequest();
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var i=0;
				while(rankstosend.executeStep())
				{
					if(rankstosend.getInt64(0)!=0)
					{
						postdata+="&i"+i+"="+rankstosend.getInt64			(0);	//id
						postdata+="&t"+i+"="+rankstosend.getUTF8String		(1);	//tag
						postdata+="&m"+i+"="+rankstosend.getInt32			(2);	//members
						postdata+="&r"+i+"="+rankstosend.getInt32			(3);	//pointsrank
						postdata+="&p"+i+"="+rankstosend.getInt64			(4);	//points
						postdata+="&a"+i+"="+rankstosend.getInt64			(5);	//avgpoints
						postdata+="&v"+i+"="+rankstosend.getInt32			(6);	//pointsvariation
						postdata+="&u"+i+"="+rankstosend.getInt64			(7);	//pointsupdate
						i++;
					}
				}
				//updatesentranks.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatesentranks);
				req.mozBackgroundRequest=true;
				req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								//alert(req.responseText)
								if(parseInt(req.responseText)==1)
								{
									//alert(req.responseText);
									//OK, DATA RECEIVED...
								}
							}
							else
							{
								//alert("errore:"+req.responseText)
								//ERRORE 404, PHP, SQL, ECC...
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAllianceFleetRanks.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onprogress=function(e)
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("position: "+e.position+"\nototalSize: "+e.totalSize)
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAllianceFleetRanks.req.onprogress",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onreadystatechange=function()
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("readyState: "+req.readyState+"\nstatus: "+req.status);
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAllianceFleetRanks.req.onreadystatechange",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onerror=function()
					{
						try
						{
							//alert("error!!!")
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAllianceFleetRanks.req.onerror",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/ranks_alliances/savealliancefleetranks.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendAllianceFleetRanks",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendAllianceResearchRanks=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countrankstosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS ranks_to_send, "
							+"1 AS grouping "
						+"FROM "
							+"( "
								+"SELECT "
									+"1 "
								+"FROM "
									+"alliances AS p "
								+"JOIN "
									+"stogalaxy_alliance_rankupdates AS u "
								+"ON "
									+"p.researchrank>=1 "
									+"AND "
									+"((p.researchrank-p.researchrank%100)/100)=u.rankgroup "
									+"AND "
									+"p.researchupdate>(u.research_update_timestamp+86400000) "
							+") AS a "
						+"GROUP BY "
							+"grouping "
						+"HAVING "
							+"ranks_to_send>10 "
					);
			if(countrankstosend.executeStep())
			{
				var rankstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"p.id, "
								+"p.tag, "
								+"p.members, "
								+"p.researchrank, "
								+"p.research, "
								+"p.avgresearch, "
								+"p.researchvariation, "
								+"p.researchupdate "
							+"FROM "
								+"alliances AS p "
							+"JOIN "
								+"stogalaxy_alliance_rankupdates AS u "
							+"ON "
								+"p.researchrank>=1 "
								+"AND "
								+"((p.researchrank-p.researchrank%100)/100)=u.rankgroup "
								+"AND "
								+"p.researchupdate>(u.research_update_timestamp+86400000) "
								+"AND "
								+"u.rankgroup IN ( "
									+"SELECT "
										+"u.rankgroup "
									+"FROM "
										+"alliances AS p "
									+"JOIN "
										+"stogalaxy_alliance_rankupdates AS u "
									+"ON "
										+"p.researchrank>=1 "
										+"AND "
										+"((p.researchrank-p.researchrank%100)/100)=u.rankgroup "
										+"AND "
										+"p.researchupdate>(u.research_update_timestamp+86400000) "
									+"GROUP BY "
										+"u.rankgroup "
									+"LIMIT "
										+"0,5 "
								+") "
						);
				var updatesentranks=this
					.AccountDB
					.createStatement
						(
							"UPDATE "
								+"stogalaxy_alliance_rankupdates "
							+"SET "
								+"research_update_timestamp="+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+" "
							+"WHERE "
								+"rankgroup "
									+"IN"
										+"( "
											+"SELECT "
												+"u.rankgroup "
											+"FROM "
												+"alliances AS p "
											+"JOIN "
												+"stogalaxy_alliance_rankupdates AS u "
											+"ON "
												+"p.researchrank>=1 "
												+"AND "
												+"((p.researchrank-p.researchrank%100)/100)=u.rankgroup "
												+"AND "
												+"p.researchupdate>(u.research_update_timestamp+86400000) "
											+"GROUP BY "
												+"u.rankgroup "
											+"LIMIT "
												+"0,5 "
										+") "
						);
				var language=this.language;
				var universe=this.universe;
				var ogameid=this.ogameid;
				var req=new XMLHttpRequest();
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var i=0;
				while(rankstosend.executeStep())
				{
					if(rankstosend.getInt64(0)!=0)
					{
						postdata+="&i"+i+"="+rankstosend.getInt64			(0);	//id
						postdata+="&t"+i+"="+rankstosend.getUTF8String		(1);	//tag
						postdata+="&m"+i+"="+rankstosend.getInt32			(2);	//members
						postdata+="&r"+i+"="+rankstosend.getInt32			(3);	//pointsrank
						postdata+="&p"+i+"="+rankstosend.getInt64			(4);	//points
						postdata+="&a"+i+"="+rankstosend.getInt64			(5);	//avgpoints
						postdata+="&v"+i+"="+rankstosend.getInt32			(6);	//pointsvariation
						postdata+="&u"+i+"="+rankstosend.getInt64			(7);	//pointsupdate
						i++;
					}
				}
				//updatesentranks.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatesentranks);
				req.mozBackgroundRequest=true;
				req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								//alert(req.responseText)
								if(parseInt(req.responseText)==1)
								{
									//alert(req.responseText);
									//OK, DATA RECEIVED...
								}
							}
							else
							{
								//alert("errore:"+req.responseText)
								//ERRORE 404, PHP, SQL, ECC...
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAllianceResearchRanks.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onprogress=function(e)
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("position: "+e.position+"\nototalSize: "+e.totalSize)
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAllianceResearchRanks.req.onprogress",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onreadystatechange=function()
					{
						try
						{
							//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
							//alert("readyState: "+req.readyState+"\nstatus: "+req.status);
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAllianceResearchRanks.req.onreadystatechange",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.onerror=function()
					{
						try
						{
							//alert("error!!!")
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendAllianceResearchRanks.req.onerror",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/ranks_alliances/saveallianceresearchranks.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendAllianceResearchRanks",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

/*********************************************************************
					GALAXY MANAGEMENT
*********************************************************************/

StOGalaxy.prototype.getGalaxiesUpdates=function()
{
	try
	{
		if(
			(this.galaxy_updatetimestamp)<(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()-43200000)
			&& this.checkStatus()
		)
		{
			var stogalaxy=this;
			var x=0;
			var fetchgalaxy=function(responsetext)
			{
				try
				{
					if(responsetext.length>3)
					{
						responsetext=responsetext.split("\n");
						for(var i=0;i<responsetext.length;i++)
						{
							if(responsetext[i].length>3)
							{
								var setgalaxyupdaterow=allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].stogalaxy.AccountDB
									.createStatement
									(
										"INSERT INTO "
											+"stogalaxy_galaxy_systemupdates "
												+"( "
													+"x, "
													+"y, "
													+"update_timestamp "
												+") "
												+"VALUES "
												+"( "
													+"?1, "
													+"?2, "
													+"?3 "
												+") "
									);
								var y=ST_parseInt(responsetext[i]);
								var timestamp=ST_parseInt(responsetext[i].substring(responsetext[i].indexOf(":")+1,responsetext[i].length))*1000;
								setgalaxyupdaterow.bindInt32Parameter(0,x);
								setgalaxyupdaterow.bindInt32Parameter(1,y);
								setgalaxyupdaterow.bindInt64Parameter(2,timestamp);
								//setgalaxyupdaterow.execute();
								allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].storagemanager.push(setgalaxyupdaterow);
							}
						}
					}
					x++;
					if(x<10)
					{
						var postdata="l="+stogalaxy.language+"&u="+stogalaxy.universe+"&x="+x;
						var req=new XMLHttpRequest();
						req.mozBackgroundRequest=true;
						req.onload=function()
						{
							if
							(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								fetchgalaxy(req.responseText);
							}
						}
						req.open('POST', "http://standardogame.mozdev.org/autoupdates/systems/getgalaxyupdatetimes.php", true);
						req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
						req.setRequestHeader("Content-length", postdata.length);
						req.setRequestHeader("Connection", "close");
						req.overrideMimeType('text/plain');
						req.send(postdata);
					}
					else
					{
						var setstogalaxylastsyncronizationupdates=stogalaxy.AccountDB
							.createStatement
							(
								"UPDATE "
									+"stogalaxy_accountdata "
								+"SET "
									+"galaxy_updatetimestamp = ?1 "
								+"WHERE "
									+"id = 1 "
							);
						var timestamp=allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].getServerTimestamp();
						setstogalaxylastsyncronizationupdates.bindInt64Parameter(0,timestamp);
						//setstogalaxylastsyncronizationupdates.execute();
						allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].storagemanager.push(setstogalaxylastsyncronizationupdates);
						allaccounts.accounts[allaccounts.accountindex[stogalaxy.language][stogalaxy.universe][stogalaxy.ogameid]].stogalaxy.galaxy_updatetimestamp=timestamp;
					}
				}
				catch(e)
				{
					st_errors.adderror
					(
						e,
						"getGalaxiesUpdates(in fetchgalaxy())",
						"see_how_to_retrieve_html",
						"no_interesting_vars"
					)
				}
			}
			fetchgalaxy("");
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getGalaxiesUpdates",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendGalaxies=function()
{
	try
	{
		if(this.checkStatus())
		{
			//FOLLOWING ROWS USED FOR TESTS
			//alert("packing galaxy data...");
			/*for(var y=1;y<500;y++)
			{
				var updatesentsystems=this
					.AccountDB
					.createStatement
						(
							"INSERT OR REPLACE INTO "
								+"stogalaxy_galaxy_systemupdates "
									+"VALUES "
									+"( "
										+"1, "
										+y+", "
										+"0"
									+") "
						);
				updatesentsystems.execute();
			}*/
			//NO MORE TESTS
			var countsystemstosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS systems_to_send, "
							+"1 AS grouping "
						+"FROM "
							+"( "
								+"SELECT "
									+"1 "
								+"FROM "
									+"stogalaxy_galaxy_systemupdates AS upd "
								+"JOIN "
									+"galaxy AS gal "
								+"ON "
									+"upd.x=gal.x "
									+"AND "
									+"upd.y=gal.y "
									+"AND "
									+"gal.updated>(upd.update_timestamp+86400000) "
								+"WHERE "
									+"gal.x>0 "
									+"AND "
									+"gal.x<10 "
									+"AND "
									+"gal.y>0 "
									+"AND "
									+"gal.y<500 "
									+"AND "
									+"gal.z>0 "
									+"AND "
									+"gal.z<16 "
								+"GROUP BY "
									+"upd.x, "
									+"upd.y "
							+") AS a "
						+"GROUP BY "
							+"grouping "
						+"HAVING "
							+"systems_to_send>4 "
					);
			if(countsystemstosend.executeStep())
			{
				//SELECTING DATA TO SEND...
				var systemstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"gal.x AS x, "
								+"gal.y AS y, "
								+"gal.z AS z, "
								+"gal.ogameid AS ogameid, "
								+"gal.planetname AS planetname, "
								+"gal.planetgroup AS planetgroup, "
								+"gal.planettype AS planettype, "
								+"gal.moonname AS moonname, "
								+"gal.moondiameter AS moondiameter, "
								+"gal.moontemperature AS moontemperature, "
								+"gal.debrismet AS debrismet, "
								+"gal.debriscry AS debriscry, "
								+"gal.updated AS updated, "
								+"pl.nickname AS nickname, "
								+"pl.allyid AS allyid, "
								+"pl.pointsrank AS pointsrank, "
								+"pl.vacation AS vacation, "
								+"pl.inactive AS inactive, "
								+"pl.banned AS banned, "
								//+"pl.protection AS protection, " //NOT USED - CALCULATED
								+"pl.statusupdate AS statusupdate "
							+"FROM "
								+"stogalaxy_galaxy_systemupdates AS upd "
							+"JOIN "
								+"galaxy AS gal "
							+"ON "
								+"upd.x=gal.x "
								+"AND "
								+"upd.y=gal.y "
								+"AND "
								+"gal.updated>(upd.update_timestamp+86400000) "
							+"LEFT JOIN "
								+"players AS pl "
							+"ON "
								+"gal.ogameid=pl.ogameid "
							+"WHERE "
								+"gal.x>0 "
								+"AND "
								+"gal.x<10 "
								+"AND "
								+"gal.y>0 "
								+"AND "
								+"gal.y<500 "
								+"AND "
								+"gal.z>0 "
								+"AND "
								+"gal.z<16 "
							+"LIMIT "
								+"0, 180"
						);
				//UPDATING INFORMATION
				var updatesentsystems=this
					.AccountDB
					.createStatement
						(
							"INSERT INTO "
								+"stogalaxy_galaxy_systemupdates "
									+"( "
										+"x, "
										+"y, "
										+"update_timestamp "
									+") "
									+"SELECT "
										+"newupd.x, "
										+"newupd.y, "
										+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+" "
									+"FROM "
										+"( "
											+"SELECT "
												+"upd.x AS x, "
												+"upd.y AS y "
											+"FROM "
												+"stogalaxy_galaxy_systemupdates AS upd "
											+"JOIN "
												+"galaxy AS gal "
											+"ON "
												+"upd.x=gal.x "
												+"AND "
												+"upd.y=gal.y "
												+"AND "
												+"gal.updated>(upd.update_timestamp+86400000) "
											+"WHERE "
												+"gal.x>0 "
												+"AND "
												+"gal.x<10 "
												+"AND "
												+"gal.y>0 "
												+"AND "
												+"gal.y<500 "
												+"AND "
												+"gal.z>0 "
												+"AND "
												+"gal.z<16 "
											+"LIMIT "
												+"0, 180"
										+") AS newupd "
									+"GROUP BY "
										+"newupd.x, "
										+"newupd.y "
						);
				var language=this.language;
				var universe=this.universe;
				var ogameid=this.ogameid;
				var req=new XMLHttpRequest();
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var i=0;
				while(systemstosend.executeStep())
				{
					//alert(systemstosend.getInt32(0))
					postdata+="&x"+i+"="+systemstosend.getInt32			(0);	//x
					postdata+="&y"+i+"="+systemstosend.getInt32			(1);	//y
					postdata+="&z"+i+"="+systemstosend.getInt32			(2);	//z
					postdata+="&o"+i+"="+systemstosend.getInt32			(3);	//ogameid
					postdata+="&p"+i+"="+systemstosend.getUTF8String	(4);	//planetname
					postdata+="&g"+i+"="+systemstosend.getInt32			(5);	//planetgroup
					postdata+="&t"+i+"="+systemstosend.getInt32			(6);	//planettype
					postdata+="&mn"+i+"="+systemstosend.getUTF8String	(7);	//moonname
					postdata+="&d"+i+"="+systemstosend.getInt32			(8);	//moondiameter
					postdata+="&mt"+i+"="+systemstosend.getInt32		(9);	//moontemperature
					postdata+="&m"+i+"="+systemstosend.getInt64			(10);	//debrismet
					postdata+="&c"+i+"="+systemstosend.getInt64			(11);	//debriscry
					postdata+="&u"+i+"="+systemstosend.getInt64			(12);	//updated
					postdata+="&n"+i+"="+systemstosend.getUTF8String	(13);	//nickname
					postdata+="&pt"+i+"="+systemstosend.getInt64		(14);	//allyid
					postdata+="&r"+i+"="+systemstosend.getInt32			(15);	//pointsrank
					postdata+="&v"+i+"="+systemstosend.getInt32			(16);	//vacation
					postdata+="&i"+i+"="+systemstosend.getInt32			(17);	//inactive
					postdata+="&b"+i+"="+systemstosend.getInt32			(18);	//banned
					postdata+="&su"+i+"="+systemstosend.getInt64		(19);	//statusupdate
					i++;
				}
				//updatesentsystems.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatesentsystems);
				//alert(postdata.length/1024+"Kb for "+i+" planets:\n"+postdata);
				req.mozBackgroundRequest=true;
				req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								//alert(req.responseText)
								if(parseInt(req.responseText)==1)
								{
									//OK, DATA RECEIVED...
								}
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendGalaxies.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/galaxy/saveplanets.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendGalaxies",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

/*********************************************************************
					MESSAGES MANAGEMENT
*********************************************************************/

StOGalaxy.prototype.sendCombatReports=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countcombatreportstosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS reports_count "
						+"FROM "
							+"combat_reports "
						+"WHERE "
							+"submitted=0 "
						+"GROUP BY "
							+"submitted "
						+"HAVING "
							+"reports_count>2 "
					);
			if(countcombatreportstosend.executeStep())
			{
				var combatreportstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"messageid,"
								+"timestamp,"
								+"x,"
								+"y,"
								+"z,"
								+"attackerlosses,"
								+"defenderlosses,"
								+"attackerunits,"
								+"defenderunits,"
								+"attackerlossesnumber,"
								+"defenderlossesnumber,"
								+"met,"
								+"cry,"
								+"deu,"
								+"debrismet,"
								+"debriscry,"
								+"victory,"
								+"rebuilt_401,"
								+"rebuilt_402,"
								+"rebuilt_403,"
								+"rebuilt_404,"
								+"rebuilt_405,"
								+"rebuilt_406,"
								+"rebuilt_407,"
								+"rebuilt_408,"
								+"submitted "
							+"FROM "
								+"combat_reports "
							+"WHERE "
								+"submitted=0 "
							+"ORDER BY "
								+"messageid ASC "
							+"LIMIT "
								+"0,30 "
						);
				var i=0;
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var sentmessagesids=new Array();
				var playerids=new Array();
				while(combatreportstosend.executeStep())
				{
					playerids[combatreportstosend.getInt64(0)]=i;
					sentmessagesids.push(combatreportstosend.getInt64(0));
					postdata+="&mid"+i+"="+combatreportstosend.getInt64(0)	//messageid
					+"&t"+i+"="+combatreportstosend.getInt64(1)				//timestamp
					+"&x"+i+"="+combatreportstosend.getInt32(2)				//timestamp
					+"&y"+i+"="+combatreportstosend.getInt32(3)				//timestamp
					+"&z"+i+"="+combatreportstosend.getInt32(4)				//timestamp
					+"&al"+i+"="+combatreportstosend.getInt64(5)			//attackerlosses
					+"&dl"+i+"="+combatreportstosend.getInt64(6)			//defenderlosses
					+"&au"+i+"="+combatreportstosend.getInt64(7)			//attackerunits
					+"&du"+i+"="+combatreportstosend.getInt64(8)			//defenderunits
					+"&aln"+i+"="+combatreportstosend.getInt64(9)			//attackerlossesnumber
					+"&dln"+i+"="+combatreportstosend.getInt64(10)			//defenderlossesnumber
					+"&m"+i+"="+combatreportstosend.getInt64(11)			//met
					+"&c"+i+"="+combatreportstosend.getInt64(12)			//cry
					+"&d"+i+"="+combatreportstosend.getInt64(13)			//deu
					+"&dm"+i+"="+combatreportstosend.getInt64(14)			//debrismet
					+"&dc"+i+"="+combatreportstosend.getInt64(15)			//debriscry
					+"&v"+i+"="+combatreportstosend.getInt32(16)			//victory
					+"&r401_"+i+"="+combatreportstosend.getInt64(17)		//rebuilt_401
					+"&r402_"+i+"="+combatreportstosend.getInt64(18)		//rebuilt_402
					+"&r403_"+i+"="+combatreportstosend.getInt64(19)		//rebuilt_403
					+"&r404_"+i+"="+combatreportstosend.getInt64(20)		//rebuilt_404
					+"&r405_"+i+"="+combatreportstosend.getInt64(21)		//rebuilt_405
					+"&r406_"+i+"="+combatreportstosend.getInt64(22)		//rebuilt_406
					+"&r407_"+i+"="+combatreportstosend.getInt64(23)		//rebuilt_407
					+"&r408_"+i+"="+combatreportstosend.getInt64(24);		//rebuilt_408
					i++;
				}
				var combatpartecipantstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"messageid,"
								+"position,"
								+"id,"
								+"x,"
								+"y,"
								+"z,"
								+"ogameid,"
								+"weapons,"
								+"shields,"
								+"armour "
							+"FROM "
								+"combat_partecipants "
							+"WHERE "
								+"messageid IN("+sentmessagesids.join(",")+") "
							+"ORDER BY "
								+"messageid ASC, "
								+"position ASC, "
								+"id ASC "
						);
				while(combatpartecipantstosend.executeStep())
				{
					postdata+="&plx_"+playerids[combatpartecipantstosend.getInt64(0)]+"_"+combatpartecipantstosend.getInt32(1)+"_"+combatpartecipantstosend.getInt32(2)+"="+combatpartecipantstosend.getInt32(3)	//x
					+"&ply_"+playerids[combatpartecipantstosend.getInt64(0)]+"_"+combatpartecipantstosend.getInt32(1)+"_"+combatpartecipantstosend.getInt32(2)+"="+combatpartecipantstosend.getInt32(4)	//y
					+"&plz_"+playerids[combatpartecipantstosend.getInt64(0)]+"_"+combatpartecipantstosend.getInt32(1)+"_"+combatpartecipantstosend.getInt32(2)+"="+combatpartecipantstosend.getInt32(5)	//z
					+"&plo_"+playerids[combatpartecipantstosend.getInt64(0)]+"_"+combatpartecipantstosend.getInt32(1)+"_"+combatpartecipantstosend.getInt32(2)+"="+combatpartecipantstosend.getInt32(6)	//ogameid
					+"&plw_"+playerids[combatpartecipantstosend.getInt64(0)]+"_"+combatpartecipantstosend.getInt32(1)+"_"+combatpartecipantstosend.getInt32(2)+"="+combatpartecipantstosend.getInt32(7)	//weapons
					+"&pls_"+playerids[combatpartecipantstosend.getInt64(0)]+"_"+combatpartecipantstosend.getInt32(1)+"_"+combatpartecipantstosend.getInt32(2)+"="+combatpartecipantstosend.getInt32(8)	//shields
					+"&pla_"+playerids[combatpartecipantstosend.getInt64(0)]+"_"+combatpartecipantstosend.getInt32(1)+"_"+combatpartecipantstosend.getInt32(2)+"="+combatpartecipantstosend.getInt32(9);	//armour
				}
				var combatroundstosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"messageid,"
								+"partecipant_position,"
								+"partecipant_id,"
								+"round,"
								+"ship_202,"
								+"ship_203,"
								+"ship_204,"
								+"ship_205,"
								+"ship_206,"
								+"ship_207,"
								+"ship_208,"
								+"ship_209,"
								+"ship_210,"
								+"ship_211,"
								+"ship_212,"
								+"ship_213,"
								+"ship_214,"
								+"ship_215,"
								+"defense_401,"
								+"defense_402,"
								+"defense_403,"
								+"defense_404,"
								+"defense_405,"
								+"defense_406,"
								+"defense_407,"
								+"defense_408 "
							+"FROM "
								+"combat_rounds "
							+"WHERE "
								+"messageid IN ("+sentmessagesids.join(",")+")"
							+"ORDER BY "
								+"messageid ASC, "
								+"partecipant_position ASC, "
								+"partecipant_id ASC, "
								+"round ASC "
						);
				while(combatroundstosend.executeStep())
				{
					postdata+="&r_202_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(4)	//ship_202
					+"&r_203_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(5)	//ship_203
					+"&r_204_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(6)	//ship_204
					+"&r_205_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(7)	//ship_205
					+"&r_206_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(8)	//ship_206
					+"&r_207_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(9)	//ship_207
					+"&r_208_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(10)	//ship_208
					+"&r_209_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(11)	//ship_209
					+"&r_210_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(12)	//ship_210
					+"&r_211_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(13)	//ship_211
					+"&r_212_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(14)	//ship_212
					+"&r_213_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(15)	//ship_213
					+"&r_214_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(16)	//ship_214
					+"&r_215_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(17)	//ship_215
					+"&r_401_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(18)	//defense_401
					+"&r_402_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(19)	//defense_402
					+"&r_403_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(20)	//defense_403
					+"&r_404_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(21)	//defense_404
					+"&r_405_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(22)	//defense_405
					+"&r_406_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(23)	//defense_406
					+"&r_407_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(24)	//defense_407
					+"&r_408_"+playerids[combatroundstosend.getInt64(0)]+"_"+combatroundstosend.getInt32(1)+"_"+combatroundstosend.getInt32(2)+"_"+combatroundstosend.getInt32(3)+"="+combatroundstosend.getInt64(25);	//defense_408
				}
				//alert(postdata.length/1024+"Kb\n________________________\n"+postdata)
				//alert(postdata.length/1024+"Kb")
				if(i>0)
				{
					var language=this.language;
					var universe=this.universe;
					var ogameid=this.ogameid;
					var req=new XMLHttpRequest();
					req.mozBackgroundRequest=true;
					req.onload=function()
						{
							try
							{
								//alert(req.responseText)
								if(
									(req.status==200)
									&&(req.readyState==4)
								)
								{
									if(parseInt(req.responseText)==1)
									{
										var updatesent=allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].AccountDB
											.createStatement
											(
												"UPDATE "
													+"combat_reports "
												+"SET "
													+"submitted=1 "
												+"WHERE "
													+"messageid IN ("+sentmessagesids.join(",")+")"
											);
										//updatesent.execute();
										allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(updatesent);
									}
									else
									{
										clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendmessagespoller)
									}
								}
								else
								{
									clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendmessagespoller)
								}
							}
							catch(e)
							{
								st_errors.adderror
								(
									e,
									"sendMessages.req.onload",
									"see_how_to_retrieve_html",
									"no_interesting_vars"
								)
							}
						};
					req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/combat_reports/savecombatreports.php",true);
					req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
					req.setRequestHeader("Content-length", postdata.length);
					req.setRequestHeader("Connection", "close");
					req.overrideMimeType('text/plain');
					req.send(postdata);
				}
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendCombatReports",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendMessages=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countmessagestosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS messages_count "
						+"FROM "
							+"messages "
						+"WHERE "
							+"submitted=0 "
						+"GROUP BY "
							+"submitted "
						+"HAVING "
							+"messages_count>2 "
					);
			if(countmessagestosend.executeStep())
			{
				var messagestosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"messageid, "
								+"timestamp, "
								+"senderogameid, "
								+"title, "
								+"message "
							+"FROM "
								+"messages "
							+"WHERE "
								+"submitted=0 "
							+"LIMIT "
								+"0,50 "
						);
				var i=0;
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var sentmessagesids=new Array();
				while(messagestosend.executeStep())
				{
					sentmessagesids[sentmessagesids.length]=messagestosend.getInt64(0);
					postdata+="&mid"+i+"="+messagestosend.getInt64(0)	//messageid
					+"&t"+i+"="+messagestosend.getInt64(1)				//timestamp
					+"&o"+i+"="+messagestosend.getInt32(2)				//ogameid
					+"&s"+i+"="+escape(messagestosend.getUTF8String(3)).replace('+', '%2B').replace('%20', '+').replace('*', '%2A').replace('/', '%2F').replace('@', '%40')			//subject
					+"&m"+i+"="+escape(messagestosend.getUTF8String(4)).replace('+', '%2B').replace('%20', '+').replace('*', '%2A').replace('/', '%2F').replace('@', '%40')			//message
					i++;
				}
				//alert(postdata)
				if(i>0)
				{
					var language=this.language;
					var universe=this.universe;
					var ogameid=this.ogameid;
					var req=new XMLHttpRequest();
					req.mozBackgroundRequest=true;
					req.onload=function()
						{
							try
							{
								//alert(req.responseText)
								if(
									(req.status==200)
									&&(req.readyState==4)
								)
								{
									if(parseInt(req.responseText)==1)
									{
										for(var j=0;j<i;j++)
										{
											var updatesent=allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].AccountDB
												.createStatement
												(
													"UPDATE "
														+"messages "
													+"SET "
														+"submitted=1 "
													+"WHERE "
														+"messageid= ?1 "
												);
											updatesent.bindInt64Parameter(0,sentmessagesids[j])
											//updatesent.execute();
											allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(updatesent);
										}
									}
									else
									{
										clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendmessagespoller)
									}
								}
								else
								{
									clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendmessagespoller)
								}
							}
							catch(e)
							{
								st_errors.adderror
								(
									e,
									"sendMessages.req.onload",
									"see_how_to_retrieve_html",
									"no_interesting_vars"
								)
							}
						};
					req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/messages_private/savemessages.php",true);
					req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
					req.setRequestHeader("Content-length", postdata.length);
					req.setRequestHeader("Connection", "close");
					req.overrideMimeType('text/plain');
					req.send(postdata);
				}
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendMessages",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendSentMessages=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countmessagestosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS messages_count "
						+"FROM "
							+"sentmessages "
						+"WHERE "
							+"submitted=0 "
						+"GROUP BY "
							+"submitted "
						+"HAVING "
							+"messages_count>2 "
					);
			if(countmessagestosend.executeStep())
			{
				var messagestosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"replytomessageid, "
								+"timestamp, "
								+"targetogameid, "
								+"title, "
								+"message "
							+"FROM "
								+"sentmessages "
							+"WHERE "
								+"submitted=0 "
							+"LIMIT "
								+"0,50 "
						);
				var i=0;
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				var sentmessagestimestamps=new Array();
				while(messagestosend.executeStep())
				{
					sentmessagestimestamps[sentmessagestimestamps.length]=messagestosend.getInt64(1);
					postdata+="&mid"+i+"="+messagestosend.getInt64(0)	//messageid
					+"&t"+i+"="+messagestosend.getInt64(1)				//timestamp
					+"&o"+i+"="+messagestosend.getInt32(2)				//ogameid
					+"&s"+i+"="+escape(messagestosend.getUTF8String(3)).replace('+', '%2B').replace('%20', '+').replace('*', '%2A').replace('/', '%2F').replace('@', '%40')			//subject
					+"&m"+i+"="+escape(messagestosend.getUTF8String(4)).replace('+', '%2B').replace('%20', '+').replace('*', '%2A').replace('/', '%2F').replace('@', '%40')			//message
					i++;
				}
				//alert(postdata)
				if(i>0)
				{
					var language=this.language;
					var universe=this.universe;
					var ogameid=this.ogameid;
					var req=new XMLHttpRequest();
					req.mozBackgroundRequest=true;
					req.onload=function()
						{
							try
							{
								//alert(req.responseText)
								if(
									(req.status==200)
									&&(req.readyState==4)
								)
								{
									if(parseInt(req.responseText)==1)
									{
										for(var j=0;j<i;j++)
										{
											var updatesent=allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].AccountDB
												.createStatement
												(
													"UPDATE "
														+"sentmessages "
													+"SET "
														+"submitted=1 "
													+"WHERE "
														+"timestamp= ?1 "
												);
											updatesent.bindInt64Parameter(0,sentmessagestimestamps[j])
											//updatesent.execute();
											allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(updatesent);
										}
									}
									else
									{
										clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendsentmessagespoller)
									}
								}
								else
								{
									clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendsentmessagespoller)
								}
							}
							catch(e)
							{
								st_errors.adderror
								(
									e,
									"sendSentMessages.req.onload",
									"see_how_to_retrieve_html",
									"no_interesting_vars"
								)
							}
						};
					req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/messages_sent/savemessages.php",true);
					req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
					req.setRequestHeader("Content-length", postdata.length);
					req.setRequestHeader("Connection", "close");
					req.overrideMimeType('text/plain');
					req.send(postdata);
				}
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendSentMessages",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendCircularMails=function()
{
	try
	{
		if(this.checkStatus())
		{
			var countmessagestosend=this
				.AccountDB
				.createStatement
					(
						"SELECT "
							+"COUNT(1) AS messages_count "
						+"FROM "
							+"circularmails "
						+"WHERE "
							+"submitted=0 "
							+"AND "
							+"allyid!=0 "
						+"GROUP BY "
							+"submitted "
						+"HAVING "
							+"messages_count>0 "
					);
			if(countmessagestosend.executeStep())
			{
				var messagestosend=this
					.AccountDB
					.createStatement
						(
							"SELECT "
								+"messageid, "
								+"timestamp, "
								+"allyid, "
								+"message "
							+"FROM "
								+"circularmails "
							+"WHERE "
								+"submitted=0 "
								+"AND "
								+"allyid!=0 "
							+"LIMIT "
								+"0,50 "
						);
				var i=0;
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				sentmessagesids=new Array();
				while(messagestosend.executeStep())
				{
					sentmessagesids[sentmessagesids.length]=messagestosend.getInt64(0);
					postdata+="&t"+i+"="+messagestosend.getInt64(1)				//timestamp
					+"&a"+i+"="+messagestosend.getInt64(2)
					+"&m"+i+"="+escape(messagestosend.getUTF8String(3)).replace('+', '%2B').replace('%20', '+').replace('*', '%2A').replace('/', '%2F').replace('@', '%40')			//message
					i++;
				}
				//alert(postdata)
				if(i>0)
				{
					var language=this.language;
					var universe=this.universe;
					var ogameid=this.ogameid;
					var req=new XMLHttpRequest();
					req.mozBackgroundRequest=true;
					req.onload=function()
						{
							try
							{
								//alert(req.responseText)
								if(
									(req.status==200)
									&&(req.readyState==4)
								)
								{
									if(parseInt(req.responseText)==1)
									{
										for(var j=0;j<i;j++)
										{
											var updatesent=allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].AccountDB
												.createStatement
												(
													"UPDATE "
														+"circularmails "
													+"SET "
														+"submitted=1 "
													+"WHERE "
														+"messageid= ?1 "
												);
											updatesent.bindInt64Parameter(0,sentmessagesids[j])
											//updatesent.execute();
											allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(updatesent);
										}
									}
									else
									{
										clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendcircularmailspoller)
									}
								}
								else
								{
									clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendcircularmailspoller)
								}
							}
							catch(e)
							{
								st_errors.adderror
								(
									e,
									"sendCircularMails.req.onload",
									"see_how_to_retrieve_html",
									"no_interesting_vars"
								)
							}
						};
					req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/messages_alliances/savecircularmails.php",true);
					req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
					req.setRequestHeader("Content-length", postdata.length);
					req.setRequestHeader("Connection", "close");
					req.overrideMimeType('text/plain');
					req.send(postdata);
				}
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendCircularMails",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

/*********************************************************************
					SPY REPORTS MANAGEMENT
*********************************************************************/

StOGalaxy.prototype.sendSpyReports=function()
{
	try
	{
		if(this.checkStatus())
		{
			var getspyreportquery=this.AccountDB
				.createStatement
				(
					"SELECT "
						+"x, "
						+"y, "
						+"z, "
						+"ismoon, "
						+"timestamp, "
						+"met, "
						+"cry, "
						+"deu, "
						+"ene, "
						+"antispionage, "
						+"building_1, "
						+"building_2, "
						+"building_3, "
						+"building_4, "
						+"building_12, "
						+"building_14, "
						+"building_15, "
						+"building_21, "
						+"building_22, "
						+"building_23, "
						+"building_24, "
						+"building_31, "
						+"building_33, "
						+"building_34, "
						+"building_44, "
						+"moonbuilding_41, "
						+"moonbuilding_42, "
						+"moonbuilding_43, "
						+"building_timestamp, "
						+"ships_202, "
						+"ships_203, "
						+"ships_204, "
						+"ships_205, "
						+"ships_206, "
						+"ships_207, "
						+"ships_208, "
						+"ships_209, "
						+"ships_210, "
						+"ships_211, "
						+"ships_212, "
						+"ships_213, "
						+"ships_214, "
						+"ships_215, "
						+"ships_timestamp, "
						+"defense_401, "
						+"defense_402, "
						+"defense_403, "
						+"defense_404, "
						+"defense_405, "
						+"defense_406, "
						+"defense_407, "
						+"defense_408, "
						+"rockets_502, "
						+"rockets_503, "
						+"defense_timestamp, "
						+"messageid "
					+"FROM "
						+"spyreports "
					+"WHERE "
						+"submitted = 0 "
					+"LIMIT "
						+"0, 50 "
				);
			var i=0;
			var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
			sentmessagesids=new Array();
			while(getspyreportquery.executeStep())
			{
				postdata+="&t"+i+"="+getspyreportquery.getInt64(4)	//timestamp
				+"&mid"+i+"="+getspyreportquery.getInt64(55)		//messageid
				+"&x"+i+"="+getspyreportquery.getInt32(0)			//x
				+"&y"+i+"="+getspyreportquery.getInt32(1)			//y
				+"&z"+i+"="+getspyreportquery.getInt32(2)			//z
				+"&m"+i+"="+getspyreportquery.getInt32(3)			//ismoon
				+"&met"+i+"="+getspyreportquery.getInt64(5)			//met
				+"&cry"+i+"="+getspyreportquery.getInt64(6)			//cry
				+"&deu"+i+"="+getspyreportquery.getInt64(7)			//deu
				+"&ene"+i+"="+getspyreportquery.getInt64(8)			//ene
				+"&a"+i+"="+getspyreportquery.getInt32(9)			//antispionage
				+"&b_1_"+i+"="+getspyreportquery.getInt32(10)		//building_1
				+"&b_2_"+i+"="+getspyreportquery.getInt32(11)		//building_2
				+"&b_3_"+i+"="+getspyreportquery.getInt32(12)		//building_3
				+"&b_4_"+i+"="+getspyreportquery.getInt32(13)		//building_4
				+"&b_12_"+i+"="+getspyreportquery.getInt32(14)		//building_12
				+"&b_14_"+i+"="+getspyreportquery.getInt32(15)		//building_14
				+"&b_15_"+i+"="+getspyreportquery.getInt32(16)		//building_15
				+"&b_21_"+i+"="+getspyreportquery.getInt32(17)		//building_21
				+"&b_22_"+i+"="+getspyreportquery.getInt32(18)		//building_22
				+"&b_23_"+i+"="+getspyreportquery.getInt32(19)		//building_23
				+"&b_24_"+i+"="+getspyreportquery.getInt32(20)		//building_24
				+"&b_31_"+i+"="+getspyreportquery.getInt32(21)		//building_31
				+"&b_33_"+i+"="+getspyreportquery.getInt32(22)		//building_33
				+"&b_34_"+i+"="+getspyreportquery.getInt32(23)		//building_34
				+"&b_44_"+i+"="+getspyreportquery.getInt32(24)		//building_44
				+"&mb_41_"+i+"="+getspyreportquery.getInt32(25)		//moonbuilding_41
				+"&mb_42_"+i+"="+getspyreportquery.getInt32(26)		//moonbuilding_42
				+"&mb_43_"+i+"="+getspyreportquery.getInt32(27)		//moonbuilding_43
				+"&b_t"+i+"="+getspyreportquery.getInt64(28)		//building_timestamp
				+"&s_202_"+i+"="+getspyreportquery.getInt64(29)		//ships_202
				+"&s_203_"+i+"="+getspyreportquery.getInt64(30)		//ships_203
				+"&s_204_"+i+"="+getspyreportquery.getInt64(31)		//ships_204
				+"&s_205_"+i+"="+getspyreportquery.getInt64(32)		//ships_205
				+"&s_206_"+i+"="+getspyreportquery.getInt64(33)		//ships_206
				+"&s_207_"+i+"="+getspyreportquery.getInt64(34)		//ships_207
				+"&s_208_"+i+"="+getspyreportquery.getInt64(35)		//ships_208
				+"&s_209_"+i+"="+getspyreportquery.getInt64(36)		//ships_209
				+"&s_210_"+i+"="+getspyreportquery.getInt64(37)		//ships_210
				+"&s_211_"+i+"="+getspyreportquery.getInt64(38)		//ships_211
				+"&s_212_"+i+"="+getspyreportquery.getInt64(39)		//ships_212
				+"&s_213_"+i+"="+getspyreportquery.getInt64(40)		//ships_213
				+"&s_214_"+i+"="+getspyreportquery.getInt64(41)		//ships_214
				+"&s_215_"+i+"="+getspyreportquery.getInt64(42)		//ships_215
				+"&s_t"+i+"="+getspyreportquery.getInt64(43)		//ships_timestamp
				+"&d_401_"+i+"="+getspyreportquery.getInt64(44)		//defense_401
				+"&d_402_"+i+"="+getspyreportquery.getInt64(45)		//defense_402
				+"&d_403_"+i+"="+getspyreportquery.getInt64(46)		//defense_403
				+"&d_404_"+i+"="+getspyreportquery.getInt64(47)		//defense_404
				+"&d_405_"+i+"="+getspyreportquery.getInt64(48)		//defense_405
				+"&d_406_"+i+"="+getspyreportquery.getInt64(49)		//defense_406
				+"&d_407_"+i+"="+getspyreportquery.getInt64(50)		//defense_407
				+"&d_408_"+i+"="+getspyreportquery.getInt64(51)		//defense_408
				+"&r_502_"+i+"="+getspyreportquery.getInt64(52)		//rockets_502
				+"&r_503_"+i+"="+getspyreportquery.getInt64(53)		//rockets_503
				+"&d_t"+i+"="+getspyreportquery.getInt64(54)		//defense_timestamp
				sentmessagesids[sentmessagesids.length]={
					"x":getspyreportquery.getInt32(0),
					"y":getspyreportquery.getInt32(1),
					"z":getspyreportquery.getInt32(2),
					"ismoon":getspyreportquery.getInt32(3)
				};
				i++;
			}
			if(i>=1)
			{
					var language=this.language;
					var universe=this.universe;
					var ogameid=this.ogameid;
					var req=new XMLHttpRequest();
					req.mozBackgroundRequest=true;
					req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								if(parseInt(req.responseText)==1)
								{
									for(var j=0;j<i;j++)
									{
										var updatesent=allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].AccountDB
											.createStatement
											(
												"UPDATE "
													+"spyreports "
												+"SET "
													+"submitted=1 "
												+"WHERE "
													+"x= ?1 "
													+"AND "
													+"y= ?2 "
													+"AND "
													+"z= ?3 "
													+"AND "
													+"ismoon= ?4 "
											);
										updatesent.bindInt32Parameter(0,sentmessagesids[j].x)
										updatesent.bindInt32Parameter(1,sentmessagesids[j].y)
										updatesent.bindInt32Parameter(2,sentmessagesids[j].z)
										updatesent.bindInt32Parameter(3,sentmessagesids[j].ismoon)
										//updatesent.execute();
										allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(updatesent);
									}
								}
								else
								{
									clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendspyreportspoller)
								}
							}
							else
							{
								clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendspyreportspoller)
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendSpyReports.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/spy/savespyreports.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendSpyReports",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendSpyResearches=function()
{
	try
	{
		if(this.checkStatus())
		{
			var getspyresearchquery=this.AccountDB
				.createStatement
				(
					"SELECT "
						+"targetogameid, "
						+"timestamp, "
						+"tech_106, "
						+"tech_108, "
						+"tech_109, "
						+"tech_110, "
						+"tech_111, "
						+"tech_113, "
						+"tech_114, "
						+"tech_115, "
						+"tech_117, "
						+"tech_118, "
						+"tech_120, "
						+"tech_121, "
						+"tech_122, "
						+"tech_123, "
						+"tech_124, "
						+"tech_199 "
					+"FROM "
						+"spyresearches "
					+"WHERE "
						+"submitted = 0 "
					+"LIMIT "
						+"0, 50 "
				);
			var i=0;
			var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
			sentmessagesids=new Array();
			while(getspyresearchquery.executeStep())
			{
				sentmessagesids[sentmessagesids.length]=getspyresearchquery.getInt32(0);
				postdata+="&o"+i+"="+getspyresearchquery.getInt32(0);			//ogameid
				postdata+="&t"+i+"="+getspyresearchquery.getInt64(1);			//timestamp
				postdata+="&t106_"+i+"="+getspyresearchquery.getInt32(2);		//tech_106
				postdata+="&t108_"+i+"="+getspyresearchquery.getInt32(3);		//tech_108
				postdata+="&t109_"+i+"="+getspyresearchquery.getInt32(4);		//tech_109
				postdata+="&t110_"+i+"="+getspyresearchquery.getInt32(5);		//tech_110
				postdata+="&t111_"+i+"="+getspyresearchquery.getInt32(6);		//tech_111
				postdata+="&t113_"+i+"="+getspyresearchquery.getInt32(7);		//tech_113
				postdata+="&t114_"+i+"="+getspyresearchquery.getInt32(8);		//tech_114
				postdata+="&t115_"+i+"="+getspyresearchquery.getInt32(9);		//tech_115
				postdata+="&t117_"+i+"="+getspyresearchquery.getInt32(10);		//tech_117
				postdata+="&t118_"+i+"="+getspyresearchquery.getInt32(11);		//tech_118
				postdata+="&t120_"+i+"="+getspyresearchquery.getInt32(12);		//tech_120
				postdata+="&t121_"+i+"="+getspyresearchquery.getInt32(13);		//tech_121
				postdata+="&t122_"+i+"="+getspyresearchquery.getInt32(14);		//tech_122
				postdata+="&t123_"+i+"="+getspyresearchquery.getInt32(15);		//tech_123
				postdata+="&t124_"+i+"="+getspyresearchquery.getInt32(16);		//tech_124
				postdata+="&t199_"+i+"="+getspyresearchquery.getInt32(17);		//tech_199
				i++;
			}
			if(i>=1)
			{
					var language=this.language;
					var universe=this.universe;
					var ogameid=this.ogameid;
					var req=new XMLHttpRequest();
					req.mozBackgroundRequest=true;
					req.onload=function()
					{
						try
						{
							if(
								(req.status==200)
								&&(req.readyState==4)
							)
							{
								if(parseInt(req.responseText)==1)
								{
									for(var j=0;j<i;j++)
									{
										var updatesent=allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].AccountDB
											.createStatement
											(
												"UPDATE "
													+"spyresearches "
												+"SET "
													+"submitted=1 "
												+"WHERE "
													+"targetogameid= ?1 "
											);
										updatesent.bindInt32Parameter(0,sentmessagesids[j])
										//updatesent.execute();
										allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(updatesent);
									}
								}
								else
								{
									clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendspyresearchespoller)
								}
							}
							else
							{
								clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendspyresearchespoller)
							}
						}
						catch(e)
						{
							st_errors.adderror
							(
								e,
								"sendSpyResearches.req.onload",
								"see_how_to_retrieve_html",
								"no_interesting_vars"
							)
						}
					};
				req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/spy/savespyresearches.php",true);
				req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				req.setRequestHeader("Content-length", postdata.length);
				req.setRequestHeader("Connection", "close");
				req.overrideMimeType('text/plain');
				req.send(postdata);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendSpyResearches",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

StOGalaxy.prototype.sendSpyLogs=function()
{
	try
	{
		if(this.checkStatus())
		{
			var getspylogstosubmit=this.AccountDB
				.createStatement
				(
					"SELECT "
						+"COUNT(1) AS not_submitted "
					+"FROM "
						+"sightedmessages "
					+"WHERE "
						+"submitted=0 "
					+"GROUP BY "
						+"submitted "
					+"HAVING "
						+"not_submitted>4 "
				);
			if(getspylogstosubmit.executeStep())
			{
				var getspylogsquery=this.AccountDB
					.createStatement
					(
						"SELECT "
							+"messageid,"
							+"timestamp,"
							+"fromgalaxy,"
							+"fromsystem,"
							+"fromplanet,"
							+"fromismoon,"
							+"togalaxy,"
							+"tosystem,"
							+"toplanet,"
							+"toismoon,"
							+"perc "
						+"FROM "
							+"sightedmessages "
						+"WHERE "
							+"submitted = 0 "
						+"LIMIT "
							+"0, 50 "
					);
				var i=0;
				var postdata="l="+this.language+"&u="+this.universe+"&o="+this.ogameid+"&sid="+this.sessionid;
				sentmessagesids=new Array();
				while(getspylogsquery.executeStep())
				{
					postdata+="&mid"+i+"="+getspylogsquery.getInt64(0)	//messageid
					+"&t"+i+"="+getspylogsquery.getInt64(1)				//timestamp
					+"&x"+i+"="+getspylogsquery.getInt32(2)				//fromgalaxy
					+"&y"+i+"="+getspylogsquery.getInt32(3)				//fromsystem
					+"&z"+i+"="+getspylogsquery.getInt32(4)				//fromplanet
					+"&m"+i+"="+getspylogsquery.getInt32(5)				//fromismoon
					+"&tx"+i+"="+getspylogsquery.getInt32(6)			//togalaxy
					+"&ty"+i+"="+getspylogsquery.getInt32(7)			//tosystem
					+"&tz"+i+"="+getspylogsquery.getInt32(8)			//toplanet
					+"&tm"+i+"="+getspylogsquery.getInt32(9)			//toismoon
					+"&a"+i+"="+getspylogsquery.getInt32(10)			//perc
					sentmessagesids[sentmessagesids.length]=getspylogsquery.getInt64(0);
					/*{
						"x":getspyreportquery.getInt32(0),
						"y":getspyreportquery.getInt32(1),
						"z":getspyreportquery.getInt32(2),
						"ismoon":getspyreportquery.getInt32(3)
					};*/
					i++;
				}
				if(i>=1)
				{
						var language=this.language;
						var universe=this.universe;
						var ogameid=this.ogameid;
						var req=new XMLHttpRequest();
						req.mozBackgroundRequest=true;
						req.onload=function()
						{
							try
							{
								if(
									(req.status==200)
									&&(req.readyState==4)
								)
								{
									if(parseInt(req.responseText)==1)
									{
										for(var j=0;j<i;j++)
										{
											var updatesent=allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].AccountDB
												.createStatement
												(
													"UPDATE "
														+"sightedmessages "
													+"SET "
														+"submitted=1 "
													+"WHERE "
														+"messageid= ?1 "
												);
											updatesent.bindInt64Parameter(0,sentmessagesids[j])
											//updatesent.execute();
											allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].storagemanager.push(updatesent);
										}
									}
									else
									{
										clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendspylogspoller)
									}
								}
								else
								{
									clearInterval(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sendspylogspoller)
								}
							}
							catch(e)
							{
								st_errors.adderror
								(
									e,
									"sendSpyLogs.req.onload",
									"see_how_to_retrieve_html",
									"no_interesting_vars"
								)
							}
						};
					req.open('POST',"http://data.stogame.net/"+GlobalVars.stogame_version+"/spy/savespylogs.php",true);
					req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
					req.setRequestHeader("Content-length", postdata.length);
					req.setRequestHeader("Connection", "close");
					req.overrideMimeType('text/plain');
					req.send(postdata);
				}
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"sendSpyLogs",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}