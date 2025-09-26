/** @param {NS} ns */
export async function main(ns) {
	let [univ, course] = (ns.args[1]).split(":");
	//ns.tprint(ns.args);
	//ns.tprint("trynig class - " + ns.args[0] +"; "+ univ +";  "+ course);
	ns.sleeve.setToUniversityCourse(ns.args[0], univ, course);
}