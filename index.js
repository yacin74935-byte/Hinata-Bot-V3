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

// كود مدمج لإجبار البوت على عمل ريستارت تلقائي كل 5 دقائق
setInterval(() => {
    console.log("يتم الآن إعادة تشغيل البوت تلقائياً لتحديث الكوكيز ومنع الفصل...");
    process.exit(0); 
    // نظام Render Web Service سيعيد تشغيل البوت فوراً بمجرد إغلاقه هنا
}, 300000); // 300000 مللي ثانية تساوي 5 دقائق
