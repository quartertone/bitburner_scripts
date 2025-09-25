/** @param {NS} ns **/

import { FactionNames, AugNames, Augmentations } from "graft-augs.js";
import { parsetime, gettime } from "settings.js";

export async function main(ns) {

	// Prepare Augmentations so that full name is used as hash key
	var augs = {};
	for (const aug in Augmentations) {
		augs[Augmentations[aug].name] = Augmentations[aug];
		//ns.tprint(aug + " = " + Augmentations[aug].name);
	}

	var all = false;

	var sortby = "time";
	var lines = ns.args;
	var listonly = false;
	var straight = false;
	var highpriority = true;
	var argfirst = "";

	//var total = 0; // var for total cost

	function prepgrafting(sortby = "time", straight = false, all = false) {
		let graftable = [];
		// go to New Tokyo if not already there
		if (ns.getPlayer().location != "New Tokyo") ns.singularity.travelToCity("New Tokyo");

		// collect graftable augmentations
		//let graftcollection = all ? augs : ns.grafting.getGraftableAugmentations();
		for (const graft of all ? augs : ns.grafting.getGraftableAugmentations()) {
			//ns.tprint(graft);
			graftable.push({
				name: graft,
				price: ns.grafting.getAugmentationGraftPrice(graft),
				time: ns.grafting.getAugmentationGraftTime(graft),
				factions: augs[graft].factions,
				//attach to graft object the first faction listed in array
				fac: augs[graft].factions[0],
			});
			//total += ns.grafting.getAugmentationGraftPrice(graft);
		}
		// sort graftable augmentations
		graftable.sort(function (a, b) {
			return a[sortby] - b[sortby];
		});


		if (straight) {
			//for (const graft of graftable) {
			//	graft.fac = graft.factions[0];
			//}
			//ns.tprint(":Straight");
			return graftable; // straight sorted, no faction or augs prioritizing
		} else {
			//ns.tprint(":regular");
			var firstfacs = [
				FactionNames.CyberSec,
				FactionNames.NiteSec,
				//FactionNames.Netburners,
				FactionNames.TheBlackHand,
				FactionNames.BitRunners,
			];

			var firstaugs = [
				//AugNames.CongruityImplant, //"nickofolas Congruity Implant", //removes entropy virus
				//AugNames.NeuroreceptorManager, //"Neuroreceptor Management Implant", //no unfocused penalty
				AugNames.nextSENS, //"nextSENS Gene Modification", // Gene Modification", //+20% all skills
				AugNames.Neurotrainer1, //"Neurotrainer  I", // 10%
				AugNames.Neurotrainer2, //"Neurotrainer II", // 15%
				AugNames.Neurotrainer3, //"Neurotrainer III", // 20% exp all skills
				AugNames.PowerRecirculator, //"Power Recirculation Core", //all skills +5%, exp +10%
				AugNames.Xanipher, //"Xanipher", //+20% all skills, +15% exp
				AugNames.HiveMind, //"ECorp HVMind Implant", //something good
				AugNames.PCMatrix, //"PCMatrix", // 7.77% crime, work, charisma, reputation 
				AugNames.QLink, //"QLink", //awesome hacking benefits
				AugNames.NuoptimalInjectorImplant, //"Nuoptimal Nootropic Injector Implant", //
			];


			if (argfirst) {
				ns.tprint("args");
				if (FactionNames[argfirst] != undefined) {
					//ns.tprint(":Adding Faction " + FactionNames[argfirst]);
					firstfacs.unshift(FactionNames[argfirst]);
					//firstfacs = [FactionNames[argfirst]];
					//firstaugs = [];
				} else {
					ns.tprint("Bad faction name");
					for (const fac in FactionNames) {
						ns.tprint(fac + "\t->\t" + FactionNames[fac]);
					}
					ns.exit();

				}
			}

			var firstgrafts = [];
			var latergrafts = [];

			// push the absolute first grafts
			if (highpriority) {
				//ns.tprint(":highpriority first");
				for (const first of [
					AugNames.CongruityImplant,
					AugNames.NeuroreceptorManager,
				]) {
					let tempgraft = graftable.find(g => g.name == first);
					if (tempgraft && !firstgrafts.includes(tempgraft)) firstgrafts.push(tempgraft);
				}
			}

			// find in graftable that matches firstfacs and firstaugs
			for (const graft of graftable) {
				//ns.tprint(":assessing " + graft.name);
				// graftabe is already sorted by time
				graft.fac = (firstfacs.filter(value => graft.factions.includes(value)))[0];
				if (highpriority && firstaugs.includes(graft.name) ||
					graft.fac !== undefined) {
					// if graft is in the first grafts, or part of starting factions, do them first
					if (graft.fac == undefined) graft.fac = graft.factions[0];
					if (!firstgrafts.includes(graft)) firstgrafts.push(graft);
				} else {
					graft.fac = graft.factions[0];
					// collect other grafts in temp array
					if (!latergrafts.includes(graft) && !firstgrafts.includes(graft)) latergrafts.push(graft);
				}
			}

			return firstgrafts.concat(latergrafts);
		}
	}


	while (lines.length > 0) {
		let item = lines.shift();
		switch (item) {
			case "--first":
				argfirst = lines.shift();
				break;
			case "--sort":
				sortby = lines.shift();
				break;
			case "--list": // LIST AUGMENTATIONS and then EXIT
				listonly = true;
				break;
			case "--str":
				straight = true;
				break;
			case "--basic":
				highpriority = false;
				break;
			case "--all": // show all aug names
				all = true;
				listonly = true;
				/*for (const aug in augs) {
						ns.tprint(aug);
					}
					ns.exit();
					*/
				break;
			case "--help":
			default:
				ns.tprint("Params:\n\
	--sort [price|time]\n\
	--str		straight sort, without prioritizing factions or firstaugs\n\
	--basic		ignore firstaugs\n\
	--list		List available augs\n\
	--all		list ALL augs\n\
	");
				ns.exit();
				break;
		}
	}


	var graftable = prepgrafting(sortby, straight, all);

	//ns.tprint(":`graftable` is ready");

	if (listonly) {
		var totaltime = 0;
		var totalcost = 0;
		for (const graft of graftable) {
			ns.tprint(ns.format.number(graft.price, "0a")
				+ "\t  " + (parsetime(graft.time)).padStart(8, " ") + "    " + graft.name + " (" + graft.fac + ")"); //ns.format.time(graft.time)); //
			totaltime += graft.time;
			totalcost += graft.price;
		}
		ns.tprint((" -").repeat(30));
		ns.tprint("Total cost:\t\t" + ns.format.number(totalcost, "0a")
			+ "\t\t " + parsetime(totaltime)); //ns.format.time(totaltime)); //
		ns.exit();
	}


	//ns.tprint(":starting main loop");
	// CONTINUE with MAIN LOOP

	while (ns.grafting.getGraftableAugmentations().length > 0) {
		if (!ns.singularity.getCurrentWork() && ns.getPlayer().money > 1 * graftable[0].price) {

			if (ns.getPlayer().location != "New Tokyo") ns.singularity.travelToCity("New Tokyo");

			let aug = graftable.shift();
			ns.tprint(
				"(" + gettime() + ")\t"
				+ ns.format.number(aug.price, "0a")
				+ "\t" + parsetime(aug.time) + "\t" + aug.name); //ns.format.time(aug.time)); //

			ns.grafting.graftAugmentation(aug.name, false);
		}
		await ns.sleep(5000);

	}

	ns.alert("All graft augmentations obtained!\n" + gettime());

	// now start working for Daedalus
	// and one sleeve working for Daedalus

	// until enough reputation for Red Pill
	// then get Red Pill
	// start selling off stock (rm runfile)
	// buy up NeuroFlux Governor levels until out of money

	//	ns.exec("endgame.js");
	/* */
}