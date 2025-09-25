/** @param {NS} ns **/

// BASIC SETTINGS
export const settings = {
	//host: "home",
	homerambuffer: 128,

	loopinstall: "loop-install.js",
	scanhosts: "scanhosts.js",
	scripts: {
		hack: "loop-hack.js",
		grow: "loop-grow.js",
		weak: "loop-weaken.js"
	},

	batchinstall: "batch-install.js",
	batch: {
		hack: "batch-hack.js",
		weak: "batch-weak.js",
		grow: "batch-grow.js",
		ctrl: "batch-control.js"
	},
	batchbuffer: 600,

	sharescript: "share.js",


	// for redditstock.js
	threshold: 0.565, // min forecast threshold
	moneykeep: 255000000, // 100 mil
	volthresh: 0.05, // max allowable volatility
	minshares: 5, // minimum number of shares to buy
	minbuy: 15000000 // minimum purchase
}

// RETRIEVE TIME AND RAM VALUES OF SCRIPTS
export function getmemtimes(ns, target, timeonly = false) {
	let times = {
		hack: ns.getHackTime(target),
		grow: ns.getGrowTime(target),
		weak: ns.getWeakenTime(target),
		buff: settings.batchbuffer
	};
	// first calculate ram usage for batch algorithm
	times.totalbatch = times.weak + times.buff * 2;
	times.simulbatches = Math.floor(times.totalbatch / times.buff);
	if (timeonly) {
		return times;
	} else {
		let mem = {};
		for (const key in settings.batch) {
			mem[key] = ns.getScriptRam(settings.batch[key], "home");
		}
		// var totalbatchram = mem.weak * 2 + mem.grow + mem.hack;
		mem.batchtotal = mem.weak * 2 + mem.grow + mem.hack;
		mem.needed = mem.ctrl + mem.batchtotal * times.simulbatches;
		return [
			{
				...mem
			}, {
				...times
			}
		];
	}
}

// RETRIEVE ARRAY OF ALL SERVERS
export function getservers(ns) {
	const servers = ["home"];
	for (const server of servers)
		servers.push(...ns.scan(server).filter((x) => !servers.includes(x)));


	return servers;
}


export function rootprep(ns, server, verbose = false) {
	let nstools = [
		ns.brutessh,
		ns.ftpcrack,
		ns.relaysmtp,
		ns.httpworm,
		ns.sqlinject,
		ns.nuke
	];

	for (const tool of nstools) {
		try {
			tool(server);
		} catch (e) {
			if (verbose)
				ns.tprint(e);
		}
	}
	/*
	if (ns.hasRootAccess(server)) {
		try {
			eval(
				'ns.singularity.installBackdoor(server);');
		} catch (e) {
			if (verbose)
			ns.tprint(e);
		}
	}*/


	return ns.hasRootAccess(server);
}


// INSTALL LOOP SCRIPTS ON A SINGLE SERVER
export async function loopinstall(ns, server, opts) {
	let freeram = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
	let scriptram = ns.getScriptRam(settings.loopinstall, "home");
	while (ns.scriptRunning(settings.loopinstall, "home") && freeram < scriptram) { // hang on a minute if we're temp out of ram
		await ns.sleep(1000);
	}
	try {
		let args = ["-s", server, opts.target];
		if (!opts.appendonly)
			args.push("--replace");


		if (opts.verbose)
			args.push("-v");


		if (opts.silent)
			args.push("-q");


		ns.exec(settings.loopinstall, "home", 1, ...args);
		await ns.sleep(100);
	} catch (e) {
		ns.tprint("Installhack error: " + e);
	}
}


export function zprint(html, cmd = "") {
	try {
		var terminal = document.getElementById("terminal");
		let li = document.createElement("li");
		terminal.append(li);
		li.className = "jss1300 MuiTypography-root MuiTypography-body1 css-cxl1tz";
		li.innerHTML = html;
		if (cmd) {
			let com = document.createElement("a");
			com.innerHTML = " :go: ";
			com.addEventListener("click", function (e) {
				terminalcommand(cmd);
			});
			li.appendChild(com);
		}
	} catch (e) {

	}
}

