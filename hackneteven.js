/** @param {NS} ns */
export async function main(ns) {

	//check first node
	while (true) {
		var basenode = ns.hacknet.getNodeStats(0);
		//cache, cores, level, ram


		/*ns.tprint(
			"level " + basenode.level + ", " +
			"ram " + basenode.ram +
			" = " + Math.log(basenode.ram) / Math.log(2) +
			" = " + 2 ** (Math.log(basenode.ram) / Math.log(2)) + ", " +
			"cores " + basenode.cores + ", " +
			"cache " + basenode.cache + ", "

		);*/

		for (let i = 1; i < ns.hacknet.numNodes(); i++) {
			let thisnode = ns.hacknet.getNodeStats(i);
			// getCacheUpgradeCost(i, diff)
			// getCoreUpgradeCost(i, diff)
			// getLevelUpgradeCost
			// getRamUpgradeCost
			if (thisnode.level < basenode.level &&
				ns.getPlayer().money >
				ns.hacknet.getLevelUpgradeCost(i, basenode.level - thisnode.level)) ns.hacknet.upgradeLevel(i, basenode.level - thisnode.level);

			let ramdiff = (Math.log(basenode.ram) / Math.log(2)) - (Math.log(thisnode.ram) / Math.log(2));
			if (thisnode.ram < basenode.ram &&
				ns.getPlayer().money > ns.hacknet.getRamUpgradeCost(i, ramdiff)) ns.hacknet.upgradeRam(i, ramdiff);

			if (thisnode.cores < basenode.cores &&
				ns.getPlayer().money > ns.hacknet.getCoreUpgradeCost(i, basenode.cores - thisnode.cores)) {
				ns.hacknet.upgradeCore(i, basenode.cores - thisnode.cores);
			}


			if (thisnode.cache < basenode.cache &&
				ns.getPlayer().money > ns.hacknet.getCacheUpgradeCost(i, basenode.cache - thisnode.cache)) ns.hacknet.upgradeCache(i, basenode.cache - thisnode.cache);

		}

		await ns.sleep(5000);
	}

}