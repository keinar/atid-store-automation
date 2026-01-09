# Atid Store QA Automation

[![Playwright Tests](https://github.com/keinar/atid-store-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/keinar/atid-store-automation/actions)

Automated End-to-End (E2E) testing suite for the **Atid Store** e-commerce website, built with **Playwright** and **TypeScript**.

## Overview

This project automates critical user journeys for an e-commerce platform (`atid.store`), focusing on the Guest Checkout flow, Form Validation, and Session Isolation handling. It demonstrates robust test architecture using the **Page Object Model (POM)** design pattern.

## Features

* **Robust POM Architecture:** Modular page objects (`StorePage`, `ProductPage`, `CartPage`, `CheckoutPage`) with strictly typed selectors.
* **Dynamic Product Selection:** Tests dynamically find in-stock products instead of relying on hardcoded items.
* **Data Driven:** Uses `@faker-js/faker` for generating realistic, random user data for every run.
* **Smart Validation:**
    * **Generic Form Persistence Check:** Utilities to validate that form data is preserved (or correctly handled) across navigation.
    * **Math Validation:** Automatic verification of Cart Subtotal + Shipping = Total.
* **Advanced Scenarios:**
    * **Browser Context Isolation:** Verifies shopping cart independence between different user sessions (Scenario 3).
    * **Negative Testing:** Validates error handling for missing fields and checkout constraints.
* **Reporting:** Integrated **Allure Report** for detailed test execution visualization.

## Tech Stack

* **Framework:** [Playwright](https://playwright.dev/)
* **Language:** TypeScript
* **Data Generation:** Faker.js
* **Reporting:** Allure / Playwright HTML Reporter
* **CI/CD:** GitHub Actions

## Project Structure

```text
├── src
│   ├── consts      # Static data (Products, URLs)
│   ├── fixtures    # Playwright Fixtures (Dependency Injection for Pages)
│   ├── pages       # Page Object Models (The application mapping)
│   └── utils       # Utilities (Data Factory, Helpers)
├── tests
│   └── ui          # Test Specifications
│       ├── checkout.spec.ts  # Scenarios 1 & 2 (Checkout flows)
│       └── isolation.spec.ts # Scenario 3 (Stock & Session Isolation)
├── playwright.config.ts      # Configuration
└── package.json

```

## How to Run

### Prerequisites

* Node.js (v18+)
* npm

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/keinar/atid-store-automation.git](https://github.com/keinar/atid-store-automation.git)
cd atid-store-automation

```


2. Install dependencies:
```bash
npm install

```


3. Install Playwright browsers:
```bash
npx playwright install

```



### Execution Commands

* **Run All Tests:**
```bash
npx playwright test

```


* **Run Specific Test File:**
```bash
npx playwright test tests/ui/checkout.spec.ts

```


* **Run in Headed Mode (Visible Browser):**
```bash
npx playwright test --headed

```


* **View HTML Report:**
```bash
npx playwright show-report

```


* **Generate Allure Report:**
```bash
npm run allure:generate
npm run allure:open

```



## Test Scenarios Covered

1. **Guest Checkout Journey:** Verifies the full flow from catalog to cart, including quantity updates, shipping calculations, and form filling.
2. **Form Validation:** Ensures required fields are enforced and validates that user input is preserved during validation errors.
3. **Session Isolation:** verify that "Out of Stock" items cannot be added and that carts are isolated between different browser contexts (users).

---

**Author:** Keinar