// RETRIEVE INFOINFO ABOUT A SERVER
export function serverinfo(ns, info) {
	var output = "Name: " + info.organizationName + " (" + info.hostname + ")" + "\n" + "Hacklevel: " + info.requiredHackingSkill + "\t" + "Difficulty: " + info.hackDifficulty.toFixed(0) + " (" + info.minDifficulty + "~" + info.baseDifficulty + ") " + "\n" + "Hack Chance: " + (
		ns.hackAnalyzeChance(info.hostname) * 100
	).toFixed(2) + "% (" + ns.format.time(ns.getHackTime(info.hostname)) + ") " + "\nWeaktime: " + ns.format.time(ns.getWeakenTime(info.hostname)) + "\nGrowtime: " + ns.format.time(ns.getGrowTime(info.hostname)) + "\n" + "RAM: " + (
		info.maxRam - info.ramUsed
	).toFixed(2) + "/" + info.maxRam + "\t" + "Growth: " + info.serverGrowth + "\t" + "Money: " + ns.format.number(info.moneyAvailable, "0.000a") + "/" + ns.format.number(info.moneyMax, "0.000a") + "\n" + "Rooted: " + info.hasAdminRights + "\t" + "ports: " + info.openPortCount + "/" + info.numOpenPortsRequired + "\t" + "backdoor: " + info.backdoorInstalled + (info.purchasedByPlayer ? "\n" + "CpuCores: " + info.cpuCores : "") + "\n\n";

	return output;
}

// EXECUTE COMMAND IN TERMINAL
export function terminalcommand(command) {
	const terminalInput = document.getElementById("terminal-input");
	terminalInput.value = command;

	// Get a reference to the React event handler.
	const handler = Object.keys(terminalInput)[1];

	// Perform an onChange event to set some internal values.
	terminalInput[handler].onChange({ target: terminalInput });

	terminalInput[handler].onKeyDown({
		keyCode: 13,
		preventDefault: () => null
	});
}


// RETURN CURRENT TIME
export function gettime() {
	var date = new Date();
	return (date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + ":" + date.getSeconds().toString().padStart(2, "0"));
}

//CONVERT MILLISECONDS TO hh:mm:ss.x
//tFormat
export function parsetime(ms, seconds=false, precise = false) {
	var hrs = Math.floor(ms / 1000 / 60 / 60);
	var min = Math.floor((ms / 1000 / 60) % 60);
	var sec = Math.floor((ms / 1000) % 60);
	var dec = Math.floor(100 * (ms / 1000 - Math.floor(ms / 1000))); //.toFixed(2);
	//sec = (sec + dec).toFixed(2);
	let output = "";
	if (hrs > 0) output += hrs.toString().padStart(2, "0") + ":";
	output +=
		min.toString().padStart(2, "0") +
		":" +
		sec.toString().padStart(2, "0");
	if (precise) output += "." + dec.toString().padStart(2, "0");
	return output;
}

/*
//ABBREVIATE NUMBERS
export function number(num) {
	let exp = Math.log10(num);
	// 12 = tril
	// 9 = bil
	// 6 = mil
	// 8 = k
	if (exp >= 12) {
		return (num / 10 ** 12).toFixed(3) + "t";
	} else if (exp >= 9) {
		return (num / 10 ** 9).toFixed(3) + "b";
	} else if (exp >= 6) {
		return (num / 10 ** 6).toFixed(3) + "m";
	} else if (exp >= 3) {
		return (num / 10 ** 3).toFixed(3) + "k";
	} else {
		return num.toFixed(2);
	}
}
*/

// CHECK FOR PRESENCE OF BOX
export function havebox(id) {
	var divbox = document.getElementById(id);
	// If it isn't "undefined" and it isn't "null", then it exists.
	if (typeof divbox != "undefined" && divbox != null) {
		return true;
	} else {
		return false;
	}
}

// ADD FLOATING DIV BOX
export function divbox(element, id = "divbox", append = false) {
	var rootdiv = document.getElementById("root");

	// Attempt to get the element using document.getElementById
	var divbox = document.getElementById(id);

	// If it isn't "undefined" and it isn't "null", then it exists.
	if (typeof divbox == "undefined" || divbox == null) {
		divbox = document.createElement("div");
		divbox.id = id;
		rootdiv.appendChild(divbox);
		divbox.style = // right:0;bottom:0;
			"position:fixed; font-size: 16pt; top:0; left:0; color:#fff; background:#333; border:solid #23f 2px; padding: 0.5em; min-width: 2em; min-height: 2em; white-space: pre-wrap;";

		/*divbox.addEventListener("click", function (e) {
divbox.parentElement.removeChild(divbox);
});*/


		var divcloser = document.createElement("button");
		divcloser.innerHTML = "X";
		divcloser.style = "position:absolute;bottom:0.2em; right:0.2em; width: 1.5em; height:1.5em; padding: 0.1em; line-height: 1.4em";
		divbox.appendChild(divcloser);

		divcloser.addEventListener("click", function (e) {
			divbox.parentElement.removeChild(divbox);
		});

	}

	divbox.appendChild(element);
}


