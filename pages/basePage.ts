import { Locator, Page, test, expect } from "@playwright/test";


export abstract class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async navigateTo(path: string) {
        await test.step(`Navigate to ${path}`, async () => {
            await this.page.goto(path, { waitUntil: 'domcontentloaded' });
        });
    }

    protected async clickElement(locator: Locator, options?: { force?: boolean }) {
        await test.step(`Click element: ${locator}`, async () => {
            await locator.click(options);
        });
    }

    protected async fillElement(locator: Locator, value: string) {
        await test.step(`Fill field ${locator} with value: ${value}`, async () => {
            await locator.fill(value);
        });
    }

    protected async getElementText(locator: Locator) {
        return await test.step(`Get text of element: ${locator}`, async () => {
            return (await locator.textContent())?.trim() ?? '';
        });
    }

    protected parsePrice(priceText: string): number {
        const cleanText = priceText.replace(/,/g, '');
        const matches = cleanText.match(/(\d+(?:\.\d+)?)/g);
        if (!matches || matches.length === 0) return 0;
        return parseFloat(matches[matches.length - 1]);
    }

}