/** @param {NS} ns **/
export async function main(ns) {

	// switch to WHILE 
	while (true) {
		
		while (ns.gang.canRecruitMember()) {
		var members = ns.gang.getMemberNames();
		let newmember = "member-" + (members.length + 1);
		ns.tprint("Recruiting new member: " + newmember);

		ns.gang.recruitMember(newmember);
		ns.gang.setMemberTask(newmember, "Train Charisma");
		await ns.sleep(50);
		}
		if (ns.gang.getMemberNames().length ==12) break;
		await ns.sleep(5000);
	}
	ns.tprint("Max Gang members recruited");

}