const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmud-aura/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "4k",
                aliases: ["hd", "enhance", "upscale"],
                version: "2.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        en: "تحسين أو استعادة جودة الصورة إلى 4K باستخدام الذكاء الاصطناعي",
                        vi: "Nâng cao chất lượng hình ảnh lên 4K bằng AI"
                },
                category: "tools",
                guide: {
                        en: '   {pn} [رابط]: ترقية جودة الصورة عبر الرابط' +
                                '\n   {pn} [رد]: قم بالرد على صورة لترقية جودتها',
                        vi: '   {pn} [url]: Nâng cấp ảnh qua URL' +
                                '\n   {pn} [reply]: Phản hồi ảnh để nâng cấp'
                }
        },

        langs: {
                en: {
                        noImage: "• عزيزي، يرجى الرد على صورة أو توفير رابط لها.",
                        success: "✅ | 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝟒𝐤 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
                        error: "× خطأ في الـ API: %1. تواصل مع MahMUD للحصول على المساعدة.\n•واتساب: 01836298139"
                },
                vi: {
                        noImage: "• Cưng ơi, hãy phản hồi một bức ảnh hoặc gửi link.",
                        success: "✅ | 𝐇𝐞𝐫𝐞'𝐬 𝐲ou'r 𝟒𝐤 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
                        error: "× Lỗi: %1. Liên hệ MahMUD để được hỗ trợ.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, message, args, event, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                let imgUrl;
                if (event.messageReply?.attachments?.[0]?.type === "photo") {
                        imgUrl = event.messageReply.attachments[0].url;
                } else if (args[0]) {
                        imgUrl = args.join(" ");
                }

                if (!imgUrl) return api.sendMessage(getLang("noImage"), event.threadID, event.messageID);

                api.setMessageReaction("😘", event.messageID, () => {}, true);

                try {
                        const response = await axios.get(`${await baseApiUrl()}/api/enhance?imgUrl=${encodeURIComponent(imgUrl)}`, {
                                method: "GET",
                                responseType: "stream",
                                headers: { 'User-Agent': 'Mozilla/5.0' }
                        });

                        api.setMessageReaction("🪽", event.messageID, () => {}, true);

                        return api.sendMessage({
                                body: getLang("success"),
                                attachment: response.data
                        }, event.threadID, event.messageID);

                } catch (err) {
                        console.error("error", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
                }
        }
};
