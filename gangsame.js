/** @param {NS} ns **/

export async function main(ns) {

	while (true) {
		let first = 0;
		let reftask = "";
		for (const name of ns.gang.getMemberNames()) {
			let member = ns.gang.getMemberInformation(name);
			let ascent = ns.gang.getAscensionResult(name);
			if (first++ == 0) {
				reftask = member.task;
				continue;
			}
			if (member.task.match(/^(Vigilante|Ethical Hacking|Train)/)) continue;

			if (member.task != reftask) {
				ns.gang.setMemberTask(name, reftask);

				ns.print(name + ": set to " + member.task);

			}

		}
		await ns.sleep(1000);
	}

}

