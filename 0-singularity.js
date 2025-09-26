/** @param {NS} ns **/
// scripts to run after reboot?
// also called by endgame
import { settings } from "/settings.js";

export async function main(ns) {

  ns.exec(settings.primary.scanhosts, "home", 1);
  await ns.sleep(100);

  ns.exec(settings.primary.sing_getapps, "home", 1);
  await ns.sleep(100);

  ns.exec(settings.primary.buy_stockaccess, "home", 1);
  await ns.sleep(100);

  //ns.exec(settings.primary.hacknetcorp, "home", 1);
  await ns.sleep(100);

  ns.exec(settings.primary.sleeve_task, "home", 1);
  await ns.sleep(100);

  ns.exec(settings.primary.gangsame, "home", 1);
  await ns.sleep(100);

  ns.exec(settings.primary.batch_install, "home", 1, "-s", "home", "n00dles");
  await ns.sleep(100);

  /*
  while (true) {

    if (ns.getServerMaxRam("home") > 2 ** 5) {
      ns.exec(settings.scanhosts, "home", 1);
      await ns.sleep(100);

      ns.exec(settings.batch.ctrl, "home", 1, "n00dles");
      await ns.sleep(100);

      ns.exec("sleeve-maxaugs.j s", "home", 1);
      await ns.sleep(100);
      break;
    }
    await ns.sleep(10000);
  }
  */
}