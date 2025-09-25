/** @param {NS} ns */
export async function main(ns) {

	while (true) {
		
		if (ns.hacknet.numHashes() > ns.hacknet.hashCost("Sell for Corporation Funds")) {
			ns.hacknet.spendHashes("Sell for Corporation Funds");
		}
		await ns.sleep(50);
	}
}
