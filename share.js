/** @param {NS} ns **/
// called from scanhosts
export async function main(ns) {
	while (true) {
		await ns.share();
//		await ns.sleep(300);
	}
}