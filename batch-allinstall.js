/** @param {NS} ns **/
import { settings, getservers, getmemtimes } from "/settings.js";
//initiator for batch hacking algorithm
export async function main(ns) {
	var usage =
		"Usage: {flags}\n\
		[-h]		This help text\n\
		[target]		Target for hacking scripts\n\
		[-s server]		Single server on which to install batch scripts\n";

	// NEED TO buy-servers FIRST
	// TODO - modify so that /home server is used as controller site

	var exclude = "";
	var includeonly = "";

	// parse command line arguments
	var lines = ns.args;
	while (lines.length > 0) {
		let item = lines.shift();
		switch (item) {
			case "-e": // partial names of servers to exclude
				exclude = lines.shift();
				break;
			case "-i": // include
				includeonly = lines.shift();
				break;
			case "-h":
			default:
				if (item.match(/^-/)) {
					// bad argument
					//target = ""; // this forces script to fail
				} else {
					// un-tacked argument defaults to target name
					//target = ns.serverExists(item) ? item : "";
				}
				ns.tprint(usage);
				ns.exit();
				break;
		}
	}


	// FOR EACH SERVER/HOST
	//find server list; use scanhost and exec this script
	//var serverlist = ["list", "of", "servers"];

	// check to make sure we have enough ram to do all this
	// basically means only purchased servers can handle this

	//var [mem, times] = getmemtimes(ns, target);

	var targetlist = [];

	targetlist = getservers(ns).filter((s) => {
		if (!s.match("pserv")
			&& ns.getServerMaxMoney(s) > 0
			&& ns.getServerRequiredHackingLevel(s) < ns.getHackingLevel()
		) {
			return true;
		}
	}).sort(function (a, b) {
		return ns.getServerRequiredHackingLevel(a) - ns.getServerRequiredHackingLevel(b);
		//return ns.getHackTime(a) - ns.getHackTime(b); //ascending hacktime
	});



	//ns.tprint("There are " + serverlist.length + " servers with enough ram");

	let copied = false;
	//for (const server of serverlist) {
	for (let i = 0; i < 25; i++) {
		let target = targetlist.shift();
		let server = "pserv-" + i;

		if (!ns.serverExists(server)) continue;

		// exclude filter
		if (exclude && server.match(exclude)) continue;
		// include-only filter
		if (includeonly && !server.match(includeonly)) continue;

		copied = await ns.scp(settings.settingsfile, server, "home");
		for (const script in settings.batch) {
			copied = await ns.scp(settings.batch[script], server, "home");
			// TODO low priority - consolidate to ONE scp event (use file name array)
		}
		if (copied) {
			//ns.tprint("Copied batch files to " + server);
		} else {
			ns.tprint("Failed to copy files to " + server);
			continue;
		}
		// For each server fire off a separate control script to manage the hwgw cycle
		ns.killall(server);
		if (ns.exec(settings.batch.ctrl, server, 1, target)) {
			ns.tprint(server + " batch hacking " + target);
		}
		if (targetlist.length == 0) break;
		await ns.sleep(100);
	}
}

