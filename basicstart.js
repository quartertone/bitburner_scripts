/** @param {NS} ns **/
// VERY FIRST script to run; root first degree servers
import { rootprep } from "settings.js";
export async function main(ns) {
	let servers = ns.scan(ns.args[0]);
	for (const serv of servers) {
		//ns.tprint("server", serv);
		if (rootprep(ns, serv)) {
			ns.tprint("rooted " + serv);
		}
	}


	// function rootprep(server, verbose = false) {
	// 	let nstools = [
	// 		ns.brutessh,
	// 		ns.ftpcrack,
	// 		ns.relaysmtp,
	// 		ns.httpworm,
	// 		ns.sqlinject,
	// 		ns.nuke
	// 	];
	
	// 	for (const tool of nstools) {
	// 		try {
	// 			tool(server);
	// 		} catch (e) {
	// 			if (verbose)
	// 				ns.tprint("Errrr:", e);
	// 		}
	// 	}
	// }

	
}