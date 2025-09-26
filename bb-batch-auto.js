/** @param {NS} ns **/
//BladeBurner?
export async function main(ns) {

	while (true) {
		let action = ns.bladeburner.getCurrentAction(); // {type,name}
		let chance = ns.bladeburner.getActionEstimatedSuccessChance(action.typee, action.name);

		action.time = ns.sleep(ns.bladeburner.getActionTime(action.type, action.name));
		if (chance[0]<0.5 || chance[1]<1) {
			ns.bladeburner.stopBladeburnerAction();
		}
		await ns.sleep(action.time > 5000 ? action.time : 5000);
	}
}
