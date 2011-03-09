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
function NotesContainer
(
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

NotesContainer.prototype.setPlayerNote=function(ogameid,added,note)
{
	try
	{
		ogameid=ST_parseInt(ogameid);
		added=Math.max(0,ST_parseInt(added));
		note=String(note);
		if(ogameid>0)
		{
			var playernote=new PlayerNote
			(
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]],
				ogameid,
				added
			);
			playernote.set(note);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setPlayerNote",
			"",
			"ogameid:"+ogameid
		)
	}
}

NotesContainer.prototype.getPlayerNotes=function(filter)
{
	try
	{
		var NotesContainer=this;
		var fields=[
			"ogameid",
			"added",
			"updated"
		];
		var searchstring="SELECT "
							+"ogameid, "
							+"added, "
							+"updated, "
							+"note "
						+"FROM "
							+"player_notes "
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
		if(typeof filter["note"]!="undefined")
		{
			searchstring+=" AND note LIKE '%"+filter["note"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY ogameid ASC, added DESC";
		var returnednotes=[];
		var getnotesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getnotesquery.executeStep())
		{
			returnednotes.push
			(
				{
					"ogameid":				getnotesquery.getInt32(0),
					"added":				getnotesquery.getInt64(1),
					"updated":				getnotesquery.getInt64(2),
					"note":					getnotesquery.getUTF8String(3),
					"set":					function(note)
					{
						note=String(note);
						NotesContainer.setPlayerNote(this.ogameid,this.added,note);
						this.note=note;
						return this;
					}
				}
			);
		}
		return returnednotes;
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

NotesContainer.prototype.setAllianceNote=function(id,added,note)
{
	try
	{
		id=ST_parseInt(id);
		added=Math.max(0,ST_parseInt(added));
		note=String(note);
		if(id>0)
		{
			var alliancenote=new AllianceNote
			(
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]],
				id,
				added
			);
			alliancenote.set(note);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setAllianceNote",
			"",
			"id:"+id
		)
	}
}

NotesContainer.prototype.getAllianceNotes=function(filter)
{
	try
	{
		var NotesContainer=this;
		var fields=[
			"id",
			"added",
			"updated"
		];
		var searchstring="SELECT "
							+"id, "
							+"added, "
							+"updated, "
							+"note "
						+"FROM "
							+"alliance_notes "
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
		if(typeof filter["note"]!="undefined")
		{
			searchstring+=" AND note LIKE '%"+filter["note"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY id ASC, added DESC";
		var returnednotes=[];
		var getnotesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getnotesquery.executeStep())
		{
			returnednotes.push
			(
				{
					"id":					getnotesquery.getInt32(0),
					"added":				getnotesquery.getInt64(1),
					"updated":				getnotesquery.getInt64(2),
					"note":					getnotesquery.getUTF8String(3),
					"set":					function(note)
					{
						note=String(note);
						NotesContainer.setAllianceNote(this.id,this.added,note);
						this.note=note;
						return this;
					}
				}
			);
		}
		return returnednotes;
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

NotesContainer.prototype.setGalaxyNote=function(x,y,z,ismoon,added,note)
{
	try
	{
		x=ST_parseInt(x);
		y=ST_parseInt(y);
		z=ST_parseInt(z);
		ismoon=Math.max(0,Math.min(ST_parseInt(ismoon),1));
		added=Math.max(0,ST_parseInt(added));
		note=String(note);
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
			var galaxynote=new GalaxyNote
			(
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]],
				x,
				y,
				z,
				ismoon,
				added
			);
			galaxynote.set(note);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setGalaxyNote",
			"",
			"x:"+x+";y:"+y+";z:"+z+";ismoon:"+ismoon
		)
	}
}

NotesContainer.prototype.getGalaxyNotes=function(filter)
{
	try
	{
		var NotesContainer=this;
		var fields=[
			"x",
			"y",
			"z",
			"ismoon",
			"added",
			"updated"
		];
		var searchstring="SELECT "
							+"x, "
							+"y, "
							+"z, "
							+"ismoon, "
							+"added, "
							+"updated, "
							+"note "
						+"FROM "
							+"galaxy_notes "
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
		if(typeof filter["note"]!="undefined")
		{
			searchstring+=" AND note LIKE '%"+filter["note"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY x ASC, y ASC, z ASC, ismoon ASC, added DESC";
		var returnednotes=[];
		var getnotesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getnotesquery.executeStep())
		{
			returnednotes.push
			(
				{
					"x":					getnotesquery.getInt32(0),
					"y":					getnotesquery.getInt32(1),
					"z":					getnotesquery.getInt32(2),
					"ismoon":				getnotesquery.getInt32(3),
					"added":				getnotesquery.getInt64(4),
					"updated":				getnotesquery.getInt64(5),
					"note":					getnotesquery.getUTF8String(6),
					"set":					function(note)
					{
						note=String(note);
						NotesContainer.setGalaxyNote(this.x,this.y,this.z,this.ismoon,this.added,note);
						this.note=note;
						return this;
					}
				}
			);
		}
		return returnednotes;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getGalaxyNotes",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}