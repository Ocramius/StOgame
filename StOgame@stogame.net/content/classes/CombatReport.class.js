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
function CombatReport(language,universe,ogameid,messageid)
{
	try
	{
		this.language	=	language;
		this.universe	=	universe;
		this.ogameid	=	ogameid;
		this.messageid	=	messageid;
		this.load();
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

CombatReport.prototype.get=function()
{
	try
	{
		return {
			"language":				this.language,
			"universe":				this.universe,
			"ogameid":				this.ogameid,
			"messageid":			this.messageid,
			"timestamp":			this.timestamp,
			"x":					this.x,
			"y":					this.y,
			"z":					this.z,
			"ismoon":				this.ismoon,
			"attackerlosses":		this.attackerlosses,
			"defenderlosses":		this.defenderlosses,
			"attackerunits":		this.attackerunits,
			"defenderunits":		this.defenderunits,
			"attackerlossesnumber":	this.attackerlossesnumber,
			"defenderlossesnumber":	this.defenderlossesnumber,
			"met":					this.met,
			"cry":					this.cry,
			"deu":					this.deu,
			"debrismet":			this.debrismet,
			"debriscry":			this.debriscry,
			"victory":				this.victory,
			"rebuilt_401":			this.rebuilt_401,
			"rebuilt_402":			this.rebuilt_402,
			"rebuilt_403":			this.rebuilt_403,
			"rebuilt_404":			this.rebuilt_404,
			"rebuilt_405":			this.rebuilt_405,
			"rebuilt_406":			this.rebuilt_406,
			"rebuilt_407":			this.rebuilt_407,
			"rebuilt_408":			this.rebuilt_408,
			"submitted":			this.submitted,
			"attackers":			this.attackers,
			"defenders":			this.defenders
		};
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

CombatReport.prototype.load=function()
{
	try
	{
		var getcrquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"SELECT "
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
				+"messageid=?1"
		);
		getcrquery.bindInt64Parameter(0,this.messageid);
		if(getcrquery.executeStep())
		{
			this.timestamp=getcrquery.getInt64(1);
			this.x=getcrquery.getInt32(2);
			this.y=getcrquery.getInt32(3);
			this.z=getcrquery.getInt32(4);
			this.ismoon=getcrquery.getInt32(5);
			this.attackerlosses=getcrquery.getInt64(6);
			this.defenderlosses=getcrquery.getInt64(7);
			this.attackerunits=getcrquery.getInt64(8);
			this.defenderunits=getcrquery.getInt64(9);
			this.attackerlossesnumber=getcrquery.getInt64(10);
			this.defenderlossesnumber=getcrquery.getInt64(11);
			this.met=getcrquery.getInt64(12);
			this.cry=getcrquery.getInt64(13);
			this.deu=getcrquery.getInt64(14);
			this.debrismet=getcrquery.getInt64(15);
			this.debriscry=getcrquery.getInt64(16);
			this.victory=getcrquery.getInt64(17);
			this.rebuilt_401=getcrquery.getInt64(18);
			this.rebuilt_402=getcrquery.getInt64(19);
			this.rebuilt_403=getcrquery.getInt64(20);
			this.rebuilt_404=getcrquery.getInt64(21);
			this.rebuilt_405=getcrquery.getInt64(22);
			this.rebuilt_406=getcrquery.getInt64(23);
			this.rebuilt_407=getcrquery.getInt64(24);
			this.rebuilt_408=getcrquery.getInt64(25);
			this.submitted=getcrquery.getInt64(26);
		}
		else
		{
			this.timestamp=0;
			this.x=0;
			this.y=0;
			this.z=0;
			this.ismoon=0;
			this.attackerlosses=0;
			this.defenderlosses=0;
			this.attackerunits=0;
			this.defenderunits=0;
			this.attackerlossesnumber=0;
			this.defenderlossesnumber=0;
			this.met=0;
			this.cry=0;
			this.deu=0;
			this.debrismet=0;
			this.debriscry=0;
			this.victory=0;
			this.rebuilt_401=0;
			this.rebuilt_402=0;
			this.rebuilt_403=0;
			this.rebuilt_404=0;
			this.rebuilt_405=0;
			this.rebuilt_406=0;
			this.rebuilt_407=0;
			this.rebuilt_408=0;
			this.submitted=0;
		}
		this.attackers=new Array();
		this.defenders=new Array();
		var players=["attackers","defenders"];
		var getpartecipantsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"SELECT "
				+"messageid,"
				+"position,"
				+"id,"
				+"x,"
				+"y,"
				+"z,"
				+"ismoon,"
				+"ogameid,"
				+"weapons,"
				+"shields,"
				+"armour "
			+"FROM "
				+"combat_partecipants "
			+"WHERE "
				+"messageid=?1 "
			+"ORDER BY "
				+"position ASC,"
				+"id ASC"
		);
		getpartecipantsquery.bindInt64Parameter(0,this.messageid);
		while(getpartecipantsquery.executeStep())
		{
			this[players[getpartecipantsquery.getInt32(1)]][getpartecipantsquery.getInt32(2)]=
			{
				"x":		getpartecipantsquery.getInt32(3),
				"y":		getpartecipantsquery.getInt32(4),
				"z":		getpartecipantsquery.getInt32(5),
				"ismoon":	getpartecipantsquery.getInt32(6),
				"ogameid":	getpartecipantsquery.getInt32(7),
				"weapons":	getpartecipantsquery.getInt32(8),
				"shields":	getpartecipantsquery.getInt32(9),
				"armour":	getpartecipantsquery.getInt32(10),
				"rounds":	new Array()
			};
		}
		//GET CR ROUNDS HERE!
		var getroundsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"SELECT "
				+"messageid,"
				+"partecipant_position,"
				+"partecipant_id,"
				+"round,"
				+"ship_202,"
				+"ship_203,"
				+"ship_204,"
				+"ship_205,"
				+"ship_206,"
				+"ship_207,"
				+"ship_208,"
				+"ship_209,"
				+"ship_210,"
				+"ship_211,"
				+"ship_212,"
				+"ship_213,"
				+"ship_214,"
				+"ship_215,"
				+"defense_401,"
				+"defense_402,"
				+"defense_403,"
				+"defense_404,"
				+"defense_405,"
				+"defense_406,"
				+"defense_407,"
				+"defense_408 "
			+"FROM "
				+"combat_rounds "
			+"WHERE "
				+"messageid=?1 "
			+"ORDER BY "
				+"partecipant_position ASC,"
				+"partecipant_id ASC,"
				+"round ASC"
		);
		getroundsquery.bindInt64Parameter(0,this.messageid);
		while(getroundsquery.executeStep())
		{
			if(this[players[getroundsquery.getInt32(1)]][getroundsquery.getInt32(2)])
			{
				this[players[getroundsquery.getInt32(1)]][getroundsquery.getInt32(2)].rounds.push
				(
					{
						"ship_202": getroundsquery.getInt64(4),
						"ship_203": getroundsquery.getInt64(5),
						"ship_204": getroundsquery.getInt64(6),
						"ship_205": getroundsquery.getInt64(7),
						"ship_206": getroundsquery.getInt64(8),
						"ship_207": getroundsquery.getInt64(9),
						"ship_208": getroundsquery.getInt64(10),
						"ship_209": getroundsquery.getInt64(11),
						"ship_210": getroundsquery.getInt64(12),
						"ship_211": getroundsquery.getInt64(13),
						"ship_212": getroundsquery.getInt64(14),
						"ship_213": getroundsquery.getInt64(15),
						"ship_214": getroundsquery.getInt64(16),
						"ship_215": getroundsquery.getInt64(17),
						"defense_401": getroundsquery.getInt64(18),
						"defense_402": getroundsquery.getInt64(19),
						"defense_403": getroundsquery.getInt64(20),
						"defense_404": getroundsquery.getInt64(21),
						"defense_405": getroundsquery.getInt64(22),
						"defense_406": getroundsquery.getInt64(23),
						"defense_407": getroundsquery.getInt64(24),
						"defense_408": getroundsquery.getInt64(25)
					}
				);
			}
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

CombatReport.prototype.set=function(data)
{
	try
	{
		var save_changes=false;
		/*//SETS CR DATA
		var s="___________";
		for(var i in data)
		{
			s+="\n"+i+": "+data[i];
		}
		//alert(s);*/
		for(var i in data)
		{
			if
			(
				i!="messageid"
				&& i!="attackers"
				&& i!="defenders"
			)
			{
				if(this[i]!=data[i])
				{
					save_changes=true;
					this[i]=data[i];
					this.submitted=0;
				}
			}
			else if
			(
				i=="attackers"
				|| i=="defenders"
			)
			{
				for(var j=0;j<data[i].length;j++)
				{
					if(!this[i][j])
					{
						this[i][j]=
						{
							"rounds": new Array()
						};
					}
					//var s=i+"\n___________";
					for(var k in data[i][j])
					{
						//s+="\n"+k+": "+data[i][j][k];
						if(k!="rounds")
						{
							if
							(
								!this[i][j][k]
								|| this[i][j][k]!=data[i][j][k]
							)
							{
								save_changes=true;
								this[i][j][k]=data[i][j][k];
								this.submitted=0;
							}
						}
						else
						{
							if(!this[i][j].rounds)
							{
								this[i][j].rounds=new Array();
							}
							for(var l=0;l<data[i][j].rounds.length;l++)
							{
								if(!this[i][j].rounds[l])
								{
									this[i][j].rounds[l]={};
								}
								for(var m in data[i][j].rounds[l])
								{
									if
									(
										!this[i][j].rounds[l][m]
										|| this[i][j].rounds[l][m]!=data[i][j].rounds[l][m]
									)
									{
										save_changes=true;
										this[i][j].rounds[l][m]=data[i][j].rounds[l][m];
										this.submitted=0;
									}
								}
							}
							for(var m=this[i][j].rounds.length;m>=l;m--)
							{
								delete this[i][j].rounds[m];
							}
							//MANAGE ROUNDS
						}
					}
					//alert(s);
				}
				for(var l=this[i].length;l>=j;l--)
				{
					delete this[i][l];
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
			"set",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

CombatReport.prototype.save=function()
{
	try
	{
		if(this.messageid>0)
		{
			var setcrquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
				"INSERT OR REPLACE INTO "
					+"combat_reports "
						+"( "
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
							+"?27 "
						+") "
			);
			setcrquery.bindInt64Parameter(0,this.messageid);
			setcrquery.bindInt64Parameter(1,ST_parseInt(this.timestamp));
			setcrquery.bindInt32Parameter(2,ST_parseInt(this.x));
			setcrquery.bindInt32Parameter(3,ST_parseInt(this.y));
			setcrquery.bindInt32Parameter(4,ST_parseInt(this.z));
			setcrquery.bindInt32Parameter(5,ST_parseInt(this.ismoon));
			setcrquery.bindInt64Parameter(6,ST_parseInt(this.attackerlosses));
			setcrquery.bindInt64Parameter(7,ST_parseInt(this.defenderlosses));
			setcrquery.bindInt64Parameter(8,ST_parseInt(this.attackerunits));
			setcrquery.bindInt64Parameter(9,ST_parseInt(this.defenderunits));
			setcrquery.bindInt64Parameter(10,ST_parseInt(this.attackerlossesnumber));
			setcrquery.bindInt64Parameter(11,ST_parseInt(this.defenderlossesnumber));
			setcrquery.bindInt64Parameter(12,ST_parseInt(this.met));
			setcrquery.bindInt64Parameter(13,ST_parseInt(this.cry));
			setcrquery.bindInt64Parameter(14,ST_parseInt(this.deu));
			setcrquery.bindInt64Parameter(15,ST_parseInt(this.debrismet));
			setcrquery.bindInt64Parameter(16,ST_parseInt(this.debriscry));
			setcrquery.bindInt32Parameter(17,ST_parseInt(this.victory));
			setcrquery.bindInt64Parameter(18,ST_parseInt(this.rebuilt_401));
			setcrquery.bindInt64Parameter(19,ST_parseInt(this.rebuilt_402));
			setcrquery.bindInt64Parameter(20,ST_parseInt(this.rebuilt_403));
			setcrquery.bindInt64Parameter(21,ST_parseInt(this.rebuilt_404));
			setcrquery.bindInt64Parameter(22,ST_parseInt(this.rebuilt_405));
			setcrquery.bindInt64Parameter(23,ST_parseInt(this.rebuilt_406));
			setcrquery.bindInt64Parameter(24,ST_parseInt(this.rebuilt_407));
			setcrquery.bindInt64Parameter(25,ST_parseInt(this.rebuilt_408));
			setcrquery.bindInt32Parameter(26,ST_parseInt(this.submitted));
			//setcrquery.execute();
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(setcrquery);
			//NOW INSERT PLAYERS AND ROUNDS...
			var deleteplayersquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
				"DELETE FROM "
					+"combat_partecipants "
				+"WHERE "
					+"messageid=?1"
			);
			deleteplayersquery.bindInt64Parameter(0,this.messageid);
			//deleteplayersquery.execute();
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(deleteplayersquery);
			var deleteroundsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
				"DELETE FROM "
					+"combat_rounds "
				+"WHERE "
					+"messageid=?1"
			);
			deleteroundsquery.bindInt64Parameter(0,this.messageid);
			//deleteroundsquery.execute();
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(deleteroundsquery);
			var players=["attackers","defenders"];
			for(var i in players)
			{
				for(var j in this[players[i]])
				{
					var insertplayersquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
						"INSERT INTO "
							+"combat_partecipants "
								+"( "
									+"messageid,"
									+"position,"
									+"id,"
									+"x,"
									+"y,"
									+"z,"
									+"ismoon,"
									+"ogameid,"
									+"weapons,"
									+"shields,"
									+"armour"
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
									+"?11 "
								+") "
					);
					insertplayersquery.bindInt64Parameter(0,this.messageid);
					insertplayersquery.bindInt32Parameter(1,i);
					insertplayersquery.bindInt32Parameter(2,j);
					insertplayersquery.bindInt32Parameter(3,ST_parseInt(this[players[i]][j].x));
					insertplayersquery.bindInt32Parameter(4,ST_parseInt(this[players[i]][j].y));
					insertplayersquery.bindInt32Parameter(5,ST_parseInt(this[players[i]][j].z));
					insertplayersquery.bindInt32Parameter(6,ST_parseInt(this[players[i]][j].ismoon));
					insertplayersquery.bindInt32Parameter(7,ST_parseInt(this[players[i]][j].ogameid));
					insertplayersquery.bindInt32Parameter(8,ST_parseInt(this[players[i]][j].weapons));
					insertplayersquery.bindInt32Parameter(9,ST_parseInt(this[players[i]][j].shields));
					insertplayersquery.bindInt32Parameter(10,ST_parseInt(this[players[i]][j].armour));
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertplayersquery);
					//insertplayersquery.execute();
					//MANAGE ROUNDS HERE!
					for(var k in this[players[i]][j].rounds)
					{
						var insertroundsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
							"INSERT INTO "
								+"combat_rounds "
									+"( "
										+"messageid,"
										+"partecipant_position,"
										+"partecipant_id,"
										+"round,"
										+"ship_202,"
										+"ship_203,"
										+"ship_204,"
										+"ship_205,"
										+"ship_206,"
										+"ship_207,"
										+"ship_208,"
										+"ship_209,"
										+"ship_210,"
										+"ship_211,"
										+"ship_212,"
										+"ship_213,"
										+"ship_214,"
										+"ship_215,"
										+"defense_401,"
										+"defense_402,"
										+"defense_403,"
										+"defense_404,"
										+"defense_405,"
										+"defense_406,"
										+"defense_407,"
										+"defense_408 "
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
										+"?26 "
									+") "
						);
						insertroundsquery.bindInt64Parameter(0,this.messageid);
						insertroundsquery.bindInt32Parameter(1,i);
						insertroundsquery.bindInt32Parameter(2,j);
						insertroundsquery.bindInt32Parameter(3,k);
						insertroundsquery.bindInt64Parameter(4,ST_parseInt(this[players[i]][j].rounds[k].ship_202));
						insertroundsquery.bindInt64Parameter(5,ST_parseInt(this[players[i]][j].rounds[k].ship_203));
						insertroundsquery.bindInt64Parameter(6,ST_parseInt(this[players[i]][j].rounds[k].ship_204));
						insertroundsquery.bindInt64Parameter(7,ST_parseInt(this[players[i]][j].rounds[k].ship_205));
						insertroundsquery.bindInt64Parameter(8,ST_parseInt(this[players[i]][j].rounds[k].ship_206));
						insertroundsquery.bindInt64Parameter(9,ST_parseInt(this[players[i]][j].rounds[k].ship_207));
						insertroundsquery.bindInt64Parameter(10,ST_parseInt(this[players[i]][j].rounds[k].ship_208));
						insertroundsquery.bindInt64Parameter(11,ST_parseInt(this[players[i]][j].rounds[k].ship_209));
						insertroundsquery.bindInt64Parameter(12,ST_parseInt(this[players[i]][j].rounds[k].ship_210));
						insertroundsquery.bindInt64Parameter(13,ST_parseInt(this[players[i]][j].rounds[k].ship_211));
						insertroundsquery.bindInt64Parameter(14,ST_parseInt(this[players[i]][j].rounds[k].ship_212));
						insertroundsquery.bindInt64Parameter(15,ST_parseInt(this[players[i]][j].rounds[k].ship_213));
						insertroundsquery.bindInt64Parameter(16,ST_parseInt(this[players[i]][j].rounds[k].ship_214));
						insertroundsquery.bindInt64Parameter(17,ST_parseInt(this[players[i]][j].rounds[k].ship_215));
						insertroundsquery.bindInt64Parameter(18,ST_parseInt(this[players[i]][j].rounds[k].defense_401));
						insertroundsquery.bindInt64Parameter(19,ST_parseInt(this[players[i]][j].rounds[k].defense_402));
						insertroundsquery.bindInt64Parameter(20,ST_parseInt(this[players[i]][j].rounds[k].defense_403));
						insertroundsquery.bindInt64Parameter(21,ST_parseInt(this[players[i]][j].rounds[k].defense_404));
						insertroundsquery.bindInt64Parameter(22,ST_parseInt(this[players[i]][j].rounds[k].defense_405));
						insertroundsquery.bindInt64Parameter(23,ST_parseInt(this[players[i]][j].rounds[k].defense_406));
						insertroundsquery.bindInt64Parameter(24,ST_parseInt(this[players[i]][j].rounds[k].defense_407));
						insertroundsquery.bindInt64Parameter(25,ST_parseInt(this[players[i]][j].rounds[k].defense_408));
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(insertroundsquery);
						//insertroundsquery.execute();
					}
				}
			}
		}
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