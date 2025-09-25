/** @param {NS} ns **/

export async function main(ns) {

	//	while (true) {
	for (const name of ns.gang.getMemberNames()) {
		let member = ns.gang.getMemberInformation(name);
		let ascent = ns.gang.getAscensionResult(name);

		
		let output = name + ": " + member.task + "\n";
		for (const stat in ascent) {
			if (stat == "respect") continue;
			output += stat + " (" + member[stat + "_asc_mult"].toFixed(4) + ") " + (ascent[stat]).toFixed(4) + " = " + member[stat + "_asc_mult"] * ascent[stat] + " \n";
		}
		ns.tprint(output + "\n\n");

	}

}


