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
function Galaxy(
	language,
	universe,
	ogameid,
	AccountDB
)
{
	try
	{
		this.language	=	language;
		this.universe	=	universe;
		this.ogameid	=	ogameid;
		this.AccountDB	=	AccountDB;
		this.planets	=	new Array();
		this.notes		=	new Array();
		this.savesdelayer;
		for(var i=1;i<10;i++)
		{
			this.planets	[i]		=	new Array();
			this.notes		[i]		=	new Array();
			for(var j=1;j<500;j++)
			{
				this.planets	[i][j]	=	new Array();
				this.notes		[i][j]	=	new Array();
				for(var k=1;k<16;k++)
				{
					this.planets[i][j][k]=new Array();
					this.notes	[i][j][k]=new Array();
					this.planets[i][j][k]["ogameid"]			=	0;		 /**OGAMEID=0->no planet, OGAMEID=-1->destroyed planet**/
					this.planets[i][j][k]["planetname"]			=	"";
					this.planets[i][j][k]["planetgroup"]		=	0;
					this.planets[i][j][k]["planettype"]			=	0;
					this.planets[i][j][k]["debrismet"]			=	0;
					this.planets[i][j][k]["debriscry"]			=	0;
					this.planets[i][j][k]["moonname"]			=	"";
					this.planets[i][j][k]["moondiameter"]		=	0;
					this.planets[i][j][k]["moontemperature"]	=	0;
				}
				this.planets[i][j]["savedate"]=0;
			}
		}
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

Galaxy.prototype.getSystem=function(gal,sys)
{
	try
	{
		if(this.planets[gal][sys]["savedate"]==0)
		{
			var getsystemquery	=	this.AccountDB.createStatement(
				"SELECT "
					+"z, "
					+"ogameid, "
					+"planetname, "
					+"planetgroup, "
					+"planettype, "
					+"moonname, "
					+"moondiameter, "
					+"moontemperature, "
					+"debrismet, "
					+"debriscry, "
					+"updated "
				+"FROM "
					+"galaxy "
				+"WHERE "
					+"x = ?1 "
					+"AND "
					+"y = ?2 "
			);
			getsystemquery.bindInt32Parameter			(0, gal);
			getsystemquery.bindInt32Parameter			(1, sys);
			while(getsystemquery.executeStep())
			{
				var z											=	getsystemquery.getInt32			(0);
				this.planets[gal][sys][z]["ogameid"]			=	getsystemquery.getInt32			(1);
				this.planets[gal][sys][z]["planetname"]			=	getsystemquery.getUTF8String	(2);
				this.planets[gal][sys][z]["planetgroup"]		=	getsystemquery.getInt32			(3);
				this.planets[gal][sys][z]["planettype"]			=	getsystemquery.getInt32			(4);
				this.planets[gal][sys][z]["moonname"]			=	getsystemquery.getUTF8String	(5);
				this.planets[gal][sys][z]["moondiameter"]		=	getsystemquery.getInt32			(6);
				this.planets[gal][sys][z]["moontemperature"]	=	getsystemquery.getInt32			(7);
				this.planets[gal][sys][z]["debrismet"]			=	getsystemquery.getInt64			(8);
				this.planets[gal][sys][z]["debriscry"]			=	getsystemquery.getInt64			(9);
				this.planets[gal][sys]["savedate"]				=	getsystemquery.getInt64			(10);
			}
		}
		return this.planets[gal][sys];
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getSystem",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.getPlanetsByName=function(planetname)
{
	try
	{
		var getsystemquery	=	this.AccountDB.createStatement(
			"SELECT "
				+"x, "
				+"y, "
				+"z, "
				+"ogameid, "
				+"planetname, "
				+"planetgroup, "
				+"planettype, "
				+"moonname, "
				+"moondiameter, "
				+"moontemperature, "
				+"debrismet, "
				+"debriscry, "
				+"updated "
			+"FROM "
				+"galaxy "
			+"WHERE "
				+"planetname LIKE ?1 "
			+"ORDER BY "
				+"x ASC, "
				+"y ASC, "
				+"z ASC "
		);
		getsystemquery.bindUTF8StringParameter			(0, "%"+planetname+"%");
		var returnedplanets=new Array();
		while(getsystemquery.executeStep())
		{
			var x											=	getsystemquery.getInt32			(0);
			var y											=	getsystemquery.getInt32			(1);
			var z											=	getsystemquery.getInt32			(2);
			var ogameid										=	getsystemquery.getInt32			(3);
			var planetname									=	getsystemquery.getUTF8String	(4);
			var planetgroup									=	getsystemquery.getInt32			(5);
			var planettype									=	getsystemquery.getInt32			(6);
			var moonname									=	getsystemquery.getUTF8String	(7);
			var moondiameter								=	getsystemquery.getInt32			(8);
			var moontemperature								=	getsystemquery.getInt32			(9);
			var debrismet									=	getsystemquery.getInt64			(10);
			var debriscry									=	getsystemquery.getInt64			(11);
			var savedate									=	getsystemquery.getInt64			(12);
			returnedplanets.push({
				"x": x,
				"y": y,
				"z": z,
				"ogameid": ogameid,
				"planetname": planetname,
				"planetgroup": planetgroup,
				"planettype": planettype,
				"moonname": moonname,
				"moondiameter": moondiameter,
				"moontemperature": moontemperature,
				"debrismet": debrismet,
				"debriscry": debriscry,
				"savedate": savedate
			});
		}
		return returnedplanets;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getPlanetsByName",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.getPlanetsByOgameid=function(ogameid)
{
	try
	{
		var getsystemquery	=	this.AccountDB.createStatement(
			"SELECT "
				+"x, "
				+"y, "
				+"z, "
				+"planetname, "
				+"planetgroup, "
				+"planettype, "
				+"moonname, "
				+"moondiameter, "
				+"moontemperature, "
				+"debrismet, "
				+"debriscry, "
				+"updated "
			+"FROM "
				+"galaxy "
			+"WHERE "
				+"ogameid = ?1 "
			+"ORDER BY "
				+"x ASC, "
				+"y ASC, "
				+"z ASC "
		);
		getsystemquery.bindInt32Parameter			(0, ogameid);
		var returnedplanets=new Array();
		while(getsystemquery.executeStep())
		{
			var x											=	getsystemquery.getInt32			(0);
			var y											=	getsystemquery.getInt32			(1);
			var z											=	getsystemquery.getInt32			(2);
			var planetname									=	getsystemquery.getUTF8String	(3);
			var planetgroup									=	getsystemquery.getInt32			(4);
			var planettype									=	getsystemquery.getInt32			(5);
			var moonname									=	getsystemquery.getUTF8String	(6);
			var moondiameter								=	getsystemquery.getInt32			(7);
			var moontemperature								=	getsystemquery.getInt32			(8);
			var debrismet									=	getsystemquery.getInt64			(9);
			var debriscry									=	getsystemquery.getInt64			(10);
			var savedate									=	getsystemquery.getInt64			(11);
			returnedplanets[returnedplanets.length]={
				"x": x,
				"y": y,
				"z": z,
				"planetname": planetname,
				"planetgroup": planetgroup,
				"planettype": planettype,
				"moonname": moondiameter,
				"moondiameter": moondiameter,
				"moontemperature": moontemperature,
				"debrismet": debrismet,
				"debriscry": debriscry,
				"savedate": savedate
			}
		}
		return returnedplanets;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getPlanetsByOgameid",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.setSystem=function(system)
{
	try
	{
		var save_changes=false;
		this.getSystem(system.galaxy,system.system);
		var players=new Array();
		var alliances=new Array();
		for(var i in system.planets)
		{
			if
			(
				system.planets[i].ogameid>0
				&& system.planets[i].nickname.length>0
				&& system.planets[i].rank>0
				&& !players[system.planets[i].ogameid]
			)
			{
				players[system.planets[i].ogameid]={
					"ogameid"			:	system.planets[i].ogameid,
					"nickname"			:	(
												(system.planets[i].nickname.indexOf("...")<system.planets[i].nickname.length-3)
												?system.planets[i].nickname
												:0
											),
					"rank"				:	system.planets[i].rank,
					"allyid"			:	system.planets[i].allyid,
					"inactive"			:	system.planets[i].inactive,
					"loginactive"		:	system.planets[i].loginactive,
					"banned"			:	system.planets[i].banned,
					"vacation"			:	system.planets[i].vacation,
					"noob"				:	system.planets[i].noob,
					"strong"			:	system.planets[i].strong
				};
			}
			else if
			(
				system.planets[i].ogameid>0
				&& !players[system.planets[i].ogameid]
			)
			{
				//GET RANK AND NICKNAME? OR JUST IGNORE?
				
				//CREATE GETPLAYERBYOGAMEID FUNCTION IN RANKS?
				if
				(
					system.planets[i].allytag.length>=3
					&& system.planets[i].allyid==0
				)
				{
					if(!alliances[system.planets[i].allytag])
					{
						var allyids=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].ranks.getAllianceByTag(system.planets[i].allytag);
						if(allyids.length==1)
						{
							system.planets[i].allyid=allyids[0].id;
						}
					}
					else
					{
						system.planets[i].allyid=alliances[system.planets[i].allytag].allyid;
					}
				}
				players[system.planets[i].ogameid]={
					"ogameid"			:	system.planets[i].ogameid,
					"nickname"			:	(
												(system.planets[i].nickname.indexOf("...")<system.planets[i].nickname.length-3)
												?system.planets[i].nickname
												:0
											),
					"rank"				:	system.planets[i].rank,
					"allyid"			:	system.planets[i].allyid,
					"inactive"			:	system.planets[i].inactive,
					"loginactive"		:	system.planets[i].loginactive,
					"banned"			:	system.planets[i].banned,
					"vacation"			:	system.planets[i].vacation,
					"noob"				:	system.planets[i].noob,
					"strong"			:	system.planets[i].strong
				};
			}
			if
			(
				system.planets[i].allytag.length>=3
				&& !alliances[system.planets[i].allytag]
			)
			{
				if(system.planets[i].allyid==0)
				{
					var allyids=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].ranks.getAllianceByTag(system.planets[i].allytag);
					if(allyids.length==1)
					{
						system.planets[i].allyid=allyids[0].id;
					}
				}
				alliances[system.planets[i].allytag]={
					"allytag"			:	system.planets[i].allytag,
					"allyrank"			:	system.planets[i].allyrank,
					"allymembers"		:	system.planets[i].allymembers,
					"allyid"			:	system.planets[i].allyid
				};
			}
			if(
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["ogameid"]			!=system.planets[i].ogameid
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["planetname"]		!=system.planets[i].planetname
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["debrismet"]		!=system.planets[i].debrismet
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["debriscry"]		!=system.planets[i].debriscry
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["moonname"]		!=system.planets[i].moonname
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["moondiameter"]	!=system.planets[i].moondiameter
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["moontemperature"]	!=system.planets[i].moontemperature
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["moonname"]		!=system.planets[i].moonname
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["planetgroup"]		!=system.planets[i].planetgroup
				|| this.planets[system.galaxy][system.system][system.planets[i].planetindex]["planettype"]		!=system.planets[i].planettype
			)
			{
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["ogameid"]			=system.planets[i].ogameid;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["planetname"]			=system.planets[i].planetname;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["debrismet"]			=system.planets[i].debrismet;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["debriscry"]			=system.planets[i].debriscry;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["moonname"]			=system.planets[i].moonname;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["moondiameter"]		=system.planets[i].moondiameter;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["moontemperature"]	=system.planets[i].moontemperature;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["moonname"]			=system.planets[i].moonname;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["planetgroup"]		=system.planets[i].planetgroup;
				this.planets[system.galaxy][system.system][system.planets[i].planetindex]["planettype"]			=system.planets[i].planettype;
				this.planets[system.galaxy][system.system]["savedate"]=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				save_changes=true;
			}
		}
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].ranks.setPlayersFromGalaxy(players);
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].ranks.setAlliancesFromTag(alliances);
		if(save_changes)
		{
			this.saveSystem(system.galaxy,system.system);
			var removedeletedplayers=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
			(
				"DELETE "
				+"FROM "
					+"players "
				+"WHERE "
					+"ogameid "
						+"IN "
							+"( "
								+"SELECT "
									+"p.ogameid "
								+"FROM "
									+"players AS p "
								+"LEFT JOIN "
									+"galaxy AS g "
										+"ON "
											+"g.x=p.x "
											+"AND "
											+"g.y=p.y "
											+"AND "
											+"g.z=p.z "
											+"AND "
											+"g.ogameid!=p.ogameid "
								+"WHERE "
									+"g.x=?1 "
									+"AND "
									+"g.y=?2 "
							+")"
			);
			removedeletedplayers.bindInt32Parameter(0,system.galaxy);
			removedeletedplayers.bindInt32Parameter(1,system.system);
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(removedeletedplayers);
			//removedeletedplayers.execute();
			var setgalaxyupdaterow=this.AccountDB.createStatement
			(
				"INSERT OR IGNORE INTO "
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
			setgalaxyupdaterow.bindInt32Parameter(0,system.galaxy);
			setgalaxyupdaterow.bindInt32Parameter(1,system.system);
			setgalaxyupdaterow.bindInt64Parameter(2,0);
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(setgalaxyupdaterow);
			//setgalaxyupdaterow.execute();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setSystem",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.saveSystem=function(gal,sys)
{
	try
	{
		for(var i=1;i<16;i++)
		{
			var setsystemquery	=	this.AccountDB.createStatement(
				"INSERT INTO "
					+"galaxy "
						+"( "
							+"x, "
							+"y, "
							+"z, "
							+"ogameid, "
							+"planetname, "
							+"planetgroup, "
							+"planettype, "
							+"moonname, "
							+"moondiameter, "
							+"moontemperature, "
							+"debrismet, "
							+"debriscry, "
							+"updated "
						+") "
						+"VALUES "
						+"( "
							+"?1, "
							+"?2, "
							+"?3, "
							+"?4, "
							+"?5, "
							+"?6, "
							+"?7, "
							+"?8, "
							+"?9, "
							+"?10, "
							+"?11, "
							+"?12, "
							+"?13 "
						+") "
			);
			setsystemquery.bindInt32Parameter			(0, gal);
			setsystemquery.bindInt32Parameter			(1, sys);
			setsystemquery.bindInt32Parameter			(2, i);
			setsystemquery.bindInt32Parameter			(3, this.planets[gal][sys][i]["ogameid"]);
			setsystemquery.bindUTF8StringParameter		(4, this.planets[gal][sys][i]["planetname"]);
			setsystemquery.bindInt32Parameter			(5, this.planets[gal][sys][i]["planetgroup"]);
			setsystemquery.bindInt32Parameter			(6, this.planets[gal][sys][i]["planettype"]);
			setsystemquery.bindUTF8StringParameter		(7, this.planets[gal][sys][i]["moonname"]);
			setsystemquery.bindInt32Parameter			(8, this.planets[gal][sys][i]["moondiameter"]);
			setsystemquery.bindInt32Parameter			(9, this.planets[gal][sys][i]["moontemperature"]);
			setsystemquery.bindInt64Parameter			(10, this.planets[gal][sys][i]["debrismet"]);
			setsystemquery.bindInt64Parameter			(11, this.planets[gal][sys][i]["debriscry"]);
			setsystemquery.bindInt64Parameter			(12, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
			//setsystemquery.execute();
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(setsystemquery);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"saveSystem",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.getNotes=function(gal,sys,pla)
{
	try
	{
		var getnotequery	=	this.AccountDB.createStatement(
			"SELECT "
				+"added, "
				+"updated, "
				+"note "
			+"FROM "
				+"galaxy_notes "
			+"WHERE "
				+"x = ?1 "
				+"AND "
				+"y = ?2 "
				+"AND "
				+"z = ?3 "
			+"ORDER BY "
				+"updated ASC "
		);
		getnotequery.bindInt32Parameter			(0, gal);
		getnotequery.bindInt32Parameter			(1, sys);
		getnotequery.bindInt32Parameter			(2, pla);
		var i=0;
		this.notes[gal][sys][pla]=new Array();
		while(getnotequery.executeStep())
		{
			this.notes[gal][sys][pla][i]={
				"added":	getnotequery.getInt64		(0),
				"updated":	getnotequery.getInt64		(1),
				"note":		getnotequery.getUTF8String	(2)
			};
			i++;
		}
		return this.notes[gal][sys][pla];
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.addNote=function(gal,sys,pla,value)
{
	try
	{
		this.getNotes(gal,sys,pla);
		var servertimestamp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
		this.notes[gal][sys][pla][this.notes[gal][sys][pla].length]={
			"added":	servertimestamp,
			"updated":	servertimestamp,
			"note":		value
		}
		var setnotequery	=	this.AccountDB.createStatement(
			"INSERT INTO "
				+"galaxy_notes "
					+"( "
						+"x, "
						+"y, "
						+"z, "
						+"added, "
						+"updated, "
						+"note "
					+") "
					+"VALUES "
					+"( "
						+"?1, "
						+"?2, "
						+"?3, "
						+"?4, "
						+"?5, "
						+"?6 "
					+") "
		);
		setnotequery.bindInt32Parameter			(0, gal);
		setnotequery.bindInt32Parameter			(1, sys);
		setnotequery.bindInt32Parameter			(2, pla);
		setnotequery.bindInt64Parameter			(3, servertimestamp);
		setnotequery.bindInt64Parameter			(4, servertimestamp);
		setnotequery.bindUTF8StringParameter	(5, value);
		setnotequery.execute();
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.updNote=function(gal,sys,pla,id,value)
{
	try
	{
		var note=this.getNotes(gal,sys,pla);
		var added=note[id]["added"];
		var updated=note[id]["updated"];
		var updatenotequery	=	this.AccountDB.createStatement(
			"UPDATE "
				+"galaxy_notes "
			+"SET "
				+"updated = ?1, "
				+"note = ?2 "
			+"WHERE "
				+"x = ?3 "
				+"AND "
				+"y = ?4 "
				+"AND "
				+"z = ?5 "
				+"AND "
				+"added = ?6 "
				+"AND "
				+"updated = ?7 "
		);
		updatenotequery.bindInt32Parameter			(2, gal);
		updatenotequery.bindInt32Parameter			(3, sys);
		updatenotequery.bindInt32Parameter			(4, pla);
		updatenotequery.bindInt64Parameter			(5, added);
		updatenotequery.bindInt64Parameter			(6, updated);
		updatenotequery.bindInt64Parameter			(0, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
		updatenotequery.bindUTF8StringParameter		(1, value);
		updatenotequery.execute();
		this.getNotes(gal,sys,pla);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"updNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.delNote=function(gal,sys,pla,id)
{
	try
	{
		var note=this.getNotes(gal,sys,pla);
		var added=note[id]["added"];
		var updated=note[id]["updated"];
		var delnotequery	=	this.AccountDB.createStatement(
			"DELETE FROM "
				+"galaxy_notes "
			+"WHERE "
				+"x = ?1 "
				+"AND "
				+"y = ?2 "
				+"AND "
				+"z = ?3 "
				+"AND "
				+"added = ?4 "
				+"AND "
				+"updated = ?5 "
		);
		delnotequery.bindInt32Parameter			(0, gal);
		delnotequery.bindInt32Parameter			(1, sys);
		delnotequery.bindInt32Parameter			(2, pla);
		delnotequery.bindInt64Parameter			(3, added);
		delnotequery.bindInt64Parameter			(4, updated);
		delnotequery.execute();
		this.getNotes(gal,sys,pla);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"delNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.getPlanets=function(filter)
{
	try
	{
		var fields=[
				"x",
				"y",
				"z",
				"ogameid",
				"planetgroup",
				"planettype",
				"moondiameter",
				"moontemperature",
				"debrismet",
				"debriscry",
				"updated"
		];
		var searchstring="SELECT "
							+"x, "
							+"y, "
							+"z, "
							+"ogameid, "
							+"planetname, "
							+"planetgroup, "
							+"planettype, "
							+"moonname, "
							+"moondiameter, "
							+"moontemperature, "
							+"debrismet, "
							+"debriscry, "
							+"updated "
						+"FROM "
							+"galaxy "
						+"WHERE "
							+"1";
		for(var i in fields)
		{
			if(typeof filter[fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+"="	+filter[fields[i]];
			}
			if(typeof filter["min"+fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+">="	+filter["min"+fields[i]];
			}
			if(typeof filter["max"+fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+">="	+filter["max"+fields[i]];
			}
		}
		if(typeof filter["planetname"]!="undefined")
		{
			searchstring+=" AND planetname LIKE '%"+filter["planetname"].replace(/\'/ig,"")+"%'";
		}
		if(typeof filter["moonname"]!="undefined")
		{
			searchstring+=" AND moonname LIKE '%"+filter["moonname"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY x ASC, y ASC, z ASC";
		var returnedplanets=[];
		var getplanetsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getplanetsquery.executeStep())
		{
			returnedplanets.push
			(
				{
					"x":				getplanetsquery.getInt32(0),
					"y":				getplanetsquery.getInt32(1),
					"z":				getplanetsquery.getInt32(2),
					"ogameid":			getplanetsquery.getInt64(3),
					"planetname":		getplanetsquery.getUTF8String(4),
					"planetgroup":		getplanetsquery.getInt64(5),
					"planettype":		getplanetsquery.getInt64(6),
					"moonname":			getplanetsquery.getUTF8String(7),
					"moondiameter":		getplanetsquery.getInt64(8),
					"moontemperature":	getplanetsquery.getInt64(9),
					"debrismet":		getplanetsquery.getInt64(10),
					"debriscry":		getplanetsquery.getInt64(11),
					"updated":			getplanetsquery.getInt64(12)
				}
			);
		}
		return returnedplanets;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getPlanets",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Galaxy.prototype.getActivities=function(filter)
{
	try
	{
		var fields=[
				"x",
				"y",
				"z",
				"timestamp"
		];
		var searchstring="SELECT "
							+"x, "
							+"y, "
							+"z, "
							+"timestamp "
						+"FROM "
							+"activities "
						+"WHERE "
							+"1";
		for(var i in fields)
		{
			if(typeof filter[fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+"="	+filter[fields[i]];
			}
			if(typeof filter["min"+fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+">="	+filter["min"+fields[i]];
			}
			if(typeof filter["max"+fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+">="	+filter["max"+fields[i]];
			}
		}
		if(typeof filter["planetname"]!="undefined")
		{
			searchstring+=" AND planetname LIKE '%"+filter["planetname"].replace(/\'/ig,"")+"%'";
		}
		if(typeof filter["moonname"]!="undefined")
		{
			searchstring+=" AND moonname LIKE '%"+filter["moonname"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY x ASC, y ASC, z ASC, timestamp ASC";
		var returnedactivities=[];
		var getactivitiesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getactivitiesquery.executeStep())
		{
			returnedactivities.push
			(
				{
					"x":				getactivitiesquery.getInt32(0),
					"y":				getactivitiesquery.getInt32(1),
					"z":				getactivitiesquery.getInt32(2),
					"timestamp":		getactivitiesquery.getInt64(3)
				}
			);
		}
		return returnedactivities;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getActivities",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}