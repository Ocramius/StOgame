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
Components.utils.import("resource://StOgame/DatabaseConnections.js");

function ST_parseInt(str)
{
	if((typeof str=="undefined")||(isNaN(parseInt(str))))
	{
		return 0;
	}
	else
	{
		if((typeof str=="number"))
		{
			return parseInt(str);
		}
		else
		{
			return parseInt(String(str).replace(/\./g,"").replace(/^(\d+)\s*(k\W+.*?)|k$/i, '$1000').replace(/^(\d+)\s*(m\W+.*?)|m$/i, '$1000000'));
		}
	}
}

function ST_trim(str)
{
	if (typeof str=="undefined")
		return '';
	str=str.replace(/^\s+/, '');
	for(var i=str.length-1;i>=0;i--)
	{
		if (/\S/.test(str.charAt(i)))
		{
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}

function ST_MD5(string)
{
    function RotateLeft(lValue, iShiftBits)
	{
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
    function AddUnsigned(lX,lY)
	{
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4)
		{
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4)
		{
            if (lResult & 0x40000000)
			{
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            }
			else
			{
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
     }
     function F(x,y,z)
	 {
		return (x & y) | ((~x) & z);
	 }
     function G(x,y,z)
	 {
		return (x & z) | (y & (~z));
	 }
     function H(x,y,z)
	 {
		return (x ^ y ^ z);
	 }
     function I(x,y,z)
	  {
		return (y ^ (x | (~z)));
	 }
    function FF(a,b,c,d,x,s,ac)
	{
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function GG(a,b,c,d,x,s,ac)
	{
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function HH(a,b,c,d,x,s,ac)
	{
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function II(a,b,c,d,x,s,ac)
	{
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function ConvertToWordArray(string)
	{
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength )
		{
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
    function WordToHex(lValue)
	{
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++)
		{
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
    function Utf8Encode(string)
	{
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
	    for (var n = 0; n < string.length; n++)
		{
            var c = string.charCodeAt(n);
            if (c < 128)
			{
               utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048))
			{
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
			{
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k=0;k<x.length;k+=16)
	{
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
    return temp.toLowerCase();
}

function ST_getUrlParameter(get_parameter_name,url)
{
	var regex=new RegExp("[\\?&]"+get_parameter_name+"=([^&#]*)");
	var results=regex.exec(url);
	if(results==null)
		return "";
	else
		return results[1];
}

function ST_number_format(n,c)
{
	var d=",";
	var t=".";
	var s = n < 0 ? "-" : "";
	var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function ST_timestamp_from_date(datetime,servertimestamp)
{
	//TAKES DATES LIKE 08-25 12:47:21 AND CONVERTS THEM TO UTF TIMESTAMPS. CHECKS YEAR THROUGH SERVER DATE...
	var date=ST_trim(datetime).split(" ");
	var time=date[1].split(":");
	if (date[0].indexOf("-")>0)
	{
		var date=date[0].split("-");
		date[2]=date[0]
		date[0]=date[1]
		date[1]=date[2]
		date[2]=2009;
	}
	else
		var date=date[0].split(".");
	return Date.UTC
	(
		date[2],
		date[1]-1,
		date[0],
		time[0],
		time[1],
		time[2]
	);
}

function ST_countdown_from_timestamp(timestamp,day,hour,min,sec)
{
	
	timestamp=ST_parseInt(timestamp);
	output="";
	if(day){day=Math.floor(timestamp/86400000);timestamp-=day*86400000;if(day){output+=day;}}
	if(hour){hour=Math.floor(timestamp/3600000);timestamp-=hour*3600000;hour+="";if(hour){output+="-"+hour;}}
	if(min){min=Math.floor(timestamp/60000);timestamp-=min*60000;min+="";if(min.length==1 && hour){min="0"+min;}output+=":"+min;}
	if(sec){sec=Math.floor(timestamp/1000);timestamp-=sec*1000;sec+="";if(sec.length==1 && min){sec="0"+sec;}output+=":"+sec;}
	if(output.charAt(0)==":" || output.charAt(0)=="-"){output=output.replace(/[\:\-]/,"");}
	return(output);
}

function ST_date_from_timestamp(times_timestamp)
{
	
	var times_finaltimestamp=new Date(times_timestamp);
	var times_minute=times_finaltimestamp.getUTCMinutes()+"";
	var times_second=times_finaltimestamp.getUTCSeconds()+"";
	if(times_minute.length == 1){times_minute="0"+times_minute}
	if(times_second.length == 1){times_second="0"+times_second}
	if(times_finaltimestamp.getUTCDate()==(new Date()).getDate())
	{	
		return(times_finaltimestamp.getUTCHours()+":"+times_minute+":"+times_second);
	}
	else
	{	
		return(times_finaltimestamp.getUTCDate()+"/"+(times_finaltimestamp.getUTCMonth()*1+1)+" "+times_finaltimestamp.getUTCHours()+":"+times_minute+":"+times_second);
	}
}

var GlobalVars={
	"stogame_version":				"3.0.0b1",
	"buildingids":					new Array
	(
		"1",
		"2",
		"3",
		"4",
		"12",
		"14",
		"15",
		"21",
		"22",
		"23",
		"24",
		"31",
		"33",
		"34",
		"44"
	),
	"moonbuildingids":				new Array
	(	
		"41",
		"42",
		"43"
	),
	"allmoonbuildingids":			new Array
	(	
		"14",
		"21",
		"22",
		"23",
		"24",
		"34",
		"41",
		"42",
		"43"
	),
	"techids":						new Array
	(
		"106",
		"108",
		"109",
		"110",
		"111",
		"113",
		"114",
		"115",
		"117",
		"118",
		"120",
		"121",
		"122",
		"123",
		"124",
		"199"
	),
	"shipsids":						new Array
	(
		"202",
		"203",
		"204",
		"205",
		"206",
		"207",
		"208",
		"209",
		"210",
		"211",
		"212",
		"213",
		"214",
		"215"
	),
	"defenseids":					new Array
	(
		"401",
		"402",
		"403",
		"404",
		"405",
		"406",
		"407",
		"408"
	),
	"rocketsids":					new Array
	(
		"502",
		"503"
	),
	"planetgroups":					new Array
	(
		"desert",
		"dry",
		"normal",
		"jungle",
		"water",
		"ice",
		"gas"
	),
	"planetgroupsids":				new Array(),
	"levelupgradecostincrements":	new Array(),
	"baselevelmetcosts":			new Array(),
	"baselevelcrycosts":			new Array(),
	"baseleveldeucosts":			new Array(),
	"baselevelenecosts":			new Array(),
	"unitsmetcost":					new Array(),
	"unitscrycost":					new Array(),
	"unitsdeucost":					new Array(),
	"unitsweapons":					new Array(),
	"unitsshields":					new Array(),
	"unitsintegrity":				new Array(),
	"shipsrapidfire":				new Array(),
	"shipspeed":					new Array(),
	"shipscapacity":				new Array(),
	"shipsconsumption":				new Array(),
	"buildingneeds":				new Array(),
	"labneed":						new Array()
}

GlobalVars["planetgroupsids"]["desert"]	=0;
GlobalVars["planetgroupsids"]["dry"]	=1;
GlobalVars["planetgroupsids"]["normal"]	=2;
GlobalVars["planetgroupsids"]["jungle"]	=3;
GlobalVars["planetgroupsids"]["water"]	=4;
GlobalVars["planetgroupsids"]["ice"]	=5;
GlobalVars["planetgroupsids"]["gas"]	=6;

//old ogame planet groups
GlobalVars["planetgroupsids"]["wuestenplanet"]	=0;
GlobalVars["planetgroupsids"]["trockenplanet"]	=1;
GlobalVars["planetgroupsids"]["normaltempplanet"]	=2;
GlobalVars["planetgroupsids"]["dschjungelplanet"]	=3;
GlobalVars["planetgroupsids"]["wasserplanet"]	=4;
GlobalVars["planetgroupsids"]["eisplanet"]	=5;
GlobalVars["planetgroupsids"]["gasplanet"]	=6;

GlobalVars["baselevelmetcosts"]["1"]	=60;
GlobalVars["baselevelcrycosts"]["1"]	=15;
GlobalVars["baseleveldeucosts"]["1"]	=0;
GlobalVars["baselevelenecosts"]["1"]	=0;
GlobalVars["levelupgradecostincrements"]["1"]=1.5;

GlobalVars["baselevelmetcosts"]["2"]	=48;
GlobalVars["baselevelcrycosts"]["2"]	=24;
GlobalVars["baseleveldeucosts"]["2"]	=0;
GlobalVars["baselevelenecosts"]["2"]	=0;
GlobalVars["levelupgradecostincrements"]["2"]=1.6;

GlobalVars["baselevelmetcosts"]["3"]	=225;
GlobalVars["baselevelcrycosts"]["3"]	=75;
GlobalVars["baseleveldeucosts"]["3"]	=0;
GlobalVars["baselevelenecosts"]["3"]	=0;
GlobalVars["levelupgradecostincrements"]["3"]=1.5;

GlobalVars["baselevelmetcosts"]["4"]	=75;
GlobalVars["baselevelcrycosts"]["4"]	=30;
GlobalVars["baseleveldeucosts"]["4"]	=0;
GlobalVars["baselevelenecosts"]["4"]	=0;
GlobalVars["levelupgradecostincrements"]["4"]=1.5;

GlobalVars["baselevelmetcosts"]["12"]	=900;
GlobalVars["baselevelcrycosts"]["12"]	=360;
GlobalVars["baseleveldeucosts"]["12"]	=180;
GlobalVars["baselevelenecosts"]["12"]	=0;
GlobalVars["levelupgradecostincrements"]["12"]=1.8;

GlobalVars["baselevelmetcosts"]["14"]	=400;
GlobalVars["baselevelcrycosts"]["14"]	=120;
GlobalVars["baseleveldeucosts"]["14"]	=200;
GlobalVars["baselevelenecosts"]["14"]	=0;
GlobalVars["levelupgradecostincrements"]["14"]=2;

GlobalVars["baselevelmetcosts"]["15"]	=1000000;
GlobalVars["baselevelcrycosts"]["15"]	=500000;
GlobalVars["baseleveldeucosts"]["15"]	=100000;
GlobalVars["baselevelenecosts"]["15"]	=0;
GlobalVars["levelupgradecostincrements"]["15"]=2;

GlobalVars["baselevelmetcosts"]["21"]	=400;
GlobalVars["baselevelcrycosts"]["21"]	=200;
GlobalVars["baseleveldeucosts"]["21"]	=100;
GlobalVars["baselevelenecosts"]["21"]	=0;
GlobalVars["levelupgradecostincrements"]["21"]=2;

GlobalVars["baselevelmetcosts"]["22"]	=2000;
GlobalVars["baselevelcrycosts"]["22"]	=0;
GlobalVars["baseleveldeucosts"]["22"]	=0;
GlobalVars["baselevelenecosts"]["22"]	=0;
GlobalVars["levelupgradecostincrements"]["22"]=2;

GlobalVars["baselevelmetcosts"]["23"]	=2000;
GlobalVars["baselevelcrycosts"]["23"]	=1000;
GlobalVars["baseleveldeucosts"]["23"]	=0;
GlobalVars["baselevelenecosts"]["23"]	=0;
GlobalVars["levelupgradecostincrements"]["23"]=2;

GlobalVars["baselevelmetcosts"]["24"]	=2000;
GlobalVars["baselevelcrycosts"]["24"]	=2000;
GlobalVars["baseleveldeucosts"]["24"]	=0;
GlobalVars["baselevelenecosts"]["24"]	=0;
GlobalVars["levelupgradecostincrements"]["24"]=2;

GlobalVars["baselevelmetcosts"]["31"]	=200;
GlobalVars["baselevelcrycosts"]["31"]	=400;
GlobalVars["baseleveldeucosts"]["31"]	=200;
GlobalVars["baselevelenecosts"]["31"]	=0;
GlobalVars["levelupgradecostincrements"]["31"]=2;

GlobalVars["baselevelmetcosts"]["33"]	=0;
GlobalVars["baselevelcrycosts"]["33"]	=50000;
GlobalVars["baseleveldeucosts"]["33"]	=100000;
GlobalVars["baselevelenecosts"]["33"]	=1000;
GlobalVars["levelupgradecostincrements"]["33"]=2;

GlobalVars["baselevelmetcosts"]["34"]	=20000;
GlobalVars["baselevelcrycosts"]["34"]	=40000;
GlobalVars["baseleveldeucosts"]["34"]	=0;
GlobalVars["baselevelenecosts"]["34"]	=0;
GlobalVars["levelupgradecostincrements"]["34"]=2;

GlobalVars["baselevelmetcosts"]["44"]	=20000;
GlobalVars["baselevelcrycosts"]["44"]	=20000;
GlobalVars["baseleveldeucosts"]["44"]	=1000;
GlobalVars["baselevelenecosts"]["44"]	=0;
GlobalVars["levelupgradecostincrements"]["44"]=2;

GlobalVars["baselevelmetcosts"]["41"]	=20000;
GlobalVars["baselevelcrycosts"]["41"]	=40000;
GlobalVars["baseleveldeucosts"]["41"]	=20000;
GlobalVars["baselevelenecosts"]["41"]	=0;
GlobalVars["levelupgradecostincrements"]["41"]=2;

GlobalVars["baselevelmetcosts"]["42"]	=20000;
GlobalVars["baselevelcrycosts"]["42"]	=40000;
GlobalVars["baseleveldeucosts"]["42"]	=20000;
GlobalVars["baselevelenecosts"]["42"]	=0;
GlobalVars["levelupgradecostincrements"]["42"]=2;

GlobalVars["baselevelmetcosts"]["43"]	=2000000;
GlobalVars["baselevelcrycosts"]["43"]	=4000000;
GlobalVars["baseleveldeucosts"]["43"]	=2000000;
GlobalVars["baselevelenecosts"]["43"]	=0;
GlobalVars["levelupgradecostincrements"]["43"]=2;

GlobalVars["baselevelmetcosts"]["106"]	=200;
GlobalVars["baselevelcrycosts"]["106"]	=1000;
GlobalVars["baseleveldeucosts"]["106"]	=200;
GlobalVars["baselevelenecosts"]["106"]	=0;
GlobalVars["levelupgradecostincrements"]["106"]=2;

GlobalVars["baselevelmetcosts"]["108"]	=0;
GlobalVars["baselevelcrycosts"]["108"]	=400;
GlobalVars["baseleveldeucosts"]["108"]	=600;
GlobalVars["baselevelenecosts"]["108"]	=0;
GlobalVars["levelupgradecostincrements"]["108"]=2;

GlobalVars["baselevelmetcosts"]["109"]	=800;
GlobalVars["baselevelcrycosts"]["109"]	=200;
GlobalVars["baseleveldeucosts"]["109"]	=0;
GlobalVars["baselevelenecosts"]["109"]	=0;
GlobalVars["levelupgradecostincrements"]["109"]=2;

GlobalVars["baselevelmetcosts"]["110"]	=200;
GlobalVars["baselevelcrycosts"]["110"]	=600;
GlobalVars["baseleveldeucosts"]["110"]	=0;
GlobalVars["baselevelenecosts"]["110"]	=0;
GlobalVars["levelupgradecostincrements"]["110"]=2;

GlobalVars["baselevelmetcosts"]["111"]	=1000;
GlobalVars["baselevelcrycosts"]["111"]	=0;
GlobalVars["baseleveldeucosts"]["111"]	=0;
GlobalVars["baselevelenecosts"]["111"]	=0;
GlobalVars["levelupgradecostincrements"]["111"]=2;

GlobalVars["baselevelmetcosts"]["113"]	=0;
GlobalVars["baselevelcrycosts"]["113"]	=800;
GlobalVars["baseleveldeucosts"]["113"]	=400;
GlobalVars["baselevelenecosts"]["113"]	=0;
GlobalVars["levelupgradecostincrements"]["113"]=2;

GlobalVars["baselevelmetcosts"]["114"]	=0;
GlobalVars["baselevelcrycosts"]["114"]	=4000;
GlobalVars["baseleveldeucosts"]["114"]	=2000;
GlobalVars["baselevelenecosts"]["114"]	=0;
GlobalVars["levelupgradecostincrements"]["114"]=2;

GlobalVars["baselevelmetcosts"]["115"]	=400;
GlobalVars["baselevelcrycosts"]["115"]	=0;
GlobalVars["baseleveldeucosts"]["115"]	=600;
GlobalVars["baselevelenecosts"]["115"]	=0;
GlobalVars["levelupgradecostincrements"]["115"]=2;

GlobalVars["baselevelmetcosts"]["117"]	=2000;
GlobalVars["baselevelcrycosts"]["117"]	=4000;
GlobalVars["baseleveldeucosts"]["117"]	=600;
GlobalVars["baselevelenecosts"]["117"]	=0;
GlobalVars["levelupgradecostincrements"]["117"]=2;

GlobalVars["baselevelmetcosts"]["118"]	=10000;
GlobalVars["baselevelcrycosts"]["118"]	=20000;
GlobalVars["baseleveldeucosts"]["118"]	=6000;
GlobalVars["baselevelenecosts"]["118"]	=0;
GlobalVars["levelupgradecostincrements"]["118"]=2;

GlobalVars["baselevelmetcosts"]["120"]	=200;
GlobalVars["baselevelcrycosts"]["120"]	=100;
GlobalVars["baseleveldeucosts"]["120"]	=0;
GlobalVars["baselevelenecosts"]["120"]	=0;
GlobalVars["levelupgradecostincrements"]["120"]=2;

GlobalVars["baselevelmetcosts"]["121"]	=1000;
GlobalVars["baselevelcrycosts"]["121"]	=300;
GlobalVars["baseleveldeucosts"]["121"]	=100;
GlobalVars["baselevelenecosts"]["121"]	=0;
GlobalVars["levelupgradecostincrements"]["121"]=2;

GlobalVars["baselevelmetcosts"]["122"]	=2000;
GlobalVars["baselevelcrycosts"]["122"]	=4000;
GlobalVars["baseleveldeucosts"]["122"]	=1000;
GlobalVars["baselevelenecosts"]["122"]	=0;
GlobalVars["levelupgradecostincrements"]["122"]=2;

GlobalVars["baselevelmetcosts"]["123"]	=240000;
GlobalVars["baselevelcrycosts"]["123"]	=400000;
GlobalVars["baseleveldeucosts"]["123"]	=160000;
GlobalVars["baselevelenecosts"]["123"]	=0;
GlobalVars["levelupgradecostincrements"]["123"]=2;

GlobalVars["baselevelmetcosts"]["124"]	=4000;
GlobalVars["baselevelcrycosts"]["124"]	=8000;
GlobalVars["baseleveldeucosts"]["124"]	=4000;
GlobalVars["baselevelenecosts"]["124"]	=0;
GlobalVars["levelupgradecostincrements"]["124"]=2;

GlobalVars["baselevelmetcosts"]["199"]	=0;
GlobalVars["baselevelcrycosts"]["199"]	=0;
GlobalVars["baseleveldeucosts"]["199"]	=0;
GlobalVars["baselevelenecosts"]["199"]	=300000;
GlobalVars["levelupgradecostincrements"]["199"]=3;



GlobalVars["unitsmetcost"]["401"]=2000;
GlobalVars["unitscrycost"]["401"]=0;
GlobalVars["unitsdeucost"]["401"]=0;
GlobalVars["unitsweapons"]["401"]=80;
GlobalVars["unitsshields"]["401"]=20;
GlobalVars["unitsintegrity"]["401"]=2000;

GlobalVars["unitsmetcost"]["402"]=1500;
GlobalVars["unitscrycost"]["402"]=500;
GlobalVars["unitsdeucost"]["402"]=0;
GlobalVars["unitsweapons"]["402"]=100;
GlobalVars["unitsshields"]["402"]=25;
GlobalVars["unitsintegrity"]["402"]=2000;

GlobalVars["unitsmetcost"]["403"]=6000;
GlobalVars["unitscrycost"]["403"]=2000;
GlobalVars["unitsdeucost"]["403"]=0;
GlobalVars["unitsweapons"]["403"]=250;
GlobalVars["unitsshields"]["403"]=100;
GlobalVars["unitsintegrity"]["403"]=8000;

GlobalVars["unitsmetcost"]["404"]=20000;
GlobalVars["unitscrycost"]["404"]=15000;
GlobalVars["unitsdeucost"]["404"]=2000;
GlobalVars["unitsweapons"]["404"]=1100;
GlobalVars["unitsshields"]["404"]=200;
GlobalVars["unitsintegrity"]["404"]=35000;

GlobalVars["unitsmetcost"]["405"]=2000;
GlobalVars["unitscrycost"]["405"]=6000;
GlobalVars["unitsdeucost"]["405"]=0;
GlobalVars["unitsweapons"]["405"]=150;
GlobalVars["unitsshields"]["405"]=500;
GlobalVars["unitsintegrity"]["405"]=8000;

GlobalVars["unitsmetcost"]["406"]=50000;
GlobalVars["unitscrycost"]["406"]=50000;
GlobalVars["unitsdeucost"]["406"]=30000;
GlobalVars["unitsweapons"]["406"]=3000;
GlobalVars["unitsshields"]["406"]=300;
GlobalVars["unitsintegrity"]["406"]=100000;

GlobalVars["unitsmetcost"]["407"]=10000;
GlobalVars["unitscrycost"]["407"]=10000;
GlobalVars["unitsdeucost"]["407"]=0;
GlobalVars["unitsweapons"]["407"]=1;
GlobalVars["unitsshields"]["407"]=2000;
GlobalVars["unitsintegrity"]["407"]=20000;

GlobalVars["unitsmetcost"]["408"]=50000;
GlobalVars["unitscrycost"]["408"]=50000;
GlobalVars["unitsdeucost"]["408"]=0;
GlobalVars["unitsweapons"]["408"]=1;
GlobalVars["unitsshields"]["408"]=10000;
GlobalVars["unitsintegrity"]["408"]=100000;

GlobalVars["unitsmetcost"]["502"]=8000;
GlobalVars["unitscrycost"]["502"]=0;
GlobalVars["unitsdeucost"]["502"]=2000;
GlobalVars["unitsweapons"]["502"]=0;
GlobalVars["unitsshields"]["502"]=0;
GlobalVars["unitsintegrity"]["502"]=0;

GlobalVars["unitsmetcost"]["503"]=12500;
GlobalVars["unitscrycost"]["503"]=2500;
GlobalVars["unitsdeucost"]["503"]=10000;
GlobalVars["unitsweapons"]["503"]=0;
GlobalVars["unitsshields"]["503"]=0;
GlobalVars["unitsintegrity"]["503"]=0;


GlobalVars["unitsmetcost"]["202"]=2000;
GlobalVars["unitscrycost"]["202"]=2000;
GlobalVars["unitsdeucost"]["202"]=0;
GlobalVars["unitsweapons"]["202"]=5;
GlobalVars["unitsshields"]["202"]=10;
GlobalVars["unitsintegrity"]["202"]=4000;
GlobalVars["shipsrapidfire"]["202"]={"210":5,"212":5};
GlobalVars["shipspeed"]["202"]={"basespeed":5000,"tech":"115","speedincrement":0.1,"upgradespeed":10000,"upgradetech":"117","upgradespeedincrement":0.2,"upgradelevel":5};
GlobalVars["shipscapacity"]["202"]=5000;
GlobalVars["shipsconsumption"]["202"]={"baseconsumption":10,"upgradeconsumption":20,"upgradetech":"117","upgradelevel":5};

GlobalVars["unitsmetcost"]["203"]=6000;
GlobalVars["unitscrycost"]["203"]=6000;
GlobalVars["unitsdeucost"]["203"]=0;
GlobalVars["unitsweapons"]["203"]=5;
GlobalVars["unitsshields"]["203"]=25;
GlobalVars["unitsintegrity"]["203"]=12000;
GlobalVars["shipsrapidfire"]["203"]={"210":5,"212":5};
GlobalVars["shipspeed"]["203"]={"basespeed":7500,"tech":"115","speedincrement":0.1,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["203"]=25000;
GlobalVars["shipsconsumption"]["203"]={"baseconsumption":50,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["204"]=3000;
GlobalVars["unitscrycost"]["204"]=1000;
GlobalVars["unitsdeucost"]["204"]=0;
GlobalVars["unitsweapons"]["204"]=50;
GlobalVars["unitsshields"]["204"]=10;
GlobalVars["unitsintegrity"]["204"]=4000;
GlobalVars["shipsrapidfire"]["204"]={"210":5,"212":5};
GlobalVars["shipspeed"]["204"]={"basespeed":12500,"tech":"115","speedincrement":0.1,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["204"]=50;
GlobalVars["shipsconsumption"]["204"]={"baseconsumption":20,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["205"]=6000;
GlobalVars["unitscrycost"]["205"]=4000;
GlobalVars["unitsdeucost"]["205"]=0;
GlobalVars["unitsweapons"]["205"]=150;
GlobalVars["unitsshields"]["205"]=25;
GlobalVars["unitsintegrity"]["205"]=10000;
GlobalVars["shipsrapidfire"]["205"]={"202":3,"210":5,"212":5};
GlobalVars["shipspeed"]["205"]={"basespeed":10000,"tech":"117","speedincrement":0.2,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["205"]=100;
GlobalVars["shipsconsumption"]["205"]={"baseconsumption":75,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["206"]=20000;
GlobalVars["unitscrycost"]["206"]=7000;
GlobalVars["unitsdeucost"]["206"]=2000;
GlobalVars["unitsweapons"]["206"]=400;
GlobalVars["unitsshields"]["206"]=50;
GlobalVars["unitsintegrity"]["206"]=27000;
GlobalVars["shipsrapidfire"]["206"]={"204":6,"210":5,"212":5,"401":10};
GlobalVars["shipspeed"]["206"]={"basespeed":15000,"tech":"117","speedincrement":0.2,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["206"]=800;
GlobalVars["shipsconsumption"]["206"]={"baseconsumption":300,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["207"]=45000;
GlobalVars["unitscrycost"]["207"]=15000;
GlobalVars["unitsdeucost"]["207"]=0;
GlobalVars["unitsweapons"]["207"]=1000;
GlobalVars["unitsshields"]["207"]=200;
GlobalVars["unitsintegrity"]["207"]=60000;
GlobalVars["shipsrapidfire"]["207"]={"210":5,"212":5};
GlobalVars["shipspeed"]["207"]={"basespeed":10000,"tech":"118","speedincrement":0.3,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["207"]=1500;
GlobalVars["shipsconsumption"]["207"]={"baseconsumption":500,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["208"]=10000;
GlobalVars["unitscrycost"]["208"]=20000;
GlobalVars["unitsdeucost"]["208"]=10000;
GlobalVars["unitsweapons"]["208"]=50;
GlobalVars["unitsshields"]["208"]=100;
GlobalVars["unitsintegrity"]["208"]=30000;
GlobalVars["shipsrapidfire"]["208"]={"210":5,"212":5};
GlobalVars["shipspeed"]["208"]={"basespeed":2500,"tech":"117","speedincrement":0.2,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["208"]=7500;
GlobalVars["shipsconsumption"]["208"]={"baseconsumption":1000,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["209"]=10000;
GlobalVars["unitscrycost"]["209"]=6000;
GlobalVars["unitsdeucost"]["209"]=2000;
GlobalVars["unitsweapons"]["209"]=1;
GlobalVars["unitsshields"]["209"]=10;
GlobalVars["unitsintegrity"]["209"]=16000;
GlobalVars["shipsrapidfire"]["209"]={"210":5,"212":5};
GlobalVars["shipspeed"]["209"]={"basespeed":2000,"tech":"115","speedincrement":0.1,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["209"]=20000;
GlobalVars["shipsconsumption"]["209"]={"baseconsumption":300,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["210"]=0;
GlobalVars["unitscrycost"]["210"]=1000;
GlobalVars["unitsdeucost"]["210"]=0;
GlobalVars["unitsweapons"]["210"]=0;
GlobalVars["unitsshields"]["210"]=0;
GlobalVars["unitsintegrity"]["210"]=1000;
GlobalVars["shipsrapidfire"]["210"]={};
GlobalVars["shipspeed"]["210"]={"basespeed":100000000,"tech":"115","speedincrement":0.1,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["210"]=5;
GlobalVars["shipsconsumption"]["210"]={"baseconsumption":1,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["211"]=50000;
GlobalVars["unitscrycost"]["211"]=25000;
GlobalVars["unitsdeucost"]["211"]=15000;
GlobalVars["unitsweapons"]["211"]=1000;
GlobalVars["unitsshields"]["211"]=500;
GlobalVars["unitsintegrity"]["211"]=75000;
GlobalVars["shipsrapidfire"]["211"]={"210":5,"212":5,"401":20,"402":20,"403":10,"405":10};
GlobalVars["shipspeed"]["211"]={"basespeed":4000,"tech":"117","speedincrement":0.2,"upgradespeed":5000,"upgradetech":"118","upgradespeedincrement":0.3,"upgradelevel":8};
GlobalVars["shipscapacity"]["211"]=500;
GlobalVars["shipsconsumption"]["211"]={"baseconsumption":1000,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["212"]=0;
GlobalVars["unitscrycost"]["212"]=2000;
GlobalVars["unitsdeucost"]["212"]=500;
GlobalVars["unitsweapons"]["212"]=1;
GlobalVars["unitsshields"]["212"]=1;
GlobalVars["unitsintegrity"]["212"]=2000;
GlobalVars["shipsrapidfire"]["212"]={};
GlobalVars["shipspeed"]["212"]={"basespeed":0,"tech":"115","speedincrement":0,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["212"]=0;
GlobalVars["shipsconsumption"]["212"]={"baseconsumption":0,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["213"]=60000;
GlobalVars["unitscrycost"]["213"]=50000;
GlobalVars["unitsdeucost"]["213"]=15000;
GlobalVars["unitsweapons"]["213"]=2000;
GlobalVars["unitsshields"]["213"]=500;
GlobalVars["unitsintegrity"]["213"]=110000;
GlobalVars["shipsrapidfire"]["213"]={"210":5,"212":5,"215":2,"402":10};
GlobalVars["shipspeed"]["213"]={"basespeed":5000,"tech":"118","speedincrement":0.3,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["213"]=2000;
GlobalVars["shipsconsumption"]["213"]={"baseconsumption":1000,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["214"]=5000000;
GlobalVars["unitscrycost"]["214"]=4000000;
GlobalVars["unitsdeucost"]["214"]=1000000;
GlobalVars["unitsweapons"]["214"]=200000;
GlobalVars["unitsshields"]["214"]=50000;
GlobalVars["unitsintegrity"]["214"]=9000000;
GlobalVars["shipsrapidfire"]["214"]={"202":250,"203":250,"204":200,"205":100,"206":33,"207":30,"208":250,"209":250,"210":1250,"211":25,"212":1250,"213":5,"215":15,"401":200,"402":200,"403":100,"404":50,"405":100};
GlobalVars["shipspeed"]["214"]={"basespeed":100,"tech":"118","speedincrement":0.3,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["214"]=1000000;
GlobalVars["shipsconsumption"]["214"]={"baseconsumption":1,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};

GlobalVars["unitsmetcost"]["215"]=30000;
GlobalVars["unitscrycost"]["215"]=40000;
GlobalVars["unitsdeucost"]["215"]=15000;
GlobalVars["unitsweapons"]["215"]=700;
GlobalVars["unitsshields"]["215"]=400;
GlobalVars["unitsintegrity"]["215"]=70000;
GlobalVars["shipsrapidfire"]["215"]={"202":3,"203":3,"205":4,"206":4,"207":7,"210":5,"212":5};
GlobalVars["shipspeed"]["215"]={"basespeed":10000,"tech":"118","speedincrement":0.3,"upgradespeed":0,"upgradetech":"","upgradelevel":0};
GlobalVars["shipscapacity"]["215"]=750;
GlobalVars["shipsconsumption"]["215"]={"baseconsumption":250,"upgradeconsumption":0,"upgradetech":"","upgradelevel":0};


GlobalVars["buildingneeds"][1]=new Array();//met
GlobalVars["buildingneeds"][2]=new Array();//cri
GlobalVars["buildingneeds"][3]=new Array();//deu
GlobalVars["buildingneeds"][4]=new Array();//solare
GlobalVars["buildingneeds"][12]=new Array({"requirement":3,"level":5},{"requirement":113,"level":3});//fusione
GlobalVars["buildingneeds"][14]=new Array();//robot
GlobalVars["buildingneeds"][15]=new Array({"requirement":14,"level":10},{"requirement":108,"level":10});//naniti
GlobalVars["buildingneeds"][21]=new Array({"requirement":14,"level":2});//cantiere
GlobalVars["buildingneeds"][22]=new Array();//depmet
GlobalVars["buildingneeds"][23]=new Array();//depcri
GlobalVars["buildingneeds"][24]=new Array();//depdeu
GlobalVars["buildingneeds"][31]=new Array();//lab
GlobalVars["buildingneeds"][33]=new Array({"requirement":15,"level":1},{"requirement":113,"level":12});//terraformer
GlobalVars["buildingneeds"][34]=new Array();//base appoggio
GlobalVars["buildingneeds"][44]=new Array({"requirement":21,"level":1});//missili


GlobalVars["buildingneeds"][41]=new Array();//avanposto
GlobalVars["buildingneeds"][42]=new Array({"requirement":41,"level":1});//falange
GlobalVars["buildingneeds"][43]=new Array({"requirement":41,"level":1},{"requirement":114,"level":7});//portale

GlobalVars["buildingneeds"][106]=new Array({"requirement":31,"level":3});//spio
GlobalVars["buildingneeds"][108]=new Array({"requirement":31,"level":1});//info
GlobalVars["buildingneeds"][109]=new Array({"requirement":31,"level":4});//armi
GlobalVars["buildingneeds"][110]=new Array({"requirement":113,"level":3},{"requirement":31,"level":6});//scudi
GlobalVars["buildingneeds"][111]=new Array({"requirement":31,"level":2});//cora
GlobalVars["buildingneeds"][113]=new Array({"requirement":31,"level":1});//ene
GlobalVars["buildingneeds"][114]=new Array({"requirement":113,"level":5},{"requirement":110,"level":5},{"requirement":31,"level":7});//tec iperspaziale
GlobalVars["buildingneeds"][115]=new Array({"requirement":113,"level":1});//prop comb
GlobalVars["buildingneeds"][117]=new Array({"requirement":113,"level":1},{"requirement":31,"level":2});//prop imp
GlobalVars["buildingneeds"][118]=new Array({"requirement":114,"level":3});//prop iperspaziale
GlobalVars["buildingneeds"][120]=new Array({"requirement":113,"level":2});//laser
GlobalVars["buildingneeds"][121]=new Array({"requirement":31,"level":4},{"requirement":120,"level":5},{"requirement":113,"level":4});//ionica
GlobalVars["buildingneeds"][122]=new Array({"requirement":113,"level":8},{"requirement":120,"level":10},{"requirement":121,"level":5});//plasmi
GlobalVars["buildingneeds"][123]=new Array({"requirement":31,"level":10},{"requirement":108,"level":8},{"requirement":114,"level":8});//rete di ric
GlobalVars["buildingneeds"][124]=new Array({"requirement":106,"level":4},{"requirement":117,"level":3});//spedizione
GlobalVars["buildingneeds"][199]=new Array({"requirement":31,"level":12});//gravi


GlobalVars["buildingneeds"][202]=new Array({"requirement":21,"level":2},{"requirement":115,"level":2});//carghino
GlobalVars["buildingneeds"][203]=new Array({"requirement":21,"level":4},{"requirement":115,"level":6});//cargone
GlobalVars["buildingneeds"][204]=new Array({"requirement":21,"level":1},{"requirement":115,"level":1});//caccino
GlobalVars["buildingneeds"][205]=new Array({"requirement":21,"level":3},{"requirement":111,"level":2},{"requirement":117,"level":2});//caccione
GlobalVars["buildingneeds"][206]=new Array({"requirement":21,"level":5},{"requirement":117,"level":4},{"requirement":121,"level":4});//incro
GlobalVars["buildingneeds"][207]=new Array({"requirement":21,"level":7},{"requirement":118,"level":4});//bs
GlobalVars["buildingneeds"][208]=new Array({"requirement":21,"level":4},{"requirement":117,"level":3});//colo
GlobalVars["buildingneeds"][209]=new Array({"requirement":21,"level":4},{"requirement":115,"level":6},{"requirement":110,"level":2});//rici
GlobalVars["buildingneeds"][210]=new Array({"requirement":21,"level":3},{"requirement":115,"level":3},{"requirement":106,"level":2});//sonda
GlobalVars["buildingneeds"][211]=new Array({"requirement":117,"level":6},{"requirement":21,"level":8},{"requirement":122,"level":5});//bomber
GlobalVars["buildingneeds"][212]=new Array({"requirement":21,"level":1});//satellite
GlobalVars["buildingneeds"][213]=new Array({"requirement":21,"level":9},{"requirement":118,"level":6},{"requirement":114,"level":5});//cora
GlobalVars["buildingneeds"][214]=new Array({"requirement":21,"level":12},{"requirement":118,"level":7},{"requirement":114,"level":6},{"requirement":199,"level":1});//mn
GlobalVars["buildingneeds"][215]=new Array({"requirement":114,"level":5},{"requirement":120,"level":12},{"requirement":118,"level":5},{"requirement":21,"level":8});//bc


GlobalVars["buildingneeds"][401]=new Array({"requirement":21,"level":1});//lanciamissili
GlobalVars["buildingneeds"][402]=new Array({"requirement":113,"level":1},{"requirement":21,"level":2},{"requirement":120,"level":3});//laserino
GlobalVars["buildingneeds"][403]=new Array({"requirement":113,"level":3},{"requirement":21,"level":4},{"requirement":120,"level":6});//laserone
GlobalVars["buildingneeds"][404]=new Array({"requirement":21,"level":6},{"requirement":113,"level":6},{"requirement":109,"level":3},{"requirement":110,"level":1});//gauss
GlobalVars["buildingneeds"][405]=new Array({"requirement":21,"level":4},{"requirement":121,"level":4});//ionico
GlobalVars["buildingneeds"][406]=new Array({"requirement":21,"level":8},{"requirement":122,"level":7});//plasmon
GlobalVars["buildingneeds"][407]=new Array({"requirement":110,"level":2},{"requirement":21,"level":1});//cupolina
GlobalVars["buildingneeds"][408]=new Array({"requirement":110,"level":6},{"requirement":21,"level":6});//cupolone


GlobalVars["buildingneeds"][502]=new Array({"requirement":44,"level":2},{"requirement":21,"level":1});//anti-missile
GlobalVars["buildingneeds"][503]=new Array({"requirement":44,"level":4},{"requirement":21,"level":1},{"requirement":117,"level":1});//missile





GlobalVars["labneed"][106]=3;//spio
GlobalVars["labneed"][108]=1;//info
GlobalVars["labneed"][109]=4;//armi
GlobalVars["labneed"][110]=6;//scudi
GlobalVars["labneed"][111]=2;//cora
GlobalVars["labneed"][113]=1;//ene
GlobalVars["labneed"][114]=7;//tec iperspaziale
GlobalVars["labneed"][115]=0;//prop comb
GlobalVars["labneed"][117]=2;//prop imp
GlobalVars["labneed"][118]=0;//prop iperspaziale
GlobalVars["labneed"][120]=0;//laser
GlobalVars["labneed"][121]=4;//ionica
GlobalVars["labneed"][122]=0;//plasmi
GlobalVars["labneed"][123]=10;//rete di ric
GlobalVars["labneed"][124]=0;//spedizione
GlobalVars["labneed"][199]=12;//gravi
