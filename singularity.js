/** @param {NS} ns **/
import { settings } from "/settings.js";

export async function main(ns) {


	ns.exec(settings.scanhosts, "home", 1);
	await ns.sleep(100);

	ns.exec("sing-getapps.js", "home", 1);
	await ns.sleep(100);

	ns.exec("buy-stockaccess.js", "home", 1);
	await ns.sleep(100);

	//ns.exec("hacknetcorp.js", "home", 1);
	await ns.sleep(100);

	ns.exec("sleeve-task.js", "home", 1);
	await ns.sleep(100);

	ns.exec("gangsame.js", "home", 1);
	await ns.sleep(100);

	ns.exec("batch-install.js", "home", 1, "-s", "home", "n00dles");
	await ns.sleep(100);
	
	/*
	while (true) {

		if (ns.getServerMaxRam("home") > 2 ** 5) {
			ns.exec(settings.scanhosts, "home", 1);
			await ns.sleep(100);

			ns.exec(settings.batch.ctrl, "home", 1, "n00dles");
			await ns.sleep(100);

			ns.exec("sleeve-maxaugs.js", "home", 1);
			await ns.sleep(100);
			break;
		}
		await ns.sleep(10000);
	}
	*/
}