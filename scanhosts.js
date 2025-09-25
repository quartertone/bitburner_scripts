/** @param {NS} ns **/
//SOLID
import { settings, serverinfo, loopinstall, rootprep, zprint } from "settings.js";
export async function main(ns) {

	//var scriptram = ns.getScriptRam(settings.scripts.weak, "home");

	var recursion = 0;

	var opts = {
		target: "temp",
		appendonly: true,
		verbose: false,
		silent: false,
		getinfo: false,
		hackable: false,
		exclude: ["hacknet", "pserv"], //search string to exclude
		includeonly: [],
		grep: "",
		sharing: false,
		sortinfo: "",
		sortrev: false,
		killall: false,
	}
	var allservers = [];

	var backdoorservers = ["CSEC", "I.I.I.I", "run4theh111z", "avmnite-02h", "fulcrumassets"];

	//var target = "temp";

	var usage = "Usage: {flags}\n\
		[-h]		This help text\n\
		[target]		Target for hacking scripts\n\
		[-r recursion]	Depth of levels to scan. Default is max.\n\
		[--hackable]	Show/scan only hackable servers\n\
		[--replace]		Re-up new script to running servers\n\
		[-e exclude]	Partial name of servers to EXCLUDE (default hacknet,pserv)\n\
		[--eo excludeOnly]	Partial name of servers to also EXCLUDE\n\
		[-i include]	Partial name of servers to INCLUDE\n\
		[-v]		make it verbose\n\
		[-q]		make it silent\n\
		[-f grep]		Find files with pattern grep\n\
		[--info]		Get server information\n\
		[--share]		Install processor sharing script\n\
		[--sort param]	Sort info by this\n\
		[--killall]	Wipe all non-home non-purchased servers\n\
		\t\tbackdoorInstalled\n\
		\t\tbaseDifficulty\n\
		\t\tcpuCores\n\
		\t\thackDifficulty\n\
		\t\thasAdminRights\n\
		\t\tmaxRam\n\
		\t\tminDifficulty\n\
		\t\tmoneyAvailable\n\
		\t\tmoneyMax\n\
		\t\tnumOpenPortsRequired\n\
		\t\topenPortCount\n\
		\t\tramUsed\n\
		\t\trequiredHackingSkill\n\
		\t\tserverGrowth\n\
		\n";

	// parse command line arguments
	var lines = ns.args;
	while (lines.length > 0) {
		let item = lines.shift();
		switch (item) {
			case "--replace":
				opts.appendonly = false;
				break;
			case "-r":
				opts.recursion = lines.shift();
				break;
			case "--eo":
				opts.exclude = [];
			case "-e": // partial names of servers to exclude
				let exline = lines.shift();
				if (exline == "none") {
					opts.exclude = [];
				} else {
					for (const item of exline.split(",")) {
						opts.exclude.push(item);
					}
				}
				break;
			case "-f": // partial names of servers to exclude
				opts.grep = lines.shift();
				break;
			case "-i": // include
				let incline = lines.shift();
				for (const item of incline.split(",")) {
					opts.includeonly.push(item);
				}
				break;
			case "-v":
				opts.verbose = true;
				break;
			case "-q":
				opts.silent = true;
				break;
			case "--hackable":
				opts.hackable = true;
				break;
			case "--info":
				opts.getinfo = true;
				break;
			case "--rev":
				opts.sortrev = true;
			case "--sort":
				opts.sortinfo = lines.shift();
				opts.silent = true;
				break;
			case "--share":
				opts.sharing = true;
				break;
			case "--killall":
				opts.killall = true;
				break;
			case "-h":
			default:
				if (item.match(/^-/)) {
					// bad argument
					opts.target = ""; // this forces script to fail
				} else {
					// un-tacked argument defaults to target name
					opts.target = ns.serverExists(item) ? item : "";
				}
				break;
		}
	}

	if (!opts.target) {
		//ns.tprint(opts.includeonly + " " + opts.includeonly.length);
		ns.tprint(usage);
		ns.exit();
	}

	if (ns.serverExists(opts.target)) {
		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(opts.target)) {
			//await installhack(opts.target, opts.target);
			await loopinstall(ns, opts.target, opts);
			//make sure we also use HOME
			// await installhack("home", opts.target);
			//await loopinstall(ns, "home", opts);
		} else {
			ns.tprint("Target " + opts.target + " hacking level too high "
				+ ns.getServerRequiredHackingLevel(opts.target));
			ns.exit();
		}
	}

	await scanhost("home", ""); // Recursive scan function

	/// END OF MAIN SCRIPT ///

	if (opts.sortinfo) {
		let sortedservers = allservers.sort(function (a, b) {
			if (opts.sortrev) {
				return b[opts.sortinfo] - a[opts.sortinfo];
			} else {
				return a[opts.sortinfo] - b[opts.sortinfo];
			}
		});
		for (const info of sortedservers) {
			ns.tprint(serverinfo(ns, info));
		}
	}


	if (opts.verbose) {
		//	ns.tprint("-- SCAN COMPLETE --");
		ns.tprint("-- Target: " + opts.target + " --");
	}

	ns.tprint("-- SCAN COMPLETE --");

	/// FUNCTIONS BELOW ///

	// SCAN and do things
	async function scanhost(host, parent, recursioncount = 1, trace = "home;") {
		//await ns.sleep(20); // prevent runaway script
		//ns.tprint((" ").repeat(indentcount), "SCANNING host: ", host, " ", recursioncount);
		let servers = ns.scan(host); // get servers connected to host
		for (const server of servers) {

			// skip the server we came from
			// if parent is the only connection this stops the recursion
			if (server == parent) continue;

			// exclude filter
			//if (opts.exclude && server.match(opts.exclude)) continue;

			if ((opts.exclude.length > 0) && (opts.exclude.find(function (s) {
				return server.match(s);
			}))) {
				continue;
			}



			// include-only filter
			//if (opts.includeonly && !server.match(opts.includeonly)) continue;
			if (opts.includeonly.length > 0) {
				if (opts.includeonly.find(function (s) {
					return server.match(s);
				})) {
					//do the thing
					console.log("scanning " + server);
				} else {
					continue;
				}
			}

			// found a connected server. DO THINGS
			let serverhacklevel = ns.getServerRequiredHackingLevel(server);

			// show only hackable servers
			if (opts.hackable && ns.getHackingLevel() < serverhacklevel) continue;

			//await ns.sleep(50);

			let info = ns.getServer(server);

			if (!opts.silent) {

				let bakdoorcmd = !info.backdoorInstalled ? ";backdoor" : "";
				let noroot = rootprep(ns, server) ? "" : "*";
				if (backdoorservers.includes(server) && !info.backdoorInstalled) {
					noroot = "*";
				}
				eval('\
				zprint(("-").repeat(recursioncount) \
					+ server + " (" + serverhacklevel + ") " \
					+ recursioncount + " " + noroot, trace + "connect " + server + bakdoorcmd);');
				//ns.tprint("trace = " + trace +":"+ server);
				if (bakdoorcmd && ns.getHackingLevel() > serverhacklevel
					&& backdoorservers.includes(server)
					&& noroot == "*") {
					ns.exec("backdoor.js", "home", 1, trace + "connect " + server);
				}
			}

			if (opts.getinfo) {
				// display server info
				if (opts.sortinfo) {
					allservers.push(info);
				} else {
					ns.tprint(serverinfo(ns, info));
				}

			} else if (opts.grep) {
				// look for server files
				await listfiles(server, opts.grep, recursioncount);

			} else if (opts.sharing) {
				if (rootprep(ns, server)) {
					await ns.scp(settings.sharescript, server, "home");
					let sharethreads = ns.getServerMaxRam(server) / ns.getScriptRam(settings.sharescript, "home");
					ns.killall(server);
					ns.exec(settings.sharescript, server, sharethreads);
				}

			} else if (opts.killall) {
				if (!["home"].find(function (s) { //,"pserv", "hacknet"
					return server.match(s);
				})) {
					ns.killall(server);
					ns.tprint("Killed scripts on " + server);
				}
			} else if (ns.serverExists(opts.target)) {
				// installing hack scripts
				if (opts.verbose) ns.tprint("-------- Installhacking " + server);
				await loopinstall(ns, server, opts);
			}

			if (recursion == 0 || recursion > recursioncount) {
				// continue recursive scanning
				await scanhost(server, host, recursioncount + 1, trace + "connect " + server + ";");
			}
		}
	}

	async function listfiles(server, grep, indentcount) {
		let files = ns.ls(server, grep);
		//if (files.length == 0) return;
		//ns.tprint((" ").repeat(indentcount), ": ", server, ":");
		while (files.length > 0) {
			ns.tprint((" ").repeat(indentcount) + server + ": " + files.shift());
		}
	}

}

export function autocomplete(data, args) {
	return [...data.servers];
}