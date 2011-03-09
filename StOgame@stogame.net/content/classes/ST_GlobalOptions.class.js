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
function ST_GlobalOptions()
{
	try
	{
		this.options		=	new Array();
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

ST_GlobalOptions.prototype.getOptionStack=function(type,name)
{
	try
	{
		if(
			typeof this.options[type+"_"+name]!="undefined"
			&& this.options[type+"_"+name]!=null
			&& this.options[type+"_"+name].length>0
		)
		{
			return this.options[type+"_"+name];
		}
		else
		{
			var getoptionstack=StOgameDB
				.createStatement
				(
					"SELECT "
						+"number, "
						+"value, "
						+"updated "
					+"FROM "
						+"options "
					+"WHERE "
						+"type = ?1 "
						+"AND "
						+"name = ?2 "
					+"ORDER BY "
						+"number ASC "
				);
			getoptionstack.bindUTF8StringParameter		(0, type);
			getoptionstack.bindUTF8StringParameter		(1, name);
			this.options[type+"_"+name]=new Array();
			var i=0;
			while(getoptionstack.executeStep())
			{
				this.options[type+"_"+name][i]=
					{
						"value":	getoptionstack.getUTF8String(1),
						"number":	getoptionstack.getInt32(0),
						"updated":	getoptionstack.getInt64(2)
					}
				i++;
			}
			return (this.options[type+"_"+name].length>0)?this.options[type+"_"+name]:this.options[type+"_"+name]=null;
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getOptionStack",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

ST_GlobalOptions.prototype.stackOption=function(type,name,value)
{
	try
	{
		var stackoptionquery=StOgameDB
			.createStatement
			(
				"INSERT INTO "
					+"options"
						+"("
							+"type,"
							+"name,"
							+"number,"
							+"value,"
							+"updated"
						+")"
						+"VALUES "
						+"("
							+"?1,"
							+"?2,"
							+"?3,"
							+"?4,"
							+"?5"
						+")"
			);
		if(this.getOptionStack(type,name)!=null)
		{
			this.options[type+"_"+name][this.options[type+"_"+name].length]=
				{
					"value"		:	value,
					"number"	:	this.options[type+"_"+name][this.options[type+"_"+name].length-1].number+1,
					"updated"	:	Date.parse(new Date())
				}
			stackoptionquery.bindUTF8StringParameter		(0, type);
			stackoptionquery.bindUTF8StringParameter		(1, name);
			stackoptionquery.bindInt32Parameter				(2, this.options[type+"_"+name][this.options[type+"_"+name].length-1].number);
			stackoptionquery.bindUTF8StringParameter		(3, value);
			stackoptionquery.bindInt64Parameter				(4, this.options[type+"_"+name][this.options[type+"_"+name].length-1].updated);
			stackoptionquery.execute();
		}
		else
		{
			this.options[type+"_"+name]=new Array();
			this.options[type+"_"+name][0]=
				{
					"value":	value,
					"number":	0,
					"updated":	Date.parse(new Date())
				}
			stackoptionquery.bindUTF8StringParameter		(0, type);
			stackoptionquery.bindUTF8StringParameter		(1, name);
			stackoptionquery.bindInt32Parameter				(2, 0);
			stackoptionquery.bindUTF8StringParameter		(3, value);
			stackoptionquery.bindInt64Parameter				(4, this.options[type+"_"+name][0].updated);
			stackoptionquery.execute();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"stackOption",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

ST_GlobalOptions.prototype.unstackOption=function(type,name,index)
{
	try
	{
		if
		(
			this.getOptionStack(type,name)!=null
			&& index>=0
			&& this.options[type+"_"+name].length>index
		)
		{
			var unstackoptionquery=StOgameDB
				.createStatement
				(
					"DELETE FROM "
						+"options "
					+"WHERE "
						+"type=?1 "
						+"AND "
						+"name=?2 "
						+"AND "
						+"number=?3"
				);
			unstackoptionquery.bindUTF8StringParameter		(0, type);
			unstackoptionquery.bindUTF8StringParameter		(1, name);
			unstackoptionquery.bindInt32Parameter			(2, this.options[type+"_"+name][index].number);
			unstackoptionquery.execute();
			var newarray1=new Array();
			var newarray2=new Array();
			for(var i=0;i<index;i++)
			{
				newarray1[i]=this.options[type+"_"+name][i];
			}
			for(var i=index+1;i<this.options[type+"_"+name].length;i++)
			{
				newarray2[(i-1)-index]=this.options[type+"_"+name][i];
			}
			this.options[type+"_"+name]=newarray1.concat(newarray2);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"unstackOption",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

ST_GlobalOptions.prototype.updateOption=function(type,name,index,value)
{
	try
	{
		if
		(
			this.getOptionStack(type,name)!=null
			&& index>=0
			&& this.options[type+"_"+name].length>index
		)
		{
			var unstackoptionquery=StOgameDB
				.createStatement
				(
					"UPDATE "
						+"options "
					+"SET "
						+"value=?1, "
						+"updated=?2 "
					+"WHERE "
						+"type=?3 "
						+"AND "
						+"name=?4 "
						+"AND "
						+"number=?5"
				);
			this.options[type+"_"+name][index].value=value;
			this.options[type+"_"+name][index].updated=Date.parse(new Date());
			unstackoptionquery.bindUTF8StringParameter		(0, value);
			unstackoptionquery.bindInt64Parameter			(1, this.options[type+"_"+name][index].updated);				
			unstackoptionquery.bindUTF8StringParameter		(2, type);
			unstackoptionquery.bindUTF8StringParameter		(3, name);
			unstackoptionquery.bindInt32Parameter			(4, this.options[type+"_"+name][index].number);
			unstackoptionquery.execute();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"updateOption",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

ST_GlobalOptions.prototype.getOption=function(type,name)
{
	try
	{
		var returnedvalue=this.getOptionStack(type,name);
		return ((returnedvalue!=null)&&(returnedvalue.length>0))?returnedvalue[0]:null;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getOption",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

ST_GlobalOptions.prototype.setOption=function(type,name,value)
{
	try
	{
		while
		(
			this.getOptionStack(type,name)!=null
			&& this.getOptionStack(type,name).length>1
		)
		{
			this.unstackOption(type,name,0);
		}
		if(this.getOptionStack(type,name)==null)
		{
			this.stackOption(type,name,value);
		}
		else
		{
			this.updateOption(type,name,0,value);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setOption",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

ST_GlobalOptions.prototype.removeOption=function(type,name)
{
	try
	{
		while(this.getOptionStack(type,name)!=null)
		{
			this.unstackOption(type,name,0);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"removeOption",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

var st_globaloptions=new ST_GlobalOptions();