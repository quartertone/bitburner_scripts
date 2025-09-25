/** @param {NS} ns **/
// this script gets installed on host servers
// by the main batch-install script
import { settings, getmemtimes } from "/settings.js";

export async function main(ns) {
	var targ = ns.args[0];
	var target = ns.getServer(targ);
	var hostname = ns.getHostname();
	var host = ns.getServer(hostname);
	var moneypercent = 0.85;
	var securitythresh = 2;

	var [mem, times] = getmemtimes(ns, targ);

	var hostram = host.maxRam - mem.ctrl;

	// PART 1.1
	// Weaken the target until we achieve minimum security (minDifficulty)
	//TODO fix this
	// if weak/grow times is long, this wastes a lot of time while waiting for all the preparation weak/grow scripts to complete before proceeding to the next thing
	// NEED to calculate/predict weak/grow effect so we stop sending prep scripts once we have enough threads going on that, once they finish execution the server will be at the optimum level & money
	var nullarg = 0;
	while ((target.hackDifficulty > target.minDifficulty + securitythresh) || (target.moneyAvalaible < target.moneyMax * moneypercent)) {

		times = getmemtimes(ns, targ, true);

		var growdelay = times.weak + times.buff - times.grow;

		// total time to complete one cycle of this batch (weak+grow)
		var prepbatchtime = times.weak + times.buff * 2;

		// number of batch overlaps
		// ie number of batches that might run simultaneously
		// var prepsimulbatches = Math.floor(prepbatchtime / times.buff);
		var prepsimulbatches = prepbatchtime / times.buff;

		// ram quota for each batch cycle
		var prepbatchram = hostram / prepsimulbatches;

		// number of threads each script should run
		// weak/grow have same ram requirements
		var prepthreads = Math.floor(prepbatchram / mem.weak / 2);
		if (prepthreads == 0) prepthreads = 1;
		/*		
		ns.tprint(
			"Server ram: " + host.maxRam + "\n"
			+ "weaken mem: "	+ mem.weak + "\n"
			+ "weaken time: "+ times.weak + "\n"
			+ "prbatchtime: "+ prepbatchtime + "\n"
			//	+ "prbatchdelay: "+ prepbatchdelay + "\n"
			+ "prsiimulbatch: "+ prepsimulbatches + "\n"
			+ "prbatchram: "	+ prepbatchram + "\n"
			+ "prepthreads: "	+ prepthreads + "\n\n");
		*/

		// SEND IT
		ns.exec(settings.batch.weak, hostname, prepthreads, targ, 0, nullarg);
		ns.exec(settings.batch.grow, hostname, prepthreads, targ, growdelay, nullarg);
		nullarg++;


		// per-batch delay
		//var prepbatchdelay = times.weak + times.buff * 2 - ns.getWeakenTime(targ);
		// prepbatchtime == times.weak + times.buff * 2
		var prepbatchdelay = times.buff * 1.5;//shorten 

		await ns.sleep(prepbatchdelay);
		// LOOP IT

		target = ns.getServer(targ);
		//ns.exit();
	}

	// STEP 2 -- HWGW cycle
	var nullcycle = 0;
	while (true) {
		// ns.fileExists("runfile-batchhack.txt", "home")) {
		// first set up the batch informations
		times = getmemtimes(ns, targ, true);
		//reload host ram info
		host = ns.getServer(hostname);
		hostram = host.maxRam - mem.ctrl;


		var starttimes = {
			weak: times.buff * 2,
			// this is for the second weakening
			// first weaken starts with no delay
			hack: times.weak - times.buff - times.hack,
			grow: times.weak + times.buff - times.grow
		};

		// memory allocated for each batch
		var batchram = hostram / times.simulbatches;

		// denominator for ram percent calculation
		// settings.batch.allmem = mem.batchtotal

		var threads = {};
		for (const key in settings.batch) { // calculate percent of RAM used by each script
			let memper = mem[key] / mem.batchtotal;
			// then calculate number of threads per script within the batch
			threads[key] = Math.floor(batchram * memper);
			if (threads[key] == 0) threads[key] = 1;
		}

		// SEND IT
		// first weaken starts with no delay
		ns.exec(settings.batch.weak, hostname, threads["weak"], targ, 0, nullcycle);
		for (const key in starttimes) {
			ns.exec(settings.batch[key], hostname, threads[key], targ, starttimes[key], nullcycle);
		}
		nullcycle++;
		// per-batch delay
		// old weakentime - (new weaken time - buff * 3 )
		//var batchdelay = times.weak - (ns.getWeakenTime(targ) - times.buff * 3); 
		var batchdelay = times.buff * 1.5; // simplified and decreased interval to make more efficient use of memory.

		await ns.sleep(batchdelay);
		// LOOP IT
	}
}