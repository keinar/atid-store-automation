import { test, expect } from '../../fixtures/baseFixture';
import { generateGuestDetails } from '../../utils/testDataFactory';
import { PRODUCT_DATA } from '../../consts/products';

test.describe('Checkout Flow & Validation', () => {

    test('Scenario 1: Guest Checkout Journey', async ({ storePage, productPage, cartPage, checkoutPage }) => {
        await storePage.navigateToStore();
        await storePage.clickFirstInStockProduct();

        const productName = await productPage.getProductName();
        await productPage.setQuantity(PRODUCT_DATA.DEFAULT_QUANTITY);
        await productPage.addToCartAndGoToCart();

        await cartPage.validateCartItem(productName, PRODUCT_DATA.DEFAULT_QUANTITY);
        await cartPage.selectShippingMethod('Local pickup')
        await cartPage.validateTotalsMath();
        await cartPage.selectShippingMethod('Delivery Express')
        await cartPage.validateTotalsMath();
        await cartPage.selectShippingMethod('Registered Mail')
        await cartPage.validateTotalsMath();
        await cartPage.proceedToCheckout();

        const guestDetails = generateGuestDetails();
        await checkoutPage.fillGuestDetails(guestDetails);

        await test.step('Optional: Validate form persistence (Skipped due to AUT limitation)', async () => {
            // We skip this step programmatically because the site clears guest data on navigation
            test.info().annotations.push({ 
                type: 'limitation', 
                description: 'Guest data is not persisted on navigation in this version of the app' 
            });
        });

        await cartPage.navigateToCart();
        await cartPage.clearCart();
    });

    test('Scenario 2: Checkout Form Validation', async ({ storePage, productPage, cartPage, checkoutPage, page }) => {
        await storePage.navigateToStore();
        await storePage.clickFirstInStockProduct();
        await productPage.addToCartAndGoToCart();
        await cartPage.proceedToCheckout();

        const guestDetailsWithoutEmail = { 
            ...generateGuestDetails(),
            email: '' 
        };
        
        await checkoutPage.fillGuestDetails(guestDetailsWithoutEmail);
        await checkoutPage.submitOrder();

        await checkoutPage.validateErrorMessage('Billing Email address is a required field');
        await checkoutPage.validateFormFilled(guestDetailsWithoutEmail, ['email']);

        const guestDetailsWithEmail = {
            ...guestDetailsWithoutEmail,
            email: 'fixed_email@test.com',
        };
        
        await checkoutPage.fillGuestDetails(guestDetailsWithEmail);
        await checkoutPage.submitOrder();

        await checkoutPage.validateErrorGone('Billing Email address is a required field');
        await expect(page.getByText('no available payment methods')).toBeVisible();
    });
});