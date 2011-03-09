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
function Ranks(
	language,
	universe,
	ogameid
)
{
	try
	{
		this.language		=	language;
		this.universe		=	universe;
		this.ogameid		=	ogameid;
		this.totalplayers	=	0;		//total universe players
		this.player			=	new Array();
		//this.player[ogameid]...
		//this.player[ogameid]["x"]
		//this.player[ogameid]["y"]
		//this.player[ogameid]["z"]
		//this.player[ogameid]["nickname"]
		//this.player[ogameid]["allyid"]
		//this.player[ogameid]["pointsrank"]
		//this.player[ogameid]["points"]
		//this.player[ogameid]["pointsupdate"]
		//this.player[ogameid]["fleetrank"]
		//this.player[ogameid]["fleet"]
		//this.player[ogameid]["fleetupdate"]
		//this.player[ogameid]["researchrank"]
		//this.player[ogameid]["research"]
		//this.player[ogameid]["researchupdate"]
		//this.player[ogameid]["vacation"]	//0, 1
		//this.player[ogameid]["inactive"]	//0, 1, 2
		//this.player[ogameid]["banned"]	//0, 1
		//this.player[ogameid]["protection"]	//0, 1 (noob), 2(strong)
		//this.player[ogameid]["statusupdate"]
		this.playernotes	=	new Array();
		
		this.alliance		=	new Array();
		//this.alliance[id]...
		//this.alliance[id]["tag"]
		//this.alliance[id]["members"]
		//this.alliance[id]["pointsrank"]
		//this.alliance[id]["points"]
		//this.alliance[id]["avgpoints"]
		//this.alliance[id]["pointsupdate"]
		//this.alliance[id]["fleetrank"]
		//this.alliance[id]["fleet"]
		//this.alliance[id]["avgfleet"]
		//this.alliance[id]["fleetupdate"]
		//this.alliance[id]["researchrank"]
		//this.alliance[id]["research"]
		//this.alliance[id]["avgresearch"]
		//this.alliance[id]["researchupdate"]
		this.alliancenotes	=	new Array();
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

Ranks.prototype.setTotalPlayers=function(totalplayers)
{
	try
	{
		this.totalplayers=totalplayers;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setTotalPlayers",
			"see_how_to_retrieve_html",
			"totalplayers:"+String(totalplayers)
		)
	}
}

Ranks.prototype.getTotalPlayers=function()
{
	try
	{
		var totalplayers=this.totalplayers;
		return totalplayers;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getTotalPlayers",
			"see_how_to_retrieve_html",
			"totalplayers:"+String(this.totalplayers)
		)
	}
}

