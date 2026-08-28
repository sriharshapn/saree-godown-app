# 👗 Udupu - Premium Clothing Inventory & Showcase

A sleek, lightning-fast inventory management system and customer-facing catalog built for **Udupu** (a premium saree and dress boutique). 

Built with React (Vite) and powered by a completely free **Google Sheets + Google Drive + Apps Script** backend. 

## ✨ Key Features

### 🛍️ Customer Showcase
- **Consumer-Facing Catalog:** Beautiful, glassmorphic UI where customers can browse available stock.
- **Image Carousels:** Seamlessly swipe through multiple high-quality photos per item.
- **Category Filtering:** Easily filter between Sarees, Dresses, and "All".
- **WhatsApp Integration:** 1-click inquiry buttons that automatically draft a WhatsApp message with the item's model name and price.
- **Live Stock Indicators:** "Out of Stock", "Only X Left", and "Available" badges dynamically update.
- **Smart Markdowns:** Displays "Sale" badges and calculates percentage discounts dynamically when an exclusive sale price is set.

### 🔒 Admin Dashboard
- **Secure PIN Login:** Hidden admin portal secured by a custom PIN to prevent unauthorized modifications.
- **Advanced Inventory Management:** 
  - Add quantities for bulk stock (e.g., 10 pieces of a model).
  - **Partial Sales:** Sell 2 pieces today, 3 pieces tomorrow. The app automatically tracks remaining stock and updates statuses to `Available`, `Partial`, or `Sold`.
  - Edit items (prices, names, quantities, and toggle sales) on the fly.
- **Multiple Image Support:** Upload up to 3 images per product securely straight to your Google Drive. 
- **Auto-Cleanup:** Deleting an item automatically moves its Drive images to the trash, preventing storage leaks.

### 📈 Financial Analytics
- **Live Dashboard:** Real-time calculations of your **Total Inventory Value**, **Revenue**, and **Profit/Loss**.
- **Performance Metrics:** View "Most Sold Models" and "Slow Moving Stock" visually via Recharts.
- **Full Sales History & Undo:** 
  - Every single sale is logged with timestamps and quantities in a dedicated Sales History tab.
  - Made a mistake? Click **Undo Sale**, write a quick comment, and the inventory quantities and revenue are instantly restored.

### ☁️ 100% Free Cloud Database
- Bypasses expensive databases (like Firebase or Supabase) by using Google Sheets as a JSON REST API. 
- Automatically creates necessary sheets (`Inventory`, `SalesHistory`) if they don't exist.
- Highly resistant to ISP blocking and 100% free forever.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, CSS (Glassmorphism design)
- **Icons & Charts:** Lucide React, Recharts
- **Image Compression:** Client-side canvas compression for lightning-fast uploads without crashing mobile browsers.
- **Backend/Database:** Google Apps Script (REST API), Google Sheets, Google Drive

## 🚀 Setup Instructions for the Backend

To deploy this project yourself, you need to set up the Google Sheets backend:

1. Create a new Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Copy the code from `google_apps_script.js` (or the latest provided artifact) and paste it into the script editor.
4. Click **Deploy > New deployment**.
5. Select type: **Web app**.
6. Execute as: **Me**.
7. Who has access: **Anyone**.
8. Click **Deploy** and authorize the permissions.
9. Copy the generated **Web App URL** and paste it into `src/config.js` as the `SCRIPT_URL`.

*(Note: Whenever you update the Apps Script code, you must go to **Manage deployments**, edit the deployment, and select **New version** to apply changes.)*

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Deployment
The frontend is optimized and ready to be deployed instantly on platforms like **Vercel**, **Netlify**, or **GitHub Pages**.

---
*Built for Udupu.*
