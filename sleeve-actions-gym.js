/** @param {NS} ns */
export async function main(ns) {
	let [gym, workout] = (ns.args[1]).split(":");
	ns.sleeve.setToGymWorkout(ns.args[0], gym, workout);
}