/** @param {NS} ns **/

// PURCHASE ALL AUGMENTATIONS for SLEEVES
export async function main(ns) {
	//while (true) {
		let doing = 0;
		for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
			let stat = ns.sleeve.getSleeve(i);

			let auglist = "";
			if (stat.shock > 0) {
				// check shock level
				// if shock, set to shock recovery
				ns.sleeve.setToShockRecovery(i);
				doing ++;
			} else {
				// not shocked;

				let augs = ns.sleeve.getSleevePurchasableAugs(i);
				if (augs.length > 0) {
					doing ++;
					auglist = "Augs: ";
					for (const aug of augs) {
						auglist += aug.name + ", ";
						if (aug.cost * 5 < ns.getPlayer().money) {
							//ns.tprint( "cost*5:"+aug.cost * 5 + " Mymoney:" + ns.getPlayer().money);
							if (ns.sleeve.purchaseSleeveAug(i, aug.name)) {
								ns.toast("Sleeve-" + i + ":" + aug.name + " bought");
							}
						}

						await ns.sleep(100);
					}

				}

				if (stat.sync < 90) {
					ns.sleeve.setToSynchronize(i);
				} else {
					// FIND OTHER TASK TO DO
				}
				let task = ns.sleeve.getTask(i)["task"];
				// ns.tprint("Sleeve:" + i + " - " + task + "\n"	+ auglist);

			}
		}

		//await ns.sleep(doing >0? 100:5000);
	//}
	ns.tprint("Bought affordable sleeve augs");
}
