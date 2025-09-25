/** @param {NS} ns **/

export async function main(ns) {

	while (true) {

		if (ns.getPlayer().money > 26 * 10 ^ 9 && ns.stock.purchase4SMarketData() && ns.stock.purchase4SMarketDataTixApi()) {
			ns.spawn("buy-betterstocks.js", 1);
		} else {
			//ns.toast("Error: coulden't buy TIX things");

			//if (ns.getPlayer().money > 26 * 10 ^ 9) break;
			await ns.sleep(10000);
		}
	}

}