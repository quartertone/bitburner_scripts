/** @param {NS} ns **/
import { settings, getservers, getmemtimes } from "/settings.js";
//initiator for batch hacking algorithm
export async function main(ns) {
	var usage =
		"Usage: {flags}\n\
		[-h]		This help text\n\
		[target]		Target for hacking scripts\n\
		[-s server]		Single server on which to install batch scripts\n";
	/*
	[--hackable]	Show/scan only hackable servers\n\
	[-f grep]		Find files with pattern grep\n\
	[--replace]		Re-up new script to running servers\n\
	[-e exclude]	Partial name of servers to EXCLUDE\n\
	[-i include]	Partial name of servers to INCLUDE\n\
	[--info]		Get server information\n\
	[-v]		make it verbose\n\
	[-q]		make it silent\n\n";
*/

	var host = "";
	var exclude = "";
	var includeonly = "";
	var target = "";
	var hackable = "";

	// parse command line arguments
	var lines = ns.args;
	while (lines.length > 0) {
		let item = lines.shift();
		switch (item) {
			case "-s":
				// install scripts on one server only
				host = lines.shift();
				break;
			case "-e": // partial names of servers to exclude
				exclude = lines.shift();
				break;
			case "-i": // include
				includeonly = lines.shift();
				break;
			case "--hackable":
				hackable = true;
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

	if (!target) {
		ns.tprint(usage);
		ns.exit();
	}

	// FOR EACH SERVER/HOST
	//find server list; use scanhost and exec this script
	//var serverlist = ["list", "of", "servers"];

	// check to make sure we have enough ram to do all this
	// basically means only purchased servers can handle this

	var [mem, times] = getmemtimes(ns, target);

	var serverlist = [];
	if (host) {
		serverlist = [host];
	} else {
		serverlist = getservers(ns).filter((s) => {
			let info = ns.getServer(s);
			// Filter for servers that have minimum amount of ram
			if (
				(exclude && s.match(exclude)) ||
				(includeonly && !s.match(includeonly))
			) {
				return false;
			}
			return info.maxRam > mem.needed;
		});
	}

	ns.tprint("There are " + serverlist.length + " servers with enough ram");

	let copied = false;
	for (const server of serverlist) {
		copied = await ns.scp(settings.settingsfile, server, "home");
		for (const script in settings.batch) {
			copied = await ns.scp(settings.batch[script], server, "home");
			// TODO low priority - consolidate to ONE scp event (use file name array)
		}
		if (copied) {
			ns.tprint("Copied batch files to " + server);
		} else {
			ns.tprint("Failed to copy a file to " + server);
		}
		// For each server fire off a separate control script to manage the hwgw cycle
		if (server != "home") ns.killall(server);
		ns.tprint("Starting batch controller (" + settings.batch.ctrl + " on " + server + " for " + target);
		ns.exec(settings.batch.ctrl, server, 1, target);
	}
}

export function autocomplete(data, args) {
	return [...data.servers];
}
