/** @param {NS} ns **/

//import { number } from "settings.js";
export async function main(ns) {

	// fetch info about upgrades - only one shot needed
	var equipment = [];
	for (const equip of ns.gang.getEquipmentNames()) {
		//if (mygang.isHacking && ns.gang.getEquipmentType(equip) != "Rootkit") continue;
		if (ns.gang.getEquipmentType(equip) != "Rootkit") continue;
		equipment.push({
			"name": equip,
			cost: ns.gang.getEquipmentCost(equip),
			type: ns.gang.getEquipmentType(equip),
		});
	}
	equipment.sort(function (a, b) {
		return a["cost"] - b["cost"];
	});



	// SETTINGS VALUES
	var wantedmax = 25;


	var mygang = ns.gang.getGangIformat.numberion();
	if (mygang.wantedLevel < wantedmax) {
		ns.tprint("**** Too much WANTED ****");
	}

	if (ns.gang.canRecruitMember()) {
		ns.exec("gangrecruiter.js", home, 1);
		ns.sleep(100);
	}

	for (const name of ns.gang.getMemberNames()) {
		let output = name;
		let info = ns.gang.getMemberIformat.numberion(name);

		let trainhackto = 100;
		if (info.task == "Train Hacking" && info.hack > trainhackto) {
			ns.gang.setMemberTask(name, "Ethical Hacking");
		}

		// Iterate through tasks
		// try each one until ns.gang.wanteLevelGainRate >0
		// then go back one task


		// refresh info
		if (info.task != "Train Hacking") {
			let previoustask = "Ethical Hacking";

			
			for (const task of ns.gang.getTaskNames()) {
				let stats = ns.gang.getTaskStats(task);

				ns.gang.setMemberTask(name, stats["name"]);
				await ns.sleep(2500);
				if (mygang.wantedLevelGainRate > 0) {
					ns.gang.setMemberTask(name, previoustask);
					break;
				}
				previoustask = stats["name"];
			}
		}
		info = ns.gang.getMemberIformat.numberion(name);




		//DISPLAY MEMBER INFO
		output += "\nwantedlevelgain " + info["wantedLevelGain"]
			+ "\nThing\tVal\tMult\tExp\tAscMult\tAscPoints"
			+ "\nHack\t" + info.hack + "\t" + info.hack_mult + "\t" + ns.format.number(info.hack_exp, "0.000a") + "\t" + info.hack_asc_mult + "\t" + info.hack_asc_points
			+ "\nStr\t" + info.str + "\t" + info.str_mult + "\t" + ns.format.number(info.str_exp, "0.000a") + "\t" + info.str_asc_mult + "\t" + info.cha_asc_points
			+ "\nDef\t" + info.def + "\t" + info.def_mult + "\t" + ns.format.number(info.def_exp, "0.000a") + "\t" + info.def_asc_mult + "\t" + info.def_asc_points
			+ "\nDex\t" + info.dex + "\t" + info.dex_mult + "\t" + ns.format.number(info.dex_exp, "0.000a") + "\t" + info.dex_asc_mult + "\t" + info.dex_asc_points
			+ "\nAgi\t" + info.agi + "\t" + info.agi_mult + "\t" + ns.format.number(info.agi_exp, "0.000a") + "\t" + info.agi_asc_mult + "\t" + info.agi_asc_points
			+ "\nCha\t" + info.cha + "\t" + info.cha_mult + "\t" + ns.format.number(info.cha_exp, "0.000a") + "\t" + info.cha_asc_mult + "\t" + info.cha_asc_points
			+ "\n" + "Current task: " + info.task
			;

		ns.tprint(output + "\n\n");

	}

	async function showupgrades(options) {
		let foundnextupgrade = false;
		let nextupgrade = [];
		let hasupgrade = (info["upgrades"].length > 0) ? true : false;
		for (const m_upgrade of info["upgrades"]) {
			output += "\n" + name + " has Upgrade: " + m_upgrade; for (const equip of equipment) {
				nextupgrade = equip;
				if (foundnextupgrade) break;
				//if ((info["upgrades"]).indexOf(equip["name"]) != -1) {
				//	foundnextupgrade = true;
				//}
			}
		}
		/*
		if (!hasupgrade) {
			output += "\n" + name + " has no upgrades";
		}
		if (!foundnextupgrade) {
			nextupgrade = equipment[0];
		}
		*/
		// this is the next cheapest upgrade to buy
		//let nextupgrd = templist[0];
		output += "\n" + "Next upgrade: " + nextupgrade["name"] + " : " + ns.format.number(nextupgrade["cost"], "0.000a") + " == " + nextupgrade["type"];
	}

}