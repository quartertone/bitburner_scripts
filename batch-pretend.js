/** @param {NS} ns **/
// this script gets installed on host servers
// by the main batch-install script
import { settings, getmemtimes } from "/settings.js";

export async function main(ns) {
	var targ = ns.args[1];
	var target = ns.getServer(targ);
	var hostname = ns.args[0];// ns.getHostname();
	var host = ns.getServer(hostname);
	var moneypercent = 0.85;
	var securitythresh = 2;

	var [mem, times] = getmemtimes(ns, targ);

	var hostram = host.maxRam - mem.ctrl;

	// PART 1.1
	// Weaken the target until we achieve minimum security (minDifficulty)
	var nullarg = 0;
	// while ((target.hackDifficulty > target.minDifficulty + securitythresh) || (target.moneyAvalaible < target.moneyMax * moneypercent)) {

	ns.tprint("-----------------Prep phase: Weaken/Grow cycle");
	times = getmemtimes(ns, targ, true);

	var growdelay = times.weak + times.buff - times.grow;
	ns.tprint("growdelay = " + growdelay);


	// total time to complete one cycle of this batch (weak+grow)
	var prepbatchtime = times.weak + times.buff * 2;
	ns.tprint("prepbatchtime = " + prepbatchtime);

	// number of batch overlaps
	// ie number of batches that might run simultaneously
	// var prepsimulbatches = Math.floor(prepbatchtime / times.buff);
	var prepsimulbatches = prepbatchtime / times.buff;

	// ram quota for each batch cycle
	var prepbatchram = hostram / prepsimulbatches;
	ns.tprint("prepbatchram = hostram/prepsimulbatches " + prepbatchram + "=" + hostram + "/" + prepsimulbatches);

	// number of threads each script should run
	// weak/grow have same ram requirements
	var prepthreads = Math.floor(prepbatchram / mem.weak / 2);
	ns.tprint("prepthreads " + prepthreads);

	// SEND IT
	// ns.exec(settings.batch.weak, hostname, prepthreads, targ, 0, nullarg);
	// ns.exec(settings.batch.grow, hostname, prepthreads, targ, growdelay, nullarg);
	// nullarg++;


	// per-batch delay
	var prepbatchdelay = times.weak + times.buff * 2 - ns.getWeakenTime(targ);
	ns.tprint("await prepbatchdelay" + prepbatchdelay);
	//await ns.sleep(prepbatchdelay);
	// LOOP IT

	target = ns.getServer(targ);
	//	ns.exit();
	//}

	// STEP 2 -- HWGW cycle
	var nullcycle = 0;
	// while (true) {
	ns.tprint("HWGW cycle");

	// ns.fileExists("runfile-batchhack.txt", "home")) {
	// first set up the batch informations
	times = getmemtimes(ns, targ, true);

	var starttimes = {
		weak: times.buff * 2,
		// this is for the second weakening
		// first weaken starts with no delay
		hack: times.weak - times.buff - times.hack,
		grow: times.weak + times.buff - times.grow
	};

	for (const i in starttimes) {
		ns.tprint("starttimes." + i + " =  " + starttimes[i]);
	}

	// memory allocated for each batch
	var batchram = hostram / times.simulbatches;
	ns.tprint("batchram " + batchram);
	// denominator for ram percent calculation
	// settings.batch.allmem = mem.batchtotal

	var threads = {};
	for (const key in settings.batch) { // calculate percent of RAM used by each script
		let memper = mem[key] / mem.batchtotal;
		// then calculate number of threads per script within the batch
		threads[key] = Math.floor(batchram * memper);
		ns.tprint("threads."+ key + " = " + threads[key]);
	}

	// SEND IT
	// first weaken starts with no delay
	//ns.exec(settings.batch.weak, hostname, threads["weak"], targ, 0, nullcycle);
	//for (const key in starttimes) {
	//	ns.exec(settings.batch[key], hostname, threads[key], targ, starttimes[key], nullcycle);
	//}
	nullcycle++;
	// per-batch delay
	// old weakentime - (new weaken time - buff * 3 )
	var batchdelay = times.weak - (ns.getWeakenTime(targ) - times.buff * 3);
	await ns.sleep(batchdelay);
	ns.tprint("batchedelay = " + batchdelay);
	// LOOP IT
}