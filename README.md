# Demoblaze QA Automation Home Task

[![Playwright Tests](https://github.com/keinar/demoblaze-automation/actions/workflows/playwright.yml/badge.svg)](https://keinar.github.io/demoblaze-automation/)

This repository contains an automated testing suite for the **Demoblaze** e-commerce website (UI) and a Mock API (Backend), developed using **Playwright** with **TypeScript**.

## Features

* **UI Automation:** Robust End-to-End scenarios covering Product Catalog, Cart management, and Authentication flows using the **Page Object Model (POM)**.
* **API Automation:** REST API testing (CRUD operations) against a local `json-server` with strict data validation and schema checks.
* **Modern Architecture:**
    * **Custom Fixtures:** Implementation of Playwright's test extension mechanism for clean dependency injection (no manual page instantiation in tests).
    * **Constructor-Based Locators:** Optimized POM design where locators are defined strictly in constructors.
    * **BasePage Abstraction:** Shared logic for element interaction, navigation, and reporting steps.
    * **Smart Waits:** Usage of `waitForResponse` and `toHaveCount` to handle dynamic content (SPA) without hardcoded sleeps.
* **CI/CD & Reporting:**
    * Fully integrated **GitHub Actions** pipeline.
    * **Allure Reports** generated automatically and deployed to **GitHub Pages**.
    * Artifact management for test traces and videos on failure.

## Implemented Bonuses

This suite includes the optional bonus requirements:
* **Negative Scenarios:** Handles invalid login attempts (UI) and non-existent resource deletion (API).
* **Performance Testing:** Measures and asserts API response times.

## Prerequisites

* **Node.js** (v14 or higher)
* **npm**

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/keinar/demoblaze-automation.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd demoblaze-automation
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Install Playwright browsers:
    ```bash
    npx playwright install
    ```

## How to Run

### 1. Start the Mock API Server
Since the backend tests run against a local server, you must start it first.
Open a terminal and run:

```bash
npm run api
```

*This will start `json-server` on `http://localhost:3000` watching `db.json`.*

### 2. Run the Tests

Open a **new** terminal window and use one of the following commands:

  * **Run All Tests (UI & API):**
    ```bash
    npx playwright test
    ```

  * **Run Only UI Tests:**
    ```bash
    npx playwright test tests/ui
    ```

  * **Run Only API Tests:**
    ```bash
    npx playwright test tests/api
    ```

  * **View HTML Report:**
    ```bash
    npx playwright show-report
    ```

  * **Generate & Open Allure Report:**
    ```bash
    npm run allure:generate
    npm run allure:open
    ```

## Project Structure

```bash
├── src
│   ├── consts      # Configuration (URLs, Selectors, Data, Errors)
│   ├── fixtures    # Custom Playwright Fixtures (Test Extension)
│   ├── interfaces  # TypeScript Interfaces (e.g., Product)
│   ├── pages       # Page Object Models
│   │   ├── components  # Shared components (e.g., LoginPopup)
│   │   └── ...         # Main Pages (HomePage, ProductPage)
│   └── utils       # Utilities (ApiUtils for backend testing)
├── tests
│   ├── ui          # UI Spec files (catalog, cart, login)
│   └── api         # API Spec files (products, cart CRUD, perf)
├── db.json         # Database file for the Mock API
├── playwright.config.ts
└── README.md
```

## Assumptions & Design Decisions

1. **Mock API Cleanup:** The API tests are designed to be independent (Isolated). A `beforeEach` hook cleans up the cart in the mock DB before every test run to prevent state leakage between tests.
2. **Demoblaze Latency:** The demo website (`demoblaze.com`) does not always update the URL immediately upon navigation. The framework uses explicit waits (`waitForResponse`, `waitForEvent`) and network handling strategies to ensure stability and avoid flakiness.
