process.on('uncaughtException', (err) => {
    console.error('[AntiCrash] حدث خطأ وتم تخطيه بنجاح:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[AntiCrash] تم منع انهيار البوت بسبب:', reason);
});

const { spawn } = require("child_process");
const log = require("./logger/log.js");

function startProject() {
	const child = spawn("node", ["Hinata.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		if (code == 2) {
			log.info("Restarting Project...");
			startProject();
		}
	});
}

startProject();
