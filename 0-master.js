/** @param {NS} ns **/
// run this after augment install?
import { settings } from "settings.js";

export async function main(ns) {

	//ns.exec(settings.primary.scanhosts, "home", 1); await ns.sleep(100);
	//ns.exec(settings.primary.sing_getapps, "home", 1); await ns.sleep(100);
	//ns.exec(settings.primary.buy_stockaccess, "home", 1); await ns.sleep(100);


	ns.exec(settings.primary.buy_betterstocks, "home", 1); await ns.sleep(100);

	ns.exec(settings.primary.graft, "home", 1); await ns.sleep(100);

	ns.exec(settings.primary.batch_install, "home", 1, "-s","home","joesguns");
	await ns.sleep(100);

	ns.exec(settings.primary.sleeve_tasks, "home", 1);
	await ns.sleep(100);

	ns.exec(settings.primary.corpcontrol, "home", 1);
	await ns.sleep(100);


}
