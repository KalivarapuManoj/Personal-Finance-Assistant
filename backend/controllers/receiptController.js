import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";
import Transaction from "../model/Transaction.js";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to parse receipt text via OpenAI
export async function processReceiptText(text) {
    const prompt = `
You are an AI that extracts transactions from receipt text.
The receipt has columns like Product, Qty, Price, Total, etc.
Use the Price or Total column as the amount. Ignore quantities.
If there are individual items do not consider total amount as one
of the expenses but rather give expenses for each item separately
from the below receipt data.

Here’s the receipt data:
"${text}"

Return only JSON array of transactions with these keys and dont give any other texts only send me an array of jsons:
"type" (Expense/Income), "amount" (number), "Category" (string), "Date" (YYYY-MM-DD).

Example output:
[
  {"type": "expense", "amount": 90, "category": "Groceries", "date": "2025-08-28"},
  {"type": "expense", "amount": 25, "category": "Travel", "date": "2025-08-28"}
]
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
        ],
        max_tokens: 500,
    });

    const output = response.choices[0].message.content.trim();

    try {
        return JSON.parse(output);
    } catch (err) {
        console.error("Failed to parse JSON:", output);
        return null;
    }
}

// Upload receipt and extract transactions
export const uploadReceipt = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        // Prepare form-data for OCR.Space
        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path));
        formData.append("language", "eng");
        formData.append("apikey", process.env.OCR_SPACE_API_KEY);
        formData.append("isOverlayRequired", "false");

        // Call OCR.Space API
        const response = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.OCRExitCode !== 1) {
            return res.status(500).json({ error: "OCR failed", details: data });
        }

        let extractedText = data.ParsedResults[0].ParsedText;

        // Clean OCR text
        const cleanedText = extractedText
            .replace(/\r/g, "")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .join("\n");


        // Parse text into transactions using OpenAI
        let transactionData = await processReceiptText(cleanedText);

        // Fallback: if OpenAI fails to extract amounts, extract Total via regex
        if (transactionData) {
            transactionData = transactionData.map((tx) => {
                if (!tx.amount) {
                    const amountMatch = cleanedText.match(/Total[:\s]*([\d.]+)/i);
                    tx.amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
                }
                if (!tx.Category) tx.Category = "POS receipts";
                if (!tx.Date) {
                    // Try to extract date from text like DD/MM/YYYY
                    const dateMatch = cleanedText.match(/(\d{2}\/\d{2}\/\d{4})/);
                    tx.Date = dateMatch
                        ? new Date(dateMatch[1].split("/").reverse().join("-")).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0];
                }
                if (!tx.type) tx.type = "Expense";
                return tx;
            });
        } else {
            return res.status(500).json({ error: "Failed to parse transactions from receipt" });
        }

        console.log(transactionData);

        // Save all transactions to MongoDB
        const transactions = await Transaction.insertMany(transactionData);

        // Delete uploaded file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Failed to delete file:", err);
        });

        res.status(201).json({
            message: "Transactions created from receipt",
            transactions,
            extractedText,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
