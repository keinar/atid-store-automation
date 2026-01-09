import { Locator, Page, expect, test } from '@playwright/test';
import { BasePage } from './basePage';
import { URLS } from '../consts/urls';

export class StorePage extends BasePage {
    readonly productList: Locator;
    readonly productLink: Locator;
    readonly outOfStockBadge: string;
    readonly searchInput: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        super(page);
        this.productList = page.locator('ul.products li.product');
        this.productLink = page.locator('a.woocommerce-LoopProduct-link');
        this.outOfStockBadge = '.onsale';
        this.searchInput = page.locator('#wc-block-search__input-1');
        this.searchButton = page.locator('.wc-block-search__button');

    }

    async navigateToStore() {
        await this.navigateTo(URLS.HOME);
    }

    async clickFirstInStockProduct() {
        await test.step('Select first in-stock product', async () => {
            const count = await this.productList.count();
            
            for (let i = 0; i < count; ++i) {
                const product = this.productList.nth(i);
                
                // Check if the "Out of Stock" text exists within the badge
                const badge = product.locator(this.outOfStockBadge);
                const isOutOfStock = await badge.isVisible() && 
                                     (await badge.textContent())?.toLowerCase().includes('out of stock');

                if (!isOutOfStock) {
                    // Click the main link to navigate to details
                    await this.clickElement(product.locator(this.productLink).first());
                    return;
                }
            }
            throw new Error('No in-stock products found on the store page.');
        });
    }

    async navigateToProduct(productName: string) {
        await test.step(`Maps to specific product: ${productName}`, async () => {
             const product = this.productList.filter({ hasText: productName }).first();
             await this.clickElement(product.locator(this.productLink));
        });
    }
}