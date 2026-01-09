import { Page } from '@playwright/test';
import { test, expect } from '../../fixtures/baseFixture';
import { StorePage } from '../../pages/storePage';
import { ProductPage } from '../../pages/productPage';
import { CartPage } from '../../pages/cartPage';
import { PRODUCT_DATA } from '../../consts/products';

const createPageContext = (page: Page) => ({
    storePage: new StorePage(page),
    productPage: new ProductPage(page),
    cartPage: new CartPage(page)
});

test.describe('Session Isolation & Stock Behavior', () => {

    test('Scenario 3: Out-of-Stock & Session Isolation', async ({ browser, storePage, productPage }) => {
        
        await test.step('Validate Out-of-Stock Product', async () => {
            await storePage.navigateToStore();
            await storePage.navigateToProduct(PRODUCT_DATA.OUT_OF_STOCK_NAME);
            await productPage.verifyAddToCartDisabled();
            await productPage.verifyOutOfStockMessage();
        });

        await test.step('Validate Cart Isolation', async () => {
            const contextA = await browser.newContext();
            const contextB = await browser.newContext();
            
            const sessionA = createPageContext(await contextA.newPage());
            const sessionB = createPageContext(await contextB.newPage());

            await sessionA.storePage.navigateToStore();
            await sessionA.storePage.clickFirstInStockProduct();
            await sessionA.productPage.addToCartAndGoToCart();
            
            await sessionB.storePage.navigateToStore();
            await sessionB.storePage.clickFirstInStockProduct();
            await sessionB.productPage.addToCartAndGoToCart();

            await expect(sessionA.cartPage.emptyCartMessage).toBeHidden();
            
            await sessionA.cartPage.clearCart();

            await expect(sessionA.cartPage.emptyCartMessage).toBeVisible();
            await expect(sessionB.cartPage.emptyCartMessage).toBeHidden();

            await contextA.close();
            await contextB.close();
        });
    });
});