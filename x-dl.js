/** @param {NS} ns **/

export async function main(ns) {

  //git add *; git commit -a -m "vscode push"; git push origin master
  //	https://redmega.github.io/bitburner-save-editor/

  var files = [


    "0-master.js",
    "0-singularity.js",
    "9-endgame.js",
    "backdoor.js",
    "basicstart.js",
    "batch-allinstall.js",
    "batch-control.js",
    "batch-distributed.js",
    "batch-grow.js",
    "batch-hack.js",
    "batch-install.js",
    "batch-pretend.js",
    "batch-weak.js",
    "bb-batch-auto.js",
    "bb-sleeve-burner.js",
    "buy-augmentations.js",
    "buy-betterstock.js",
    "buy-nodes.js",
    "buy-servers.js",
    "buy-stockaccess.js",
    "check-costofserver.js",
    "check-getinfo.js",
    "check-moneystocks-backup.js",
    "check-moneystocks.js",
    "check-stockinfo.js",
    "controlpanel.js",
    "corpcontrol.js",
    "corpmaterials.js",
    "exploit.js",
    "gangbuyall.js",
    "ganginfo.js",
    "ganglang.js",
    "gangrecruiter.js",
    "gangsame.js",
    "gangtasks.js",
    "gangtrain.js",
    "graft-augs.js",
    "graft.js",
    "hacknet.js",
    "hacknetcorp.js",
    "hackneteven.js",
    "loop-grow.js",
    "loop-hack.js",
    "loop-install.js",
    "loop-weaken.js",
    "scanhosts.js",
    "settings.js",
    "share.js",
    "sing-getapps.js",
    "sleeve-actions-classic.js",
    "sleeve-actions-company.js",
    "sleeve-actions-crime.js",
    "sleeve-actions-gym.js",
    "sleeve-actions-recovery.js",
    "sleeve-actions-synchro.js",
    "sleeve-buyaugs.js",
    "sleeve-task.js",
    "stanek.js",
    "wipeserver.js",
  ];

  var prepend = "https://github.com/quartertone/bitburner_scripts/raw/refs/heads/";

  var version = "main/";
  for (const file of files) {
    let gotit = ns.wget(prepend + version + file, file);
    await gotit.then(
      function (val) {
        if (val) {
          ns.tprint("OK: " + file);
        } else {
          ns.tprint("Failed to get " + file + "; " + val);
        }
      }
      //function(err) { ns.tpint("Failed to get " + file + "; " + err);}
    );
    // , "home");
    // console.log(file, filename[0]);
    await ns.sleep(100);
  }
}

// git add *; git commit -a -m "no coment"; git push origin master
