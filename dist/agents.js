import "dotenv/config";
import { FunctionTool, LlmAgent } from '@google/adk';
import { chromium } from 'playwright';
import { z } from 'zod';
let browser = null;
let page = null;
let context = null;
const SearchGoogle = new FunctionTool({
    name: 'search_google',
    description: 'Searches Google for a specified query.',
    // ✅ Fix: Use plain JSON schema instead of z.object
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "The search query to enter into Google"
            }
        },
        required: ["query"]
    },
    execute: async (input) => {
        const { query } = input;
        if (!browser) {
            browser = await chromium.launch({
                headless: false,
                slowMo: 100
            });
        }
        context = await browser.newContext();
        page = await context.newPage();
        try {
            await page.goto('https://www.google.com', {
                waitUntil: 'domcontentloaded'
            });
            await page.waitForSelector('textarea[name="q"]');
            await page.type('textarea[name="q"]', query, { delay: 100 });
            await page.keyboard.press('Enter');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(10000);
            return `Search for "${query}" completed successfully.`;
        }
        catch (error) {
            return `Search failed: ${error.message}`;
        }
        finally {
            await browser.close();
        }
    },
});
const closeBrowser = new FunctionTool({
    name: 'close_browser',
    description: 'Closes the browser.',
    execute: async (input) => {
        if (!browser) {
            return "No active browser session found.";
        }
        await page.waitForTimeout(10000);
        await browser.close();
        browser = null;
        page = null;
        context = null;
        return "browser closed successfully";
    },
});
export const SearchAgent = new LlmAgent({
    name: 'search_agent',
    model: 'gemini-2.5-flash',
    description: 'Searches Google for a specified query.',
    instruction: `You are a helpful assistant that searches Google for a specified query.
                Use the 'SearchGoogle' tool for this purpose.`,
    tools: [SearchGoogle, closeBrowser],
});
// const func=async (input: any) => {
//         const { query } = input;
//         const browser = await chromium.launch({
//             headless: false,
//             slowMo: 100
//         });
//         const context = await browser.newContext();
//         const page = await context.newPage();
//         try {
//             await page.goto('https://www.google.com', {
//                 waitUntil: 'domcontentloaded'
//             });
//             await page.waitForSelector('textarea[name="q"]');
//             await page.type('textarea[name="q"]', query, { delay: 100 });
//             await page.keyboard.press('Enter');
//             await page.waitForLoadState('networkidle');
//             // Reduced timeout for efficiency, but kept your logic
//             await page.waitForTimeout(12000); 
//             return `Search for "${query}" completed successfully.`;
//         } catch (error:any) {
//             return `Search failed: ${error.message}`;
//         } finally {
//             await browser.close();
//         }
//     }
//     async function main() {
//         const data=func("search about lions");
//         console.log(data);
//     }
//     main();
//# sourceMappingURL=agents.js.map