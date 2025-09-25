/** @param {NS} ns **/
export async function main(ns) {

	var output = "\nTaskname\tMoney\tWant\tResp\tDiff\tHack\tStr\tDef\tDex\tAgi\tCha";
	for (const task of ns.gang.getTaskNames()) {
		let stats = ns.gang.getTaskStats(task);


		output += "\n" + stats["name"].slice(0, 10);
		// + "\t" + "Hacking/Combat: " +
		//stats["isHacking"] + "/" + stats["isCombat"]


		output += "\t" + (stats.baseMoney ? "$" + stats.baseMoney : " ");
		output += "\t" + (stats.baseWanted ? stats.baseWanted : " ");
		output += "\t" + (stats.baseRespect ? stats.baseRespect : " ");
		output += "\t" + (stats.difficulty ? stats.difficulty : " ");
		output += "\t" + (stats.hackweight ? stats.hackWeight : " ");
		output += "\t" + (stats.strWeight ? stats.strWeight : " ");
		output += "\t" + (stats.defWeight ? stats.defWeight : " ");
		output += "\t" + (stats.dexWeight ? stats.dexWeight : " ");
		output += "\t" + (stats.agiWeight ? stats.agiWeight : " ");
		output += "\t" + (stats.chaWeight ? stats.chaWeight : " ");
		
	}
	ns.tprint(output + "\n\n");


}

// https://kosgames.com/bitburner-combat-gang-management-script-fully-automatic-14545/