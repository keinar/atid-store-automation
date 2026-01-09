import { Locator, Page, test, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { GuestDetails } from '../interfaces/guestDetails.interface';

export class CheckoutPage extends BasePage {
    readonly billingFirstName: Locator;
    readonly billingLastName: Locator;
    readonly billingCompany: Locator;
    readonly billingCountry: Locator;
    readonly billingAddress1: Locator;
    readonly billingAddress2: Locator;
    readonly billingPostcode: Locator;
    readonly billingCity: Locator;
    readonly billingPhone: Locator;
    readonly billingEmail: Locator;
    
    readonly placeOrderBtn: Locator;
    readonly errorMessage: Locator;
    readonly loadingOverlay: string;

    constructor(page: Page) {
        super(page);
        this.billingFirstName = page.locator('#billing_first_name');
        this.billingLastName = page.locator('#billing_last_name');
        this.billingCompany = page.locator('#billing_company');
        this.billingCountry = page.locator('#billing_country');
        this.billingAddress1 = page.locator('#billing_address_1');
        this.billingAddress2 = page.locator('#billing_address_2');
        this.billingPostcode = page.locator('#billing_postcode');
        this.billingCity = page.locator('#billing_city');
        this.billingPhone = page.locator('#billing_phone');
        this.billingEmail = page.locator('#billing_email');

        this.placeOrderBtn = page.locator('#place_order');
        this.errorMessage = page.locator('.woocommerce-error');
        this.loadingOverlay = '.blockUI';
    }

    private get fieldMap(): Record<keyof GuestDetails, Locator> {
        return {
            firstName: this.billingFirstName,
            lastName: this.billingLastName,
            company: this.billingCompany,
            country: this.billingCountry,
            address: this.billingAddress1,
            city: this.billingCity,
            postcode: this.billingPostcode,
            phone: this.billingPhone,
            email: this.billingEmail
        };
    }

    async fillGuestDetails(details: Partial<GuestDetails>) {
        await test.step('Fill Checkout Form', async () => {
            const map = this.fieldMap;
            
            for (const [key, value] of Object.entries(details)) {
                const fieldName = key as keyof GuestDetails;
                
                if (!map[fieldName] || value === undefined || value === null) continue;

                if (fieldName === 'country') {
                    await map[fieldName].selectOption({ label: value as string });
                } else {
                    await this.fillElement(map[fieldName], value as string);
                }
            }
        });
    }

    async validateFormFilled(details: Partial<GuestDetails>, fieldsToSkip: (keyof GuestDetails)[] = []) {
        await test.step(`Validate Form Persistence (Skipping: ${fieldsToSkip.join(', ') || 'none'})`, async () => {
            const map = this.fieldMap;

            for (const [key, value] of Object.entries(details)) {
                const fieldName = key as keyof GuestDetails;

                if (fieldsToSkip.includes(fieldName)) continue;

                const locator = map[fieldName];
                if (!locator) continue;

                if (fieldName !== 'country') { 
                     await expect(locator).toHaveValue(value as string);
                }
            }
        });
    }

    async submitOrder() {
        await test.step('Click Place Order', async () => {
            await this.page.waitForSelector(this.loadingOverlay, { state: 'detached' });
            await this.clickElement(this.placeOrderBtn);
        });
    }

    async validateErrorMessage(text: string) {
        await test.step(`Validate error message contains: "${text}"`, async () => {
            await expect(this.errorMessage).toBeVisible();
            await expect(this.errorMessage).toContainText(text);
        });
    }

    async validateErrorGone(text: string) {
        await test.step(`Validate error message "${text}" is NOT displayed`, async () => {
            await expect(this.errorMessage.filter({ hasText: text })).toBeHidden();
        });
    }
}