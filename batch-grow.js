/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    var sleeptime = ns.args.hasOwnProperty(1) ? ns.args[1] : 0;

    await ns.sleep(sleeptime);
    await ns.grow(target);
}
