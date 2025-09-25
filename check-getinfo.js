/** @param {NS} ns **/
import {serverinfo, divbox, havebox, draggable} from "settings.js";

export async function main(ns) {


    var watch = false;
    var target = "";

    var usage = "Usage: {flags}\n\
		[target]		Target for hacking scripts\n\
		[-w]		watch this output\n\n";

    // parse command line arguments
    var lines = ns.args;
    while (lines.length > 0) {
        let item = lines.shift();
        switch (item) {
            case "-w": watch = true;
                break;
            case "-h":
            default:
                if (item.match(/^-/)) { // bad argument
                    target = ""; // this forces script to fail
                } else { // un-tacked argument defaults to target name
                    target = ns.serverExists(item) ? item : "";
                }
                break;
        }
    }

    if (! target) {
        ns.tprint(usage);
        ns.exit();
    }

    var info = ns.getServer(target);
    // ns.tprint(info);

    ns.tprint(serverinfo(ns, info));


    if (watch) {
        var output = document.createElement("div");
        output.id = "watchbox"+target;
        output.style = "width:100%;user-select:none;";
        divbox(output, output.id+"divbox");

				draggable(document.getElementById(output.id+"divbox"));
        var box = true;
        while (box) { // if (!box && !ns.args[0] ) break;
            output.innerHTML = serverinfo(ns, info);
          
            await ns.sleep(3000);
            var box = havebox(output.id);
						info = ns.getServer(target);
        }

    }

}

export function autocomplete(data, args) {
    return [... data.servers];
}


/*
ns.tprint("contracts:", info.contracts);
	ns.tprint("isConnectedTo:", info.isConnectedTo);
	ns.tprint("messages:", info.messages);


ns.tprint(" ");
ns.tprint("programs:", info.programs);
ns.tprint("runningScripts:", info.runningScripts);
ns.tprint("scripts:", info.scripts);
ns.tprint("serversOnNetwork:", info.serversOnNetwork);
ns.tprint("textFiles:", info.textFiles);

tprint("purchasedByPlayer:", info.purchasedByPlayer);

tprint("ip:", info.ip);
tprint("isConnectedTo:", info.isConnectedTo);
tprint("messages:", info.messages);
tprint("organizationName:", info.organizationName);


tprint("ftpPortOpen:", info.ftpPortOpen);
tprint("httpPortOpen:", info.httpPortOpen);
tprint("smtpPortOpen:", info.smtpPortOpen);
tprint("sqlPortOpen:", info.sqlPortOpen);
tprint("sshPortOpen:", info.sshPortOpen);


*/
