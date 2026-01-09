import { Locator, Page, test, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { URLS } from '../consts/urls';

export class CartPage extends BasePage {
    readonly cartRow: Locator;
    readonly cartItemQuantity: string;
    readonly subtotal: Locator;
    readonly total: Locator;
    readonly shippingLabel: Locator;
    readonly shippingRadio: string;
    readonly proceedToCheckoutBtn: Locator;
    readonly emptyCartMessage: Locator;
    readonly removeIcon: Locator;
    readonly loadingOverlay: string;

    constructor(page: Page) {
        super(page);
        this.cartRow = page.locator('tr.cart_item');
        this.cartItemQuantity = 'input.qty';
        this.subtotal = page.locator('.cart-subtotal .woocommerce-Price-amount bdi');
        this.total = page.locator('.order-total .woocommerce-Price-amount bdi');
        this.shippingLabel = page.locator('#shipping_method label');
        this.shippingRadio = 'input';
        this.proceedToCheckoutBtn = page.locator('.checkout-button');
        this.emptyCartMessage = page.locator('.cart-empty');
        this.removeIcon = page.locator('.remove');
        this.loadingOverlay = '.blockUI';
    }

    async navigateToCart() {
        await this.navigateTo(URLS.CART);
    }

    async validateCartItem(name: string, quantity: number) {
        await test.step(`Validate item "${name}" with qty ${quantity} in cart`, async () => {
            const row = this.cartRow.filter({ hasText: name });
            await expect(row).toBeVisible();

            const qtyValue = await row.locator(this.cartItemQuantity).inputValue();
            expect(qtyValue).toBe(quantity.toString());
        });
    }

    async selectShippingMethod(methodName: string) {
        await test.step(`Select shipping method: ${methodName}`, async () => {
            await this.shippingLabel.filter({ hasText: methodName }).click();
            await this.page.waitForSelector(this.loadingOverlay, { state: 'detached' });
        });
    }

    async validateTotalsMath() {
        await test.step('Validate Subtotal + Shipping = Total', async () => {
            const subtotalText = await this.subtotal.textContent();
            const totalText = await this.total.textContent();

            const subtotal = this.parsePrice(subtotalText!);
            const total = this.parsePrice(totalText!);

            const checkedLabel = this.page.locator('#shipping_method input:checked').locator('..').locator('label');
            const shippingText = await checkedLabel.textContent();
            const shippingCost = this.parsePrice(shippingText || '0');

            expect(total).toBeCloseTo(subtotal + shippingCost, 2);
        });
    }

    async proceedToCheckout() {
        await test.step('Proceed to Checkout', async () => {
            await this.proceedToCheckoutBtn.click();
        });
    }

    async clearCart() {
        await test.step('Clear all items from cart', async () => {
            // Check if cart is already empty
            if (await this.emptyCartMessage.isVisible()) return;

            while (await this.removeIcon.count() > 0) {
                await this.removeIcon.first().click();
                await this.page.waitForSelector(this.loadingOverlay, { state: 'detached' });
            }
            await expect(this.emptyCartMessage).toBeVisible();
        });
    }
}