Ranks.prototype.getPlayer=function(ogameid)
{
	try
	{
		var getplayerquery=allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB
			.createStatement(
				"SELECT "
					+"nickname, "
					+"allyid, "
					+"x, "
					+"y, "
					+"z, "
					+"pointsrank, "
					+"points, "
					+"pointsvariation, "
					+"pointsupdate, "
					+"fleetrank, "
					+"fleet, "
					+"fleetvariation, "
					+"fleetupdate, "
					+"researchrank, "
					+"research, "
					+"researchvariation, "
					+"researchupdate "
				+"FROM "
					+"players "
				+"WHERE "
					+"ogameid = ?1 "
			);
		getplayerquery.bindInt32Parameter		(0, ogameid);
		if(getplayerquery.executeStep())
		{
			this.player[ogameid]=new Array();
			this.player[ogameid]["nickname"]			=	getplayerquery.getUTF8String	(0);
			this.player[ogameid]["allyid"]				=	getplayerquery.getInt32			(1);
			this.player[ogameid]["x"]					=	getplayerquery.getInt32			(2);
			this.player[ogameid]["y"]					=	getplayerquery.getInt32			(3);
			this.player[ogameid]["z"]					=	getplayerquery.getInt32			(4);
			this.player[ogameid]["pointsrank"]			=	getplayerquery.getInt32			(5);
			this.player[ogameid]["points"]				=	getplayerquery.getInt64			(6);
			this.player[ogameid]["pointsvariation"]		=	getplayerquery.getInt32			(7);
			this.player[ogameid]["pointsupdate"]		=	getplayerquery.getInt64			(8);
			this.player[ogameid]["fleetrank"]			=	getplayerquery.getInt32			(9);
			this.player[ogameid]["fleet"]				=	getplayerquery.getInt64			(10);
			this.player[ogameid]["fleetvariation"]		=	getplayerquery.getInt32			(11);
			this.player[ogameid]["fleetupdate"]			=	getplayerquery.getInt64			(12);
			this.player[ogameid]["researchrank"]		=	getplayerquery.getInt32			(13);
			this.player[ogameid]["research"]			=	getplayerquery.getInt32			(14);
			this.player[ogameid]["researchvariation"]	=	getplayerquery.getInt32			(15);
			this.player[ogameid]["researchupdate"]		=	getplayerquery.getInt64			(16);
			return this.player[ogameid];
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
			"getPlayer",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.getPlayersByNickname=function(nickname)
{
	try
	{
		var getplayerquery=allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB
			.createStatement(
				"SELECT "
					+"ogameid, "
					+"nickname, "
					+"allyid, "
					+"x, "
					+"y, "
					+"z, "
					+"pointsrank, "
					+"points, "
					+"pointsvariation, "
					+"pointsupdate, "
					+"fleetrank, "
					+"fleet, "
					+"fleetvariation, "
					+"fleetupdate, "
					+"researchrank, "
					+"research, "
					+"researchvariation, "
					+"researchupdate "
				+"FROM "
					+"players "
				+"WHERE "
					+"nickname LIKE ?1 "
				+"ORDER BY "
					+"nickname ASC"
			);
		getplayerquery.bindUTF8StringParameter		(0, "%"+nickname+"%");
		var returnedplayers=new Array();
		while(getplayerquery.executeStep())
		{
			var ogameid									=	getplayerquery.getInt32			(0);
			this.player[ogameid]=new Array();
			this.player[ogameid]["ogameid"]				=	ogameid;
			this.player[ogameid]["nickname"]			=	getplayerquery.getUTF8String	(1);
			this.player[ogameid]["allyid"]				=	getplayerquery.getInt32			(2);
			this.player[ogameid]["x"]					=	getplayerquery.getInt32			(3);
			this.player[ogameid]["y"]					=	getplayerquery.getInt32			(4);
			this.player[ogameid]["z"]					=	getplayerquery.getInt32			(5);
			this.player[ogameid]["pointsrank"]			=	getplayerquery.getInt32			(6);
			this.player[ogameid]["points"]				=	getplayerquery.getInt64			(7);
			this.player[ogameid]["pointsvariation"]		=	getplayerquery.getInt32			(8);
			this.player[ogameid]["pointsupdate"]		=	getplayerquery.getInt64			(9);
			this.player[ogameid]["fleetrank"]			=	getplayerquery.getInt32			(10);
			this.player[ogameid]["fleet"]				=	getplayerquery.getInt64			(11);
			this.player[ogameid]["fleetvariation"]		=	getplayerquery.getInt32			(12);
			this.player[ogameid]["fleetupdate"]			=	getplayerquery.getInt64			(13);
			this.player[ogameid]["researchrank"]		=	getplayerquery.getInt32			(14);
			this.player[ogameid]["research"]			=	getplayerquery.getInt32			(15);
			this.player[ogameid]["researchvariation"]	=	getplayerquery.getInt32			(16);
			this.player[ogameid]["researchupdate"]		=	getplayerquery.getInt64			(17);
			returnedplayers[returnedplayers.length]=this.player[ogameid];
		}
		return returnedplayers;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getPlayersByNickname",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.getAlliance=function(id)
{
	try
	{
		var getalliancequery=allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB
			.createStatement(
				"SELECT "
					+"tag, "
					+"members, "
					+"pointsrank, "
					+"points, "
					+"avgpoints, "
					+"pointsvariation, "
					+"pointsupdate, "
					+"fleetrank, "
					+"fleet, "
					+"avgfleet, "
					+"fleetvariation, "
					+"fleetupdate, "
					+"researchrank, "
					+"research, "
					+"avgresearch, "
					+"researchvariation, "
					+"researchupdate "
				+"FROM "
					+"alliances "
				+"WHERE "
					+"id = ?1 "
			);
		getalliancequery.bindInt64Parameter		(0, id);
		if(getalliancequery.executeStep())
		{
			this.alliance[id]=new Array();
			this.alliance[id]["tag"]					=	getalliancequery.getUTF8StringParameter	(0);
			this.alliance[id]["members"]				=	getalliancequery.getInt32				(1);
			this.alliance[id]["pointsrank"]				=	getalliancequery.getInt32				(2);
			this.alliance[id]["points"]					=	getalliancequery.getInt64				(3);
			this.alliance[id]["avgpoints"]				=	getalliancequery.getInt64				(4);
			this.alliance[id]["pointsvariation"]		=	getalliancequery.getInt32				(5);
			this.alliance[id]["pointsupdate"]			=	getalliancequery.getInt64				(6);
			this.alliance[id]["fleetrank"]				=	getalliancequery.getInt32				(7);
			this.alliance[id]["fleet"]					=	getalliancequery.getInt64				(8);
			this.alliance[id]["avgfleet"]				=	getalliancequery.getInt64				(9);
			this.alliance[id]["fleetvariation"]			=	getalliancequery.getInt32				(10);
			this.alliance[id]["fleetupdate"]			=	getalliancequery.getInt64				(11);
			this.alliance[id]["researchrank"]			=	getalliancequery.getInt32				(12);
			this.alliance[id]["research"]				=	getalliancequery.getInt64				(13);
			this.alliance[id]["avgresearch"]			=	getalliancequery.getInt64				(14);
			this.alliance[id]["researchvariation"]		=	getalliancequery.getInt32				(15);
			this.alliance[id]["researchupdate"]			=	getalliancequery.getInt64				(16);
			return this.alliance[id];
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
			"getAlliance",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.getAlliancesBySimilarTag=function(tag)
{
	try
	{
		var getalliancequery=allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB
			.createStatement(
				"SELECT "
					+"id, "
					+"tag, "
					+"members, "
					+"pointsrank, "
					+"points, "
					+"avgpoints, "
					+"pointsvariation, "
					+"pointsupdate, "
					+"fleetrank, "
					+"fleet, "
					+"avgfleet, "
					+"fleetvariation, "
					+"fleetupdate, "
					+"researchrank, "
					+"research, "
					+"avgresearch, "
					+"researchvariation, "
					+"researchupdate "
				+"FROM "
					+"alliances "
				+"WHERE "
					+"tag LIKE ?1 "
				+"ORDER BY "
					+"tag ASC "
			);
		getalliancequery.bindUTF8StringParameter		(0, "%"+tag+"%");
		var returnedalliances=new Array();
		while(getalliancequery.executeStep())
		{
			var id										=	getalliancequery.getInt64				(0);
			this.alliance[id]							=	new Array();
			this.alliance[id]["id"]						=	id;
			this.alliance[id]["tag"]					=	getalliancequery.getUTF8String			(1);
			this.alliance[id]["members"]				=	getalliancequery.getInt32				(2);
			this.alliance[id]["pointsrank"]				=	getalliancequery.getInt32				(3);
			this.alliance[id]["points"]					=	getalliancequery.getInt64				(4);
			this.alliance[id]["avgpoints"]				=	getalliancequery.getInt64				(5);
			this.alliance[id]["pointsvariation"]		=	getalliancequery.getInt32				(6);
			this.alliance[id]["pointsupdate"]			=	getalliancequery.getInt64				(7);
			this.alliance[id]["fleetrank"]				=	getalliancequery.getInt32				(8);
			this.alliance[id]["fleet"]					=	getalliancequery.getInt64				(9);
			this.alliance[id]["avgfleet"]				=	getalliancequery.getInt64				(10);
			this.alliance[id]["fleetvariation"]			=	getalliancequery.getInt32				(11);
			this.alliance[id]["fleetupdate"]			=	getalliancequery.getInt64				(12);
			this.alliance[id]["researchrank"]			=	getalliancequery.getInt32				(13);
			this.alliance[id]["research"]				=	getalliancequery.getInt64				(14);
			this.alliance[id]["avgresearch"]			=	getalliancequery.getInt64				(15);
			this.alliance[id]["researchvariation"]		=	getalliancequery.getInt32				(16);
			this.alliance[id]["researchupdate"]			=	getalliancequery.getInt64				(17);
			returnedalliances[returnedalliances.length]=this.alliance[id];
		}
		return returnedalliances;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getAlliancesBySimilarTag",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.getAllianceByTag=function(tag)
{
	try
	{
		var getalliancequery=allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB
			.createStatement(
				"SELECT "
					+"id, "
					+"tag, "
					+"members, "
					+"pointsrank, "
					+"points, "
					+"avgpoints, "
					+"pointsvariation, "
					+"pointsupdate, "
					+"fleetrank, "
					+"fleet, "
					+"avgfleet, "
					+"fleetvariation, "
					+"fleetupdate, "
					+"researchrank, "
					+"research, "
					+"avgresearch, "
					+"researchvariation, "
					+"researchupdate "
				+"FROM "
					+"alliances "
				+"WHERE "
					+"tag =?1 "
				+"ORDER BY "
					+"pointsupdate DESC, "
					+"fleetupdate DESC, "
					+"researchupdate DESC, "
					+"tag ASC "
				+"LIMIT "
					+"0, "
					+"1 "
			);
		getalliancequery.bindUTF8StringParameter		(0, tag);
		var returnedalliances=new Array();
		while(getalliancequery.executeStep())
		{
			var id										=	getalliancequery.getInt64				(0);
			this.alliance[id]							=	new Array();
			this.alliance[id]["id"]						=	id;
			this.alliance[id]["tag"]					=	getalliancequery.getUTF8String			(1);
			this.alliance[id]["members"]				=	getalliancequery.getInt32				(2);
			this.alliance[id]["pointsrank"]				=	getalliancequery.getInt32				(3);
			this.alliance[id]["points"]					=	getalliancequery.getInt64				(4);
			this.alliance[id]["avgpoints"]				=	getalliancequery.getInt64				(5);
			this.alliance[id]["pointsvariation"]		=	getalliancequery.getInt32				(6);
			this.alliance[id]["pointsupdate"]			=	getalliancequery.getInt64				(7);
			this.alliance[id]["fleetrank"]				=	getalliancequery.getInt32				(8);
			this.alliance[id]["fleet"]					=	getalliancequery.getInt64				(9);
			this.alliance[id]["avgfleet"]				=	getalliancequery.getInt64				(10);
			this.alliance[id]["fleetvariation"]			=	getalliancequery.getInt32				(11);
			this.alliance[id]["fleetupdate"]			=	getalliancequery.getInt64				(12);
			this.alliance[id]["researchrank"]			=	getalliancequery.getInt32				(13);
			this.alliance[id]["research"]				=	getalliancequery.getInt64				(14);
			this.alliance[id]["avgresearch"]			=	getalliancequery.getInt64				(15);
			this.alliance[id]["researchvariation"]		=	getalliancequery.getInt32				(16);
			this.alliance[id]["researchupdate"]			=	getalliancequery.getInt64				(17);
			returnedalliances[returnedalliances.length]=this.alliance[id];
		}
		return returnedalliances;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getAllianceByTag",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.getPlayerNotes=function(ogameid)
{
	try
	{
		var getnotequery	=	allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB.createStatement(
			"SELECT "
				+"added, "
				+"updated, "
				+"note "
			+"FROM "
				+"player_notes "
			+"WHERE "
				+"ogameid = ?1 "
			+"ORDER BY "
				+"updated ASC "
		);
		getnotequery.bindInt32Parameter			(0, ogameid);
		var i=0;
		this.playernotes[ogameid]=new Array();
		while(getnotequery.executeStep())
		{
			this.playernotes[ogameid][i]={
				"added":	getnotequery.getInt64		(0),
				"updated":	getnotequery.getInt64		(1),
				"note":		getnotequery.getUTF8String	(2)
			};
			i++;
		}
		return this.playernotes[ogameid];
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getPlayerNotes",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.addPlayerNote=function(ogameid,value)
{
	try
	{
		this.getPlayerNotes(ogameid);
		var servertimestamp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
		this.playernotes[ogameid][this.playernotes[ogameid].length]={
			"added":	servertimestamp,
			"updated":	servertimestamp,
			"note":		value
		}
		var setnotequery	=	allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB.createStatement(
			"INSERT INTO "
				+"player_notes "
					+"( "
						+"ogameid, "
						+"added, "
						+"updated, "
						+"note "
					+") "
					+"VALUES "
					+"( "
						+"?1, "
						+"?2, "
						+"?3, "
						+"?4 "
					+") "
		);
		setnotequery.bindInt32Parameter			(0, ogameid);
		setnotequery.bindInt64Parameter			(1, servertimestamp);
		setnotequery.bindInt64Parameter			(2, servertimestamp);
		setnotequery.bindUTF8StringParameter	(3, value);
		setnotequery.execute();
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"addPlayerNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.updPlayerNote=function(ogameid,id,value)
{
	try
	{
		var note=this.getPlayerNotes(ogameid);
		var added=note[id]["added"];
		var updated=note[id]["updated"];
		var updatenotequery	=	allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB.createStatement(
			"UPDATE "
				+"player_notes "
			+"SET "
				+"updated = ?1, "
				+"note = ?2 "
			+"WHERE "
				+"ogameid = ?3 "
				+"AND "
				+"added = ?4 "
				+"AND "
				+"updated = ?5 "
		);
		updatenotequery.bindInt32Parameter			(2, ogameid);
		updatenotequery.bindInt64Parameter			(3, added);
		updatenotequery.bindInt64Parameter			(4, updated);
		updatenotequery.bindInt64Parameter			(0, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
		updatenotequery.bindUTF8StringParameter		(1, value);
		updatenotequery.execute();
		this.getPlayerNotes(ogameid);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"updPlayerNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.delPlayerNote=function(ogameid,id)
{
	try
	{
		var note=this.getPlayerNotes(ogameid);
		var added=note[id]["added"];
		var updated=note[id]["updated"];
		var delnotequery	=	allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB.createStatement(
			"DELETE FROM "
				+"player_notes "
			+"WHERE "
				+"ogameid = ?1 "
				+"AND "
				+"added = ?2 "
				+"AND "
				+"updated = ?3 "
		);
		delnotequery.bindInt32Parameter			(0, ogameid);
		delnotequery.bindInt64Parameter			(1, added);
		delnotequery.bindInt64Parameter			(2, updated);
		delnotequery.execute();
		this.getPlayerNotes(ogameid);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"delPlayerNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.getAllianceNotes=function(id)
{
	try
	{
		var getnotequery	=	allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB.createStatement(
			"SELECT "
				+"added, "
				+"updated, "
				+"note "
			+"FROM "
				+"alliance_notes "
			+"WHERE "
				+"allyid = ?1 "
			+"ORDER BY "
				+"updated ASC "
		);
		getnotequery.bindInt64Parameter			(0, id);
		var i=0;
		this.alliancenotes[id]=new Array();
		while(getnotequery.executeStep())
		{
			this.alliancenotes[id][i]={
				"added":	getnotequery.getInt64		(0),
				"updated":	getnotequery.getInt64		(1),
				"note":		getnotequery.getUTF8String	(2)
			};
			i++;
		}
		return this.alliancenotes[id];
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getAllianceNotes",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.addAllianceNote=function(id,value)
{
	try
	{
		this.getAllianceNotes(id);
		var servertimestamp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
		this.alliancenotes[id][this.alliancenotes[id].length]={
			"added":	servertimestamp,
			"updated":	servertimestamp,
			"note":		value
		}
		var setnotequery	=	allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB.createStatement(
			"INSERT INTO "
				+"alliance_notes "
					+"( "
						+"allyid, "
						+"added, "
						+"updated, "
						+"note "
					+") "
					+"VALUES "
					+"( "
						+"?1, "
						+"?2, "
						+"?3, "
						+"?4 "
					+") "
		);
		setnotequery.bindInt64Parameter			(0, id);
		setnotequery.bindInt64Parameter			(1, servertimestamp);
		setnotequery.bindInt64Parameter			(2, servertimestamp);
		setnotequery.bindUTF8StringParameter	(3, value);
		setnotequery.execute();
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"addAllianceNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.updAllianceNote=function(allyid,id,value)
{
	try
	{
		var note=this.getAllianceNotes(allyid);
		var added=note[id]["added"];
		var updated=note[id]["updated"];
		var updatenotequery	=	allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB.createStatement(
			"UPDATE "
				+"alliance_notes "
			+"SET "
				+"updated = ?1, "
				+"note = ?2 "
			+"WHERE "
				+"allyid = ?3 "
				+"AND "
				+"added = ?4 "
				+"AND "
				+"updated = ?5 "
		);
		updatenotequery.bindInt64Parameter			(2, allyid);
		updatenotequery.bindInt64Parameter			(3, added);
		updatenotequery.bindInt64Parameter			(4, updated);
		updatenotequery.bindInt64Parameter			(0, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
		updatenotequery.bindUTF8StringParameter		(1, value);
		updatenotequery.execute();
		this.getAllianceNotes(allyid);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"updAllianceNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.delAllianceNote=function(allyid,id)
{
	try
	{
		var note=this.getAllianceNotes(allyid);
		var added=note[id]["added"];
		var updated=note[id]["updated"];
		var delnotequery	=	allaccounts.
			accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
			.AccountDB.createStatement(
			"DELETE FROM "
				+"alliance_notes "
			+"WHERE "
				+"allyid = ?1 "
				+"AND "
				+"added = ?2 "
				+"AND "
				+"updated = ?3 "
		);
		delnotequery.bindInt64Parameter			(0, allyid);
		delnotequery.bindInt64Parameter			(1, added);
		delnotequery.bindInt64Parameter			(2, updated);
		delnotequery.execute();
		this.getAllianceNotes(allyid);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"delAllianceNote",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.setPlayer=function(
	ogameid,
	nickname,
	allyid,
	x,
	y,
	z,
	pointsrank,
	points,
	pointsvariation,
	pointsupdate,
	fleetrank,
	fleet,
	fleetvariation,
	fleetupdate,
	researchrank,
	research,
	researchvariation,
	researchupdate
)
{
	try
	{
		if
		(
			(ogameid>0)
			&&(nickname.length>0)
		)
		{
			if(!this.player[ogameid])
			{
				var insertnewplayerquery=allaccounts.
					accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
					.AccountDB
					.createStatement(
					"INSERT INTO "
						+"players "
							+"( "
								+"ogameid "
							+") "
							+"VALUES "
							+"( "
								+"?1 "
							+") "
					);
				this.player[ogameid]=new Array();
				insertnewplayerquery.bindInt32Parameter(0, ogameid);
				//insertnewplayerquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewplayerquery);
			}
			if(pointsrank>0)
			{
				var updateplayerpointsquery=allaccounts.
					accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
					.AccountDB
					.createStatement(
						"UPDATE "
							+"players "
						+"SET "
							+"nickname = ?1, "
							+"allyid = ?2, "
							+"x = ?3, "
							+"y = ?4, "
							+"z = ?5, "
							+"pointsrank = ?6, "
							+"points = ?7, "
							+"pointsvariation = ?8, "
							+"pointsupdate = ?9 "
						+"WHERE "
							+"ogameid = ?10 "
					);
				updateplayerpointsquery.bindUTF8StringParameter	(0, nickname);
				updateplayerpointsquery.bindInt64Parameter		(1, allyid);
				updateplayerpointsquery.bindInt32Parameter		(2, x);
				updateplayerpointsquery.bindInt32Parameter		(3, y);
				updateplayerpointsquery.bindInt32Parameter		(4, z);
				updateplayerpointsquery.bindInt32Parameter		(5, pointsrank);
				updateplayerpointsquery.bindInt32Parameter		(6, points);
				updateplayerpointsquery.bindInt32Parameter		(7, pointsvariation);
				updateplayerpointsquery.bindInt64Parameter		(8, pointsupdate);
				updateplayerpointsquery.bindInt32Parameter		(9, ogameid);
				//updateplayerpointsquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerpointsquery);
			}
			if(fleetrank>0)
			{
				var updateplayerfleetquery=allaccounts.
					accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
					.AccountDB
					.createStatement(
						"UPDATE "
							+"players "
						+"SET "
							+"nickname = ?1, "
							+"allyid = ?2, "
							+"x = ?3, "
							+"y = ?4, "
							+"z = ?5, "
							+"fleetrank = ?6, "
							+"fleet = ?7, "
							+"fleetvariation = ?8, "
							+"fleetupdate = ?9 "
						+"WHERE "
							+"ogameid = ?10 "
					);
				updateplayerfleetquery.bindUTF8StringParameter	(0, nickname);
				updateplayerfleetquery.bindInt64Parameter		(1, allyid);
				updateplayerfleetquery.bindInt32Parameter		(2, x);
				updateplayerfleetquery.bindInt32Parameter		(3, y);
				updateplayerfleetquery.bindInt32Parameter		(4, z);
				updateplayerfleetquery.bindInt32Parameter		(5, pointsrank);
				updateplayerfleetquery.bindInt32Parameter		(6, points);
				updateplayerfleetquery.bindInt32Parameter		(7, pointsvariation);
				updateplayerfleetquery.bindInt64Parameter		(8, pointsupdate);
				updateplayerfleetquery.bindInt32Parameter		(9, ogameid);
				//updateplayerfleetquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerfleetquery);
			}
			if(researchrank>0)
			{
				var updateplayerresearchquery=allaccounts.
					accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
					.AccountDB
					.createStatement(
						"UPDATE "
							+"players "
						+"SET "
							+"nickname = ?1, "
							+"allyid = ?2, "
							+"x = ?3, "
							+"y = ?4, "
							+"z = ?5, "
							+"researchrank = ?6, "
							+"research = ?7, "
							+"researchvariation = ?8, "
							+"researchupdate = ?9 "
						+"WHERE "
							+"ogameid = ?10 "
					);
				updateplayerresearchquery.bindUTF8StringParameter	(0, nickname);
				updateplayerresearchquery.bindInt64Parameter		(1, allyid);
				updateplayerresearchquery.bindInt32Parameter		(2, x);
				updateplayerresearchquery.bindInt32Parameter		(3, y);
				updateplayerresearchquery.bindInt32Parameter		(4, z);
				updateplayerresearchquery.bindInt32Parameter		(5, pointsrank);
				updateplayerresearchquery.bindInt32Parameter		(6, points);
				updateplayerresearchquery.bindInt32Parameter		(7, pointsvariation);
				updateplayerresearchquery.bindInt64Parameter		(8, pointsupdate);
				updateplayerresearchquery.bindInt32Parameter		(9, ogameid);
				//updateplayerresearchquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerresearchquery);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlayer",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.setPlayersFromGalaxy=function(players)
{
	try
	{
		for(var i in players)
		{
			if
			(
				(players[i].ogameid>0)
				&&(players[i].nickname.length>0)
			)
			{
				if(players[i].loginactive)
				{
					players[i].inactive=2;
				}
				if(players[i].noob)
				{
					players[i].protection=1;
				}
				else if(players[i].strong)
				{
					players[i].protection=2;
				}
				else
				{
					players[i].protection=0;
				}
				if(!this.player[players[i].ogameid])
				{
					var insertnewplayerquery=allaccounts.
						accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
						.AccountDB
						.createStatement(
						"INSERT INTO "
							+"players "
								+"( "
									+"ogameid "
								+") "
								+"VALUES "
								+"( "
									+"?1 "
								+") "
						);
					this.player[players[i].ogameid]=new Array();
					insertnewplayerquery.bindInt32Parameter(0, players[i].ogameid);
					//insertnewplayerquery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewplayerquery);
				}
				if
				(
					players[i].rank>0
					&& players[i].nickname!=0
				)
				{
					var updateplayerpointsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"players "
						+"SET "
							+"nickname = ?1, "
							+"allyid = ?2, "
							+"pointsrank = ?3, "
							+"vacation = ?4, "
							+"inactive = ?5, "
							+"banned = ?6, "
							+"protection = ?7, "
							+"statusupdate = ?8 "
						+"WHERE "
							+"ogameid = ?9 "
					);
					this.player[players[i].ogameid]["nickname"]		=	players[i].nickname;
					this.player[players[i].ogameid]["allyid"]		=	players[i].allyid;
					this.player[players[i].ogameid]["pointsrank"]	=	players[i].rank;
					this.player[players[i].ogameid]["vacation"]		=	players[i].vacation;
					this.player[players[i].ogameid]["inactive"]		=	players[i].inactive;
					this.player[players[i].ogameid]["banned"]		=	players[i].banned;
					this.player[players[i].ogameid]["protection"]	=	players[i].protection;
					this.player[players[i].ogameid]["statusupdate"]	=	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
					updateplayerpointsquery.bindUTF8StringParameter	(0, players[i].nickname);
					updateplayerpointsquery.bindInt64Parameter		(1, players[i].allyid);
					updateplayerpointsquery.bindInt32Parameter		(2, players[i].rank);
					updateplayerpointsquery.bindInt32Parameter		(3, players[i].vacation);
					updateplayerpointsquery.bindInt32Parameter		(4, players[i].inactive);
					updateplayerpointsquery.bindInt32Parameter		(5, players[i].banned);
					updateplayerpointsquery.bindInt32Parameter		(6, players[i].protection);
					updateplayerpointsquery.bindInt64Parameter		(7, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
					updateplayerpointsquery.bindInt32Parameter		(8, players[i].ogameid);
					//updateplayerpointsquery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerpointsquery);
				}
				else if
				(
					!players[i].nickname
					&& players[i].rank>0
				)
				{
					var updateplayerpointsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"players "
						+"SET "
							+"allyid = ?1, "
							+"pointsrank = ?2, "
							+"vacation = ?3, "
							+"inactive = ?4, "
							+"banned = ?5, "
							+"protection = ?6, "
							+"statusupdate = ?7 "
						+"WHERE "
							+"ogameid = ?8 "
					);
					this.player[players[i].ogameid]["allyid"]		=	players[i].allyid;
					this.player[players[i].ogameid]["pointsrank"]	=	players[i].rank;
					this.player[players[i].ogameid]["vacation"]		=	players[i].vacation;
					this.player[players[i].ogameid]["inactive"]		=	players[i].inactive;
					this.player[players[i].ogameid]["banned"]		=	players[i].banned;
					this.player[players[i].ogameid]["protection"]	=	players[i].protection;
					this.player[players[i].ogameid]["statusupdate"]	=	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
					updateplayerpointsquery.bindInt64Parameter		(0, players[i].allyid);
					updateplayerpointsquery.bindInt32Parameter		(1, players[i].rank);
					updateplayerpointsquery.bindInt32Parameter		(2, players[i].vacation);
					updateplayerpointsquery.bindInt32Parameter		(3, players[i].inactive);
					updateplayerpointsquery.bindInt32Parameter		(4, players[i].banned);
					updateplayerpointsquery.bindInt32Parameter		(5, players[i].protection);
					updateplayerpointsquery.bindInt64Parameter		(6, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
					updateplayerpointsquery.bindInt32Parameter		(7, players[i].ogameid);
					//updateplayerpointsquery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerpointsquery);
				}
				else if(!players[i].nickname)
				{
					var updateplayerpointsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"players "
						+"SET "
							+"allyid = ?1, "
							+"vacation = ?2, "
							+"inactive = ?3, "
							+"banned = ?4, "
							+"protection = ?5, "
							+"statusupdate = ?6 "
						+"WHERE "
							+"ogameid = ?7 "
					);
					this.player[players[i].ogameid]["allyid"]		=	players[i].allyid;
					this.player[players[i].ogameid]["vacation"]		=	players[i].vacation;
					this.player[players[i].ogameid]["inactive"]		=	players[i].inactive;
					this.player[players[i].ogameid]["banned"]		=	players[i].banned;
					this.player[players[i].ogameid]["protection"]	=	players[i].protection;
					this.player[players[i].ogameid]["statusupdate"]	=	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
					updateplayerpointsquery.bindInt64Parameter		(0, players[i].allyid);
					updateplayerpointsquery.bindInt32Parameter		(1, players[i].vacation);
					updateplayerpointsquery.bindInt32Parameter		(2, players[i].inactive);
					updateplayerpointsquery.bindInt32Parameter		(3, players[i].banned);
					updateplayerpointsquery.bindInt32Parameter		(4, players[i].protection);
					updateplayerpointsquery.bindInt64Parameter		(5, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
					updateplayerpointsquery.bindInt32Parameter		(6, players[i].ogameid);
					//updateplayerpointsquery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerpointsquery);
				}
				else
				{
					var updateplayerpointsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"players "
						+"SET "
							+"nickname = ?1, "
							+"allyid = ?2, "
							+"vacation = ?3, "
							+"inactive = ?4, "
							+"banned = ?5, "
							+"protection = ?6, "
							+"statusupdate = ?7 "
						+"WHERE "
							+"ogameid = ?8 "
					);
					this.player[players[i].ogameid]["nickname"]		=	players[i].nickname;
					this.player[players[i].ogameid]["allyid"]		=	players[i].allyid;
					this.player[players[i].ogameid]["vacation"]		=	players[i].vacation;
					this.player[players[i].ogameid]["inactive"]		=	players[i].inactive;
					this.player[players[i].ogameid]["banned"]		=	players[i].banned;
					this.player[players[i].ogameid]["protection"]	=	players[i].protection;
					this.player[players[i].ogameid]["statusupdate"]	=	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
					updateplayerpointsquery.bindUTF8StringParameter	(0, players[i].nickname);
					updateplayerpointsquery.bindInt64Parameter		(1, players[i].allyid);
					updateplayerpointsquery.bindInt32Parameter		(2, players[i].vacation);
					updateplayerpointsquery.bindInt32Parameter		(3, players[i].inactive);
					updateplayerpointsquery.bindInt32Parameter		(4, players[i].banned);
					updateplayerpointsquery.bindInt32Parameter		(5, players[i].protection);
					updateplayerpointsquery.bindInt64Parameter		(6, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
					updateplayerpointsquery.bindInt32Parameter		(7, players[i].ogameid);
					//updateplayerpointsquery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerpointsquery);
				}
			}
			else
			{
				players[i].ogameid=this.ogameid
				players[i].inactive=0;
				players[i].protection=0;
				if(!this.player[players[i].ogameid])
				{
					var insertnewplayerquery=allaccounts.
						accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
						.AccountDB
						.createStatement(
						"INSERT INTO "
							+"players "
								+"( "
									+"ogameid "
								+") "
								+"VALUES "
								+"( "
									+"?1 "
								+") "
						);
					this.player[players[i].ogameid]=new Array();
					insertnewplayerquery.bindInt32Parameter(0, players[i].ogameid);
					//insertnewplayerquery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewplayerquery);
				}
				var updateplayerpointsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
				(
					"UPDATE "
						+"players "
					+"SET "
						+"vacation = ?1, "
						+"inactive = ?2, "
						+"banned = ?3, "
						+"protection = ?4, "
						+"allyid = ?5, "
						+"statusupdate = ?6 "
					+"WHERE "
						+"ogameid = ?7 "
				);
				this.player[players[i].ogameid]["vacation"]		=	players[i].vacation;
				this.player[players[i].ogameid]["inactive"]		=	players[i].inactive;
				this.player[players[i].ogameid]["banned"]		=	players[i].banned;
				this.player[players[i].ogameid]["protection"]	=	players[i].protection;
				this.player[players[i].ogameid]["allyid"]		=	players[i].allyid;
				this.player[players[i].ogameid]["statusupdate"]	=	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				updateplayerpointsquery.bindInt32Parameter		(0, players[i].vacation);
				updateplayerpointsquery.bindInt32Parameter		(1, players[i].inactive);
				updateplayerpointsquery.bindInt32Parameter		(2, players[i].banned);
				updateplayerpointsquery.bindInt32Parameter		(3, players[i].protection);
				updateplayerpointsquery.bindInt32Parameter		(4, players[i].allyid);
				updateplayerpointsquery.bindInt64Parameter		(5, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
				updateplayerpointsquery.bindInt32Parameter		(6, players[i].ogameid);
				//updateplayerpointsquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerpointsquery);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlayerFromGalaxy",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.setAlliancesFromTag=function(alliances)
{
	try
	{
		for(var i in alliances)
		{
			if
			(
				alliances[i].allytag.length>0
				&& alliances[i].allyid!=0
			)
			{
				if(typeof this.alliance[alliances[i].allyid]=="undefined")
				{
					var insertnewalliancequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"INSERT INTO "
							+"alliances "
								+"( "
									+"id "
								+") "
								+"VALUES "
								+"( "
									+"?1 "
								+") "
					);
					this.alliance[alliances[i].allyid]=new Array();
					insertnewalliancequery.bindInt64Parameter(0, alliances[i].allyid);
					//insertnewalliancequery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewalliancequery);
				}
				if(alliances[i].allyrank>0)
				{
					var updatealliancepointsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"alliances "
						+"SET "
							+"tag = ?1, "
							+"members = ?2, "
							+"pointsrank = ?3 "
						+"WHERE "
							+"id = ?4 "
					);
					this.alliance[alliances[i].allyid]["members"]		=alliances[i].allymembers;
					this.alliance[alliances[i].allyid]["pointsrank"]	=alliances[i].allyrank;
					updatealliancepointsquery.bindUTF8StringParameter	(0, alliances[i].allytag);
					updatealliancepointsquery.bindInt64Parameter		(3, alliances[i].allyid);
					updatealliancepointsquery.bindInt32Parameter		(1, alliances[i].allymembers);
					updatealliancepointsquery.bindInt64Parameter		(2, alliances[i].allyrank);
					//updatealliancepointsquery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatealliancepointsquery);
				}
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setAllianceFromGalaxy",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.setPlayerFromNickname=function(
	nickname,
	ogameid,
	rank,
	points
)
{
	try
	{
		if
		(
			(ogameid>0)
			&&(nickname.length>0)
		)
		{
			if(!this.player[ogameid])
			{
				var insertnewplayerquery=allaccounts.
					accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
					.AccountDB
					.createStatement(
					"INSERT INTO "
						+"players "
							+"( "
								+"ogameid "
							+") "
							+"VALUES "
							+"( "
								+"?1 "
							+") "
					);
				this.player[ogameid]=new Array();
				insertnewplayerquery.bindInt32Parameter(0, ogameid);
				//insertnewplayerquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewplayerquery);
			}
			if(rank>0)
			{
				var updateplayerpointsquery=allaccounts.
					accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]]
					.AccountDB
					.createStatement(
						"UPDATE "
							+"players "
						+"SET "
							+"nickname = ?1, "
							+"pointsrank = ?2, "
							+"points = ?3, "
							+"pointsupdate = ?4 "
						+"WHERE "
							+"ogameid = ?5 "
					);
				updateplayerpointsquery.bindUTF8StringParameter	(0, nickname);
				updateplayerpointsquery.bindInt32Parameter		(1, rank);
				updateplayerpointsquery.bindInt64Parameter		(2, points);
				updateplayerpointsquery.bindInt64Parameter		(3, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
				updateplayerpointsquery.bindInt32Parameter		(4, ogameid);
				//updateplayerpointsquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerpointsquery);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlayerFromOverview",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.setPlayersFromStatistics=function(players)
{
	try
	{
		//alert(players.ranks);
		switch(players.ranktype)
		{
			case 0:
				var type="points";
			break;
			case 1:
				var type="fleet";
			break;
			case 2:
				var type="research";
			break;
			default:
				var type="";
			break;
		}
		var rankgroup=Math.floor(players.ranks[0].position/100);
		var insertnewplayerrankupdatesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
		(
			//INSERT OR UPDATE???
			"INSERT OR IGNORE INTO "
				+"stogalaxy_player_rankupdates "
					+"( "
						+"rankgroup, "
						+type+"_update_timestamp "
					+") "
					+"VALUES "
					+"( "
						+"?1, "
						+"?2 "
					+") "
		);
		insertnewplayerrankupdatesquery.bindInt32Parameter(0,rankgroup);
		insertnewplayerrankupdatesquery.bindInt64Parameter(1,0);
		//insertnewplayerrankupdatesquery.execute();
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewplayerrankupdatesquery);
		var alliances=new Array();
		for(var i in players.ranks)
		{
			alliances[players.ranks[i].allyid]=players.ranks[i].allytag;
			if(players.ranks[i].ogameid>90000)
			{
				this.player[players.ranks[i].ogameid]=new Array();
				var insertnewplayerquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
				(
					"INSERT INTO "
						+"players "
						+"( "
							+"ogameid "
						+") "
						+"VALUES "
						+"( "
							+"?1 "
						+") "
				);
				insertnewplayerquery.bindInt32Parameter(0,players.ranks[i].ogameid);
				//insertnewplayerquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewplayerquery);
				if
				(
					players.ranks[i].x>0
					&& players.ranks[i].y>0
					&& players.ranks[i].z>0
				)
				{
					var updateplayerranksquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"players "
						+"SET "
							+"nickname = ?1, "
							+"allyid = ?2, "
							+"x = ?3, "
							+"y = ?4, "
							+"z = ?5, "
							+type+"rank = ?6, "
							+type+" = ?7, "
							+type+"variation = ?8, "
							+type+"update = ?9 "
						+"WHERE "
							+"ogameid = ?10 "
					);
					updateplayerranksquery.bindUTF8StringParameter	(0, players.ranks[i].name);
					updateplayerranksquery.bindInt64Parameter		(1, players.ranks[i].allyid);
					updateplayerranksquery.bindInt32Parameter		(2, players.ranks[i].x);
					updateplayerranksquery.bindInt32Parameter		(3, players.ranks[i].y);
					updateplayerranksquery.bindInt32Parameter		(4, players.ranks[i].z);
					updateplayerranksquery.bindInt32Parameter		(5, players.ranks[i].position);
					updateplayerranksquery.bindInt32Parameter		(6, players.ranks[i].score);
					updateplayerranksquery.bindInt32Parameter		(7, players.ranks[i].variation);
					updateplayerranksquery.bindInt64Parameter		(8, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
					updateplayerranksquery.bindInt32Parameter		(9, players.ranks[i].ogameid);
					//updateplayerranksquery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerranksquery);
				}
				else
				{
					var updateplayerranksquery_nocoords=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"players "
						+"SET "
							+"nickname = ?1, "
							+"allyid = ?2, "
							+type+"rank = ?3, "
							+type+" = ?4, "
							+type+"variation = ?5, "
							+type+"update = ?6 "
						+"WHERE "
							+"ogameid = ?7 "
					);
					updateplayerranksquery_nocoords.bindUTF8StringParameter	(0, players.ranks[i].name);
					updateplayerranksquery_nocoords.bindInt64Parameter		(1, players.ranks[i].allyid);
					updateplayerranksquery_nocoords.bindInt32Parameter		(2, players.ranks[i].position);
					updateplayerranksquery_nocoords.bindInt32Parameter		(3, players.ranks[i].score);
					updateplayerranksquery_nocoords.bindInt32Parameter		(4, players.ranks[i].variation);
					updateplayerranksquery_nocoords.bindInt64Parameter		(5, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
					updateplayerranksquery_nocoords.bindInt32Parameter		(6, players.ranks[i].ogameid);
					//updateplayerranksquery_nocoords.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplayerranksquery_nocoords);
				}
			}
		}
		this.setAlliancesFromTags(alliances);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlayersFromStatistics",
			"see_how_to_retrieve_html",
			players.ranktype+"\n\n"+players.ranks.join("\n")
		)
	}
}

Ranks.prototype.setAlliancesFromTags=function(alliances)
{
	try
	{
		for(var i in alliances)
		{
			if
			(
				i!=0
				&& alliances[i].length>=3
			)
			{
				var insertnewalliancequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
				(
					"INSERT INTO "
						+"alliances "
						+"( "
							+"id, "
							+"tag "
						+") "
						+"VALUES "
						+"( "
							+"?1, "
							+"?2 "
						+") "
				);
				insertnewalliancequery.bindInt64Parameter		(0, i);
				insertnewalliancequery.bindUTF8StringParameter	(1, alliances[i]);
				//insertnewalliancequery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewalliancequery);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setAlliancesFromStatistics",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.setAlliancesFromStatistics=function(alliances)
{
	try
	{
		switch(alliances.ranktype)
		{
			case 0:
				var type="points";
			break;
			case 1:
				var type="fleet";
			break;
			case 2:
				var type="research";
			break;
			default:
				var type="";
			break;
		}
		var rankgroup=Math.floor(alliances.ranks[0].position/100);
		if(alliances.sort_per_member)
		{
			for(var i in alliances.ranks)
			{
				if
				(
					typeof this.alliance[alliances.ranks[i].allyid]=="undefined"
					&& alliances.ranks[i].allyid!=0
				)
				{
					var insertnewalliancequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"INSERT OR IGNORE INTO "
							+"alliances "
							+"( "
								+"id "
							+") "
							+"VALUES "
							+"( "
								+"?1 "
							+") "
					);
					this.alliance[alliances.ranks[i].allyid]=new Array();
					insertnewalliancequery.bindInt64Parameter(0, alliances.ranks[i].allyid);
					//insertnewalliancequery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewalliancequery);
				}
				if
				(
					alliances.ranks[i].allytag.length>=3
					&& alliances.ranks[i].allyid!=0
				)
				{
					var updatealliancequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"alliances "
						+"SET "
							+"tag = ?1, "
							+"members = ?2, "
							+type+" = ?3, "
							+"avg"+type+" = ?4, "
							+type+"variation = ?5 "
						+"WHERE "
							+"id = ?6 "
					);
					this.alliance[alliances.ranks[i].allyid]["tag"]				=	alliances.ranks[i].allytag;
					this.alliance[alliances.ranks[i].allyid]["members"]			=	alliances.ranks[i].members;
					this.alliance[alliances.ranks[i].allyid][type]				=	alliances.ranks[i].score;
					this.alliance[alliances.ranks[i].allyid]["avg"+type]		=	alliances.ranks[i].avgscore;
					this.alliance[alliances.ranks[i].allyid][type+"variation"]	=	alliances.ranks[i].variation;
					updatealliancequery.bindUTF8StringParameter	(0, alliances.ranks[i].allytag);
					updatealliancequery.bindInt64Parameter		(1, alliances.ranks[i].members);
					updatealliancequery.bindInt64Parameter		(2, alliances.ranks[i].score);
					updatealliancequery.bindInt64Parameter		(3, alliances.ranks[i].avgscore);
					updatealliancequery.bindInt64Parameter		(4, alliances.ranks[i].variation);
					updatealliancequery.bindInt64Parameter		(5, alliances.ranks[i].allyid);
					//updatealliancequery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatealliancequery);
				}
			}
		}
		else
		{
			var insertnewalliancerankupdatesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
			(
				"INSERT OR IGNORE INTO "
					+"stogalaxy_alliance_rankupdates "
						+"( "
							+"rankgroup, "
							+type+"_update_timestamp "
						+") "
						+"VALUES "
						+"( "
							+"?1, "
							+"?2 "
						+") "
			);
			insertnewalliancerankupdatesquery.bindInt32Parameter(0,rankgroup);
			insertnewalliancerankupdatesquery.bindInt64Parameter(1,0);
			//insertnewalliancerankupdatesquery.execute();
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewalliancerankupdatesquery);
			for(var i in alliances.ranks)
			{
				if
				(
					typeof this.alliance[alliances.ranks[i].allyid]=="undefined"
					&& alliances.ranks[i].allyid!=0
				)
				{
					var insertnewalliancequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"INSERT OR IGNORE INTO "
							+"alliances "
							+"( "
								+"id "
							+") "
							+"VALUES "
							+"( "
								+"?1 "
							+") "
					);
					this.alliance[alliances.ranks[i].allyid]=new Array();
					insertnewalliancequery.bindInt64Parameter(0, alliances.ranks[i].allyid);
					//insertnewalliancequery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertnewalliancequery);
				}
				if
				(
					alliances.ranks[i].position>0
					&& alliances.ranks[i].allytag.length>=3
					&& alliances.ranks[i].allyid!=0
				)
				{
					var updatealliancequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
					(
						"UPDATE "
							+"alliances "
						+"SET "
							+"tag = ?1, "
							+"members = ?2, "
							+type+" = ?3, "
							+type+"rank = ?4, "
							+"avg"+type+" = ?5, "
							+type+"variation = ?6, "
							+type+"update = ?7 "
						+"WHERE "
							+"id = ?8 "
					);
					this.alliance[alliances.ranks[i].allyid]["tag"]				=	alliances.ranks[i].allytag;
					this.alliance[alliances.ranks[i].allyid]["members"]			=	alliances.ranks[i].members;
					this.alliance[alliances.ranks[i].allyid][type+"rank"]		=	alliances.ranks[i].position;
					this.alliance[alliances.ranks[i].allyid][type]				=	alliances.ranks[i].score;
					this.alliance[alliances.ranks[i].allyid]["avg"+type]		=	alliances.ranks[i].avgscore;
					this.alliance[alliances.ranks[i].allyid][type+"variation"]	=	alliances.ranks[i].variation;
					this.alliance[alliances.ranks[i].allyid][type+"update"]		=	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
					updatealliancequery.bindUTF8StringParameter	(0, alliances.ranks[i].allytag);
					updatealliancequery.bindInt64Parameter		(1, alliances.ranks[i].members);
					updatealliancequery.bindInt32Parameter		(2, alliances.ranks[i].score);
					updatealliancequery.bindInt64Parameter		(3, alliances.ranks[i].position);
					updatealliancequery.bindInt64Parameter		(4, alliances.ranks[i].avgscore);
					updatealliancequery.bindInt64Parameter		(5, alliances.ranks[i].variation);
					updatealliancequery.bindInt64Parameter		(6, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
					updatealliancequery.bindInt64Parameter		(7, alliances.ranks[i].allyid);
					//updatealliancequery.execute();
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updatealliancequery);
				}
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setAlliancesFromStatistics",
			"see_how_to_retrieve_html",
			alliances.ranktype+"\n\n"+alliances.ranks.join("\n")
		)
	}
}

Ranks.prototype.getAlliances=function(filter)
{
	try
	{
		var fields=[
			"id",
			"members",
			"pointsrank",
			"points",
			"avgpoints",
			"pointsvariation",
			"pointsupdate",
			"fleetrank",
			"fleet",
			"avgfleet",
			"fleetvariation",
			"fleetupdate",
			"researchrank",
			"research",
			"avgresearch",
			"researchvariation",
			"researchupdate"
		];
		var searchstring="SELECT "
							+"id, "
							+"tag, "
							+"members, "
							+"pointsrank, "
							+"points, "
							+"avgpoints, "
							+"pointsvariation, "
							+"pointsupdate, "
							+"fleetrank, "
							+"fleet, "
							+"avgfleet, "
							+"fleetvariation, "
							+"fleetupdate, "
							+"researchrank, "
							+"research, "
							+"avgresearch, "
							+"researchvariation, "
							+"researchupdate "
						+"FROM "
							+"alliances "
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
		if(typeof filter["tag"]!="undefined")
		{
			searchstring+=" AND tag LIKE '%"+filter["tag"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY id ASC";
		var returnedalliances=[];
		var getalliancesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getalliancesquery.executeStep())
		{
			returnedalliances.push
			(
				{
					"id":					getalliancesquery.getInt64(0),
					"tag":					getalliancesquery.getUTF8String(1),
					"members":				getalliancesquery.getInt64(2),
					"pointsrank":			getalliancesquery.getInt64(3),
					"points":				getalliancesquery.getInt64(4),
					"avgpoints":			getalliancesquery.getInt64(5),
					"pointsvariation":		getalliancesquery.getInt64(6),
					"pointsupdate":			getalliancesquery.getInt64(7),
					"fleetrank":			getalliancesquery.getInt64(8),
					"fleet":				getalliancesquery.getInt64(9),
					"avgfleet":				getalliancesquery.getInt64(10),
					"fleetvariation":		getalliancesquery.getInt64(11),
					"fleetupdate":			getalliancesquery.getInt64(12),
					"researchrank":			getalliancesquery.getInt64(13),
					"research":				getalliancesquery.getInt64(14),
					"avgresearch":			getalliancesquery.getInt64(15),
					"researchvariation":	getalliancesquery.getInt64(16),
					"researchupdate":		getalliancesquery.getInt64(17)
					
				}
			);
		}
		return returnedalliances;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getAlliances",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Ranks.prototype.getPlayers=function(filter)
{
	try
	{
		var fields=[
			"ogameid",
			"allyid",
			"x",
			"y",
			"z",
			"pointsrank",
			"points",
			"pointsvariation",
			"pointsupdate",
			"fleetrank",
			"fleet",
			"fleetvariation",
			"fleetupdate",
			"researchrank",
			"research",
			"researchvariation",
			"researchupdate",
			"vacation",
			"inactive",
			"banned",
			"protection",
			"statusupdate"
		];
		var searchstring="SELECT "
							+"ogameid, "
							+"nickname, "
							+"allyid, "
							+"x, "
							+"y, "
							+"z, "
							+"pointsrank, "
							+"points, "
							+"pointsvariation, "
							+"pointsupdate, "
							+"fleetrank, "
							+"fleet, "
							+"fleetvariation, "
							+"fleetupdate, "
							+"researchrank, "
							+"research, "
							+"researchvariation, "
							+"researchupdate, "
							+"vacation, "
							+"inactive, "
							+"banned, "
							+"protection, "
							+"statusupdate "
						+"FROM "
							+"players "
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
		if(typeof filter["nickname"]!="undefined")
		{
			searchstring+=" AND nickname LIKE '%"+filter["nickname"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY ogameid ASC";
		var returnedplayers=[];
		var getplayersquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getplayersquery.executeStep())
		{
			returnedplayers.push
			(
				{
					"ogameid":				getplayersquery.getInt64(0),
					"nickname":				getplayersquery.getUTF8String(1),
					"allyid":				getplayersquery.getInt64(2),
					"x":					getplayersquery.getInt32(3),
					"y":					getplayersquery.getInt32(4),
					"z":					getplayersquery.getInt32(5),
					"pointsrank":			getplayersquery.getInt64(6),
					"points":				getplayersquery.getInt64(7),
					"pointsvariation":		getplayersquery.getInt64(8),
					"pointsupdate":			getplayersquery.getInt64(9),
					"fleetrank":			getplayersquery.getInt64(10),
					"fleet":				getplayersquery.getInt64(11),
					"fleetvariation":		getplayersquery.getInt64(12),
					"fleetupdate":			getplayersquery.getInt64(13),
					"researchrank":			getplayersquery.getInt64(14),
					"research":				getplayersquery.getInt64(15),
					"researchvariation":	getplayersquery.getInt64(16),
					"researchupdate":		getplayersquery.getInt64(17),
					"vacation":				getplayersquery.getInt64(18),
					"inactive":				getplayersquery.getInt64(19),
					"banned":				getplayersquery.getInt64(20),
					"protection":			getplayersquery.getInt64(21),
					"statusupdate":			getplayersquery.getInt64(22)
				}
			);
		}
		return returnedplayers;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getPlayers",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}