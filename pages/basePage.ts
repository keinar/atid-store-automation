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

    protected async clickElement(locator: Locator) {
        await test.step(`Click element: ${locator}`, async () => {
            await locator.click();
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

    protected async validateElementText(locator: Locator, expectedText: string) {
        await test.step(`Validate the element contains text: ${expectedText}`, async () => {
            await expect(locator).toContainText(expectedText);
        });
    }

    protected parsePrice(priceText: string): number {
        const numbers = priceText.replace(/[^0-9.]/g, '');
        return numbers ? parseFloat(numbers) : 0;
    }

}