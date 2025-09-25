/** @param {NS} ns **/

import { terminalcommand, panelbox, getservers } from "settings.js";

export async function main(ns) {
	/*
Buttons to make:
[target] (dropdown list)
start/stop Stock monster | keep | forecast
checkstock info
start/stop buy servers | 2^N RAM 
*/
	var servs = getservers(ns); //"joesguns phantasy zer0 foodnstuff comptek";
	servs = servs.filter((s) => {
		let info = ns.getServer(s);
		return (info.maxRam >0 && info.moneyMax >0);
	});
	//servs = servs.split(" ");

	//var mainbox = document.getElementById("root");
	//mainbox.insertAdjacentElement("afterend", controlbox);

	var controlbox = document.createElement("div");

	//mainbox.appendChild(controlbox);
	panelbox(controlbox,"controlpanel");

	controlbox.id = "controlbox";
	controlbox.style = "padding-top:1.5em";
	//	"z-index:10000;min-width:5em; min-height:5em; position:fixed; top:5em;left:5em; background:#444;color:#fff;padding:1.25em 0.25em 0.25em";

/*
	var headerbar = document.createElement("div");
	headerbar.id = controlbox.id + "header";
	headerbar.style =
		"height:1em; width:100%; background:#222; position:absolute; top:0;left:0;right:0";
	headerbar.innerHTML = " ";
	//controlbox.appendChild(headerbar);
*/
//	controlbox.innerHTML += '<label for="servers">Servers: </label>';


	var serverinfobtn = document.createElement("button");
	serverinfobtn.innerHTML = "S-info";
	serverinfobtn.addEventListener("click", function (e) {
		//ns.print(
		//	'ns.exec("check-getinfo.js", "home", 1, "' + serverselect.value + '");'
		terminalcommand("run check-getinfo.js " + serverselect.value);
		//);
	});
	controlbox.appendChild(serverinfobtn);


	var serverselect = document.createElement("select");
	serverselect.name = "servers";
	serverselect.id = "servers";
	for (const serv of servs) {
		serverselect.innerHTML += '<option value="' + serv + '">' + serv + "</option>";
	}
	serverselect.addEventListener("change", function (e) {
		// SERVER SELECTED
		//ns.print("selected server: " + serverselect.value);
	});
	controlbox.appendChild(serverselect);

	//controlbox.appendChild(stonk);

	controlbox.appendChild(document.createElement("br"));
	
	var stockinfobtn = document.createElement("button");
	stockinfobtn.innerHTML = "Stocks info(t)";
	stockinfobtn.addEventListener("click", function (e) {
		terminalcommand("run check-stockinfo.js");
	});
	controlbox.appendChild(stockinfobtn);

/*
	var stockmoney = document.createElement("button");
	stockmoney.innerHTML = "Stock tracker";
	stockmoney.addEventListener("click", function (e) {
		terminalcommand("run check-moneystocks.js");
	});
	controlbox.appendChild(stockmoney);
*/
/*
	var closebox = document.createElement("button");
	closebox.innerHTML = "X";
	//closebox.style =
	//	"position:absolute;top:0.2em; right:0.2em; width: 1.5em; height:1.5em; padding: 0.1em; line-height: 1.4em";
	controlbox.appendChild(closebox);

	closebox.addEventListener("click", function (e) {
		//ns.print('Closed Control box');
		controlbox.parentElement.removeChild(controlbox);

	});

*/
	//www.kirupa.com/html5/drag.htm
	//www.w3schools.com/howto/howto_js_draggable.asp

	//draggable(controlbox);

}
/*
var ns = {
	tprint: function (s) {
		document.getElementById("output").innerHTML += s + "<br/>";
	}
};

/*
var stonk = document.createElement("div");
var stonkbtn = document.createElement("input");
stonkbtn.type = "checkbox";
stonkbtn.name = "stonkbtn";
stonkbtn.id = "stonkbtn";
stonk.appendChild(stonkbtn);
stonk.innerHTML +=
	'<label for="stonkbtn">Stonk</label>' +
	'<input style="width:8em" type="number" name="stonkeep" id="stonkeep" placeholder="keep" min="10000" />' +
	'<input style="width:3.5em;" min="0.51" max="0.65" step="0.01" type="number" name="stonkcast" id="stonkcast" placeholder="0.58" />';

stonkbtn.addEventListener("click", function (e) {
	mainbox.innerHTML += "clicked";
});

/* */