import "dotenv/config";
import { FunctionTool, LlmAgent } from '@google/adk';
import { chromium } from 'playwright';
import { base64, z } from 'zod';
let browser = null;
let page = null;
let context = null;
const TakeScreenshot = new FunctionTool({
    name: 'take_screenshot',
    description: "takes a screenshot of current browser page",
    execute: async () => {
        if (!page)
            return "No active page";
        const buffer = await page.screenshot({
            fullPage: true,
            type: "png"
        });
        const base64Image = buffer.toString("base64");
        return {
            mime_type: "image/png",
            base64: base64Image
        };
    }
});
const ClickElement = new FunctionTool({
    name: "click_element",
    description: "Clicks element using CSS selector",
    parameters: {
        type: "object",
        properties: {
            selector: { type: "string" }
        },
        required: ["selector"]
    },
    execute: async (input) => {
        const { selector } = input;
        if (!page)
            return "No page open";
        await page.waitForSelector(selector, { timeout: 5000 });
        await page.click(selector);
        return `Clicked ${selector}`;
    }
});
const SearchGoogle = new FunctionTool({
    name: 'search_google',
    description: 'Searches Google for a specified query.',
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
            // await page.waitForTimeout(10000); 
            const titles = await page.$$eval("h3", (els) => els.slice(0, 5).map((el) => el.textContent?.trim() || ""));
            return titles;
        }
        catch (error) {
            return `Search failed: ${error.message}`;
        }
    },
});
const FillInput = new FunctionTool({
    name: "fill_input",
    description: "Fills input field",
    parameters: {
        type: "object",
        properties: {
            selector: { type: "string" },
            value: { type: "string" }
        },
        required: ["selector", "value"]
    },
    execute: async (input) => {
        const { selector, value } = input;
        await page.waitForSelector(selector);
        await page.fill(selector, value);
        return `Filled ${selector}`;
    }
});
const Navigate = new FunctionTool({
    name: "navigate",
    description: "Navigate to URL",
    parameters: {
        type: "object",
        properties: {
            url: { type: "string" }
        },
        required: ["url"]
    },
    execute: async (input) => {
        const { url } = input;
        await page.goto(url);
        return `Navigated to ${url}`;
    }
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
    tools: [SearchGoogle, closeBrowser, FillInput, Navigate, TakeScreenshot, ClickElement],
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