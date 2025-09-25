/** @param {NS} ns **/

export async function main(ns) {

	while (true) {

		if (ns.singularity.getOwnedAugmentations(true).includes("The Red Pill")) {
			ns.tprint("Red Pill already owned");
			ns.rm("runfile-buy-betterstocks.js.txt", "home");
			break;
		} else {

			let rep = ns.singularity.getFactionRep("Daedalus");
			//let redcost = ns.singularity.getAugmentationPrice("Red Pill");
			let redrep = ns.singularity.getAugmentationRepReq("The Red Pill");
			ns.tprint(rep + " " + redrep);
			if (rep > redrep) {
				if (ns.singularity.purchaseAugmentation("Daedalus", "The Red Pill")) {
					ns.alert("Red Pill obtained");
					ns.rm("runfile-buy-betterstocks.js.txt", "home");
					// wait for stocks to be all sold
					// continued in next while-true
					break;
				}
			} else if (!ns.singularity.getCurrentwork()) {
				ns.singularity.workForFaction("Daedalus", "Field Work", true);
			}
		}
		await ns.sleep(10000);
	}

	ns.tprint("Red Pill Obtained; Deleted stock buying runfile");

	while (true) {
		let shares = 0;
		for (const sym of ns.stock.getSymbols()) {
			let posit = ns.stock.getPosition(sym);
			shares = posit[0] + posit[2];
			if (shares > 0) {
				break;
				// break out of for loop
				// no need to look for more shares
			}
		}
		if (shares == 0) {
			//all shares sold
			// install augs and restart with script
			ns.alert("All stocks sold");
			break;
		}
		await ns.sleep(3000);
	}


	// MAX OUT SERVERS
	// mAX OUT HOME RAM & CORES
	// Buy all sleeve augs
	// 
	// spend money on Level upgrades
	ns.singularity.installAugmentations("singularity.js");

	// done

}
