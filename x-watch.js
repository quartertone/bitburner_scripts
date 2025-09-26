/** @param {NS} ns **/

import { divbox, havebox } from "settings.js";
export async function main(ns) {


  var output = document.createElement("div");
  output.id = "watchbox";
  output.style = "width:100%";
  divbox(output);

  var box = true;
  while (box) {
    //if (!box && !ns.args[0] ) break;
    output.innerHTML = "";
    var totalmoney = 0;


    await ns.sleep(5000);
    var box = havebox(output.id);
  }

}
export function autocomplete(data, args) {
  return [...data.servers];
}