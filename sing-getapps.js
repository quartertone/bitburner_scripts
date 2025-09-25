/** @param {NS} ns **/
import { settings } from "/settings.js";

export async function main(ns) {

	var factions = [
		"avmnite-02h",
		"run4theh111z",
		"I.I.I.I",
		"CSEC",
	];

	function remove(host,current) {
		return host != current;
	}

	var appcount = 0;

	
	while (ns.getPlayer().money < 400000) {
		await ns.sleep(5000);
	}
	ns.singularity.purchaseTor();

	let apps = ns.singularity.getDarkwebPrograms();
	appcount = 0;
	for (const app of apps) {

		while (ns.getPlayer().money <  ns.singularity.getDarkwebProgramCost(app)) {
			await ns.sleep(5000);
		}
		if (ns.singularity.purchaseProgram(app)) {
			appcount++;
			ns.tprint(appcount + " " + app + " " + ns.singularity.getDarkwebProgramCost(app));
			ns.exec(settings.scanhosts, "home", 1); // "n00dles",
		}
/*
		for (const fac of factions) {
			if (appcount >= ns.getServerNumPortsRequired(fac)) {
			ns.tprint("bacdor " + fac);
				await ns.singularity.installBackdoor(fac);
				factions = factions.filter(remove);
			}
		}
*/
		if (appcount == 5) break;



	}

	ns.exec(settings.scanhosts, "home", 1);

}
