import { Locator, Page, expect, test } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
    readonly productTitle: Locator;
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly successMessage: Locator;
    readonly viewCartLink: Locator;
    readonly outOfStockText: Locator

    constructor(page: Page) {
        super(page);
        this.productTitle = page.locator('h1.product_title');
        this.quantityInput = page.locator('input[name="quantity"]');
        this.addToCartButton = page.locator('button[name="add-to-cart"]');
        this.successMessage = page.locator('.woocommerce-message');
        this.viewCartLink = this.successMessage.locator('a.button.wc-forward');
        this.outOfStockText = page.locator('.stock.out-of-stock')
    }

    async getProductName(): Promise<string> {
        return await test.step('Get product name', async () => {
            return await this.getElementText(this.productTitle);
        });
    }

    async setQuantity(qty: number) {
        await test.step(`Set quantity to ${qty}`, async () => {
            await this.quantityInput.fill(qty.toString());
        });
    }

    async addToCartAndGoToCart() {
        await test.step('Add to cart and navigate to Cart page', async () => {
            await this.clickElement(this.addToCartButton)
            await expect(this.successMessage).toBeVisible();
            await this.clickElement(this.viewCartLink);
        });
    }

    async verifyAddToCartDisabled() {
        await test.step('Verify "Add to cart" is disabled or hidden', async () => {
            if (await this.addToCartButton.isVisible()) {
                await expect(this.addToCartButton).toBeDisabled();
            } else {
                await expect(this.addToCartButton).toBeHidden();
            }
        });
    }
    async verifyOutOfStockMessage() {
        await test.step('Verify "Out of stock" text is visible', async () => {
            await expect(this.outOfStockText).toBeVisible();
            await expect(this.outOfStockText).toContainText('Out of stock');
        });
    }
}