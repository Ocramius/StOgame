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
function SpyResearch
(
	language,
	universe,
	ogameid,
	targetogameid
)
{
	try
	{
		this.language		=	language;
		this.universe		=	universe;
		this.ogameid		=	ogameid;
		this.targetogameid	=	targetogameid;
		this.load();
		this.save();
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

SpyResearch.prototype.load=function()
{
	try
	{
		var getspyresearchquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement
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
				+"targetogameid = ?1 "
			+"LIMIT "
				+"0, 1 "
		);
		getspyresearchquery.bindInt32Parameter(0,this.targetogameid);
		if(getspyresearchquery.executeStep())
		{
			this.timestamp=getspyresearchquery.getInt64(1),	//timestamp
			this.tech_106=getspyresearchquery.getInt32(2),	//tech_106
			this.tech_108=getspyresearchquery.getInt32(3),	//tech_108
			this.tech_110=getspyresearchquery.getInt64(4),	//tech_110
			this.tech_111=getspyresearchquery.getInt64(5),	//tech_111
			this.tech_113=getspyresearchquery.getInt64(6),	//tech_113
			this.tech_114=getspyresearchquery.getInt64(7),	//tech_114
			this.tech_115=getspyresearchquery.getInt64(8),	//tech_115
			this.tech_117=getspyresearchquery.getInt32(9),	//tech_117
			this.tech_118=getspyresearchquery.getInt32(10),	//tech_118
			this.tech_120=getspyresearchquery.getInt32(11),	//tech_120
			this.tech_121=getspyresearchquery.getInt32(12),	//tech_121
			this.tech_122=getspyresearchquery.getInt32(13),	//tech_122
			this.tech_123=getspyresearchquery.getInt32(14),	//tech_123
			this.tech_124=getspyresearchquery.getInt32(15),	//tech_124
			this.tech_199=getspyresearchquery.getInt32(16)	//tech_199
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"load",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

SpyResearch.prototype.save=function()
{
	try
	{
		var setspyresearchquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"INSERT INTO "
				+"spyresearches "
					+"( "
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
						+"?13, "
						+"?14, "
						+"?15, "
						+"?16, "
						+"?17, "
						+"?18 "
					+") "
		);
		
		setspyresearchquery.bindInt32Parameter(0,ST_parseInt(this.targetogameid));
		setspyresearchquery.bindInt64Parameter(1,ST_parseInt(this.timestamp));
		setspyresearchquery.bindInt32Parameter(2,ST_parseInt(this.tech_106));
		setspyresearchquery.bindInt32Parameter(3,ST_parseInt(this.tech_108));
		setspyresearchquery.bindInt32Parameter(4,ST_parseInt(this.tech_109));
		setspyresearchquery.bindInt32Parameter(5,ST_parseInt(this.tech_110));
		setspyresearchquery.bindInt32Parameter(6,ST_parseInt(this.tech_111));
		setspyresearchquery.bindInt32Parameter(7,ST_parseInt(this.tech_113));
		setspyresearchquery.bindInt32Parameter(8,ST_parseInt(this.tech_114));
		setspyresearchquery.bindInt32Parameter(9,ST_parseInt(this.tech_115));
		setspyresearchquery.bindInt32Parameter(10,ST_parseInt(this.tech_117));
		setspyresearchquery.bindInt32Parameter(11,ST_parseInt(this.tech_118));
		setspyresearchquery.bindInt32Parameter(12,ST_parseInt(this.tech_120));
		setspyresearchquery.bindInt32Parameter(13,ST_parseInt(this.tech_121));
		setspyresearchquery.bindInt32Parameter(14,ST_parseInt(this.tech_122));
		setspyresearchquery.bindInt32Parameter(15,ST_parseInt(this.tech_123));
		setspyresearchquery.bindInt32Parameter(16,ST_parseInt(this.tech_124));
		setspyresearchquery.bindInt32Parameter(17,ST_parseInt(this.tech_199));
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(setspyresearchquery);
		//setspyresearchquery.execute();
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"save",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

SpyResearch.prototype.set=function(data)
{
	try
	{
		if
		(
			data.timestamp>ST_parseInt(this.timestamp)
			&& data.timestamp<allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()
		)
		{
			for(var i in data)
			{
				this[i]=data[i];
			}
			this.save();
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