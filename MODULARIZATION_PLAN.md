# App.js Modularization Plan

This document outlines the plan to modularize the `App.js` file to improve code organization, readability, and maintainability.

## 1. New Directory Structure

The following directory structure will be created to house the separated code:

- `api/`: For API-related functions.
- `utils/`: For helper and utility functions.
- `hooks/`: For custom React hooks.
- `constants/`: For application-wide constants.
- `styles/`: For stylesheet definitions.
- `components/`: For UI components.

## 2. Code Distribution

The code from `App.js` will be split into the following new files:

- **`constants/tickers.js`**: Will export the `DEFAULT_TICKERS` array.
- **`api/yahooFinance.js`**: Will contain the `fetchPriceData` function.
- **`utils/calculations.js`**: Will contain `calculateRSI` and `calculateVolatility`.
- **`utils/ui.js`**: Will contain `getColor` and `getReturnColor`.
- **`utils/data.js`**: Will contain `formatSymbol` and `sortData`.
- **`hooks/useScrollSync.js`**: Will contain the `useScrollSync` custom hook.
- **`styles/appStyles.js`**: Will contain the large `styles` object.
- **`components/TableHeader.js`**: The `TableHeader` component.
- **`components/DataRow.js`**: The `DataRow` component.
- **`components/DetailsPage.js`**: The `DetailsPage` component.
- **`components/AddSymbolModal.js`**: The `AddSymbolModal` component.

## 3. Refactored `App.js`

The main `App.js` file will be simplified to import the necessary components and functions from the new modules. It will primarily be responsible for state management and composing the main application layout.

## 4. Visualization

The following Mermaid diagram illustrates the proposed new structure:

```mermaid
graph TD
    subgraph App
        A[App.js]
    end

    subgraph Components
        B[components/TableHeader.js]
        C[components/DataRow.js]
        D[components/DetailsPage.js]
        E[components/AddSymbolModal.js]
    end

    subgraph API
        F[api/yahooFinance.js]
    end

    subgraph Utils
        G[utils/calculations.js]
        H[utils/ui.js]
        I[utils/data.js]
    end

    subgraph Hooks
        J[hooks/useScrollSync.js]
    end

    subgraph Constants
        K[constants/tickers.js]
    end

    subgraph Styles
        L[styles/appStyles.js]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    A --> I
    A --> J
    A --> K
    A --> L

    C --> H
    D --> G
    D --> H
    
    B --> L
    C --> L
    D --> L
    E --> L