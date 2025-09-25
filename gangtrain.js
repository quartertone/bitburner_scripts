/** @param {NS} ns **/

export async function main(ns) {


	while (true) {
		for (const name of ns.gang.getMemberNames()) {
			let member = ns.gang.getMemberInformation(name);
			let ascent = ns.gang.getAscensionResult(name);

			if (!member.task.match(/^Train/)) continue;

			//determine lowest ascent total
			let prevascent = null;
			let ascentdelta = 0;
			let mintask = ns.gang.getGangInformation().isHacking ? "Train Charisma" : "Train Combat";
			for (const stat in ascent) {
				if (stat == "respect") continue;
				if (!ns.gang.getGangInformation().isHacking && stat == "hack") continue; //don't bother training hack if not a hacking gang

				if (ns.gang.getGangInformation().isHacking && stat.match(/(str|def|dex|agi)/)) continue; //skip combat training if Hacking gang

				// check ascent final result
				let ascmult = member[stat + "_asc_mult"] * ascent[stat];
				if (prevascent == null || ascmult < prevascent) {
					prevascent = ascmult; // keep track of minimum ascent total
					ascentdelta = ascent[stat];
					// remember this task
					switch (stat) {
						case "hack":
							mintask = "Train Hacking";
							break;
						case "str":
						case "def":
						case "dex":
						case "agi":
							mintask = "Train Combat";
							break;
						case "cha":
							mintask = "Train Charisma";
							break;
						default:
							break;
					}
				}
			}

			if (ascentdelta > 2) {
				let output = "Ascendeng " + name;
				for (const stat in ascent) {
					if (stat == "respect") continue;
					if (!ns.gang.getGangInformation().isHacking && stat == "hack") continue;
					output += stat + " (" + member[stat + "_asc_mult"].toFixed(4) + ") " + (ascent[stat]).toFixed(4) + " = " + member[stat + "_asc_mult"] * ascent[stat] + " \n";
				}
				//ns.gang.setMemberTask(name, "Unassigned");
				ns.gang.ascendMember(name);
				ns.tprint(output);
			} else if (member.task != mintask) {
				ns.gang.setMemberTask(name, mintask);
				ns.tprint(name + " task set to " + mintask + "; " + ascentdelta);
			}
		}
		await ns.sleep(500);
	}
}