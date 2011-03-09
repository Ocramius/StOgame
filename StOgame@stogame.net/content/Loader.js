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
var ST_jquery=jQuery.noConflict();

ST_contentLoad=function(e)
{
	var unsafeWin=e.target.defaultView;
	if (unsafeWin.wrappedJSObject)
	{
		unsafeWin=unsafeWin.wrappedJSObject;
	}
	var unsafeLoc=new XPCNativeWrapper(unsafeWin, "location").location;
	var href=new XPCNativeWrapper(unsafeLoc, "href").href;
	var safeWin=new XPCNativeWrapper(unsafeWin);
	var sandbox=new Components.utils.Sandbox(safeWin);
	ST_sandbox=sandbox;
	sandbox.window=safeWin;
	sandbox.document=sandbox.window.document;
	sandbox.unsafeWindow=unsafeWin;
	sandbox.XPathResult=Components.interfaces.nsIDOMXPathResult;
	var account=localization.localize(sandbox);
	if(account!=0)
	{
		sandbox.unsafeWindow.OgameAccount=account.ogameaccount.get();
		if(typeof sandbox.unsafeWindow.useStOgame=="function")
		{
			sandbox.unsafeWindow.useStOgame();
		}
	}
}

ST_onLoad=function()
{
	var	appcontent=window.document.getElementById("appcontent");
	if(!appcontent)
	{
		appcontent=document.getElementById("content");
	}
	if (appcontent && !appcontent.loaded_by_stogame) {
		appcontent.loaded_by_stogame=true;
		appcontent.addEventListener
		(
			"DOMContentLoaded",
			ST_contentLoad,
			false
		);
	}
}

ST_onUnLoad=function()
{
	window.removeEventListener
	(
		'load',
		ST_onLoad,
		false
	);
	window.removeEventListener
	(
		'unload',
		ST_onUnLoad,
		false
	);
	window.document.getElementById("appcontent").removeEventListener
	(
		"DOMContentLoaded",
		ST_contentLoad,
		false
	);
}

window.addEventListener
(
	'load',
	ST_onLoad,
	false
);

window.addEventListener(
	'unload',
	ST_onUnLoad,
	false
);

function restartApp() {
  const nsIAppStartup = Components.interfaces.nsIAppStartup;

  // Notify all windows that an application quit has been requested.
  var os = Components.classes["@mozilla.org/observer-service;1"]
                     .getService(Components.interfaces.nsIObserverService);
  var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"]
                             .createInstance(Components.interfaces.nsISupportsPRBool);
  os.notifyObservers(cancelQuit, "quit-application-requested", null);

  // Something aborted the quit process. 
  if (cancelQuit.data)
    return;

  // Notify all windows that an application quit has been granted.
  os.notifyObservers(null, "quit-application-granted", null);

  // Enumerate all windows and call shutdown handlers
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator);
  var windows = wm.getEnumerator(null);
  while (windows.hasMoreElements()) {
    var win = windows.getNext();
    if (("tryToClose" in win) && !win.tryToClose())
      return;
  }
  Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(nsIAppStartup)
            .quit(nsIAppStartup.eRestart | nsIAppStartup.eAttemptQuit);
}


var extmanager=Components.classes["@mozilla.org/extensions/manager;1"]
	.getService(Components.interfaces.nsIExtensionManager);
	
if(typeof GTPlugin_43ec517d68b6edd3015b3edc9a11367b=="function")
{
	var galaxytoolinstalldir=extmanager.getInstallLocation("{71bfcce7-421d-4042-95d4-a585a821cbca}");
	if(galaxytoolinstalldir!=null)
	{
		if(confirm("GalaxyTool Plugin is enabled!\nStOgame could interfer with it! By pressing \"OK\" you will disable GalaxyTool Plugin, otherwise StOgame will disable itself!"))
		{
			extmanager.disableItem("{71bfcce7-421d-4042-95d4-a585a821cbca}");
		}
		else
		{
			extmanager.disableItem("StOgame@stogame.net");
		}
		restartApp();
	}
}

if(typeof foxgame_load=="function")
{
	var foxgameinstalldir=extmanager.getInstallLocation("{b66bc4c3-6d25-4a10-8c59-01daa9063051}");
	if(foxgameinstalldir!=null)
	{
		if(confirm("FoxGame is enabled!\nStOgame could interfer with it! By pressing \"OK\" you will disable FoxGame, otherwise StOgame will disable itself!"))
		{
			extmanager.disableItem("{b66bc4c3-6d25-4a10-8c59-01daa9063051}");
		}
		else
		{
			extmanager.disableItem("StOgame@stogame.net");
		}
		restartApp();
	}
}