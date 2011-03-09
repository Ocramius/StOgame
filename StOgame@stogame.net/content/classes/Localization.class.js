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
function Localization()
{
	try
	{
		this.urldataextractor=Components.classes["@mozilla.org/network/io-service;1"]
			.getService(Components.interfaces.nsIIOService);
		var universelistupdatetime=StOgameDB.createStatement(
			"SELECT "
				+"timestamp "
			+"FROM "
				+"last_updates "
			+"WHERE "
				+"name='server_list_update' "
			+"LIMIT "
				+"0, 1"
		);
		if(universelistupdatetime.executeStep())
		{
			this.lastuniversesupdate=universelistupdatetime.getInt64(0);
		}
		else
		{
			this.lastuniversesupdate=0;
		}
		this.laststringsupdate=new Array();
		var languagestringupdatetime=StOgameDB.createStatement(
			"SELECT "
				+"timestamp, "
				+"name "
			+"FROM "
				+"last_updates "
			+"WHERE "
				+"name LIKE 'language_strings_update_%' "
		);
		while(languagestringupdatetime.executeStep())
		{
			this.laststringsupdate[languagestringupdatetime.getUTF8String(1).split("_")[languagestringupdatetime.getUTF8String(1).split("_").length-1]]=languagestringupdatetime.getInt64(0);
		}
		this.universes	=	new Array();
		this.unis		=	new Array();
		var universelistquery=StOgameDB.createStatement(
			"SELECT "
				+"language, "
				+"universe, "
				+"domain, "
				+"speed "
			+"FROM "
				+"universes "
		);
		while (universelistquery.executeStep())
		{
			var language	=	universelistquery.getUTF8String(0);
			var universe	=	universelistquery.getInt32(1);
			var domain		=	universelistquery.getUTF8String(2);
			var speed		=	universelistquery.getInt32(3);
			if(typeof this.universes[domain]=="undefined")
			{
				this.universes[domain]=new Array();
			}
			this.universes[domain]["language"]	=	language;
			this.universes[domain]["universe"]	=	universe;
			this.universes[domain]["speed"]		=	speed;
			if(typeof this.unis[language]=="undefined")
			{
				this.unis[language]=new Array();
			}
			this.unis[language][universe]			=	new Array();
			this.unis[language][universe]["domain"]	=	domain;
			this.unis[language][universe]["speed"]	=	speed;
		}
		this.strings	=	new Array();
		this.gids		=	new Array();
		this.fetchUniversesUpdate();
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

Localization.prototype.localize=function(sandbox)
{
	try
	{
		var document=sandbox.document;
		if(this.urldataextractor.extractScheme(document.location.href)=="http")
		{
			var ogameid=ST_parseInt(ST_getUrlParameter("ogameid",document.location.href));
			var universe=ST_parseInt(ST_getUrlParameter("universe",document.location.href));
			var language=ST_getUrlParameter("language",document.location.href);
			var domain=document.location.href.substring(7,document.location.href.indexOf("/",8));
			if
			(
				ogameid>0
				&& universe>0
				&& language.length==2
			)
			{
				if
				(
					domain.substring(domain.length-12,domain.length)==".stogame.net"
					|| domain=="127.0.0.1"
					|| domain=="standardogame.mozdev.org"
					//|| domain=="websim.speedsim.net"
				)
				{
					//http://websim.speedsim.net/sto.php
					var account=allaccounts
						.getAccount
						(
							language,
							universe,
							ogameid,
							false
						);
					if(account==0)
					{
						return 0;
					}
					//LINK TARGETING "_top" IN OGAME HAVE TO BE "_blank" OR THE USER WILL HAVE TO RELOG
					var iframes=document.getElementsByTagName("iframe");
					for(var i=0;i<iframes.length;i++)
					{
						iframes[i].contentWindow.addEventListener
						(
							"load",
							function()
							{
								var links=this.document.getElementsByTagName("a");
								for (var i=0;i<links.length;i++)
								{
									links[i].target=(links[i].target=="_top")?"_blank":links[i].target;
								}
							},
							false
						);
					}
				}
				else
				{
					return 0;
				}
			}
			else
			{
				//REMOVAL OF NON-INTERESTING ACCOUNTS
				/*if
				(
					domain=="uni680.ogame.org"
					|| domain=="uni681.ogame.org"
					|| domain=="uni42.ogame.org"
					|| domain=="uni6.ogame.de"
				)
				{*/
					if(typeof this.universes[domain]=="undefined")
					{
						return 0;
					}
					else
					{
						var language=this.universes[domain]["language"];
						var universe=this.universes[domain]["universe"];
						var ogameid=0;
						document_to_be_parsed
							.setDocument
							(
								document,
								language,
								universe
							);
						var account=allaccounts
							.getAccount(
								language,
								universe,
								ogameid,
								true
							);
						if(account==0)
						{
							return 0;
						}
					}
				/*}
				else
				{
					return 0;
				}*/
			}
			if(typeof this.strings[language]=="undefined")
			{
				this.strings[language]=new Array();
				var getlocalizationstrings=StOgameDB.createStatement(
					"SELECT "
						+"type, "
						+"name, "
						+"value "
					+"FROM "
						+"localization_strings "
					+"WHERE "
						+"language = ?1 "
						+"AND "
						+"type = ?2 "
				);
				getlocalizationstrings.bindUTF8StringParameter(0,language);
				getlocalizationstrings.bindUTF8StringParameter(1,"gid");
				while(getlocalizationstrings.executeStep())
				{
					this.strings[language][getlocalizationstrings.getUTF8String(0)+"_"+getlocalizationstrings.getUTF8String(1)]=getlocalizationstrings.getUTF8String(2);
				}
			}
			account.universespeed	=	this.unis[language][universe]["speed"];
			account.universedomain	=	this.unis[language][universe]["domain"];
			if(domain==this.unis[language][universe]["domain"])
			{
				if (typeof sandbox.unsafeWindow.$=="function" || ST_parseInt(ST_getUrlParameter("nID",sandbox.document.location.href))>0){
					new new_OgameParser(sandbox,account.ogameaccount);
					new new_OgameModifier(sandbox,account.ogameaccount);
				}else{
					new old_OgameParser(sandbox,account.ogameaccount);
					new old_OgameModifier(sandbox,account.ogameaccount);
				}
			}
			return account;
		}
		else
		{
			return 0;
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"localize",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Localization.prototype.parseGidStrings=function(language,universe)
{
	try
	{
		if(
			document_to_be_parsed.documents[language][universe].location.href.indexOf("page=techtree&")>0
			&& document_to_be_parsed.documents[language][universe].getElementById("content")
		)
		{
			var save_changes=false;
			var allgids=new Array();
			var alllinks=document_to_be_parsed.documents[language][universe].getElementById("content").getElementsByTagName("a");
			for(var i=0;i<alllinks.length;i++)
			{
				if(alllinks[i].href.indexOf("?page=infos")>0)
				{
					var gid=ST_parseInt(alllinks[i].href.split("gid=")[1]);
					if(this.strings[language]["gid_"+gid]!=alllinks[i].innerHTML)
					{
						this.strings[language]["gid_"+gid]=alllinks[i].innerHTML;
						allgids[allgids.length]=gid;
						save_changes=true;
					}
				}
			}
			if(save_changes)
			{
				/*var setgidlocalizationstrings=StOgameDB.createStatement("BEGIN");
				setgidlocalizationstrings.execute();*/
				var setgidlocalizationstrings=StOgameDB.createStatement(
					"INSERT INTO "
						+"localization_strings "
							+"( "
								+"language, "
								+"type, "
								+"name, "
								+"value "
							+") "
						+"VALUES "
							+"( "
								+"?1, "
								+"?2, "
								+"?3, "
								+"?4 "
							+") "
				);
				for(var i=0;i<allgids.length;i++)
				{
					setgidlocalizationstrings.bindUTF8StringParameter(0, language);
					setgidlocalizationstrings.bindUTF8StringParameter(1, "gid");
					setgidlocalizationstrings.bindUTF8StringParameter(2, allgids[i]);
					setgidlocalizationstrings.bindUTF8StringParameter(3, this.strings[language]["gid_"+allgids[i]]);
					setgidlocalizationstrings.execute();
				}
				/*var setgidlocalizationstrings=StOgameDB.createStatement("END");
				setgidlocalizationstrings.execute();*/
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"parseGidStrings",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Localization.prototype.fetchUniversesUpdate=function()
{
	try
	{
		if((this.lastuniversesupdate-Date.parse(new Date())+86400000)<0)
		{
			this.lastuniversesupdate=Date.parse(new Date());
			var lastuniversesupdatequery=StOgameDB.createStatement(
				"INSERT INTO "
					+"last_updates "
						+"( "
							+"name, "
							+"timestamp "
						+") "
						+"VALUES "
						+"( "
							+"'server_list_update', "
							+Date.parse(new Date())
						+") "
			);
			lastuniversesupdatequery.execute();
			var req=new XMLHttpRequest();
			//var postdata="lang=it&asd=users";
			req.mozBackgroundRequest=true;
			req.onprogress=function(e)
				{
					//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
					//alert("position: "+e.position+"\nototalSize: "+e.totalSize)
				};
			req.onload=function()
				{
					var universeslist=req.responseText.split("\n");
					//var universelistupdate=StOgameDB.createStatement("BEGIN");
					//universelistupdate.execute();
					try
					{
						//StOgameDB.beginTransaction();
					}
					catch(e)
					{
						//alert(e)
					}
					var universelistupdate=StOgameDB.createStatement(
						"INSERT INTO "
							+"universes "
							+"( "
								+"language, "
								+"universe, "
								+"domain, "
								+"speed "
							+") "
						+"VALUES "
							+"( "
								+"?1, "
								+"?2, "
								+"?3, "
								+"?4 "
							+")"
					);
					for(var i=0;i<universeslist.length;i++)
					{
						var universedata=universeslist[i].split(",");
						if(universedata.length==4)
						{
							if(typeof localization.universes[universedata[0]]=="undefined")
							{
								localization.universes[universedata[0]]=new Array();
							}
							universedata[2]=ST_parseInt(universedata[2]);
							universedata[3]=ST_parseInt(universedata[3]);
							localization.universes[universedata[0]]["language"]	=	universedata[1];
							localization.universes[universedata[0]]["universe"]	=	universedata[2];
							localization.universes[universedata[0]]["speed"]	=	universedata[3];
							if(typeof localization.unis[universedata[1]]=="undefined")
							{
								localization.unis[universedata[1]]=new Array();
							}
							localization.unis[universedata[1]][universedata[2]]				=	new Array();
							localization.unis[universedata[1]][universedata[2]]["speed"]	=	universedata[3];
							localization.unis[universedata[1]][universedata[2]]["domain"]	=	universedata[0];
							universelistupdate.bindUTF8StringParameter		(0, universedata[1]);
							universelistupdate.bindInt32Parameter			(1, universedata[2]);
							universelistupdate.bindUTF8StringParameter		(2, universedata[0]);
							universelistupdate.bindInt32Parameter			(3, universedata[3]);
							universelistupdate.execute();
						}
					}
					try
					{
						//StOgameDB.commitTransaction();
					}
					catch(e)
					{
						//alert(e)
					}
					//var universelistupdate=StOgameDB.createStatement("END");
					//universelistupdate.execute();
				};
			req.onreadystatechange=function()
				{
					//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
					//alert("readyState: "+req.readyState+"\nstatus: "+req.status);
				};
			req.onerror=function()
				{
					//alert("error!!!")
				};
			req.open('GET', "http://standardogame.mozdev.org/autoupdates/servers/serverlist.php", true);
			//req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			//req.setRequestHeader("Content-length", postdata.length);
			req.setRequestHeader("Connection", "close");
			req.overrideMimeType('text/plain');
			req.send(null);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"fetchUniversesUpdate",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}


/*********************************
FUNCTIONS USED TO FETCH DATA
*********************************/

Localization.prototype.setGidString=function(language,name,value)
{
	try
	{
		if
		(
			value
			&& value.length>0
			&& name>0
		)
		{
			//alert(this.setLocalizationString(language,"gid",name,value)+"\nOK!\n\nreturn this.setLocalizationString(\""+language+"\",\"gid\",\""+name+"\",\""+value+"\");")
			return this.setLocalizationString(language,"gid",name,value);
		}
		else
		{
			return 0;
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setGidString",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Localization.prototype.setLocalizationString=function(language,type,name,value)
{
	try
	{
		if(!this.strings[language])
		{
			this.strings[language]=new Array();
		}
		//alert(this.strings[language][type+"_"+name])
		if(this.strings[language][type+"_"+name]!=value)
		{
			this.strings[language][type+"_"+name]=value;
			var setlocalizationstring=StOgameDB.createStatement(
				"INSERT INTO "
					+"localization_strings "
						+"( "
							+"language, "
							+"type, "
							+"name, "
							+"value "
						+") "
					+"VALUES "
						+"( "
							+"?1, "
							+"?2, "
							+"?3, "
							+"?4 "
						+") "
			);
			setlocalizationstring.bindUTF8StringParameter(0, language);
			setlocalizationstring.bindUTF8StringParameter(1, type);
			setlocalizationstring.bindUTF8StringParameter(2, name);
			setlocalizationstring.bindUTF8StringParameter(3, value);
			setlocalizationstring.execute();
			return 1;
		}
		else
		{
			return 0;
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setLocalizationString",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Localization.prototype.getLocalizationString=function(language,type,name)
{
	try
	{
		if(!this.strings[language])
		{
			this.strings[language]=new Array();
		}
		if
		(
			typeof this.strings[language][type+"_"+name]=="undefined"
		)
		{
			var getlocalizationstring=StOgameDB.createStatement(
				"SELECT "
					+"value "
				+"FROM "
					+"localization_strings "
				+"WHERE "
					+"language = ?1 "
					+"AND "
					+"type = ?2 "
					+"AND "
					+"name = ?3 "
				+"LIMIT "
					+"0, 1 "
			);
			getlocalizationstring.bindUTF8StringParameter(0, language);
			getlocalizationstring.bindUTF8StringParameter(1, type);
			getlocalizationstring.bindUTF8StringParameter(2, name);
			if(getlocalizationstring.executeStep())
			{
				this.strings[language][type+"_"+name]=getlocalizationstring.getUTF8String(0);
				return this.strings[language][type+"_"+name];
			}
			else
			{
				return "ST_"+language+"_"+type+"_"+name;
			}
		}
		else
		{
			return this.strings[language][type+"_"+name];
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getLocalizationString",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Localization.prototype.retrieveLocalizationStrings=function(language)
{
	try
	{
		if((ST_parseInt(this.laststringsupdate[language])-Date.parse(new Date())+604800000)<0)
		{
			var req=new XMLHttpRequest();
			req.mozBackgroundRequest=true;
			req.onprogress=function(e)
				{
					//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
					//alert("position: "+e.position+"\nototalSize: "+e.totalSize)
				};
			req.onload=function()
				{
					localization.laststringsupdate[language]=Date.parse(new Date());
					var localizationrows=req.responseText.split("\n");
					for(var i=0;i<localizationrows.length;i++)
					{
						if(localizationrows[i].indexOf("@")>0)
						{
							localization.setLocalizationString
							(
								language,
								localizationrows[i].substring(0,localizationrows[i].indexOf("@")),
								localizationrows[i].substring(localizationrows[i].indexOf("@")+1,localizationrows[i].indexOf(":")),
								localizationrows[i].substring(localizationrows[i].indexOf(":")+1,localizationrows[i].length)
							)
						}
					}
					var setlanguagestringupdatetime=StOgameDB.createStatement(
						"INSERT INTO "
							+"last_updates "
								+"( "
									+"name, "
									+"timestamp "
								+") "
								+"VALUES "
								+"( "
									+"?1, "
									+"?2 "
								+") "
					);
					setlanguagestringupdatetime.bindUTF8StringParameter(0,"language_strings_update_"+language);
					setlanguagestringupdatetime.bindInt64Parameter(1,localization.laststringsupdate[language]);
					setlanguagestringupdatetime.execute();
				};
			req.onreadystatechange=function()
				{
					//PER INFORMARE L'UTENTE... DOPO AVER FATTO I TOOLTIP...
					//alert("readyState: "+req.readyState+"\nstatus: "+req.status);
				};
			req.onerror=function()
				{
					//alert("error!!!")
				};
			req.open('GET', "http://standardogame.mozdev.org/autoupdates/localization/getstrings.php?language="+language, true);
			req.setRequestHeader("Connection", "close");
			req.overrideMimeType('text/plain');
			req.send(null);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"fetchUniversesUpdate",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Localization.prototype.getGidByString=function(language,value)
{
	try
	{
		if(!this.gids[language])
		{
			this.gids[language]=new Array();
		}
		if
		(
			typeof this.gids[language][value]=="undefined"
		)
		{
			var getlocalizationstring=StOgameDB.createStatement(
				"SELECT "
					+"name "
				+"FROM "
					+"localization_strings "
				+"WHERE "
					+"language = ?1 "
					+"AND "
					+"type = 'gid' "
					+"AND "
					+"value = ?2 "
				+"LIMIT "
					+"0, 1 "
			);
			getlocalizationstring.bindUTF8StringParameter(0, language);
			getlocalizationstring.bindUTF8StringParameter(1, value);
			if(getlocalizationstring.executeStep())
			{
				this.gids[language][value]=getlocalizationstring.getInt32(0);
				return this.gids[language][value];
			}
			else
			{
				return 0;
			}
		}
		else
		{
			return this.gids[language][value];
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getGidByString",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

/*********************************************************************
					NEWS UPDATE SYSTEM
*********************************************************************/
Localization.prototype.getNews=function(language,universe,ogameid)
{
	try
	{
		if
		(
			!this.lastnewsupdatetimestamp
			|| this.lastnewsupdatetimestamp>(Date.parse(new Date())+3600000)
		)
		{
			this.lastnewsupdatetimestamp=Date.parse(new Date());
			var req=new XMLHttpRequest();
			req.mozBackgroundRequest=true;
			req.onload=function()
				{
					try
					{
						if(
							(req.status==200)
							&&(req.readyState==4)
							&&(ST_parseInt(req.responseText)>0)
						)
						{
							if(ST_parseInt(req.responseText)!=ST_parseInt(localization.lastnews))
							{
								localization.lastnews=ST_parseInt(req.responseText);
								localization.lastnews_date=req.responseText.substring(req.responseText.indexOf("|")+1,req.responseText.indexOf("|",req.responseText.indexOf("|")+1));
								localization.lastnews_title=req.responseText.substring(req.responseText.indexOf("|",req.responseText.indexOf("|")+3)+1,req.responseText.length);
								globaltooltip.tip
								(
									language,
									universe,
									ogameid,
									"news",
									"news",
									"news",
									localization.lastnews_date,
									localization.lastnews_title,
									language+","+universe+","+ogameid
								);
							}
							else
							{
							}
						}
						else
						{
							//alert("errore:"+req.responseText)
								//ERRORE 404, PHP, SQL, ECC...
							localization.lastnews=ST_parseInt(req.responseText);
							localization.lastnews_date="1970-01-01 00:00:00";
							localization.lastnews_title="News system could not be reached!";
							globaltooltip.tip
							(
								language,
								universe,
								ogameid,
								"news",
								"news",
								"news",
								localization.lastnews_date,
								localization.lastnews_title,
								language+","+universe+","+ogameid
							);
						}
					}
					catch(e)
					{
						st_errors.adderror
						(
							e,
							"getNews.req.onload",
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
							"getNews.req.onprogress",
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
							"getNews.req.onreadystatechange",
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
							"getNews.req.onerror",
							"see_how_to_retrieve_html",
							"no_interesting_vars"
						)
					}
				};
			req.open('GET', "http://standardogame.mozdev.org/autoupdates/news/news.php?language="+language, true);
			req.setRequestHeader("Connection", "close");
			req.overrideMimeType('text/plain');
			req.send(null);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getNews",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}


/*********************************
INITIALIZING OBJECT
*********************************/
localization=new Localization();