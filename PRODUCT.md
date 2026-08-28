# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, Vite, CSS, Google Apps Script backend.

## Users

Sriharshapn (Admin) manages the inventory and tracks sales. 
Customers browse the catalog to find sarees and dresses they love.

## Product Purpose

To provide a beautiful, seamless catalog where customers can easily browse available sarees and dresses and directly inquire via WhatsApp. For the admin, it serves as a lightweight, reliable inventory management system synced to Google Sheets.

## Positioning

A highly visual, premium boutique catalog that bridges the gap between a simple spreadsheet inventory and a modern, high-end e-commerce experience, seamlessly integrating with WhatsApp for personalized sales.

## Operating Context

Customers view the app on their mobile or desktop devices. The admin uses the hidden `/admin` portal (secured by PIN) to add new stock, edit items, and mark items as sold. Data is persisted to a Google Apps Script endpoint which updates Google Sheets.

## Capabilities and Constraints

Capabilities:
- View all available items, filtered by category (Sarees/Dresses) and search by name.
- Direct WhatsApp inquiry generation with pre-filled item details.
- Admin portal to add, edit, delete, and mark items as sold.
- Sales history and dashboard analytics (total revenue, profit margin, top selling models).

Constraints:
- Google Apps Script must be deployed as "Execute as: Me" and "Who has access: Anyone".
- Frontend relies on optimistic UI updates backed by periodic syncing to the backend.

## Brand Commitments

- Name: Udupu (ಉಡುಪು)
- Premium, modern, rich aesthetic.
- The Udupu logo must be prominently featured.
