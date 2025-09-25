/** @param {NS} ns */
export async function main(ns) {

	//ns.tprint(ns.singularity.getCurrentWork());

	if (ns.args.length > 0) {
		ns.tprint(ns.sleeve.getTask(ns.args[0]));

		ns.exit();
	}


	var player = ns.getPlayer();
	ns.tprint(player);
	for (const thing in player) {
		ns.tprint(thing + " == " + player[thing]);
		if (typeof(player[thing]) == "object") {
			for (const element in player[thing]) {
				ns.tprint(element + " --> " + player[thing][element]);
			}
		}
	}
}