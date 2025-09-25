/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length > 0 ) {
		var host = ns.args[0];
		var script = "stanek.js";
		var scriptram = ns.getScriptRam(script, "home");
		var maxram = ns.getServerMaxRam(host);
		ns.tprint(host);
		await ns.scp(script, host, "home");
		ns.exec(script, host, (maxram/scriptram) * .95);
	} else {
		while (true) {
			for (const frag of ns.stanek.activeFragments()) {
				try {
					await ns.stanek.chargeFragment(frag.x, frag.y);
				} catch (e) {}
				//ns.tprint(frag.id + " " + frag.x + " " + frag.y);
			}
			await ns.sleep(1100);
		}
	}
}


export function autocomplete(data, args) {
	return [...data.servers];
}

