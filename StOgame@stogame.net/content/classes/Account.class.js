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
function Account(language,universe,ogameid)
{
	try
	{
		this.language=language;
		this.universe=universe;
		this.ogameid=ogameid;
		localization.retrieveLocalizationStrings(language);
		this.getnewspoller=setInterval(
			function()
			{
				localization.getNews(this.language,this.universe,this.ogameid);
			},
			600000,
			language
		);
		var currentdate			=	new Date();
		this.servertimestamp	=	Date.UTC(currentdate.getFullYear(),currentdate.getMonth(),currentdate.getDate(),currentdate.getHours(),currentdate.getMinutes(),currentdate.getSeconds(),currentdate.getMilliseconds());
		this.timestampdiff		=	0;
		var currentdate=new Date();
		this.clientcurrenttimestamp=Date.UTC(currentdate.getFullYear(),currentdate.getMonth(),currentdate.getDate(),currentdate.getHours(),currentdate.getMinutes(),currentdate.getSeconds(),currentdate.getMilliseconds());
		this.servercurrenttimestamp=this.clientcurrenttimestamp+this.timestampdiff;
		this.AccountDB=accountdatabases.getDataBase(language,universe,ogameid);
		this.storagemanager=new ST_StorageManager(this);
		//THIS CODE BECOMES UNNECESSARY BECAUSE OF THE NEW SAMPLE FILES INCLUDED IN THE STOGAME3 XPI
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"activities "
					+"("
						+"x INTEGER, "
						+"y INTEGER, "
						+"z INTEGER, "
						+"timestamp INTEGER, "
						+"PRIMARY KEY "
							+"("
								+"x,"
								+"y,"
								+"z, "
								+"timestamp "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		/*this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"main_information "
					+"("
						+"language TEXT, "
						+"universe INTEGER, "
						+"ogameid INTEGER, "
						+"nickname TEXT, "
						+"alliance TEXT, "
						+"email TEXT, "
						+"lastsessionid TEXT, "
						+"commander INTEGER, "
						+"admiral INTEGER, "
						+"engineer INTEGER, "
						+"geologist INTEGER, "
						+"technocrat INTEGER, "
						+"skin TEXT, "
						+"universespeed INTEGER, "
						+"serverdomain TEXT, "
						+"updated INTEGER,"
						+"PRIMARY KEY "
							+"("
								+"language,"
								+"universe,"
								+"ogameid "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"options "
					+"("
						+"type TEXT, "
						+"name TEXT, "
						+"number INTEGER, "
						+"value TEXT, "
						+"updated INTEGER,"
						+"PRIMARY KEY "
							+"("
								+"type,"
								+"name, "
								+"number "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"technologies "
					+"("
						+"gid INTEGER, "
						+"value INTEGER, "
						+"updated INTEGER, "
						+"PRIMARY KEY "
							+"( "
								+"gid"
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"technologies_log "
					+"("
						+"gid INTEGER, "
						+"value INTEGER, "
						+"updated INTEGER "
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"messages "
					+"("
						+"messageid INTEGER, "
						+"timestamp INTEGER, "
						+"senderogameid INTEGER, "
						+"title TEXT, "
						+"message TEXT, "
						+"submitted INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"messageid "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"sentmessages "
					+"("
						+"replytomessageid INTEGER, "
						+"timestamp INTEGER, "
						+"targetogameid INTEGER, "
						+"title TEXT, "
						+"message TEXT, "
						+"submitted INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"timestamp "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"circularmails "
					+"("
						+"messageid INTEGER, "
						+"timestamp INTEGER, "
						+"allyid INTEGER, "
						+"message TEXT, "
						+"submitted INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"messageid "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"sightedmessages "
					+"("
						+"messageid INTEGER, "
						+"timestamp INTEGER, "
						+"fromgalaxy INTEGER, "
						+"fromsystem INTEGER, "
						+"fromplanet INTEGER, "
						+"fromismoon INTEGER, "
						+"togalaxy INTEGER, "
						+"tosystem INTEGER, "
						+"toplanet INTEGER, "
						+"toismoon INTEGER, "
						+"perc INTEGER, "
						+"submitted INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"messageid "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"spyreports "
					+"("
						+"x INTEGER, "
						+"y INTEGER, "
						+"z INTEGER, "
						+"ismoon INTEGER, "
						+"timestamp INTEGER, "
						+"messageid INTEGER, "
						+"met INTEGER, "
						+"cry INTEGER, "
						+"deu INTEGER, "
						+"ene INTEGER, "
						+"antispionage INTEGER, "
						+"building_1 INTEGER, "
						+"building_2 INTEGER, "
						+"building_3 INTEGER, "
						+"building_4 INTEGER, "
						+"building_12 INTEGER, "
						+"building_14 INTEGER, "
						+"building_15 INTEGER, "
						+"building_21 INTEGER, "
						+"building_22 INTEGER, "
						+"building_23 INTEGER, "
						+"building_24 INTEGER, "
						+"building_31 INTEGER, "
						+"building_33 INTEGER, "
						+"building_34 INTEGER, "
						+"building_44 INTEGER, "
						+"moonbuilding_41 INTEGER, "
						+"moonbuilding_42 INTEGER, "
						+"moonbuilding_43 INTEGER, "
						+"building_timestamp INTEGER, "
						+"ships_202 INTEGER, "
						+"ships_203 INTEGER, "
						+"ships_204 INTEGER, "
						+"ships_205 INTEGER, "
						+"ships_206 INTEGER, "
						+"ships_207 INTEGER, "
						+"ships_208 INTEGER, "
						+"ships_209 INTEGER, "
						+"ships_210 INTEGER, "
						+"ships_211 INTEGER, "
						+"ships_212 INTEGER, "
						+"ships_213 INTEGER, "
						+"ships_214 INTEGER, "
						+"ships_215 INTEGER, "
						+"ships_timestamp INTEGER, "
						+"defense_401 INTEGER, "
						+"defense_402 INTEGER, "
						+"defense_403 INTEGER, "
						+"defense_404 INTEGER, "
						+"defense_405 INTEGER, "
						+"defense_406 INTEGER, "
						+"defense_407 INTEGER, "
						+"defense_408 INTEGER, "
						+"rockets_502 INTEGER, "
						+"rockets_503 INTEGER, "
						+"defense_timestamp INTEGER, "
						+"submitted INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"x, "
								+"y, "
								+"z, "
								+"ismoon "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE INDEX IF NOT EXISTS "
				+"spyreports_submitted "
			+"ON "
				+"spyreports "
					+"( "
						+"submitted ASC "
					+") "
		);
		*/
		try
		{
			this.AccountDB.executeSimpleSQL(
				"ALTER TABLE "
					+"combat_reports "
				+"ADD COLUMN "
					+"ismoon INTEGER DEFAULT 0"
			);
		}
		catch(e)
		{
			//COLUMN ALREADY AVAILABLE
		}
		try
		{
			this.AccountDB.executeSimpleSQL(
				"ALTER TABLE "
					+"combat_partecipants "
				+"ADD COLUMN "
					+"ismoon INTEGER DEFAULT 0"
			);
		}
		catch(e)
		{
			//COLUMN ALREADY AVAILABLE
		}
		/*
		this.AccountDB.executeSimpleSQL(
			"CREATE  TABLE IF NOT EXISTS "
				+"combat_reports"
				+"("
					+"messageid INTEGER NOT NULL DEFAULT 0,"
					+"timestamp INTEGER DEFAULT 0,"
					+"x INTEGER DEFAULT 0,"
					+"y INTEGER DEFAULT 0,"
					+"z INTEGER DEFAULT 0,"
					+"attackerlosses INTEGER DEFAULT 0,"
					+"defenderlosses INTEGER DEFAULT 0,"
					+"attackerunits INTEGER DEFAULT 0,"
					+"defenderunits INTEGER DEFAULT 0,"
					+"attackerlossesnumber INTEGER DEFAULT 0,"
					+"defenderlossesnumber INTEGER DEFAULT 0,"
					+"met INTEGER DEFAULT 0,"
					+"cry INTEGER DEFAULT 0,"
					+"deu INTEGER DEFAULT 0,"
					+"debrismet INTEGER DEFAULT 0,"
					+"debriscry INTEGER DEFAULT 0,"
					+"victory INTEGER DEFAULT 0,"
					+"rebuilt_401 INTEGER DEFAULT 0,"
					+"rebuilt_402 INTEGER DEFAULT 0,"
					+"rebuilt_403 INTEGER DEFAULT 0,"
					+"rebuilt_404 INTEGER DEFAULT 0,"
					+"rebuilt_405 INTEGER DEFAULT 0,"
					+"rebuilt_406 INTEGER DEFAULT 0,"
					+"rebuilt_407 INTEGER DEFAULT 0,"
					+"rebuilt_408 INTEGER DEFAULT 0,"
					+"submitted INTEGER DEFAULT 0,"
					+"PRIMARY KEY (messageid) ON CONFLICT REPLACE"
				+")"
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE INDEX IF NOT EXISTS "
				+"combat_reports_submitted "
			+"ON "
				+"combat_reports "
					+"( "
						+"submitted ASC "
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE  TABLE IF NOT EXISTS "
				+"combat_partecipants"
				+"("
					+"messageid INTEGER NOT NULL DEFAULT 0,"
					+"position INTEGER NOT NULL DEFAULT 0,"
					+"id INTEGER NOT NULL DEFAULT 0,"
					+"x INTEGER DEFAULT 0,"
					+"y INTEGER DEFAULT 0,"
					+"z INTEGER DEFAULT 0,"
					+"ogameid INTEGER DEFAULT 0,"
					+"weapons INTEGER DEFAULT 0,"
					+"shields INTEGER DEFAULT 0,"
					+"armour INTEGER DEFAULT 0,"
					+"PRIMARY KEY (messageid,position,id) ON CONFLICT REPLACE"
				+")"
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE INDEX IF NOT EXISTS "
				+"combat_partecipants_coordinates "
			+"ON "
				+"combat_partecipants "
					+"( "
						+"x ASC, "
						+"y ASC, "
						+"z ASC "
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE INDEX IF NOT EXISTS "
				+"combat_partecipants_ogameid "
			+"ON "
				+"combat_partecipants "
					+"( "
						+"ogameid ASC "
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE  TABLE IF NOT EXISTS "
				+"combat_rounds"
				+"("
					+"messageid INTEGER NOT NULL DEFAULT 0,"
					+"partecipant_position INTEGER NOT NULL DEFAULT 0,"
					+"partecipant_id INTEGER NOT NULL DEFAULT 0,"
					+"round INTEGER NOT NULL DEFAULT 0,"
					+"ship_202 INTEGER DEFAULT 0,"
					+"ship_203 INTEGER DEFAULT 0,"
					+"ship_204 INTEGER DEFAULT 0,"
					+"ship_205 INTEGER DEFAULT 0,"
					+"ship_206 INTEGER DEFAULT 0,"
					+"ship_207 INTEGER DEFAULT 0,"
					+"ship_208 INTEGER DEFAULT 0,"
					+"ship_209 INTEGER DEFAULT 0,"
					+"ship_210 INTEGER DEFAULT 0,"
					+"ship_211 INTEGER DEFAULT 0,"
					+"ship_212 INTEGER DEFAULT 0,"
					+"ship_213 INTEGER DEFAULT 0,"
					+"ship_214 INTEGER DEFAULT 0,"
					+"ship_215 INTEGER DEFAULT 0,"
					+"defense_401 INTEGER DEFAULT 0,"
					+"defense_402 INTEGER DEFAULT 0,"
					+"defense_403 INTEGER DEFAULT 0,"
					+"defense_404 INTEGER DEFAULT 0,"
					+"defense_405 INTEGER DEFAULT 0,"
					+"defense_406 INTEGER DEFAULT 0,"
					+"defense_407 INTEGER DEFAULT 0,"
					+"defense_408 INTEGER DEFAULT 0,"
					+"PRIMARY KEY (messageid,partecipant_position,partecipant_id,round) ON CONFLICT REPLACE"
				+")"
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"spyresearches "
					+"("
						+"targetogameid INTEGER, "
						+"timestamp INTEGER, "
						+"tech_106 INTEGER, "
						+"tech_108 INTEGER, "
						+"tech_109 INTEGER, "
						+"tech_110 INTEGER, "
						+"tech_111 INTEGER, "
						+"tech_113 INTEGER, "
						+"tech_114 INTEGER, "
						+"tech_115 INTEGER, "
						+"tech_117 INTEGER, "
						+"tech_118 INTEGER, "
						+"tech_120 INTEGER, "
						+"tech_121 INTEGER, "
						+"tech_122 INTEGER, "
						+"tech_123 INTEGER, "
						+"tech_124 INTEGER, "
						+"tech_199 INTEGER, "
						+"submitted INTEGER DEFAULT 0, "
						+"PRIMARY KEY "
							+"( "
								+"targetogameid "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE INDEX IF NOT EXISTS "
				+"spyresearches_submitted "
			+"ON "
				+"spyresearches "
					+"( "
						+"submitted ASC "
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"planets "
					+"("
						+"cp INTEGER, "
						+"id INTEGER, "
						+"x INTEGER, "
						+"y INTEGER, "
						+"z INTEGER, "
						+"ismoon INTEGER, "
						+"pl_group INTEGER DEFAULT 1, "
						+"pl_type INTEGER DEFAULT 1, "
						+"name TEXT, "
						+"diameter INTEGER, "
						+"maxtemp INTEGER, "
						+"mintemp INTEGER, "
						+"creation INTEGER, "
						+"met INTEGER, "
						+"cry INTEGER, "
						+"deu INTEGER, "
						+"resourcesupdate INTEGER, "
						+"metpercentage INTEGER DEFAULT 100, "
						+"crypercentage INTEGER DEFAULT 100, "
						+"deupercentage INTEGER DEFAULT 100, "
						+"solpercentage INTEGER DEFAULT 100, "
						+"fuspercentage INTEGER DEFAULT 100, "
						+"satpercentage INTEGER DEFAULT 100, "
						+"percentagesupdate INTEGER, "
						+"building_1 INTEGER, "
						+"building_2 INTEGER, "
						+"building_3 INTEGER, "
						+"building_4 INTEGER, "
						+"building_12 INTEGER, "
						+"building_14 INTEGER, "
						+"building_15 INTEGER, "
						+"building_21 INTEGER, "
						+"building_22 INTEGER, "
						+"building_23 INTEGER, "
						+"building_24 INTEGER, "
						+"building_31 INTEGER, "
						+"building_33 INTEGER, "
						+"building_34 INTEGER, "
						+"building_44 INTEGER, "
						+"moonbuilding_41 INTEGER, "
						+"moonbuilding_42 INTEGER, "
						+"moonbuilding_43 INTEGER, "
						+"buildingsupdate INTEGER, "
						+"ships_202 INTEGER, "
						+"ships_203 INTEGER, "
						+"ships_204 INTEGER, "
						+"ships_205 INTEGER, "
						+"ships_206 INTEGER, "
						+"ships_207 INTEGER, "
						+"ships_208 INTEGER, "
						+"ships_209 INTEGER, "
						+"ships_210 INTEGER, "
						+"ships_211 INTEGER, "
						+"ships_212 INTEGER, "
						+"ships_213 INTEGER, "
						+"ships_214 INTEGER, "
						+"ships_215 INTEGER, "
						+"shipsupdate INTEGER, "
						+"defense_401 INTEGER, "
						+"defense_402 INTEGER, "
						+"defense_403 INTEGER, "
						+"defense_404 INTEGER, "
						+"defense_405 INTEGER, "
						+"defense_406 INTEGER, "
						+"defense_407 INTEGER, "
						+"defense_408 INTEGER, "
						+"rockets_502 INTEGER, "
						+"rockets_503 INTEGER, "
						+"defensesupdate INTEGER, "
						+"PRIMARY KEY "
							+"( "
								+"cp"
							+") "
							+"ON CONFLICT IGNORE"
					+") "
		);
		*/
		try
		{
			this.AccountDB.executeSimpleSQL(
				"ALTER TABLE "
					+"galaxy "
				+"ADD COLUMN "
					+"moonname TEXT DEFAULT ''"
			);
		}
		catch(e)
		{
			//COLUMN ALREADY AVAILABLE
		}
		/*
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"galaxy "
					+"("
						+"x INTEGER, "
						+"y INTEGER, "
						+"z INTEGER, "
						+"ogameid INTEGER, "
						+"planetname TEXT, "
						+"planetgroup INTEGER, "
						+"planettype INTEGER, "
						+"moondiameter INTEGER, "
						+"moontemperature INTEGER, "
						+"debrismet INTEGER, "
						+"debriscry INTEGER, "
						+"updated INTEGER, "
						+"PRIMARY KEY "
							+"( "
								+"x, "
								+"y, "
								+"z "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);*/
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"galaxy_notes "
					+"("
						+"x INTEGER, "
						+"y INTEGER, "
						+"z INTEGER, "
						+"ismoon INTEGER DEFAULT 0, "
						+"added INTEGER, "
						+"updated INTEGER, "
						+"note TEXT,"
						+"PRIMARY KEY "
							+"( "
								+"x, "
								+"y, "
								+"z, "
								+"ismoon, "
								+"added "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		/*
		this.AccountDB.executeSimpleSQL(
			"CREATE INDEX IF NOT EXISTS "
				+"galaxy_notes_coords "
			+"ON "
				+"galaxy_notes "
					+"("
						+"x, "
						+"y, "
						+"z "
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"players "
					+"("
						+"ogameid INTEGER, "
						+"nickname TEXT, "
						+"allyid INTEGER, "
						+"x INTEGER, "
						+"y INTEGER, "
						+"z INTEGER, "
						+"pointsrank INTEGER, "
						+"points INTEGER, "
						+"pointsvariation INTEGER, "
						+"pointsupdate INTEGER, "
						+"fleetrank INTEGER, "
						+"fleet INTEGER, "
						+"fleetvariation INTEGER, "
						+"fleetupdate INTEGER, "
						+"researchrank INTEGER, "
						+"research INTEGER, "
						+"researchvariation INTEGER, "
						+"researchupdate INTEGER, "
						+"vacation INTEGER, "
						+"inactive INTEGER, "
						+"banned INTEGER, "
						+"protection INTEGER, "
						+"statusupdate INTEGER, "
						+"PRIMARY KEY "
							+"( "
								+"ogameid "
							+") "
							+"ON CONFLICT IGNORE"
					+") "
		);
		*/
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"player_notes "
					+"("
						+"ogameid INTEGER, "
						+"added INTEGER, "
						+"updated INTEGER, "
						+"note TEXT, "
						+"PRIMARY KEY "
							+"( "
								+"ogameid, "
								+"added "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		/*
		this.AccountDB.executeSimpleSQL(
			"CREATE INDEX IF NOT EXISTS "
				+"player_notes_ogameids "
			+"ON "
				+"player_notes "
					+"("
						+"ogameid "
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"alliances "
					+"("
						+"id INTEGER, "
						+"tag TEXT, "
						+"members INTEGER, "
						+"pointsrank INTEGER, "
						+"points INTEGER, "
						+"avgpoints INTEGER, "
						+"pointsvariation INTEGER, "
						+"pointsupdate INTEGER, "
						+"fleetrank INTEGER, "
						+"fleet INTEGER, "
						+"avgfleet INTEGER, "
						+"fleetvariation INTEGER, "
						+"fleetupdate INTEGER, "
						+"researchrank INTEGER, "
						+"research INTEGER, "
						+"avgresearch INTEGER, "
						+"researchvariation INTEGER, "
						+"researchupdate INTEGER, "
						+"PRIMARY KEY "
							+"( "
								+"id "
							+") "
							+"ON CONFLICT IGNORE"
					+") "
		);
		*/
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"alliance_notes "
					+"("
						+"id INTEGER, "
						+"added INTEGER, "
						+"updated INTEGER, "
						+"note TEXT,"
						+"PRIMARY KEY "
							+"( "
								+"id, "
								+"added "
							+") "
							+"ON CONFLICT REPLACE"
					+") "
		);
		/*
		this.AccountDB.executeSimpleSQL(
			"CREATE INDEX IF NOT EXISTS "
				+"alliance_notes_ids "
			+"ON "
				+"alliance_notes "
					+"("
						+"id "
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"planet_log "
					+"("
						+"cp INTEGER, "
						+"changedvalue INTEGER, "
						+"newamount INTEGER, "
						+"updated INTEGER"
					+") "
		);
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"colonization_log "
					+"("
						+"addedcp INTEGER, "
						+"removedcp INTEGER, "
						+"updated INTEGER, "
						+"PRIMARY KEY "
							+"( "
								+"addedcp, "
								+"removedcp "
							+") "
							+"ON CONFLICT IGNORE"
					+") "
		);
		//table for events
		this.AccountDB.executeSimpleSQL(
			"CREATE TABLE IF NOT EXISTS "
				+"events_list "
					+"("
						+"timestamp INTEGER, "
						+"updated INTEGER, "
						+"type TEXT, "
						+"data TEXT"
					+") "
		);*/
		var getaccountinfoquery=this.AccountDB.createStatement(
			"SELECT "
				+"language, "
				+"universe, "
				+"ogameid, "
				+"nickname, "
				+"alliance, "
				+"email, "
				+"lastsessionid, "
				+"commander, "
				+"admiral, "
				+"engineer, "
				+"geologist, "
				+"technocrat, "
				+"skin, "
				+"universespeed, "
				+"serverdomain, "
				+"updated "
			+"FROM "
				+"main_information "
			+"WHERE "
				+"language = ?1 "
				+"AND "
				+"universe = ?2 "
				+"AND "
				+"ogameid = ?3 "
			+"LIMIT "
				+"0, 1 "
		);
		getaccountinfoquery.bindUTF8StringParameter		(0, language);
		getaccountinfoquery.bindInt32Parameter			(1, universe);
		getaccountinfoquery.bindInt32Parameter			(2, ogameid);
		if(getaccountinfoquery.executeStep())
		{
			this.language		=	getaccountinfoquery.getUTF8String	(0);
			this.universe		=	getaccountinfoquery.getInt32		(1);
			this.ogameid		=	getaccountinfoquery.getInt32		(2);
			this.nickname		=	getaccountinfoquery.getUTF8String	(3);
			this.alliance		=	getaccountinfoquery.getUTF8String	(4);
			this.email			=	getaccountinfoquery.getUTF8String	(5);
			this.lastsessinid	=	getaccountinfoquery.getUTF8String	(6);
			this.commander		=	getaccountinfoquery.getInt32		(7);
			this.admiral		=	getaccountinfoquery.getInt32		(8);
			this.engineer		=	getaccountinfoquery.getInt32		(9);
			this.geologist		=	getaccountinfoquery.getInt32		(10);
			this.technocrat		=	getaccountinfoquery.getInt32		(11);
			this.skin			=	getaccountinfoquery.getUTF8String	(12);
			this.universespeed	=	getaccountinfoquery.getInt32		(13);
			this.serverdomain	=	getaccountinfoquery.getUTF8String	(14);
			this.updated		=	getaccountinfoquery.getInt64		(15);
			this.darkmatter		=	0;
		}
		else
		{
			this.language		=	language;
			this.universe		=	universe;
			this.ogameid		=	ogameid;
			this.nickname		=	"";
			this.alliance		=	"";
			this.email			=	"";
			this.lastsessinid	=	"";
			this.commander		=	0;
			this.admiral		=	0;
			this.engineer		=	0;
			this.geologist		=	0;
			this.technocrat		=	0;
			this.skin			=	"";
			this.universespeed	=	1;
			this.universedomain	=	"";
			this.updated		=	this.getServerTimestamp();
			this.darkmatter		=	0;
		}
		
		this.version="1.0b";
		//SUBOBJECTS
		this.technologies			=	new Technologies	(this.language,this.universe,this.ogameid,this.AccountDB);		//TECH DEL GIOCATORE
		this.planets				=	new PlanetContainer	(this.language,this.universe,this.ogameid,this.AccountDB);		//COSTRUZIONI, FLOTTE FERME, PERCENTUALI, TEMPERATURE, DIAMETRI...
		this.galaxy					=	new	Galaxy			(this.language,this.universe,this.ogameid,this.AccountDB);		//SISTEMI SOLARI SFOGLIATI
		this.ranks					=	new	Ranks			(this.language,this.universe,this.ogameid,this.AccountDB);		//STATISTICHE SFOGLIATE
		this.messages				=	new	Messages		(this.language,this.universe,this.ogameid,this.AccountDB);		//MESSAGGI LETTI (GESTIONE SPIATE QUI DENTRO?)
		this.notes					=	new NotesContainer	(this.language,this.universe,this.ogameid);						//NOTES CONTAINER
		//this.events					=	new Events			(this.language,this.universe,this.ogameid,this.AccountDB);		//EVENTI IN CORSO (FLOTTE, COSTRUZIONI, ETC...)
		
		this.options				=	new	Options			(this.language,this.universe,this.ogameid);													//OPZIONI DEL GIOCATORE
		
		this.ogameaccount			=	new	OgameAccount	(this.language,this.universe,this.ogameid);
		this.ogameaccount.account	=	this;
		
		this.stogalaxy				=	new	StOGalaxy		(this.language,this.universe,this.ogameid,this.AccountDB,this.email);		//DATI DI STOGALAXY, COMPRESI TUTTI I SUOI MECCANISMI
		
		
		//TIMERS ADDED HERE (FOR PERFORMANCE OPTIMIZATION)
		setInterval
		(
			function(account)
			{
				var currentdate=new Date();
				account.clientcurrenttimestamp=Date.UTC
					(
						currentdate.getFullYear(),
						currentdate.getMonth(),
						currentdate.getDate(),
						currentdate.getHours(),
						currentdate.getMinutes(),
						currentdate.getSeconds(),
						currentdate.getMilliseconds()
					);
				account.servercurrenttimestamp=account.clientcurrenttimestamp+account.timestampdiff;
				//EVERYTHING IS CALCULATED ON BASE UTC
			},
			100,
			this
		);
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

Account.prototype.setTimestampdiff=function(delta)
{
	try
	{
		this.timestampdiff=delta;
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

Account.prototype.save=function()
{
	try
	{
		var setaccountinfoquery=this.AccountDB.createStatement(
			"INSERT INTO "
				+"main_information "
					+"( "
						+"language, "
						+"universe, "
						+"ogameid, "
						+"nickname, "
						+"alliance, "
						+"email, "
						+"lastsessionid, "
						+"commander, "
						+"admiral, "
						+"engineer, "
						+"geologist, "
						+"technocrat, "
						+"skin, "
						+"universespeed, "
						+"serverdomain, "
						+"updated "
						//SERVER VERSION?
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
						+"?16 "
					+") "
		);
		setaccountinfoquery.bindUTF8StringParameter		(0, this.language);
		setaccountinfoquery.bindInt32Parameter			(1, this.universe);
		setaccountinfoquery.bindInt32Parameter			(2, this.ogameid);
		setaccountinfoquery.bindUTF8StringParameter		(3, this.nickname);
		setaccountinfoquery.bindUTF8StringParameter		(4, this.alliance);
		setaccountinfoquery.bindUTF8StringParameter		(5, this.email);
		setaccountinfoquery.bindUTF8StringParameter		(6, this.lastsessionid);
		setaccountinfoquery.bindInt32Parameter			(7, this.commander);
		setaccountinfoquery.bindInt32Parameter			(8, this.admiral);
		setaccountinfoquery.bindInt32Parameter			(9, this.engineer);
		setaccountinfoquery.bindInt32Parameter			(10, this.geologist);
		setaccountinfoquery.bindInt32Parameter			(11, this.technocrat);
		setaccountinfoquery.bindUTF8StringParameter		(12, this.skin);
		setaccountinfoquery.bindInt32Parameter			(13, this.universespeed);
		setaccountinfoquery.bindUTF8StringParameter		(14, this.serverdomain);
		setaccountinfoquery.bindInt64Parameter			(15, this.getServerTimestamp());
		//setaccountinfoquery.execute();
		this.storagemanager.push(setaccountinfoquery);
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

Account.prototype.setSessionid=function(sessionid)
{
	if
	(
		sessionid.length>0
		&& this.lastsessionid!=sessionid
	)
	{
		this.lastsessionid=sessionid;
		this.save();
		return true;
	}
	return false;
}
//SETS OFFICIERS AND SERVER VERSION (USEFUL TO UNDERSTAND IF SOME ADDITIONAL PARSING IS NEEDED)
Account.prototype.setOfficiers=function(officiers)
{
	/**
		officiers={
			serverversion	"0.88c",
			darkmatter:		123,
			commander:		1,
			admiral:		0,
			engineer:		0,
			geologist:		0,
			technocrat:		0
		}
	**/
	if
	(
		officiers.darkmatter		!=	this.darkmatter
		|| officiers.serverversion	!=	this.serverversion
		|| officiers.commander		!=	this.commander
		|| officiers.admiral		!=	this.admiral
		|| officiers.engineer		!=	this.engineer
		|| officiers.geologist		!=	this.geologist
		|| officiers.technocrat		!=	this.technocrat
	)
	{
		this.darkmatter			=	officiers.darkmatter;
		this.serverversion		=	officiers.serverversion;
		this.commander			=	officiers.commander;
		this.admiral			=	officiers.admiral;
		this.engineer			=	officiers.engineer;
		this.geologist			=	officiers.geologist;
		this.technocrat			=	officiers.technocrat;
		this.save();
		return true;
	}
	return false;
}

/*Account.prototype.parse=function()
{
	try
	{
		//globaltooltip.errortip("errore di prova","error|asdasdasd")
		var save_changes=false;
		localization.parseGidStrings(this.language,this.universe);
		var document = document_to_be_parsed.documents[this.language][this.universe];
		var lastModified=document.lastModified.split(" ");
		var lastModifiedDate=lastModified[0].split("/");
		var lastModifiedTime=lastModified[1].split(":");
		this.servertimestamp	=	Date.UTC
			(
				lastModifiedDate[2],
				lastModifiedDate[0]-1,
				lastModifiedDate[1],
				lastModifiedTime[0],
				lastModifiedTime[1],
				lastModifiedTime[2],
				499
			)
		var currentdate			=	new Date();
		this.timestampdiff		=	
			Date.UTC
			(
				currentdate.getFullYear(),
				currentdate.getMonth(),
				currentdate.getDate(),
				currentdate.getHours(),
				currentdate.getMinutes(),
				currentdate.getSeconds(),
				currentdate.getMilliseconds()
			)
			-this.servertimestamp;
		if
		(
			document.location.href.indexOf("index.php?page=overview")>0
			&& document.getElementById("content")
		)
		{
			var nickname=document.evaluate("/html/body/div[4]/center/table[@width='519']/tbody/tr/td",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null).snapshotItem(0).innerHTML.match(/\(.*\)/)[0].replace(/[\(\)]/g,"");
			if
			(
				nickname.length>0
				&& this.nickname!=nickname
			)
			{
				this.nickname=nickname;
				save_changes=true;
			}
			var gen=document.evaluate("/html/body/div[4]/center/table[@width='519']/tbody/tr[last()]/th[2]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null).snapshotItem(0).innerHTML.match(/\(.*\)/)[0];
			var numeroutenti=gen.match(/\d{0,3}\.?\d{3}\)/)[0].replace(/[^\d]/g,"");
			var posizioneinclassifica=gen.match(/>\d{0,3}\.?\d+</)[0].replace(/[^\d]/g,"");
			var points=ST_parseInt(document.evaluate("/html/body/div[4]/center/table[@width='519']/tbody/tr[last()]/th[2]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null).snapshotItem(0).innerHTML);
			this.ranks.setPlayerFromNickname(this.nickname,this.ogameid,posizioneinclassifica,points);
			//AGGIUNGERE SALVATAGGIO DI QUESTI DATI DA QUALCHE PARTE
		}
		var lastsessionid=ST_getUrlParameter("session",document.location.href);
		if
		(
			lastsessionid.length>3
			&& this.lastsessionid!=lastsessionid
		)
		{
			this.lastsessionid=lastsessionid;
			save_changes=true;
		}
		if
		(
			document.location.href.indexOf("/game/index.php?page=overview")>0
			&& ST_getUrlParameter("lgn",document.location.href)==1
		)
		{
			var allimgs=document.getElementById("leftmenu").getElementsByTagName("img");
			var email=ST_getUrlParameter("email",allimgs[allimgs.length-1].src);
			if
			(
				email.length>3
				&& email.indexOf("@")>0
				&& this.email!=email
			)
			{
				this.email=email;
				save_changes=true;
			}
		}
		if
		(
			document.getElementById("leftmenu")
		)
		{
			var alllinks=document.getElementById("leftmenu").getElementsByTagName("a");
			this.version=alllinks[1].textContent.substring(alllinks[1].textContent.indexOf(".")-1,alllinks[1].textContent.length);
		}
		if
		(
			document.getElementById("header_top")
		)
		{
			this.darkmatter=ST_parseInt(document.getElementById("header_top").getElementsByTagName("table")[3].getElementsByTagName("tr")[2].getElementsByTagName("font")[3].innerHTML);
			var checkofficiersimages=document.getElementById("header_top").getElementsByTagName("table")[4].getElementsByTagName("img");
			var commander	=(checkofficiersimages[0].src.indexOf("/commander_ikon_un.gif")	>0)?(0):(1);
			var admiral		=(checkofficiersimages[1].src.indexOf("/admiral_ikon_un.gif")	>0)?(0):(1);
			var engineer	=(checkofficiersimages[2].src.indexOf("/ingenieur_ikon_un.gif")	>0)?(0):(1);
			var geologist	=(checkofficiersimages[3].src.indexOf("/geologe_ikon_un.gif")	>0)?(0):(1);
			var technocrat	=(checkofficiersimages[4].src.indexOf("/technokrat_ikon_un.gif")>0)?(0):(1);
			if(this.commander!=commander)
			{
				this.commander=commander;
				save_changes=true;
			}
			if(this.admiral!=admiral)
			{
				this.admiral=admiral;
				save_changes=true;
			}
			if(this.engineer!=engineer)
			{
				this.engineer=engineer;
				save_changes=true;
			}
			if(this.geologist!=geologist)
			{
				this.geologist=geologist;
				save_changes=true;
			}
			if(this.technocrat!=technocrat)
			{
				this.technocrat=technocrat;
				save_changes=true;
			}
		}
		var linkelements=document.getElementsByTagName("link");
		if(linkelements.length>0)
		{
			var formatecssneedleindex=linkelements[linkelements.length-1].href.indexOf("formate.css");
		}
		if(formatecssneedleindex>0)
		{
			var skin=linkelements[linkelements.length-1].href.substring(0,formatecssneedleindex);
			if
			(
				skin.length>3
				&& this.skin!=skin
			)
			{
				this.skin=skin;
				save_changes=true;
			}
		}
		var account=this;
		var sandbox=ST_sandbox;
		document.addEventListener
		(
			"mouseup",
			function(event)
			{
				account.selectionListener(event,sandbox);
			},
			false
		);
		
		this.technologies.parse();
		this.planets.parse();
		this.events.parse();
		this.galaxy.parse();
		this.messages.parse();
		this.ranks.parse();
		
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
			"parse",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}*/

Account.prototype.log=function(changes)
{
	try
	{
		//CHANGES E' IL NOME DEL VALORE VARIATO
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"log",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}


Account.prototype.selectionListener=function(event,sandbox)
{
	try
	{
		selection=String(sandbox.window.getSelection());
		var selectedtext=String(selection.match(/\d+ *\W *\d+ *\W *\d+/));
		if
		(
			selectedtext!=null
		)
		{
			var x=ST_parseInt(selectedtext.match(/^\d+/));
			var y=ST_parseInt(String(selectedtext.match(/\W *\d+ *[\W]/)).replace(/[^\d]/g,""));
			var z=ST_parseInt(String(selectedtext.match(/\d+$/)).replace(/[^\d]/g,""));
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
				//LET'S SAVE UP TO 5 COORDINATES
				var coordstosave=x+","+y+","+z;
				var myoptions=this.options.getOptionStack("selection","coordinates");
				myoptions=myoptions!=null?myoptions:new Array();
				var found=false;
				for(var i=0;(i<myoptions.length)&&(i<5);i++)
				{
					if(myoptions[i].value==coordstosave)
					{
						this.options.unstackOption("selection","coordinates",i);
						myoptions=this.options.getOptionStack("selection","coordinates");
						myoptions=myoptions!=null?myoptions:new Array();
						i--;
					}
				}
				for(;i<myoptions.length;i++)
				{
					this.options.unstackOption("selection","coordinates",i);
				}
				this.options.stackOption("selection","coordinates",coordstosave);
			}
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"selectionListener",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

/*********************************
FUNCTIONS USED TO GET CONNECTED TO OTHER CLASSES
*********************************/
//GETS A STRING FROM THE DATABASE OR RAM
Account.prototype.getLocalizationString=function(type,name)
{
	return localization.getLocalizationString(this.language,type,name);
}

//SETS A STRING TO DATABASE AND RAM
Account.prototype.setLocalizationString=function(type,name,value)
{
	return localization.setLocalizationString(this.language,type,name,value);
}

Account.prototype.getServerTimestamp=function()
{
	return this.servercurrenttimestamp;
}

Account.prototype.getClientTimestamp=function()
{
	return this.clientcurrenttimestamp;
}
