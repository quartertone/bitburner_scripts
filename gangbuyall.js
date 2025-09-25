/** @param {NS} ns **/

export async function main(ns) {

	var lines = ns.args;
	var buyit = false;
	var showhave = false;
	var getall = false;
	while (lines.length > 0) {
		let item = lines.shift();
		switch (item) {
			case "--go":
				buyit = true;
				break;
			case "--have":
				showhave = true;
				break;
			case "--all":
				getall = true;
				break;
			case "--help":
			default:
				ns.tprint("Params:\n\
	--go \t\t Activate the thing\n\
	");
				ns.exit();
				break;
		}
	}

	function upgrayedd(go = false) {
		let fulltotal = 0;
		for (const name of ns.gang.getMemberNames()) {
			let member = ns.gang.getMemberInformation(name);
			let output = name + ": " + member.task + "\n";

			if (showhave && !go) {
				for (const upgrade of member.upgrades) {
					output += "Owned: "+ upgrade + "\n";
				}
				for (const aug of member.augmentations) {
					output += "Owned: "+ aug + "\n";
				}
			}

			let total = 0;
			for (const equip of ns.gang.getEquipmentNames()) {
				if (!getall 
					&& !ns.gang.getGangInformation().isHacking
					&& ns.gang.getEquipmentType(equip) == "Rootkit") {
						ns.tprint("Skip Rootkit");
						continue;
					}

				if (!member.upgrades.includes(equip) 
				&& !member.augmentations.includes(equip)) {
					total += ns.gang.getEquipmentCost(equip);
					if (go) {
						ns.tprint(name + " purchased " + equip);
						ns.gang.purchaseEquipment(name, equip);
					} else {
						output += equip + ": \t"
							+ ns.gang.getEquipmentType(equip) + ":"
							+ ns.format.number(ns.gang.getEquipmentCost(equip), "0.0a")
							+ "\n";
					}
				}
			}
			if (!go) {
				output += "Member Total: " + ns.format.number(total, "0.0a");
				ns.tprint(output + "\n\n");
			}
			fulltotal += total;
		}
		if (!go) ns.tprint("Full total: " + ns.format.number(fulltotal, "0.0a"));
		return fulltotal;
	}

	if (ns.getPlayer().money > upgrayedd(false) && buyit) {
		ns.tprint("Buying equipment");
		upgrayedd(buyit);
	} else if (ns.getPlayer().money < upgrayedd(false)) {
		ns.tprint("Not enough moneys");
	}

}
