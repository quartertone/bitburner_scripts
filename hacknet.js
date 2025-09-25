/** @param {NS} ns */
export async function main(ns) {


	//	ns.tprint(ns.hacknet.maxNumNodes());

	while (ns.hacknet.numNodes() > 0) {

		if (ns.getPlayer().money < 150 * (10 ** 9)|| ns.hacknet.numHashes() > 1000) {
			while (ns.hacknet.numHashes() > 4) {
				ns.hacknet.spendHashes("Sell for Money");
				await ns.sleep(50);
			}
		}
/*

		if (ns.args[0] == "upgrade") {

			let prices = [];
			for (let n = 0; n < ns.hacknet.numNodes(); n++) {
				//let hacknode = "hacknet-node-" + n;

				prices.push({ upgr: n + "_cache", cost: ns.hacknet.getCacheUpgradeCost(n, 1) });
				prices.push({ upgr: n + "_core", cost: ns.hacknet.getCoreUpgradeCost(n, 1) });
				prices.push({ upgr: n + "_level", cost: ns.hacknet.getLevelUpgradeCost(n, 1) });
				prices.push({ upgr: n + "_ram", cost: ns.hacknet.getRamUpgradeCost(n, 1) });
			}

			prices.sort(function (a, b) {
				return a.cost - b.cost;
			});

			while (prices.length > 0 && ns.getPlayer().money > prices[0].cost * ns.hacknet.numNodes() * 5) {
				let price = prices.shift()
				let [num, component] = price.upgr.split("_");
				//let hn = "hacknet-node-" + num;
				console.log(component, num);
				let buying = true;
				switch (component) {
					case "level":
						ns.hacknet.upgradeLevel(num, 1);
						prices.push({ upgr: num + "_level", cost: ns.hacknet.getLevelUpgradeCost(num, 1) });
						break;
					case "cache":
						ns.hacknet.upgradeCache(num, 1);
						prices.push({ upgr: num + "_cache", cost: ns.hacknet.getCacheUpgradeCost(num, 1) });
						break;
					case "core":
						ns.hacknet.upgradeCore(num, 1);
						prices.push({ upgr: num + "_core", cost: ns.hacknet.getCoreUpgradeCost(num, 1) });
						break;
					case "ram":
						ns.hacknet.upgradeRam(num, 1);
						prices.push({ upgr: num + "_ram", cost: ns.hacknet.getRamUpgradeCost(num, 1) });
						break;
					default: buying = false;
				}
				if (buying) ns.toast("Bought " + component + "(HN " + num + ")");

				prices.sort(function (a, b) {
					return a.cost - b.cost;
				});

				await ns.sleep(50);
			}

		}
		*/

		await ns.sleep(10);
	}

}