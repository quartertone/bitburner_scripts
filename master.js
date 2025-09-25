/** @param {NS} ns **/
import { settings } from "/settings.js";

export async function main(ns) {

	//ns.exec("scanhosts.js", "home", 1); await ns.sleep(100);
	//ns.exec("sing-getapps.js", "home", 1); await ns.sleep(100);
	//ns.exec("buy-stockaccess.js", "home", 1); await ns.sleep(100);


	ns.exec("buy-betterstocks.js", "home", 1); await ns.sleep(100);

	ns.exec("graft.js", "home", 1); await ns.sleep(100);

	ns.exec("batch-install.js", "home", 1, "-s","home","joesguns");
	await ns.sleep(100);

	ns.exec("sleeve-tasks.js", "home", 1);
	await ns.sleep(100);

	ns.exec("corpcontrol.js", "home", 1);
	await ns.sleep(100);


}
