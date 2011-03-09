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
function PlanetContainer(language,universe,ogameid,AccountDB)
{
	try
	{
		this.planets		=	new Array();		//PIANETI CLASSIFICATI TRAMITE IL LORO GD
		this.planetids		=	new Array();		//LISTA DEI PIANETI ACCESSIBILE IN SCANSIONE
		this.planetcoords	=	new Array();		//ID DEI PIANETI INDICIZZATI IN BASE ALLE LORO COORDINATE
		this.language=language;
		this.universe=universe;
		this.ogameid=ogameid;
		this.AccountDB		=	AccountDB;
		this.currentplanet	=	0;
		var getplanetsquery	=	AccountDB.createStatement(
			"SELECT "
				+"cp, "
				+"id, "
				+"x, "
				+"y, "
				+"z, "
				+"ismoon, "
				+"pl_group, "
				+"pl_type, "
				+"name, "
				+"diameter, "
				+"maxtemp, "
				+"mintemp, "
				+"creation, "
				+"met, "
				+"cry, "
				+"deu, "
				+"resourcesupdate, "
				+"metpercentage, "
				+"crypercentage, "
				+"deupercentage, "
				+"solpercentage, "
				+"fuspercentage, "
				+"satpercentage, "
				+"percentagesupdate, "
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
				+"buildingsupdate, "
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
				+"shipsupdate, "
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
				+"defensesupdate "
			+"FROM "
				+"planets "
			+"ORDER BY "
				+"id ASC "
		);
		while(getplanetsquery.executeStep())
		{
			var cp					=	getplanetsquery.getInt32		(0);
			var id					=	getplanetsquery.getInt32		(1);
			var x					=	getplanetsquery.getInt32		(2);
			var y					=	getplanetsquery.getInt32		(3);
			var z					=	getplanetsquery.getInt32		(4);
			var ismoon				=	getplanetsquery.getInt32		(5);
			var group				=	getplanetsquery.getInt32		(6);
			var type				=	getplanetsquery.getInt32		(7);
			var name				=	getplanetsquery.getUTF8String	(8);
			var diameter			=	getplanetsquery.getInt32		(9);
			var maxtemp				=	getplanetsquery.getInt32		(10);
			var mintemp				=	getplanetsquery.getInt32		(11);
			var creation			=	getplanetsquery.getInt64		(12);
			var met					=	getplanetsquery.getInt32		(13);
			var cry					=	getplanetsquery.getInt32		(14);
			var deu					=	getplanetsquery.getInt32		(15);
			var resourcesupdate		=	getplanetsquery.getInt64		(16);
			var metpercentage		=	getplanetsquery.getInt32		(17);
			var crypercentage		=	getplanetsquery.getInt32		(18);
			var deupercentage		=	getplanetsquery.getInt32		(19);
			var solpercentage		=	getplanetsquery.getInt32		(20);
			var fuspercentage		=	getplanetsquery.getInt32		(21);
			var satpercentage		=	getplanetsquery.getInt32		(22);
			var percentagesupdate	=	getplanetsquery.getInt64		(23);
			var building_1			=	getplanetsquery.getInt32		(24);
			var building_2			=	getplanetsquery.getInt32		(25);
			var building_3			=	getplanetsquery.getInt32		(26);
			var building_4			=	getplanetsquery.getInt32		(27);
			var building_12			=	getplanetsquery.getInt32		(28);
			var building_14			=	getplanetsquery.getInt32		(29);
			var building_15			=	getplanetsquery.getInt32		(30);
			var building_21			=	getplanetsquery.getInt32		(31);
			var building_22			=	getplanetsquery.getInt32		(32);
			var building_23			=	getplanetsquery.getInt32		(33);
			var building_24			=	getplanetsquery.getInt32		(34);
			var building_31			=	getplanetsquery.getInt32		(35);
			var building_33			=	getplanetsquery.getInt32		(36);
			var building_34			=	getplanetsquery.getInt32		(37);
			var building_44			=	getplanetsquery.getInt32		(38);
			var moonbuilding_41		=	getplanetsquery.getInt32		(39);
			var moonbuilding_42		=	getplanetsquery.getInt32		(40);
			var moonbuilding_43		=	getplanetsquery.getInt32		(41);
			var buildingsupdate		=	getplanetsquery.getInt64		(42);
			var ships_202			=	getplanetsquery.getInt32		(43);
			var ships_203			=	getplanetsquery.getInt32		(44);
			var ships_204			=	getplanetsquery.getInt32		(45);
			var ships_205			=	getplanetsquery.getInt32		(46);
			var ships_206			=	getplanetsquery.getInt32		(47);
			var ships_207			=	getplanetsquery.getInt32		(48);
			var ships_208			=	getplanetsquery.getInt32		(49);
			var ships_209			=	getplanetsquery.getInt32		(50);
			var ships_210			=	getplanetsquery.getInt32		(51);
			var ships_211			=	getplanetsquery.getInt32		(52);
			var ships_212			=	getplanetsquery.getInt32		(53);
			var ships_213			=	getplanetsquery.getInt32		(54);
			var ships_214			=	getplanetsquery.getInt32		(55);
			var ships_215			=	getplanetsquery.getInt32		(56);
			var shipsupdate			=	getplanetsquery.getInt64		(57);
			var defense_401			=	getplanetsquery.getInt32		(58);
			var defense_402			=	getplanetsquery.getInt32		(59);
			var defense_403			=	getplanetsquery.getInt32		(60);
			var defense_404			=	getplanetsquery.getInt32		(61);
			var defense_405			=	getplanetsquery.getInt32		(62);
			var defense_406			=	getplanetsquery.getInt32		(63);
			var defense_407			=	getplanetsquery.getInt32		(64);
			var defense_408			=	getplanetsquery.getInt32		(65);
			var rockets_502			=	getplanetsquery.getInt32		(66);
			var rockets_503			=	getplanetsquery.getInt32		(67);
			var defensesupdate		=	getplanetsquery.getInt64		(68);
			this.planetids[id]		=	cp;
			this.planetcoords[x+":"+y+":"+z+"_"+ismoon]=id;
			this.planets[cp]		=	new Planet(
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
			);
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

PlanetContainer.prototype.setPlanetPercentages=function(percentages)
{
	try
	{
		this.planets[this.planetids[this.currentplanet]].setPercentages(percentages);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlanetPercentages",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

PlanetContainer.prototype.setPlanetResourceBuildings=function(buildings)
{
	try
	{
		this.planets[this.planetids[this.currentplanet]].setResourceBuildings(buildings);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlanetResourceBuildings",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

PlanetContainer.prototype.updateAllPlanetResourcesToTimestamp=function(timestamp)
{
	try
	{
		//THIS FUNCTION SHOULD UPDATE RESOURCES WHEN SOMETHING CHANGES IN TECHNOLOGIES OR COMMANDER STUFF... STILL HAS TO BE IMPLEMENTED... ALSO CONNECT IT TO CLASS Events()
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"updateAllPlanetResourcesToTimestamp",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

PlanetContainer.prototype.setPlanetStationBuildings=function(buildings)
{
	try
	{
		this.planets[this.planetids[this.currentplanet]].setStationBuildings(buildings);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlanetStationBuildings",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

PlanetContainer.prototype.setPlanetShips=function(ships)
{
	try
	{
		this.planets[this.planetids[this.currentplanet]].setShips(ships);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlanetShips",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

PlanetContainer.prototype.setPlanetDefenses=function(defenses)
{
	try
	{
		this.planets[this.planetids[this.currentplanet]].setDefenses(defenses);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlanetDefenses",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

PlanetContainer.prototype.setPlanetData=function(data)
{
	try
	{
		this.planets[this.planetids[this.currentplanet]].setData(data);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlanetData",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

PlanetContainer.prototype.setPlanetResources=function(resources)
{
	try
	{
		this.planets[this.planetids[this.currentplanet]].setResources(resources);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlanetResources",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

PlanetContainer.prototype.getPlanetIdByCoords=function(x,y,z,ismoon)
{
	return (typeof this.planetcoords[x+":"+y+":"+z+"_"+ismoon]!="undefined")?(this.planetcoords[x+":"+y+":"+z+"_"+ismoon]):(-1);
}

PlanetContainer.prototype.setPlanets=function(planets,selected)
{
	try
	{
		if
		(
			selected>=0
			&& planets.length>=1
		)
		{
			var colonization_changes	=	false;
			var planet_changes			=	false;
			for(var i in planets)
			{
				if
				(
					planets[i].cp==0
				)
				{
					if(this.planetids[i]>0)
					{
						planets[i].cp=this.planetids[i];
					}
					else
					{
						//STORE THIS PLANETCP FOR NOW?
					}
				}
				if
				(
					this.planetids.length!=planets.length
					|| this.planetids[i]!=planets[i].cp
				)
				{
					colonization_changes	=	true;
				}
			}
			this.currentplanet=selected;
			if(colonization_changes)
			{
				var newplanetcps=new Array();
				for(var i in planets)
				{
					if
					(
						this.planetids[i]==0
						&& planets[i].cp>0
					)
					{
						var updateplanets	=	this.AccountDB.createStatement(
							"UPDATE "
								+"planets "
							+"SET "
								+"cp = ?1 "
							+"WHERE "
								+"cp = 0 "
						);
						updateplanets.bindInt64Parameter(0,planets[i].cp);
						updateplanets.execute();
						var updateloggedplanets	=	this.AccountDB.createStatement(
							"UPDATE "
								+"colonization_log "
							+"SET "
								+"addedcp = ?1 "
							+"WHERE "
								+"addedcp = 0 "
						);
						updateloggedplanets.bindInt64Parameter(0,planets[i].cp);
						updateloggedplanets.execute();
						var updateplanetlogs	=	this.AccountDB.createStatement(
							"UPDATE "
								+"planet_log "
							+"SET "
								+"cp = ?1 "
							+"WHERE "
								+"cp = 0 "
						);
						updateplanetlogs.bindInt64Parameter(0,planets[i].cp);
						updateplanetlogs.execute();
						this.planets[0].cp=planets[i].cp;
						this.planets[planets[i].cp]=this.planets[0];
						//delete this.planets[0];
						this.planetcoords[planets[i].x+":"+planets[i].y+":"+planets[i].z+"_"+planets[i].ismoon]=i;
					}
					newplanetcps.push(planets[i].cp);
				}
				this.planetids=newplanetcps;
				var logdeletedplanets	=	this.AccountDB.createStatement(
					"INSERT INTO "
						+"colonization_log "
							+"( "
								+"removedcp, "
								+"updated "
							+") "
							+"SELECT "
								+"cp, "
								+"?1 "
							+"FROM "
								+"planets "
							+"WHERE "
								+"cp NOT IN ("+this.planetids.join(",")+") "
				);
				logdeletedplanets.bindInt64Parameter(0, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
				logdeletedplanets.execute();
				var deleteoldplanets	=	this.AccountDB.createStatement(
					"DELETE FROM "
						+"planets "
					+"WHERE "
						+"cp NOT IN ("+this.planetids.join(",")+") "
				);
				deleteoldplanets.execute();
				/*var updateplanetindexquery	=	this.AccountDB.createStatement(
					"UPDATE "
						+"planets "
					+"SET "
						+"id = ?1 "
					+"WHERE "
						+"cp = ?2 "
				);*/
				for(var i=0;i<this.planetids.length;i++)
				{
					this.planetcoords[planets[i].x+":"+planets[i].y+":"+planets[i].z+"_"+planets[i].ismoon]=i;
					if(typeof this.planets[this.planetids[i]]=="undefined")
					{
						var newplanetquery	=	this.AccountDB.createStatement(
							"INSERT INTO "
								+"planets "
									+"( "
										+"cp, "
										+"id, "
										+"x, "
										+"y, "
										+"z, "
										+"ismoon, "
										+"name, "
										+"creation "
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
										+"?8 "
									+") "
						);
						newplanetquery.bindInt32Parameter			(0, planets[i].cp);
						newplanetquery.bindInt32Parameter			(1, i);
						newplanetquery.bindInt32Parameter			(2, planets[i].x);
						newplanetquery.bindInt32Parameter			(3, planets[i].y);
						newplanetquery.bindInt32Parameter			(4, planets[i].z);
						newplanetquery.bindInt32Parameter			(5, planets[i].ismoon);
						newplanetquery.bindUTF8StringParameter		(6, planets[i].name);
						newplanetquery.bindInt64Parameter			(7, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
						newplanetquery.execute();
						var logaddedplanets	=	this.AccountDB.createStatement(
							"INSERT INTO "
								+"colonization_log "
									+"( "
										+"addedcp, "
										+"updated "
									+") "
									+"VALUES "
									+"( "
										+"?1, "
										+"?2 "
									+") "
						);
						logaddedplanets.bindInt32Parameter			(0, this.planetids[i]);
						logaddedplanets.bindInt64Parameter			(1, allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
						logaddedplanets.execute();
						this.planets[this.planetids[i]]=new Planet(
							this.language,
							this.universe,
							this.ogameid,
							this.AccountDB,
							i,
							this.planetids[i],
							planets[i].x,
							planets[i].y,
							planets[i].z,
							planets[i].ismoon,
							planets[i].group,
							planets[i].type,
							planets[i].name,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0
						)
					}
					/*else
					{
						updateplanetindexquery.bindInt32Parameter			(0, i);
						updateplanetindexquery.bindInt32Parameter			(1, this.planetids[i]);
						updateplanetindexquery.execute();
					}*/
				}
				for(var i=0;i<this.planetids.length;i++)
				{
					var updateplanetindexquery	=	this.AccountDB.createStatement(
					"UPDATE "
						+"planets "
					+"SET "
						+"id = ?1 "
					+"WHERE "
						+"cp = ?2 "
					);
					updateplanetindexquery.bindInt32Parameter			(0, i);
					updateplanetindexquery.bindInt32Parameter			(1, this.planetids[i]);
					updateplanetindexquery.execute();
				}
			}
			for(var i in planets)
			{
				//CHECK PLANET DATA CHANGES
				this.planets[this.planetids[i]].updatePlanetInfo(planets[i]);
			}
		}
		else
		{
			//THROW ERROR?
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlanets",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}