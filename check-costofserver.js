/** @param {NS} ns **/

export async function main(ns) {
	ns.tprint("Max ram = ", ns.getPurchasedServerMaxRam());

	if (!ns.args[0]) {
		ns.tprint("Usage: {exponent}\n\
		Provide exponent (2**__) to calculate cost of server with that much memory");
		ns.tprint("Max ram = ", ns.getPurchasedServerMaxRam());
		ns.exit();
	}
	ns.tprint("cost of server with 2^" + ns.args[0]
		+ " (" + 2 ** ns.args[0] + ") ram : "
		+ ns.format.number(ns.getPurchasedServerCost(2 ** ns.args[0]), "0.000a"));
}