/*
export function divbox(text, id = "divbox", replace = false) {
	var rootdiv = document.getElementById("root");
	//Attempt to get the element using document.getElementById
	var divbox = document.getElementById(id);

	//If it isn't "undefined" and it isn't "null", then it exists.
	if (typeof divbox == "undefined" || divbox == null) {
		divbox = document.createElement("div");
		divbox.id = id;
		rootdiv.appendChild(divbox);
		divbox.style =
			"position:fixed; font-size: 18pt; right:0;bottom:0; color:#fff; background:#333; border:solid #23f 2px; padding: 0.5em; min-width: 2em; min-height: 2em; white-space: pre-wrap;";

		divbox.addEventListener("click", function (e) {
			divbox.parentElement.removeChild(divbox);
		});
	}

	if (replace) {
		divbox.innerHTML = text;
	} else {
		divbox.innerHTML += text + "<br/>";
	}
}
*/

// INSERT HTML TO COLLAPSIBLE PANEL
export function panelbox(element, id = "panelbox") {
	var panel = document.getElementsByClassName("MuiCollapse-wrapperInner MuiCollapse-vertical")[0];

	// Attempt to get the element using document.getElementById
	var panelbox = document.getElementById(id);

	// If it isn't "undefined" and it isn't "null", then it exists.
	if (typeof panelbox == "undefined" || panelbox == null) {
		panelbox = document.createElement("div");
		panelbox.id = id;
		panel.appendChild(panelbox);
		panelbox.style = "padding: 0.25em; color:#0f0; position: relative; width: 100%; min-hight: 2em; font-family:monospace; font-weight: 400;  font-size: 1rem; line-height:1";

		/*
if (document.getElementById(id + "header")) {
// if present, the header is where you move the DIV from:
alert("header clicked");
document.getElementById(id + "header").addEventListener("click", function (e) {
panelbox.parentElement.removeChild(panelbox);
});
} else {
alert("header not seen");*/

		var panelcloser = document.createElement("button");
		panelcloser.innerHTML = "X";
		panelcloser.style = "position:absolute;bottom:0.2em; right:0.2em; width: 1.5em; height:1.5em; padding: 0.1em; line-height: 1.4em";
		panelbox.appendChild(panelcloser);

		panelcloser.addEventListener("click", function (e) {
			panelbox.parentElement.removeChild(panelbox);
		});

		/*
panelbox.addEventListener("click", function (e) {
	panelbox.parentElement.removeChild(panelbox);
});
*/
		// panelbox.innerHTML = text;
		panelbox.appendChild(element);
	}
}

// BUILD A FLOATING BOX
export function draggable(item) {
	var currentX = 0;
	var currentY = 0;
	var initialX = 0;
	var initialY = 0;
	if (document.getElementById(item.id + "header")) { // if present, the header is where you move the DIV from:
		document.getElementById(item.id + "header").onmousedown = dragStart;
		document.getElementById(item.id + "header").ontouchstart = dragStart;
	} else { // otherwise, move the DIV from anywhere inside the DIV:
		item.onmousedown = dragStart;
		item.ontouchstart = dragStart;
	}

	function dragStart(e) {
		// e = e || window.event;
		// e.preventDefault();
		if (e.type === "touchstart") {
			initialX = e.touches[0].clientX;
			initialY = e.touches[0].clientY;
			item.ontouchend = dragStop;
			item.ontouchmove = dragThing;
		} else { // get the mouse cursor position at startup:
			initialX = e.clientX;
			initialY = e.clientY;
			item.onmouseup = dragStop;
			item.onmousemove = dragThing;
		}
	}

	function dragThing(e) {
		// e = e || window.event;
		// if (e.target.id != "closebox")
		e.preventDefault();
		// calculate the new cursor position:
		if (e.type === "touchmove") {
			currentX = initialX - e.touches[0].clientX;
			currentY = initialY - e.touches[0].clientY;
			initialX = e.touches[0].clientX;
			initialY = e.touches[0].clientY;
		} else {
			currentX = initialX - e.clientX;
			currentY = initialY - e.clientY;
			initialX = e.clientX;
			initialY = e.clientY;
		}
		// set the element's new position:
		item.style.top = item.offsetTop - currentY + "px";
		item.style.left = item.offsetLeft - currentX + "px";
	}

	function dragStop() { // stop moving when mouse button is released:
		item.onmouseup = null;
		item.onmousemove = null;
		item.ontouchend = null;
		item.ontouchmove = null;
	}
}

/* */