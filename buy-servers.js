/** @param {NS} ns **/
import { loopinstall } from "settings.js";
export async function main(ns) {
	ns.disableLog("ALL");
	var deleteserver = false;
	var dryrun = false;
	var ram = ns.getPurchasedServerMaxRam();
	var helpme = false;
	var maxservers = ns.getPurchasedServerLimit();
	//var target = "";
	var opts = {
		target: "",
		appendonly: true,
		verbose: false,
		silent: false,
		getinfo: false,
		hackable: false,
		exclude: "", //search string to exclude
		includeonly: "",
		grep: "",
	}

	var usage = "Buy server with specified RAM, and install hack script\n\
    Usage: {flags} target\n\
	[-h]		This help text\n\
	[target]	Name of hack target server (required)\n\
	[-r]		Ram to purchase. Default is max: " + ram + "\n\
	[-n]		Number of servers to buy\n\
	[--delete]	Delete server and re-purchase for upgrading ram\n\
	[--dryrun]	Dry run";

	// parse command line argumentsh
	var lines = ns.args;
	while (lines.length > 0) {
		let item = lines.shift();
		ns.tprint(item);
		switch (item) {
			case "--delete":
				deleteserver = true;
				break;
			case "--dryrun":
				dryrun = true;
				break;
			case "-r":
				ram = lines.shift();
				break;
			case "-h":
				helpme = true;
				break;
			case "-n":
				maxservers = lines.shift();
				if (maxservers > ns.getPurchasedServerLimit()) maxservers = ns.getPurchasedServerLimit();
				break;
			default:
				if (ns.serverExists(item)) {
					opts.target = item;
				} else {
					opts.target = "";
				}
				break;
		}
	}

	if (ram < 32 || ram > ns.getPurchasedServerMaxRam()) {
		helpme = true; //opts.target = "";
	}

	if (helpme) {
		ns.tprint(usage);
		ns.exit();
	}


	//ns.tprint("targeting = " + opts.target);
	//if (opts.target) {
	var i = 0;
	while (i < maxservers) {
		var servername = "pserv-" + i;
		await ns.sleep(200);

		if (ns.serverExists(servername)) {
			i++;
			// yes server exists
			//ns.tprint("Server exists ", servername);
			if (ns.getServerMaxRam(servername) >= ram) {
				// server has enough ram; skip it
				ns.tprint(servername, " server exists and already has enough ram");
				continue;
			} else if (deleteserver) {
				//ns.tprint("deleting server");
				if (ns.getServerMoneyAvailable("home")
					> ns.getPurchasedServerCost(ram)) {
					// yes we have the money
					ns.tprint("---we have the money---");
					// server exists , delete it and proceed
					if (!dryrun) {
						ns.tprint("deleting server ", servername);
						ns.killall(servername);
						ns.deleteServer(servername);
					}
				} else {
					//ns.tprint("not enough money"); //wait here;
					i--; //reverse the increment to wait until more money
					await ns.sleep(500);
					continue;
					// not enough money
				}
			} else {
				ns.tprint(servername, " server exists; skipping");
				continue;
			}
			//servername = "pserv-" + ++i;
		} //skipping server that exists ; no deleting

		if (ns.getServerMoneyAvailable("home")
			> ns.getPurchasedServerCost(ram)) {
			// increment if we didn't do it above
			if (!ns.serverExists) i++;
			// yes we have the money
			//ns.tprint("---we have the money---");
			ns.tprint("Buying ", servername, " with ram ", ram);
			if (!dryrun) {
				ns.purchaseServer(servername, ram);
				ns.toast("Bought " + servername + " with ram " + ram);
				//await installhack(servername, opts.target);
				if (opts.target) await loopinstall(ns, servername, opts);
			}
		}
	}
	ns.tprint("--Server purchase completed--");
	//} 

	/*
		async function installhack(server, target, indentcount = 1) {
			//let installscript = "installhack.js";
			let freeram = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
			let scriptram = ns.getScriptRam(settings.loopinstall, "home");
			while (ns.scriptRunning(settings.loopinstall, "home") && freeram < scriptram) {
				//hang on a minute if we're temp out of ram
				await ns.sleep(500);
			}
			try {
				let args = ["-s", server, target];
				if (!appendonly) args.push("--replace");
				if (verbose) args.push("-v");
				if (silent) args.push("-q");
				//ns.tprint(args);
				ns.exec(settings.loopinstall, "home", 1, ...args);
				//ns.tprint("installhack " + server);
				await ns.sleep(100);
			} catch (e) { ns.tprint("Installhack error: " + e); }
		}
	*/

}