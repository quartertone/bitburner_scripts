/** @param {NS} ns **/
//SOLID

import { rootprep, settings } from "/settings.js";
export async function main(ns) {

	var server = "";
	var target = "";
	var silent = false;
	var indentcount = 1;
	var appendonly = true;
	var verbose = false;


	var usage = "Usage: {flags}\n\
		[-s server]		Host to install scripts onto\n\
		[target]		Target of hacking scripts\n\
		[-i indentcount]	display feature\n\
		[--replace]		Re-up new script to running servers\n\
		[-v]		make it verbose\n\
		[-q]		make it silent";

	// parse command line arguments
	//ns.tprint(ns.args);
	var lines = ns.args;
	while (lines.length > 0) {
		let item = lines.shift();
		switch (item) {
			case "-s":
				server = lines.shift();
				break;
			case "-i":
				indentcount = lines.shift();
				break;
			case "--replace": // partial names of servers to exclude
				appendonly = false;
				break;
			case "-v": // partial names of servers to exclude
				verbose = true;
				break;
			case "-q":
				silent = true;
				break;
			case "-h":
			default:
				if (item.match(/^-/)) {
					// bad argument
					target = ""; // this forces script to fail
				} else {
					// un-tacked argument defaults to target name
					target = ns.serverExists(item) ? item : "";
				}
				break;
		}
	}


	if (!server || !target) {
		ns.tprint(ns.args);
		ns.tprint("Must specify [server] and [target]");
		ns.tprint(usage);
		ns.exit();
	}
	
/*
	var nstools = [ns.brutessh, ns.ftpcrack, ns.relaysmtp,
	ns.httpworm, ns.sqlinject, ns.nuke];

	for (const tool of nstools) {
		try { tool(server); } catch (e) {
			if (verbose) ns.tprint(e);
		}
	}

	if (!ns.hasRootAccess(target) || !ns.hasRootAccess(server)) {
		//ns.tprint("You don't have root access on ", target, " yet");
		return; //ns.exit();
	}
*/

	if (!rootprep(ns,server) || !ns.hasRootAccess(target)) { 
		if (verbose) ns.tprint(" no root on " + server);
		return; 
	}

	if (appendonly
		 //&& ns.scriptRunning(settings.scripts.hack, server)
		 && ns.getServerUsedRam(server) > 0
		 
		 ) {
		// don't install if appending only to clean servers

		//if (verbose) {
		if (verbose) ns.tprint((" ").repeat(indentcount), server, " is already occupied");
		//}
		return; //ns.exit();
	}
	//ns.tprint((" ").repeat(indentcount), " installing scripts on " + server);

	//if (!force && server == target) return; //skip the main target; was done first
	var info = ns.getServer(server);

	var servram = info.maxRam; //(info.maxRam - info.ramUsed); //info.maxRam;
	if (server == "home") servram = info.maxRam - settings.homerambuffer;
	var threads = Math.floor(servram / ns.getScriptRam(settings.scripts.weak, "home"));
	if (threads > 0) {
		//if (!silent) 
		ns.tprint((" ").repeat(indentcount), server, ": Ram:", servram, ", can run ", threads, " threads");

		for (const script in settings.scripts) {
			await ns.sleep(50);
			//if (verbose) ns.tprint("checking if " + settings.scripts[script] + " is running on " + server);

			if (ns.scriptRunning(settings.scripts[script], server)) {
				if (verbose) ns.tprint("Killing running " + script + " script on " + server);
				ns.scriptKill(settings.scripts[script], server);
			}
			await ns.scp(settings.scripts[script], server, "home");
		}

		let loophack = Math.ceil(threads * 0.05);
		let loopweak = Math.floor(threads * 0.35);
		var loopgrow = threads - loophack - loopweak;

		await splitscripts(loophack, settings.scripts.hack);
		await splitscripts(loopweak, settings.scripts.weak);
		await splitscripts(loopgrow, settings.scripts.grow);

	}

	async function splitscripts(threads, script) {
		let batch = 20;
		let batchmax = 100;
		let instances = 0;
		if (threads / batch > batchmax) batch = Math.floor(threads / batchmax);
		while (threads >= batch) {
			ns.exec(script, server, batch, target, threads);
			threads = threads - batch;
			await ns.sleep(50);
			instances++;
		}

		if (threads > 0) {
			ns.exec(script, server, threads, target, threads);
			await ns.sleep(50);
			instances++
		}
		if (verbose && instances)
			ns.tprint("Installed " + instances + " instances of " +
				script + " on " + server);

	}

}

export function autocomplete(data, args) {
	return [...data.servers];
}