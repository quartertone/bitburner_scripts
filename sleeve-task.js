/** @param {NS} ns */
export async function main(ns) {

	// parse command line arguments
	var lines = ns.args;
	var clonesource = 0;
	if (lines.length > 0) {
		clonesource = ns.args[0] > 0 ? ns.args[0] : 0;
	}

	var previousaction = ns.sleeve.getTask(clonesource);
	var looping = true;

	if (lines.length >= 2) {
		for (const task in previousaction) {
			ns.tprint(task + " " + previousaction[task]);
		}
		looping = false;
	}

	while (looping) {
		await ns.sleep(5000); // top load this so `continue` doesn't break

		var clone = ns.sleeve.getTask(clonesource);
		if (clone.location == previousaction.location && clone.task == previousaction.task) continue;
		// wait until action is changed

		previousaction = clone; // set this up for the next loop around

		ns.tprint(previousaction.task);

		for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
			if (i == clonesource) continue; // ignore source
			//let stat = ns.sleeve.getSleeveStats(i);
			//if (lines.length > 0 || (stat.shock == 0 && stat.sync == 100)) {
			// do the same thing
			let clonetask = (clone.type).toLowerCase();
			ns.tprint("sleeve "+i);
			switch (clonetask) {
				case "class":
					ns.tprint("take class" + ", " + i + ", " + clone.location +":"+ clone.className);
					ns.run("sleeve-actions-class.js", 1, i, clone.location +":"+ clone.className);
					//ns.sleeve.setToUniversityCourse(i, clone.location, clone.className);
					break;
				case "crime":
					ns.tprint("do crime" + ", " +i, + ", " +clone.crime);
					ns.run("sleeve-actions-crime.js", 1, i ,clone.crime);
					//ns.sleeve.setToCommitCrime(i, clone.crime);
					break;
				case "faction":
					ns.tprint("workfaction");
					//	ns.sleeve.setToFactionWork(i, clone.location, clone.factionWorkType);
					break
				case "bladeburner":
				//	ns.run("sleeve-actions-bladeburner.js", 1, i ,clone.crime);
					break;
				case "company":
					ns.tprint("company work");
					ns.run("sleeve-actions-company.js", 1, i , clone.location);
					//ns.sleeve.setToCompanyWork(i, clone.location);
					break;
				case "gym":
					ns.tprint("work out");
					ns.run("sleeve-actions-gym.js", 1, i , clone.location + ":"+  clone.gymStatType);
					// ns.sleeve.setToGymWorkout(i, clone.location, gymStatType);
					break;
				case "Synchro":
					ns.run("sleeve-actions-synchro.js", 1, i);
					//ns.sleeve.setToSynchronize(i);
					break;
				case "Recovery":
					ns.run("sleeve-actions-recovery.js", 1, i);
					//ns.sleeve.setToShockRecovery(i);
					break;
			}
			//}
			await ns.sleep(200);
		}

		//if (lines.length > 0) break;

	}

	ns.tprint("sleeve tasks done");

}