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
function ST_Error()
{
	this.errors=new Array();
	this.lasterrorid=-1;
}

ST_Error.prototype.adderror=function
(
	e,
	function_name,
	page_html,
	interesting_vars
)
{
	Components.utils.reportError(e);
	this.lasterrorid=this.errors.length%10;
	this.errors[this.errors.length%10]={
		"e"					: 			e,
		"function_name"		: 			function_name,
		"interesting_vars"	:			interesting_vars,
		"page_html"			:			page_html
	}
	this.tip(this.lasterrorid);
}

ST_Error.prototype.submit=function(id)
{
	var req=new XMLHttpRequest();
	var postdata=
		"version="					+GlobalVars.stogame_version
		+"&error_constructor="		+String(this.errors[id].e.constructor)		.replace(/\&/g,"%26")
		+"&error_message="			+String(this.errors[id].e.message)			.replace(/\&/g,"%26")
		+"&error_name="				+String(this.errors[id].e.name)				.replace(/\&/g,"%26")
		+"&error_fileName="			+String(this.errors[id].e.fileName)			.replace(/\&/g,"%26")
		+"&error_lineNumber="		+String(this.errors[id].e.lineNumber)
		+"&error_stack="			+String(this.errors[id].e.stack)			.replace(/\&/g,"%26")
		+"&error_function_name="	+String(this.errors[id].function_name)		.replace(/\&/g,"%26")
		+"&error_interesting_vars="	+String(this.errors[id].interesting_vars)	.replace(/\&/g,"%26")
		+"&error_page_html="		+String(this.errors[id].page_html)			.replace(/\&/g,"%26")
	req.mozBackgroundRequest=true;
	req.onload=function()
		{
			alert
			(
				req.responseText
				/*"Thank you,\n\n"
				+"Your bug report will be logged and processed as soon as possible.\n"
				+"Still working to make Ogame a better place\n\n"
				+"The StOgame Project Team\n"
				+"(Ocramius Aethril, Pippo1985, Dario2994, Alissa, JMarquis, Infinity)"*/
			)
		};
	req.onprogress=function(e)
		{
		};
	req.onreadystatechange=function()
		{
		};
	req.onerror=function()
		{
		};
	req.open('POST',"http://support.stogame.net/bug_logger/log_bug.php",true);
	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	req.setRequestHeader("Content-length", postdata.length);
	req.setRequestHeader("Connection", "close");
	req.overrideMimeType('text/plain');
	req.send(postdata);
}

ST_Error.prototype.tip=function(id)
{
	globaltooltip.tip
	(
		0,
		0,
		0,
		"error",
		"error",
		"error",
		"Error in "+this.errors[id].e.fileName+"."+this.errors[id].function_name,
		this.errors[id].e.message+" - Row "+this.errors[id].e.lineNumber+" - Click here to report this bug",
		id
	);
}

var st_errors=new ST_Error();