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
function SpyReport(
	language,
	universe,
	ogameid,
	x,
	y,
	z,
	ismoon
)
{
	try
	{
		this.language			=	language;
		this.universe			=	universe;
		this.ogameid			=	ogameid;
		this.x					=	x;
		this.y					=	y;
		this.z					=	z;
		this.ismoon				=	ismoon;
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

SpyReport.prototype.load=function()
{
	try
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
		getspyreportquery.bindInt32Parameter			(0, this.x);
		getspyreportquery.bindInt32Parameter			(1, this.y);
		getspyreportquery.bindInt32Parameter			(2, this.z);
		getspyreportquery.bindInt32Parameter			(3, this.ismoon);
		if(getspyreportquery.executeStep())
		{
			this.timestamp=getspyreportquery.getInt64(4);			//timestamp
			this.messageid=getspyreportquery.getInt64(55);			//messageid
			//getspyreportquery.getInt32(0),	//x
			//getspyreportquery.getInt32(1),	//y
			//getspyreportquery.getInt32(2),	//z
			//getspyreportquery.getInt32(3),	//ismoon
			this.met=getspyreportquery.getInt64(5);					//met
			this.cry=getspyreportquery.getInt64(6);					//cry
			this.deu=getspyreportquery.getInt64(7);					//deu
			this.ene=getspyreportquery.getInt64(8);					//ene
			this.antispionage=getspyreportquery.getInt32(9);		//antispionage
			this.building_1=getspyreportquery.getInt32(10);			//building_1
			this.building_2=getspyreportquery.getInt32(11);			//building_2
			this.building_3=getspyreportquery.getInt32(12);			//building_3
			this.building_4=getspyreportquery.getInt32(13);			//building_4
			this.building_12=getspyreportquery.getInt32(14);		//building_12
			this.building_14=getspyreportquery.getInt32(15);		//building_14
			this.building_15=getspyreportquery.getInt32(16);		//building_15
			this.building_21=getspyreportquery.getInt32(17);		//building_21
			this.building_22=getspyreportquery.getInt32(18);		//building_22
			this.building_23=getspyreportquery.getInt32(19);		//building_23
			this.building_24=getspyreportquery.getInt32(20);		//building_24
			this.building_31=getspyreportquery.getInt32(21);		//building_31
			this.building_33=getspyreportquery.getInt32(22);		//building_33
			this.building_34=getspyreportquery.getInt32(23);		//building_34
			this.building_44=getspyreportquery.getInt32(24);		//building_44
			this.moonbuilding_41=getspyreportquery.getInt32(25);	//moonbuilding_41
			this.moonbuilding_42=getspyreportquery.getInt32(26);	//moonbuilding_42
			this.moonbuilding_43=getspyreportquery.getInt32(27);	//moonbuilding_43
			this.building_timestamp=getspyreportquery.getInt64(28);	//building_timestamp
			this.ships_202=getspyreportquery.getInt64(29);			//ships_202
			this.ships_203=getspyreportquery.getInt64(30);			//ships_203
			this.ships_204=getspyreportquery.getInt64(31);			//ships_204
			this.ships_205=getspyreportquery.getInt64(32);			//ships_205
			this.ships_206=getspyreportquery.getInt64(33);			//ships_206
			this.ships_207=getspyreportquery.getInt64(34);			//ships_207
			this.ships_208=getspyreportquery.getInt64(35);			//ships_208
			this.ships_209=getspyreportquery.getInt64(36);			//ships_209
			this.ships_210=getspyreportquery.getInt64(37);			//ships_210
			this.ships_211=getspyreportquery.getInt64(38);			//ships_211
			this.ships_212=getspyreportquery.getInt64(39);			//ships_212
			this.ships_213=getspyreportquery.getInt64(40);			//ships_213
			this.ships_214=getspyreportquery.getInt64(41);			//ships_214
			this.ships_215=getspyreportquery.getInt64(42);			//ships_215
			this.ships_timestamp=getspyreportquery.getInt64(43);	//ships_timestamp
			this.defense_401=getspyreportquery.getInt64(44);		//defense_401
			this.defense_402=getspyreportquery.getInt64(45);		//defense_402
			this.defense_403=getspyreportquery.getInt64(46);		//defense_403
			this.defense_404=getspyreportquery.getInt64(47);		//defense_404
			this.defense_405=getspyreportquery.getInt64(48);		//defense_405
			this.defense_406=getspyreportquery.getInt64(49);		//defense_406
			this.defense_407=getspyreportquery.getInt64(50);		//defense_407
			this.defense_408=getspyreportquery.getInt64(51);		//defense_408
			this.rockets_502=getspyreportquery.getInt64(52);		//rockets_502
			this.rockets_503=getspyreportquery.getInt64(53);		//rockets_503
			this.defense_timestamp=getspyreportquery.getInt64(54);	//defense_timestamp
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

SpyReport.prototype.set=function(data)
{
	try
	{
		if
		(
			data.timestamp>ST_parseInt(this.timestamp)
			&& data.timestamp<allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()
		)
		{
			var vars=["timestamp","messageid","met","cry","deu","ene","antispionage"];
			for(var i in vars)
			{
				this[vars[i]]=data[vars[i]];
			}
			if
			(
				data.building_timestamp>ST_parseInt(this.building_timestamp)
				&& data.building_timestamp<allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()
			)
			{
				for(var i in GlobalVars["buildingids"])
				{
					this["building_"+GlobalVars["buildingids"][i]]=data["building_"+GlobalVars["buildingids"][i]];
				}
				for(var i in GlobalVars["moonbuildingids"])
				{
					this["moonbuilding_"+GlobalVars["moonbuildingids"][i]]=data["moonbuilding_"+GlobalVars["moonbuildingids"][i]];
				}
				this.building_timestamp=data.building_timestamp;
			}
			if
			(
				data.ships_timestamp>ST_parseInt(this.ships_timestamp)
				&& data.ships_timestamp<allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()
			)
			{
				for(var i in GlobalVars['shipsids'])
				{
					this["ships_"+GlobalVars['shipsids'][i]]=data["ships_"+GlobalVars['shipsids'][i]];
				}
				this.ships_timestamp=data.ships_timestamp;
			}
			if
			(
				data.defense_timestamp>ST_parseInt(this.defense_timestamp)
				&& data.defense_timestamp<allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()
			)
			{
				for(var i in GlobalVars['defenseids'])
				{
					this["defense_"+GlobalVars['defenseids'][i]]=data["defense_"+GlobalVars['defenseids'][i]];
				}
				for(var i in GlobalVars['rocketsids'])
				{
					this["rockets_"+GlobalVars['rocketsids'][i]]=data["rockets_"+GlobalVars['rocketsids'][i]];
				}
				this.defense_timestamp=data.defense_timestamp;
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

SpyReport.prototype.save=function()
{
	try
	{
		var setspyreportquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"INSERT INTO "
				+"spyreports "
					+"( "
						+"x, "
						+"y, "
						+"z, "
						+"ismoon, "
						+"timestamp, "
						+"messageid, "
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
						+"defense_timestamp "
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
						+"?18, "
						+"?19, "
						+"?20, "
						+"?21, "
						+"?22, "
						+"?23, "
						+"?24, "
						+"?25, "
						+"?26, "
						+"?27, "
						+"?28, "
						+"?29, "
						+"?30, "
						+"?31, "
						+"?32, "
						+"?33, "
						+"?34, "
						+"?35, "
						+"?36, "
						+"?37, "
						+"?38, "
						+"?39, "
						+"?40, "
						+"?41, "
						+"?42, "
						+"?43, "
						+"?44, "
						+"?45, "
						+"?46, "
						+"?47, "
						+"?48, "
						+"?49, "
						+"?50, "
						+"?51, "
						+"?52, "
						+"?53, "
						+"?54, "
						+"?55, "
						+"?56 "
					+") "
		);
		
		setspyreportquery.bindInt32Parameter(0,ST_parseInt(this.x));
		setspyreportquery.bindInt32Parameter(1,ST_parseInt(this.y));
		setspyreportquery.bindInt32Parameter(2,ST_parseInt(this.z));
		setspyreportquery.bindInt32Parameter(3,ST_parseInt(this.ismoon));
		setspyreportquery.bindInt64Parameter(4,ST_parseInt(this.timestamp));
		setspyreportquery.bindInt64Parameter(5,ST_parseInt(this.messageid));
		setspyreportquery.bindInt64Parameter(6,ST_parseInt(this.met));
		setspyreportquery.bindInt64Parameter(7,ST_parseInt(this.cry));
		setspyreportquery.bindInt64Parameter(8,ST_parseInt(this.deu));
		setspyreportquery.bindInt64Parameter(9,ST_parseInt(this.ene));
		setspyreportquery.bindInt32Parameter(10,ST_parseInt(this.antispionage));
		setspyreportquery.bindInt32Parameter(11,ST_parseInt(this.building_1));
		setspyreportquery.bindInt32Parameter(12,ST_parseInt(this.building_2));
		setspyreportquery.bindInt32Parameter(13,ST_parseInt(this.building_3));
		setspyreportquery.bindInt32Parameter(14,ST_parseInt(this.building_4));
		setspyreportquery.bindInt32Parameter(15,ST_parseInt(this.building_12));
		setspyreportquery.bindInt32Parameter(16,ST_parseInt(this.building_14));
		setspyreportquery.bindInt32Parameter(17,ST_parseInt(this.building_15));
		setspyreportquery.bindInt32Parameter(18,ST_parseInt(this.building_21));
		setspyreportquery.bindInt32Parameter(19,ST_parseInt(this.building_22));
		setspyreportquery.bindInt32Parameter(20,ST_parseInt(this.building_23));
		setspyreportquery.bindInt32Parameter(21,ST_parseInt(this.building_24));
		setspyreportquery.bindInt32Parameter(22,ST_parseInt(this.building_31));
		setspyreportquery.bindInt32Parameter(23,ST_parseInt(this.building_33));
		setspyreportquery.bindInt32Parameter(24,ST_parseInt(this.building_34));
		setspyreportquery.bindInt32Parameter(25,ST_parseInt(this.building_44));
		setspyreportquery.bindInt32Parameter(26,ST_parseInt(this.moonbuilding_41));
		setspyreportquery.bindInt32Parameter(27,ST_parseInt(this.moonbuilding_42));
		setspyreportquery.bindInt32Parameter(28,ST_parseInt(this.moonbuilding_43));
		setspyreportquery.bindInt64Parameter(29,ST_parseInt(this.building_timestamp));
		setspyreportquery.bindInt64Parameter(30,ST_parseInt(this.ships_202));
		setspyreportquery.bindInt64Parameter(31,ST_parseInt(this.ships_203));
		setspyreportquery.bindInt64Parameter(32,ST_parseInt(this.ships_204));
		setspyreportquery.bindInt64Parameter(33,ST_parseInt(this.ships_205));
		setspyreportquery.bindInt64Parameter(34,ST_parseInt(this.ships_206));
		setspyreportquery.bindInt64Parameter(35,ST_parseInt(this.ships_207));
		setspyreportquery.bindInt64Parameter(36,ST_parseInt(this.ships_208));
		setspyreportquery.bindInt64Parameter(37,ST_parseInt(this.ships_209));
		setspyreportquery.bindInt64Parameter(38,ST_parseInt(this.ships_210));
		setspyreportquery.bindInt64Parameter(39,ST_parseInt(this.ships_211));
		setspyreportquery.bindInt64Parameter(40,ST_parseInt(this.ships_212));
		setspyreportquery.bindInt64Parameter(41,ST_parseInt(this.ships_213));
		setspyreportquery.bindInt64Parameter(42,ST_parseInt(this.ships_214));
		setspyreportquery.bindInt64Parameter(43,ST_parseInt(this.ships_215));
		setspyreportquery.bindInt64Parameter(44,ST_parseInt(this.ships_timestamp));
		setspyreportquery.bindInt64Parameter(45,ST_parseInt(this.defense_401));
		setspyreportquery.bindInt64Parameter(46,ST_parseInt(this.defense_402));
		setspyreportquery.bindInt64Parameter(47,ST_parseInt(this.defense_403));
		setspyreportquery.bindInt64Parameter(48,ST_parseInt(this.defense_404));
		setspyreportquery.bindInt64Parameter(49,ST_parseInt(this.defense_405));
		setspyreportquery.bindInt64Parameter(50,ST_parseInt(this.defense_406));
		setspyreportquery.bindInt64Parameter(51,ST_parseInt(this.defense_407));
		setspyreportquery.bindInt64Parameter(52,ST_parseInt(this.defense_408));
		setspyreportquery.bindInt64Parameter(53,ST_parseInt(this.rockets_502));
		setspyreportquery.bindInt64Parameter(54,ST_parseInt(this.rockets_503));
		setspyreportquery.bindInt64Parameter(55,ST_parseInt(this.defense_timestamp));
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(setspyreportquery);
		//setspyreportquery.execute();
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