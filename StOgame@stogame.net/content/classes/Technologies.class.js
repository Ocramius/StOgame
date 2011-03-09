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
function Technologies(language,universe,ogameid,AccountDB)
{
	try
	{
		this.technology=new Array();
		this.technologyupdates=new Array();
		this.language=language;
		this.universe=universe;
		this.ogameid=ogameid;
		this.AccountDB=AccountDB;
		var gettechnologiesquery=this.AccountDB.createStatement(
			"SELECT "
				+"gid, "
				+"value, "
				+"updated "
			+"FROM "
				+"technologies "
		);
		while(gettechnologiesquery.executeStep())
		{
			var gid							=	gettechnologiesquery.getInt32		(0)
			this.technology[gid]			=	gettechnologiesquery.getInt32		(1);
			this.technologyupdates[gid]		=	gettechnologiesquery.getInt64		(2);
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


Technologies.prototype.log=function(changedvar)
{
	this.logAtTimestamp(changedvar,allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
}

Technologies.prototype.logAtTimestamp=function(changedvar,timestamp)
{
	if(timestamp<=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp())
	{
		var logtechchanges	=	this.AccountDB.createStatement(
			"INSERT INTO "
				+"technologies_log "
					+"( "
						+"gid, "
						+"value, "
						+"updated "
					+") "
					+"VALUES "
					+"( "
						+"?1, "
						+"?2, "
						+"?3 "
					+") "
		);
		logtechchanges.bindUTF8StringParameter	(0, changedvar);
		logtechchanges.bindInt32Parameter		(1, this.technology[changedvar]);
		logtechchanges.bindInt64Parameter		(2, timestamp);
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(logtechchanges);
		//logtechchanges.execute();
	}
}

Technologies.prototype.update=function(tech)
{
	try
	{
		var save_changes=false;
		for(var gid in tech)
		{
			if(tech[gid]["level"]!=this.technology[gid])
			{
				save_changes=true;
				//alert("updated "+gid+" from "+this.technology[gid]+" to "+tech[gid]["level"])
				this.technology[gid]=tech[gid]["level"];
				this.log(gid);
				this.technologyupdates[gid]=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				var inserttechnologyquery=this.AccountDB.createStatement(
					"INSERT INTO "
						+"technologies "
							+"( "
								+"gid, "
								+"value, "
								+"updated "
							+") "
							+"VALUES "
							+"( "
								+"?1, "
								+"?2, "
								+"?3 "
							+") "
				);
				inserttechnologyquery.bindInt32Parameter		(0, gid);
				inserttechnologyquery.bindInt32Parameter		(1, this.technology[gid]);
				inserttechnologyquery.bindInt64Parameter		(2, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
				//inserttechnologyquery.execute();
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(inserttechnologyquery);
			}
		}
		if(save_changes)
		{
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.updateAllPlanetResourcesToTimestamp(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"update",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Technologies.prototype.getTech=function(gid)
{
	return (typeof this.technology[gid]!="undefined")?this.technology[gid]:0;
}

Technologies.prototype.getLog=function(gid)
{
	var gettechnologylogquery=this.AccountDB.createStatement(
		"SELECT "
			+"value, "
			+"updated "
		+"FROM "
			+"technologies_log "
		+"WHERE "
			+"gid = ?1 "
		+"ORDER BY "
			+"updated ASC"
	);
	gettechnologylogquery.bindInt32Parameter		(0, gid);
	var techlog=new Array();
	var i=0;
	while(gettechnologylogquery.executeStep())
	{
		techlog[i]={
			"value":	gettechnologylogquery.getInt32		(0),
			"updated":	gettechnologylogquery.getInt64		(1)
		};
		i++;
	}
	return techlog;
}