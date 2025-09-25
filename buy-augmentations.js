/** @param {NS} ns **/
export async function main(ns) {

	let self = ns.getPlayer()

	var allaugs = [];
	for (let faction of self.factions) {
		allaugs.push(ns.getAugmentationsFromFaction(faction));
	}

	for (let aug of allaugs) {
		let [rep,cost] = ns.getAugmentationCost(aug);


	}


}
