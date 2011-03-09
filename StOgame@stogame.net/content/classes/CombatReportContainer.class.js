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
function CombatReportContainer(language,universe,ogameid)
{
	try
	{
		this.language	=	language;
		this.universe	=	universe;
		this.ogameid	=	ogameid;
		this.reports	=	new	Array();
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

CombatReportContainer.prototype.set=function(reportdata)
{
	try
	{
		if
		(
			reportdata.messageid
			&& reportdata.messageid>0
		)
		{
			if(typeof this.reports[reportdata.messageid]=="undefined")
			{
				this.reports[reportdata.messageid]=new CombatReport(this.language,this.universe,this.ogameid,reportdata.messageid);
			}
			this.reports[reportdata.messageid].set(reportdata);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"set",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

CombatReportContainer.prototype.get=function(filter)
{
	try
	{
		var CombatReportContainer=this;
		var fields=[
			"messageid",
			"timestamp",
			"x",
			"y",
			"z",
			"ismoon",
			"attackerlosses",
			"defenderlosses",
			"attackerunits",
			"defenderunits",
			"attackerlossesnumber",
			"defenderlossesnumber",
			"met",
			"cry",
			"deu",
			"debrismet",
			"debriscry",
			"victory",
			"rebuilt_401",
			"rebuilt_402",
			"rebuilt_403",
			"rebuilt_404",
			"rebuilt_405",
			"rebuilt_406",
			"rebuilt_407",
			"rebuilt_408",
			"submitted"
		];
		var searchstring="SELECT "
							+"messageid,"
							+"timestamp,"
							+"x,"
							+"y,"
							+"z,"
							+"ismoon,"
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
							+"1"
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
		searchstring+=" ORDER BY messageid DESC";
		var returnedcrs=[];
		var getcrsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getcrsquery.executeStep())
		{
			returnedcrs.push
			(
				{
					"messageid":			getcrsquery.getInt64(0),
					"timestamp":			getcrsquery.getInt64(1),
					"x":					getcrsquery.getInt32(2),
					"y":					getcrsquery.getInt32(3),
					"z":					getcrsquery.getInt32(4),
					"z":					getcrsquery.getInt64(5),
					"attackerlosses":		getcrsquery.getInt64(6),
					"defenderlosses":		getcrsquery.getInt64(7),
					"attackerunits":		getcrsquery.getInt64(8),
					"defenderunits":		getcrsquery.getInt64(9),
					"attackerlossesnumber":	getcrsquery.getInt64(10),
					"defenderlossesnumber":	getcrsquery.getInt64(11),
					"met":					getcrsquery.getInt64(12),
					"cry":					getcrsquery.getInt64(13),
					"deu":					getcrsquery.getInt64(14),
					"debrismet":			getcrsquery.getInt64(15),
					"debriscry":			getcrsquery.getInt64(16),
					"victory":				getcrsquery.getInt64(17),
					"rebuilt_401":			getcrsquery.getInt64(18),
					"rebuilt_402":			getcrsquery.getInt64(19),
					"rebuilt_403":			getcrsquery.getInt64(20),
					"rebuilt_404":			getcrsquery.getInt64(21),
					"rebuilt_405":			getcrsquery.getInt64(22),
					"rebuilt_406":			getcrsquery.getInt64(23),
					"rebuilt_407":			getcrsquery.getInt64(24),
					"rebuilt_408":			getcrsquery.getInt64(25),
					"submitted":			getcrsquery.getInt64(26),
					"get":					function()
					{
						if(!CombatReportContainer.reports[this.messageid])
						{
							CombatReportContainer.reports[this.messageid]=new CombatReport(CombatReportContainer.language,CombatReportContainer.universe,CombatReportContainer.ogameid,this.messageid);
						}
						return CombatReportContainer.reports[this.messageid].get();
					}
				}
			);
		}
		return returnedcrs;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"get",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}