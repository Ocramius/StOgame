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
function Planet(
	language,
	universe,
	ogameid,
	AccountDB,
	id,
	cp,
	x,
	y,
	z,
	ismoon,
	group,
	type,
	name,
	diameter,
	maxtemp,
	mintemp,
	creation,
	met,
	cry,
	deu,
	resourcesupdate,
	metpercentage,
	crypercentage,
	deupercentage,
	solpercentage,
	fuspercentage,
	satpercentage,
	percentagesupdate,
	building_1,
	building_2,
	building_3,
	building_4,
	building_12,
	building_14,
	building_15,
	building_21,
	building_22,
	building_23,
	building_24,
	building_31,
	building_33,
	building_34,
	building_44,
	moonbuilding_41,
	moonbuilding_42,
	moonbuilding_43,
	buildingsupdate,
	ships_202,
	ships_203,
	ships_204,
	ships_205,
	ships_206,
	ships_207,
	ships_208,
	ships_209,
	ships_210,
	ships_211,
	ships_212,
	ships_213,
	ships_214,
	ships_215,
	shipsupdate,
	defense_401,
	defense_402,
	defense_403,
	defense_404,
	defense_405,
	defense_406,
	defense_407,
	defense_408,
	rockets_502,
	rockets_503,
	defensesupdate
)
{
	try
	{
		this.language				=	language;
		this.universe				=	universe;
		this.ogameid				=	ogameid;
		this.AccountDB				=	AccountDB;
		this.id						=	id;
		this.cp						=	cp;
		this.x						=	x;
		this.y						=	y;
		this.z						=	z;
		this.ismoon					=	ismoon;
		this.group					=	group;
		this.type					=	type;
		this.name					=	name;
		this.diameter				=	diameter;
		this.maxtemp				=	maxtemp;
		this.mintemp				=	mintemp;
		this.creation				=	creation;
		this.met					=	met;
		this.cry					=	cry;
		this.deu					=	deu;
		this.resourcesupdate		=	resourcesupdate;
		this.metpercentage			=	metpercentage;
		this.crypercentage			=	crypercentage;
		this.deupercentage			=	deupercentage;
		this.solpercentage			=	solpercentage;
		this.fuspercentage			=	fuspercentage;
		this.satpercentage			=	satpercentage;
		this.percentagesupdate		=	percentagesupdate;
		this.building_1				=	building_1;
		this.building_2				=	building_2;
		this.building_3				=	building_3;
		this.building_4				=	building_4;
		this.building_12			=	building_12;
		this.building_14			=	building_14;
		this.building_15			=	building_15;
		this.building_21			=	building_21;
		this.building_22			=	building_22;
		this.building_23			=	building_23;
		this.building_24			=	building_24;
		this.building_31			=	building_31;
		this.building_33			=	building_33;
		this.building_34			=	building_34;
		this.building_44			=	building_44;
		this.moonbuilding_41		=	moonbuilding_41;
		this.moonbuilding_42		=	moonbuilding_42;
		this.moonbuilding_43		=	moonbuilding_43;
		this.buildingsupdate		=	buildingsupdate;
		this.ships_202				=	ships_202;
		this.ships_203				=	ships_203;
		this.ships_204				=	ships_204;
		this.ships_205				=	ships_205;
		this.ships_206				=	ships_206;
		this.ships_207				=	ships_207;
		this.ships_208				=	ships_208;
		this.ships_209				=	ships_209;
		this.ships_210				=	ships_210;
		this.ships_211				=	ships_211;
		this.ships_212				=	ships_212;
		this.ships_213				=	ships_213;
		this.ships_214				=	ships_214;
		this.ships_215				=	ships_215;
		this.shipsupdate			=	shipsupdate;
		this.defense_401			=	defense_401;
		this.defense_402			=	defense_402;
		this.defense_403			=	defense_403;
		this.defense_404			=	defense_404;
		this.defense_405			=	defense_405;
		this.defense_406			=	defense_406;
		this.defense_407			=	defense_407;
		this.defense_408			=	defense_408;
		this.rockets_502			=	rockets_502;
		this.rockets_503			=	rockets_503;
		this.defensesupdate			=	defensesupdate;
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

Planet.prototype.save=function()
{
	try
	{
		var updateplanetquery	=	this.AccountDB.createStatement(
			"UPDATE "
				+"planets "
			+"SET "
				+"id = ?1, "
				+"x = ?2, "
				+"y = ?3, "
				+"z = ?4, "
				+"ismoon = ?5, "
				+"pl_group = ?6, "
				+"pl_type = ?7, "
				+"name = ?8, "
				+"diameter = ?9, "
				+"maxtemp = ?10, "
				+"mintemp = ?11, "
				+"creation = ?12, "
				+"met = ?13, "
				+"cry = ?14, "
				+"deu = ?15, "
				+"resourcesupdate = ?16, "
				+"metpercentage = ?17, "
				+"crypercentage = ?18, "
				+"deupercentage = ?19, "
				+"solpercentage = ?20, "
				+"fuspercentage = ?21, "
				+"satpercentage = ?22, "
				+"percentagesupdate = ?23, "
				+"building_1 = ?24, "
				+"building_2 = ?25, "
				+"building_3 = ?26, "
				+"building_4 = ?27, "
				+"building_12 = ?28, "
				+"building_14 = ?29, "
				+"building_15 = ?30, "
				+"building_21 = ?31, "
				+"building_22 = ?32, "
				+"building_23 = ?33, "
				+"building_24 = ?34, "
				+"building_31 = ?35, "
				+"building_33 = ?36, "
				+"building_34 = ?37, "
				+"building_44 = ?38, "
				+"moonbuilding_41 = ?39, "
				+"moonbuilding_42 = ?40, "
				+"moonbuilding_43 = ?41, "
				+"buildingsupdate = ?42, "
				+"ships_202 = ?43, "
				+"ships_203 = ?44, "
				+"ships_204 = ?45, "
				+"ships_205 = ?46, "
				+"ships_206 = ?47, "
				+"ships_207 = ?48, "
				+"ships_208 = ?49, "
				+"ships_209 = ?50, "
				+"ships_210 = ?51, "
				+"ships_211 = ?52, "
				+"ships_212 = ?53, "
				+"ships_213 = ?54, "
				+"ships_214 = ?55, "
				+"ships_215 = ?56, "
				+"shipsupdate = ?57, "
				+"defense_401 = ?58, "
				+"defense_402 = ?59, "
				+"defense_403 = ?60, "
				+"defense_404 = ?61, "
				+"defense_405 = ?62, "
				+"defense_406 = ?63, "
				+"defense_407 = ?64, "
				+"defense_408 = ?65, "
				+"rockets_502 = ?66, "
				+"rockets_503 = ?67, "
				+"defensesupdate = ?68 "
			+"WHERE "
				+"cp = ?69 "
		);
		updateplanetquery.bindInt32Parameter			(0, this.id);
		updateplanetquery.bindInt32Parameter			(1, this.x);
		updateplanetquery.bindInt32Parameter			(2, this.y);
		updateplanetquery.bindInt32Parameter			(3, this.z);
		updateplanetquery.bindInt32Parameter			(4, this.ismoon);
		updateplanetquery.bindInt32Parameter			(5, this.group);
		updateplanetquery.bindInt32Parameter			(6, this.type);
		updateplanetquery.bindUTF8StringParameter		(7, this.name);
		updateplanetquery.bindInt32Parameter			(8, this.diameter);
		updateplanetquery.bindInt32Parameter			(9, this.maxtemp);
		updateplanetquery.bindInt32Parameter			(10, this.mintemp);
		updateplanetquery.bindInt64Parameter			(11, this.creation);
		updateplanetquery.bindInt64Parameter			(12, this.met);
		updateplanetquery.bindInt64Parameter			(13, this.cry);
		updateplanetquery.bindInt64Parameter			(14, this.deu);
		updateplanetquery.bindInt64Parameter			(15, this.resourcesupdate);
		updateplanetquery.bindInt32Parameter			(16, this.metpercentage);
		updateplanetquery.bindInt32Parameter			(17, this.crypercentage);
		updateplanetquery.bindInt32Parameter			(18, this.deupercentage);
		updateplanetquery.bindInt32Parameter			(19, this.solpercentage);
		updateplanetquery.bindInt32Parameter			(20, this.fuspercentage);
		updateplanetquery.bindInt32Parameter			(21, this.satpercentage);
		updateplanetquery.bindInt64Parameter			(22, this.percentagesupdate);
		updateplanetquery.bindInt32Parameter			(23, this.building_1);
		updateplanetquery.bindInt32Parameter			(24, this.building_2);
		updateplanetquery.bindInt32Parameter			(25, this.building_3);
		updateplanetquery.bindInt32Parameter			(26, this.building_4);
		updateplanetquery.bindInt32Parameter			(27, this.building_12);
		updateplanetquery.bindInt32Parameter			(28, this.building_14);
		updateplanetquery.bindInt32Parameter			(29, this.building_15);
		updateplanetquery.bindInt32Parameter			(30, this.building_21);
		updateplanetquery.bindInt32Parameter			(31, this.building_22);
		updateplanetquery.bindInt32Parameter			(32, this.building_23);
		updateplanetquery.bindInt32Parameter			(33, this.building_24);
		updateplanetquery.bindInt32Parameter			(34, this.building_31);
		updateplanetquery.bindInt32Parameter			(35, this.building_33);
		updateplanetquery.bindInt32Parameter			(36, this.building_34);
		updateplanetquery.bindInt32Parameter			(37, this.building_44);
		updateplanetquery.bindInt32Parameter			(38, this.moonbuilding_41);
		updateplanetquery.bindInt32Parameter			(39, this.moonbuilding_42);
		updateplanetquery.bindInt32Parameter			(40, this.moonbuilding_43);
		updateplanetquery.bindInt32Parameter			(41, this.buildingsupdate);
		updateplanetquery.bindInt64Parameter			(42, this.ships_202);
		updateplanetquery.bindInt64Parameter			(43, this.ships_203);
		updateplanetquery.bindInt64Parameter			(44, this.ships_204);
		updateplanetquery.bindInt64Parameter			(45, this.ships_205);
		updateplanetquery.bindInt64Parameter			(46, this.ships_206);
		updateplanetquery.bindInt64Parameter			(47, this.ships_207);
		updateplanetquery.bindInt64Parameter			(48, this.ships_208);
		updateplanetquery.bindInt64Parameter			(49, this.ships_209);
		updateplanetquery.bindInt64Parameter			(50, this.ships_210);
		updateplanetquery.bindInt64Parameter			(51, this.ships_211);
		updateplanetquery.bindInt64Parameter			(52, this.ships_212);
		updateplanetquery.bindInt64Parameter			(53, this.ships_213);
		updateplanetquery.bindInt64Parameter			(54, this.ships_214);
		updateplanetquery.bindInt64Parameter			(55, this.ships_215);
		updateplanetquery.bindInt64Parameter			(56, this.shipsupdate);
		updateplanetquery.bindInt64Parameter			(57, this.defense_401);
		updateplanetquery.bindInt64Parameter			(58, this.defense_402);
		updateplanetquery.bindInt64Parameter			(59, this.defense_403);
		updateplanetquery.bindInt64Parameter			(60, this.defense_404);
		updateplanetquery.bindInt64Parameter			(61, this.defense_405);
		updateplanetquery.bindInt64Parameter			(62, this.defense_406);
		updateplanetquery.bindInt64Parameter			(63, this.defense_407);
		updateplanetquery.bindInt64Parameter			(64, this.defense_408);
		updateplanetquery.bindInt32Parameter			(65, this.rockets_502);
		updateplanetquery.bindInt32Parameter			(66, this.rockets_503);
		updateplanetquery.bindInt64Parameter			(67, this.defensesupdate);
		updateplanetquery.bindInt32Parameter			(68, this.cp);
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(updateplanetquery);
		//updateplanetquery.execute();
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

Planet.prototype.log=function(changedvar)
{
	this.logAtTimestamp(changedvar,allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
}

Planet.prototype.logAtTimestamp=function(changedvar,timestamp)
{
	if(timestamp<=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp())
	{
		var logplanetchanges	=	this.AccountDB.createStatement(
			"INSERT INTO "
				+"planet_log "
					+"( "
						+"cp, "
						+"changedvalue, "
						+"newamount, "
						+"updated "
					+") "
					+"VALUES "
					+"( "
						+"?1, "
						+"?2, "
						+"?3, "
						+"?4 "
					+") "
		);
		logplanetchanges.bindInt32Parameter			(0, this.cp);
		logplanetchanges.bindUTF8StringParameter	(1, changedvar);
		logplanetchanges.bindInt32Parameter			(2, this[changedvar]);
		logplanetchanges.bindInt64Parameter			(3, timestamp);
		allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(logplanetchanges);
		//logplanetchanges.execute();
	}
}

Planet.prototype.updatePlanetInfo=function(planet)
{
	//DEFINITIONS FOR OBJECT PLANET ARE PLACED IN OgameParser.class.js/parseplanetlist()
	try
	{
		var save_changes=false;
		if
		(
			this.name!=planet.name
			&& planet.name.length>0
		)
		{
			save_changes=true;
			this.name=planet.name;
			this.log("name");
		}
		if(this.ismoon!=planet.ismoon)
		{
			save_changes=true;
			this.ismoon=planet.ismoon;
		}
		if
		(
			this.x!=planet.x
			&& planet.x>0
		)
		{
			save_changes=true;
			this.x=planet.x;
		}
		if
		(
			this.y!=planet.y
			&& planet.y>0
		)
		{
			save_changes=true;
			this.y=planet.y;
		}
		if
		(
			this.z!=planet.z
			&& planet.z>0
		)
		{
			save_changes=true;
			this.z=planet.z;
		}
		if
		(
			this.group!=planet.group
			&& planet.group>0
		)
		{
			save_changes=true;
			this.group=planet.group;
		}
		if
		(
			this.type!=planet.type
			&& planet.type>0
		)
		{
			save_changes=true;
			this.type=planet.type;
		}
		if(save_changes)
		{
			this.save();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"updatePlanetInfo",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Planet.prototype.setResources=function(resources)
{
	try
	{
		var save_changes=false;
		if(
			(this.getMet()*1.01<resources.met)
			|| (this.getMet()*0.99>resources.met)
		)
		{
			this.log("met");
			save_changes=true;
		}
		if(
			(this.getCry()*1.01<resources.cry)
			|| (this.getCry()*0.99>resources.cry)
		)
		{
			this.log("cry");
			save_changes=true;
		}
		if(
			(this.getDeu()*1.01<resources.deu)
			|| (this.getDeu()*0.99>resources.deu)
		)
		{
			this.log("deu");
			save_changes=true;
		}
		this.met=resources.met;
		this.cry=resources.cry;
		this.deu=resources.deu;
		this.resourcesupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
		if(save_changes)
		{
			this.save();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setResources",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Planet.prototype.setData=function(data)
{
	try
	{
		var save_changes=false;
		/*if(this.name!=data.name)
		{
			save_changes=true;
			this.name=data.name;
			this.log("name");
		}*/
		if(this.diameter!=data.diameter)
		{
			save_changes=true;
			this.diameter=data.diameter;
		}
		if(this.mintemp!=data.mintemp)
		{
			save_changes=true;
			this.mintemp=data.mintemp;
		}
		if(this.maxtemp!=data.maxtemp)
		{
			save_changes=true;
			this.maxtemp=data.maxtemp;
		}
		if(save_changes)
		{
			this.save();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setData",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Planet.prototype.setPercentages=function(percentages)
{
	try
	{
		var save_changes=false;
		for(var perctype in percentages)
		{
			if(percentages[perctype]!=this[perctype+"percentage"])
			{
				this[perctype+"percentage"]=percentages[perctype];
				this.log(perctype+"percentage");
				save_changes=true;
				this.percentagesupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
			}
		}
		if(save_changes)
		{
			this.save();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPercentages",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Planet.prototype.setResourceBuildings=function(resources)
{
	try
	{
		var save_changes=false;
		for(var gid in resources.buildings)
		{
			if(gid<100)
			{
				if(resources.buildings[gid]["level"]!=this["building_"+gid])
				{
					this["building_"+gid]=resources.buildings[gid]["level"];
					this.log("building_"+gid);
					save_changes=true;
					this.buildingsupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				}
			}
			else if(gid==212)
			{
				if(resources.buildings[gid]["level"]!=this["ships_"+gid])
				{
					this["ships_"+gid]=resources.buildings[gid]["level"];
					this.log("ships_"+gid);
					save_changes=true;
				}
			}
		}
		for(var gid in resources.storages)
		{
			if(resources.storages[gid]["level"]!=this["building_"+gid])
			{
				this["building_"+gid]=resources.storages[gid]["level"];
				this.log("building_"+gid);
				save_changes=true;
				this.buildingsupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
			}
		}
		if(save_changes)
		{
			this.save();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setResourceBuildings",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Planet.prototype.setStationBuildings=function(buildings)
{
	try
	{
		var save_changes=false;
		for(var gid in buildings)
		{
			if(buildings[gid]["level"]!=this["building_"+gid])
			{
				this["building_"+gid]=buildings[gid]["level"];
				this.log("building_"+gid);
				save_changes=true;
				this.buildingsupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
			}
		}
		if(save_changes)
		{
			this.save();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setStationBuildings",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Planet.prototype.setShips=function(ships)
{
	try
	{
		var save_changes=false;
		for(var gid in ships)
		{
			if(ships[gid]["amount"]!=this["ships_"+gid])
			{
				//alert(gid+"\n"+this["ships_"+gid]+"\n->"+ships[gid]["amount"])
				this["ships_"+gid]=ships[gid]["amount"];
				this.log("ships_"+gid);
				save_changes=true;
				this.shipsupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
			}
		}
		if(save_changes)
		{
			this.save();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setShips",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Planet.prototype.setDefenses=function(defenses)
{
	try
	{
		var save_changes=false;
		for(var gid in defenses)
		{
			if(gid<500)
			{
				if(defenses[gid]["amount"]!=this["defense_"+gid])
				{
					//alert(gid+"\n"+this["defense_"+gid]+"\n->"+defenses[gid]["amount"])
					this["defense_"+gid]=defenses[gid]["amount"];
					this.log("defense_"+gid);
					save_changes=true;
					this.defensesupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				}
			}
			else
			{
				if(defenses[gid]["amount"]!=this["rockets_"+gid])
				{
					//alert(gid+"\n"+this["rockets_"+gid]+"\n->"+defenses[gid]["amount"])
					this["rockets_"+gid]=defenses[gid]["amount"];
					this.log("rockets_"+gid);
					save_changes=true;
					this.defensesupdate=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				}
			}
		}
		if(save_changes)
		{
			this.save();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setDefenses",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}
	
Planet.prototype.getLog=function(valuename)
{
	try
	{
		var getplanetlogchangesquery	=	this.AccountDB.createStatement(
			"SELECT "
				+"newamount, "
				+"updated "
			+"FROM "
				+"planet_log "
			+"WHERE "
				+"cp = ?1 "
				+"AND "
				+"changedvalue = ?2 "
			+"ORDER BY "
				+"updated ASC "
		);
		getplanetlogchangesquery.bindInt32Parameter			(0, this.cp);
		getplanetlogchangesquery.bindUTF8StringParameter	(1, valuename);
		var log=new Array();
		var i=0;
		while(getplanetlogchangesquery.executeStep())
		{
			log[i]={
				"value":	getplanetlogchangesquery.getInt64		(0),
				"updated":	getplanetlogchangesquery.getInt64		(1)
			};
			i++;
		}
		return log;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getLog",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Planet.prototype.getSolTheoricalProduction=function()
{
	return 20*this.building_4*Math.pow(1.1,this.building_4)*(1+(0.1*allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].engineer));
}

Planet.prototype.getFusTheoricalProduction=function()
{
	return 30*this.building_12*Math.pow((1.05+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].technologies.getTech(113)*0.01),this.building_12)*(1+(0.1*allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].engineer));
}

Planet.prototype.getSatTheoricalProduction=function()
{
	return Math.floor((Math.floor(this.maxtemp/4)+20)*this.ships_212)*(1+(0.1*allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].engineer));
}

Planet.prototype.getFusTheoricalConsumption=function()
{
	return 10*this.building_12*Math.pow(1.1,this.building_12)*localization.unis[this.language][this.universe]["speed"];
}

Planet.prototype.getSolProduction=function()
{
	return this.getSolTheoricalProduction()*this.solpercentage/100;
}

Planet.prototype.getFusProduction=function()
{
	return this.getFusTheoricalProduction()*this.fuspercentage/100;
}

Planet.prototype.getSatProduction=function()
{
	return this.getSatTheoricalProduction()*this.satpercentage/100;
}

Planet.prototype.getFusConsumption=function()
{
	return this.getFusTheoricalConsumption()*this.fuspercentage/100;
}

Planet.prototype.getTheoricalEnergyProduction=function()
{
	return this.getSolTheoricalProduction()+this.getFusTheoricalProduction()+this.getSatTheoricalProduction();
}

Planet.prototype.getEnergyProduction=function()
{
	return this.getSolProduction()+this.getFusProduction()+this.getSatProduction();
}

Planet.prototype.getEnergyConsumption=function()
{
	return (0.1*this.building_1*Math.pow(1.1,this.building_1)*this.metpercentage+1)
		+0.1*this.building_2*Math.pow(1.1,this.building_2)*this.crypercentage
		+0.2*this.building_3*Math.pow(1.1,this.building_3)*this.deupercentage;
}

Planet.prototype.getProductionRatio=function()
{
	return Math.min(1,this.getEnergyProduction()/this.getEnergyConsumption());
}

Planet.prototype.getMetCapacity=function()
{
	return 100000+50000*Math.ceil(Math.pow(1.6,this.building_22)-1);
}

Planet.prototype.getCryCapacity=function()
{
	return 100000+50000*Math.ceil(Math.pow(1.6,this.building_23)-1);
}

Planet.prototype.getDeuCapacity=function()
{
	return 100000+50000*Math.ceil(Math.pow(1.6,this.building_24)-1);
}

Planet.prototype.getMetTheoricalProduction=function()
{
	return 30*this.building_1*Math.pow(1.1,this.building_1)*localization.unis[this.language][this.universe]["speed"]*(1+(0.1*allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].geologist))+20*localization.unis[this.language][this.universe]["speed"]*(this.ismoon?0:1);
}

Planet.prototype.getCryTheoricalProduction=function()
{
	return 20*this.building_2*Math.pow(1.1,this.building_2)*localization.unis[this.language][this.universe]["speed"]*(1+(0.1*allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].geologist))+10*localization.unis[this.language][this.universe]["speed"]*(this.ismoon?0:1);
}

Planet.prototype.getDeuTheoricalProduction=function()
{
	return 10*this.building_3*Math.pow(1.1,this.building_3)*(-0.002*this.maxtemp+1.28)*localization.unis[this.language][this.universe]["speed"]*(1+(0.1*allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].geologist));
}

Planet.prototype.getMetProduction=function()
{
	return (this.getMetTheoricalProduction()-20*localization.unis[this.language][this.universe]["speed"]*(this.ismoon?0:1))*this.getProductionRatio()*this.metpercentage/100+20*localization.unis[this.language][this.universe]["speed"]*(this.ismoon?0:1);
}

Planet.prototype.getCryProduction=function()
{
	return (this.getCryTheoricalProduction()-10*localization.unis[this.language][this.universe]["speed"]*(this.ismoon?0:1))*this.getProductionRatio()*this.crypercentage/100+10*localization.unis[this.language][this.universe]["speed"]*(this.ismoon?0:1);
}

Planet.prototype.getDeuProduction=function()
{
	return this.getDeuTheoricalProduction()*this.getProductionRatio()*this.deupercentage/100-this.getFusConsumption();
}

Planet.prototype.getMet=function()
{
	return this.met+Math.max(0,Math.min((allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()-this.resourcesupdate)*this.getMetProduction()/3600000,Math.max(this.getMetCapacity()-this.met,0)));
}

Planet.prototype.getCry=function()
{
	return this.cry+Math.max(0,Math.min((allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()-this.resourcesupdate)*this.getCryProduction()/3600000,Math.max(this.getCryCapacity()-this.cry,0)));
}

Planet.prototype.getDeu=function()
{
	return this.deu+Math.max(0,Math.min((allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()-this.resourcesupdate)*this.getDeuProduction()/3600000,Math.max(this.getDeuCapacity()-this.deu,0)));
}

Planet.prototype.getMaxSpaces=function()
{
	return Math.floor(Math.pow(this.diameter/1000,2));
}

Planet.prototype.getCurrentSpaces=function()
{
	return this.getMaxSpaces()+this.getExpandedSpaces();
}

Planet.prototype.getFilledSpaces=function()
{
	return this.building_1+this.building_2+this.building_3+this.building_4+this.building_12+this.building_14+this.building_15+this.building_21+this.building_22+this.building_23+this.building_24+this.building_31+this.building_33+this.building_34+this.building_44+this.moonbuilding_41+this.moonbuilding_42+this.moonbuilding_43;
}

Planet.prototype.getFreeSpaces=function()
{
	return this.getCurrentSpaces()-this.getFilledSpaces();
}

Planet.prototype.getExpandedSpaces=function()
{
	return this.building_33*5+this.moonbuilding_41*3+this.ismoon;
}

Planet.prototype.updateResourcesToTimestamp=function(timestamp)
{
	if
	(
		timestamp>this.resourcesupdate
		&& timestamp<allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()
	)
	{
		this.met=this.met+Math.min((timestamp-this.resourcesupdate)*this.getMetProduction()/3600000,Math.max(this.getMetCapacity()-this.met,0));
		this.cry=this.cry+Math.min((timestamp-this.resourcesupdate)*this.getCryProduction()/3600000,Math.max(this.getCryCapacity()-this.cry,0));
		this.deu=this.deu+Math.min((timestamp-this.resourcesupdate)*this.getDeuProduction()/3600000,Math.max(this.getDeuCapacity()-this.deu,0));
		this.logAtTimestamp("met",timestamp);
		this.logAtTimestamp("cry",timestamp);
		this.logAtTimestamp("deu",timestamp);
		this.logAtTimestamp("ene",timestamp);
		//this.resourcesupdate=timestamp;
	}
}
