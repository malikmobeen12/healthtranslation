// api/translate.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST requests are allowed" });
    return;
  }

  const { text, targetLang } = req.body;
  const API_KEY = process.env.DEEPL_API_KEY;

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `DeepL-Auth-Key ${API_KEY}`,
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Translation error" });
  }
};
