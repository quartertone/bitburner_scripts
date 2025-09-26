/** @param {NS} ns */
// called from scanhosts
export async function main(ns) {
	//ns.tprint(ns.args[0]);
	var trace = ns.args[0].split(";connect ");
	//trace.push("home");
	var lastserver = "";
	for (const server of trace) {
		//ns.tprint(server);
		ns.singularity.connect(server);
		//await ns.sleep(100);
		lastserver = server;
	}
	await ns.singularity.installBackdoor();
	ns.singularity.connect("home");
	ns.tprint("------ Backdoor installed ---- : " + lastserver);
	
}