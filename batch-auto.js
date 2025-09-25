/** @param {NS} ns **/
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
// ns.bladeburner.getActionCountRemaining:
// Previously returned -1 when called with type "Idle" and name "". This is no longer valid usage and will result in an error.
// 
// ns.bladeburner.getActionEstimatedSuccessChance:
// Previously returned [-1, -1] when called with type "Idle" and name "". This is no longer valid usage and will result in an error.
// 
// ns.bladeburner.getActionTime:
// Previously returned -1 when called with type "Idle" and name "". This is no longer valid usage and will result in an error.
// 
// See the related changes for ns.bladeburner.getCurrentAction, which were shown earlier in these API break details.
// In most cases, the fixes for ns.bladeburner.getCurrentAction will fix this group of issues as well.
// 
// Usage of the following functions may have been affected:
// ns.bladeburner.getActionCountRemaining
// ns.bladeburner.getActionEstimatedSuccessChance
// ns.bladeburner.getActionTime
// 
// Potentially affected files on server home (with line numbers):
// blade-auto.js: (Line numbers: 6, 8)