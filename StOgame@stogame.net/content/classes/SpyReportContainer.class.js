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
function SpyReportContainer(language,universe,ogameid)
{
	try
	{
		this.language		=	language;
		this.universe		=	universe;
		this.ogameid		=	ogameid;
		this.spyreports		=	new Array();	//INDEXED BY "X_Y_Z_MOON" - CONTAINING SpyReport() Objects
		this.spyresearches	=	new Array();	//INDEXED BY ogameid - CONTAINING SpyResearch() Objects
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

SpyReportContainer.prototype.set=function
(
	timestamp,
	messageid,
	x,
	y,
	z,
	ismoon,
	antispionage,
	met,
	cry,
	deu,
	ene,
	structures,
	timestamps
)
{
	try
	{
		//alert(x+":"+y+":"+z+":"+ismoon)
		if
		(
			x>0
			&& x<10
			&& y>0
			&& y<500
			&& z>0
			&& z<16
		)
		{
			if
			(
				timestamps[3]
				&& timestamps[3]>0
			)
			{
				var system=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].galaxy.getSystem(x,y);
				if
				(
					typeof system[z]!="undefined"
					&& system[z]["ogameid"]>0
				)
				{
					if(!this.spyresearches[system[z]["ogameid"]])
					{
						this.spyresearches[system[z]["ogameid"]]=new SpyResearch
						(
							this.language,
							this.universe,
							this.ogameid,
							system[z]["ogameid"]
						);
					}
					this.spyresearches[system[z]["ogameid"]].set
					(
						{
							"timestamp":	timestamp,
							"tech_106":		ST_parseInt(structures[106]),
							"tech_108":		ST_parseInt(structures[108]),
							"tech_109":		ST_parseInt(structures[109]),
							"tech_110":		ST_parseInt(structures[110]),
							"tech_111":		ST_parseInt(structures[111]),
							"tech_113":		ST_parseInt(structures[113]),
							"tech_114":		ST_parseInt(structures[114]),
							"tech_115":		ST_parseInt(structures[115]),
							"tech_117":		ST_parseInt(structures[117]),
							"tech_118":		ST_parseInt(structures[118]),
							"tech_120":		ST_parseInt(structures[120]),
							"tech_121":		ST_parseInt(structures[121]),
							"tech_122":		ST_parseInt(structures[122]),
							"tech_123":		ST_parseInt(structures[123]),
							"tech_124":		ST_parseInt(structures[124]),
							"tech_199":		ST_parseInt(structures[199])
						}
					);
				}
			}
			if(!this.spyreports[x+":"+y+":"+z+"_"+ismoon])
			{
				this.spyreports[x+":"+y+":"+z+"_"+ismoon]=new SpyReport
				(
					this.language,
					this.universe,
					this.ogameid,
					x,
					y,
					z,
					(ismoon?1:0)
				);
			}
			this.spyreports[x+":"+y+":"+z+"_"+ismoon].set
			(
				{
					"timestamp":			ST_parseInt(timestamp),
					"messageid":			ST_parseInt(messageid),
					"met":					ST_parseInt(met),
					"cry":					ST_parseInt(cry),
					"deu":					ST_parseInt(deu),
					"ene":					ST_parseInt(ene),
					"antispionage":			ST_parseInt(antispionage),
					"building_1":			ST_parseInt(structures[1]),
					"building_2":			ST_parseInt(structures[2]),
					"building_3":			ST_parseInt(structures[3]),
					"building_4":			ST_parseInt(structures[4]),
					"building_12":			ST_parseInt(structures[12]),
					"building_14":			ST_parseInt(structures[14]),
					"building_15":			ST_parseInt(structures[15]),
					"building_21":			ST_parseInt(structures[21]),
					"building_22":			ST_parseInt(structures[22]),
					"building_23":			ST_parseInt(structures[23]),
					"building_24":			ST_parseInt(structures[24]),
					"building_31":			ST_parseInt(structures[31]),
					"building_33":			ST_parseInt(structures[33]),
					"building_34":			ST_parseInt(structures[34]),
					"building_44":			ST_parseInt(structures[44]),
					"moonbuilding_41":		ST_parseInt(structures[41]),
					"moonbuilding_42":		ST_parseInt(structures[42]),
					"moonbuilding_43":		ST_parseInt(structures[43]),
					"building_timestamp":	ST_parseInt(timestamps[2]),
					"ships_202":			ST_parseInt(structures[202]),
					"ships_203":			ST_parseInt(structures[203]),
					"ships_204":			ST_parseInt(structures[204]),
					"ships_205":			ST_parseInt(structures[205]),
					"ships_206":			ST_parseInt(structures[206]),
					"ships_207":			ST_parseInt(structures[207]),
					"ships_208":			ST_parseInt(structures[208]),
					"ships_209":			ST_parseInt(structures[209]),
					"ships_210":			ST_parseInt(structures[210]),
					"ships_211":			ST_parseInt(structures[211]),
					"ships_212":			ST_parseInt(structures[212]),
					"ships_213":			ST_parseInt(structures[213]),
					"ships_214":			ST_parseInt(structures[214]),
					"ships_215":			ST_parseInt(structures[215]),
					"ships_timestamp":		ST_parseInt(timestamps[0]),
					"defense_401":			ST_parseInt(structures[401]),
					"defense_402":			ST_parseInt(structures[402]),
					"defense_403":			ST_parseInt(structures[403]),
					"defense_404":			ST_parseInt(structures[404]),
					"defense_405":			ST_parseInt(structures[405]),
					"defense_406":			ST_parseInt(structures[406]),
					"defense_407":			ST_parseInt(structures[407]),
					"defense_408":			ST_parseInt(structures[408]),
					"rockets_502":			ST_parseInt(structures[502]),
					"rockets_503":			ST_parseInt(structures[503]),
					"defense_timestamp":	ST_parseInt(timestamps[1])
				}
			);
		}
		return {
			"type": "spyreport",
			"x": x,
			"y": y,
			"z": z,
			"ismoon": ismoon
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

SpyReportContainer.prototype.getPlanet=function(x,y,z,ismoon)
{
	try
	{
		if(!this.spyreports[x+":"+y+":"+z+"_"+ismoon])
		{
			var getspyreportquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
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
					+"x = ?1 "
					+"AND "
					+"y = ?2 "
					+"AND "
					+"z = ?3 "
					+"AND "
					+"ismoon = ?4 "
				+"LIMIT "
					+"0, 1 "
			);
			getspyreportquery.bindInt32Parameter			(0, x);
			getspyreportquery.bindInt32Parameter			(1, y);
			getspyreportquery.bindInt32Parameter			(2, z);
			getspyreportquery.bindInt32Parameter			(3, ismoon);
			if(getspyreportquery.executeStep())
			{
				this.spyreports[x+":"+y+":"+z+"_"+ismoon]=new SpyReport
				(
					this.language,
					this.universe,
					this.ogameid,
					getspyreportquery.getInt64(4),	//timestamp
					getspyreportquery.getInt64(55),	//messageid
					getspyreportquery.getInt32(0),	//x
					getspyreportquery.getInt32(1),	//y
					getspyreportquery.getInt32(2),	//z
					getspyreportquery.getInt32(3),	//ismoon
					getspyreportquery.getInt64(5),	//met
					getspyreportquery.getInt64(6),	//cry
					getspyreportquery.getInt64(7),	//deu
					getspyreportquery.getInt64(8),	//ene
					getspyreportquery.getInt32(9),	//antispionage
					getspyreportquery.getInt32(10),	//building_1
					getspyreportquery.getInt32(11),	//building_2
					getspyreportquery.getInt32(12),	//building_3
					getspyreportquery.getInt32(13),	//building_4
					getspyreportquery.getInt32(14),	//building_12
					getspyreportquery.getInt32(15),	//building_14
					getspyreportquery.getInt32(16),	//building_15
					getspyreportquery.getInt32(17),	//building_21
					getspyreportquery.getInt32(18),	//building_22
					getspyreportquery.getInt32(19),	//building_23
					getspyreportquery.getInt32(20),	//building_24
					getspyreportquery.getInt32(21),	//building_31
					getspyreportquery.getInt32(22),	//building_33
					getspyreportquery.getInt32(23),	//building_34
					getspyreportquery.getInt32(24),	//building_44
					getspyreportquery.getInt32(25),	//moonbuilding_41
					getspyreportquery.getInt32(26),	//moonbuilding_42
					getspyreportquery.getInt32(27),	//moonbuilding_43
					getspyreportquery.getInt64(28),	//building_timestamp
					getspyreportquery.getInt64(29),	//ships_202
					getspyreportquery.getInt64(30),	//ships_203
					getspyreportquery.getInt64(31),	//ships_204
					getspyreportquery.getInt64(32),	//ships_205
					getspyreportquery.getInt64(33),	//ships_206
					getspyreportquery.getInt64(34),	//ships_207
					getspyreportquery.getInt64(35),	//ships_208
					getspyreportquery.getInt64(36),	//ships_209
					getspyreportquery.getInt64(37),	//ships_210
					getspyreportquery.getInt64(38),	//ships_211
					getspyreportquery.getInt64(39),	//ships_212
					getspyreportquery.getInt64(40),	//ships_213
					getspyreportquery.getInt64(41),	//ships_214
					getspyreportquery.getInt64(42),	//ships_215
					getspyreportquery.getInt64(43),	//ships_timestamp
					getspyreportquery.getInt64(44),	//defense_401
					getspyreportquery.getInt64(45),	//defense_402
					getspyreportquery.getInt64(46),	//defense_403
					getspyreportquery.getInt64(47),	//defense_404
					getspyreportquery.getInt64(48),	//defense_405
					getspyreportquery.getInt64(49),	//defense_406
					getspyreportquery.getInt64(50),	//defense_407
					getspyreportquery.getInt64(51),	//defense_408
					getspyreportquery.getInt64(52),	//rockets_502
					getspyreportquery.getInt64(53),	//rockets_503
					getspyreportquery.getInt64(54)	//defense_timestamp
				);
				return this.spyreports[x+":"+y+":"+z+"_"+ismoon];
			}
			else
			{
				return 0;
			}
		}
		else
		{
			return this.spyreports[x+":"+y+":"+z+"_"+ismoon];
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getPlanet",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

SpyReportContainer.prototype.getResearches=function(targetogameid)
{
	try
	{
		if(targetogameid>0)
		{
			if(!this.spyresearches[targetogameid])
			{
				var getspyresearchquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
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
				getspyresearchquery.bindInt32Parameter			(0, targetogameid);
				if(getspyresearchquery.executeStep())
				{
					this.spyresearches[targetogameid]=new SpyResearch
						(
							this.language,
							this.universe,
							this.ogameid,
							getspyresearchquery.getInt32(0),	//targetogameid
							getspyresearchquery.getInt64(1),	//timestamp
							getspyresearchquery.getInt32(2),	//tech_106
							getspyresearchquery.getInt32(3),	//tech_108
							getspyresearchquery.getInt64(4),	//tech_110
							getspyresearchquery.getInt64(5),	//tech_111
							getspyresearchquery.getInt64(6),	//tech_113
							getspyresearchquery.getInt64(7),	//tech_114
							getspyresearchquery.getInt64(8),	//tech_115
							getspyresearchquery.getInt32(9),	//tech_117
							getspyresearchquery.getInt32(10),	//tech_118
							getspyresearchquery.getInt32(11),	//tech_120
							getspyresearchquery.getInt32(12),	//tech_121
							getspyresearchquery.getInt32(13),	//tech_122
							getspyresearchquery.getInt32(14),	//tech_123
							getspyresearchquery.getInt32(15),	//tech_124
							getspyresearchquery.getInt32(16)	//tech_199
						)
					return this.spyresearches[targetogameid];
				}
				else
				{
					return 0;
				}
			}
			else
			{
				return this.spyresearches[targetogameid];
			}
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
			"getResearches",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

SpyReportContainer.prototype.getSpyReports=function(filter)
{
	try
	{
		var fields=[
				"x",
				"y",
				"z",
				"ismoon",
				"timestamp",
				"met",
				"cry",
				"deu",
				"ene",
				"antispionage",
				"building_1",
				"building_2",
				"building_3",
				"building_4",
				"building_12",
				"building_14",
				"building_15",
				"building_21",
				"building_22",
				"building_23",
				"building_24",
				"building_31",
				"building_33",
				"building_34",
				"building_44",
				"moonbuilding_41",
				"moonbuilding_42",
				"moonbuilding_43",
				"building_timestamp",
				"ships_202",
				"ships_203",
				"ships_204",
				"ships_205",
				"ships_206",
				"ships_207",
				"ships_208",
				"ships_209",
				"ships_210",
				"ships_211",
				"ships_212",
				"ships_213",
				"ships_214",
				"ships_215",
				"ships_timestamp",
				"defense_401",
				"defense_402",
				"defense_403",
				"defense_404",
				"defense_405",
				"defense_406",
				"defense_407",
				"defense_408",
				"rockets_502",
				"rockets_503",
				"defense_timestamp",
				"messageid",
				"submitted"
		];
		var searchstring="SELECT "
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
							+"messageid, "
							+"submitted "
						+"FROM "
							+"spyreports "
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
		searchstring+=" ORDER BY messageid DESC";
		var returnedspyrepors=[];
		var getspyreportsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getspyreportsquery.executeStep())
		{
			returnedspyrepors.push
			(
				{
					"timestamp":				getspyreportsquery.getInt64(4),		//timestamp
					"messageid":				getspyreportsquery.getInt64(55),	//messageid
					"x":						getspyreportsquery.getInt32(0),		//x
					"y":						getspyreportsquery.getInt32(1),		//y
					"z":						getspyreportsquery.getInt32(2),		//z
					"ismoon":					getspyreportsquery.getInt32(3),		//ismoon
					"met":						getspyreportsquery.getInt64(5),		//met
					"cry":						getspyreportsquery.getInt64(6),		//cry
					"deu":						getspyreportsquery.getInt64(7),		//deu
					"ene":						getspyreportsquery.getInt64(8),		//ene
					"antispionage":				getspyreportsquery.getInt32(9),		//antispionage
					"building_1":				getspyreportsquery.getInt32(10),	//building_1
					"building_2":				getspyreportsquery.getInt32(11),	//building_2
					"building_3":				getspyreportsquery.getInt32(12),	//building_3
					"building_4":				getspyreportsquery.getInt32(13),	//building_4
					"building_12":				getspyreportsquery.getInt32(14),	//building_12
					"building_14":				getspyreportsquery.getInt32(15),	//building_14
					"building_15":				getspyreportsquery.getInt32(16),	//building_15
					"building_21":				getspyreportsquery.getInt32(17),	//building_21
					"building_22":				getspyreportsquery.getInt32(18),	//building_22
					"building_23":				getspyreportsquery.getInt32(19),	//building_23
					"building_24":				getspyreportsquery.getInt32(20),	//building_24
					"building_31":				getspyreportsquery.getInt32(21),	//building_31
					"building_33":				getspyreportsquery.getInt32(22),	//building_33
					"building_34":				getspyreportsquery.getInt32(23),	//building_34
					"building_44":				getspyreportsquery.getInt32(24),	//building_44
					"moonbuilding_41":			getspyreportsquery.getInt32(25),	//moonbuilding_41
					"moonbuilding_42":			getspyreportsquery.getInt32(26),	//moonbuilding_42
					"moonbuilding_43":			getspyreportsquery.getInt32(27),	//moonbuilding_43
					"building_timestamp":		getspyreportsquery.getInt64(28),	//building_timestamp
					"ships_202":				getspyreportsquery.getInt64(29),	//ships_202
					"ships_203":				getspyreportsquery.getInt64(30),	//ships_203
					"ships_204":				getspyreportsquery.getInt64(31),	//ships_204
					"ships_205":				getspyreportsquery.getInt64(32),	//ships_205
					"ships_206":				getspyreportsquery.getInt64(33),	//ships_206
					"ships_207":				getspyreportsquery.getInt64(34),	//ships_207
					"ships_208":				getspyreportsquery.getInt64(35),	//ships_208
					"ships_209":				getspyreportsquery.getInt64(36),	//ships_209
					"ships_210":				getspyreportsquery.getInt64(37),	//ships_210
					"ships_211":				getspyreportsquery.getInt64(38),	//ships_211
					"ships_212":				getspyreportsquery.getInt64(39),	//ships_212
					"ships_213":				getspyreportsquery.getInt64(40),	//ships_213
					"ships_214":				getspyreportsquery.getInt64(41),	//ships_214
					"ships_215":				getspyreportsquery.getInt64(42),	//ships_215
					"ships_timestamp":			getspyreportsquery.getInt64(43),	//ships_timestamp
					"defense_401":				getspyreportsquery.getInt64(44),	//defense_401
					"defense_402":				getspyreportsquery.getInt64(45),	//defense_402
					"defense_403":				getspyreportsquery.getInt64(46),	//defense_403
					"defense_404":				getspyreportsquery.getInt64(47),	//defense_404
					"defense_405":				getspyreportsquery.getInt64(48),	//defense_405
					"defense_406":				getspyreportsquery.getInt64(49),	//defense_406
					"defense_407":				getspyreportsquery.getInt64(50),	//defense_407
					"defense_408":				getspyreportsquery.getInt64(51),	//defense_408
					"rockets_502":				getspyreportsquery.getInt64(52),	//rockets_502
					"rockets_503":				getspyreportsquery.getInt64(53),	//rockets_503
					"defense_timestamp":		getspyreportsquery.getInt64(54),	//defense_timestamp
					"submitted":				getspyreportsquery.getInt32(55)		//submitted
				}
			);
		}
		return returnedspyrepors;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getSpyReports",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

SpyReportContainer.prototype.getSpyResearches=function(filter)
{
	try
	{
		var fields=[
				"targetogameid",
				"timestamp",
				"tech_106",
				"tech_108",
				"tech_109",
				"tech_110",
				"tech_111",
				"tech_113",
				"tech_114",
				"tech_115",
				"tech_117",
				"tech_118",
				"tech_120",
				"tech_121",
				"tech_122",
				"tech_123",
				"tech_124",
				"tech_199",
				"submitted"
		];
		var searchstring="SELECT "
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
							+"tech_199, "
							+"submitted "
						+"FROM "
							+"spyresearches "
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
		searchstring+=" ORDER BY targetogameid DESC";
		var returnedspyresearches=[];
		var getspyresearchquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getspyresearchquery.executeStep())
		{
			returnedspyresearches.push
			(
				{
					"targetogameid":	getspyresearchquery.getInt64(0),	//timestamp
					"timestamp":		getspyresearchquery.getInt64(1),	//timestamp
					"tech_106":			getspyresearchquery.getInt32(2),	//tech_106
					"tech_108":			getspyresearchquery.getInt32(3),	//tech_108
					"tech_110":			getspyresearchquery.getInt64(4),	//tech_110
					"tech_111":			getspyresearchquery.getInt64(5),	//tech_111
					"tech_113":			getspyresearchquery.getInt64(6),	//tech_113
					"tech_114":			getspyresearchquery.getInt64(7),	//tech_114
					"tech_115":			getspyresearchquery.getInt64(8),	//tech_115
					"tech_117":			getspyresearchquery.getInt32(9),	//tech_117
					"tech_118":			getspyresearchquery.getInt32(10),	//tech_118
					"tech_120":			getspyresearchquery.getInt32(11),	//tech_120
					"tech_121":			getspyresearchquery.getInt32(12),	//tech_121
					"tech_122":			getspyresearchquery.getInt32(13),	//tech_122
					"tech_123":			getspyresearchquery.getInt32(14),	//tech_123
					"tech_124":			getspyresearchquery.getInt32(15),	//tech_124
					"tech_199":			getspyresearchquery.getInt32(16),	//tech_199
					"submitted":		getspyresearchquery.getInt32(17)	//submitted
				}
			);
		}
		return returnedspyresearches;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getSpyResearches",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}