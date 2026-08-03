# 👘 Saree Godown Inventory Management

A sleek, premium, and lightning-fast inventory management system designed specifically for tracking saree stock, sales, and analytics. 

Built with React (Vite) and powered by a completely free **Google Sheets + Google Drive + Apps Script** backend.

## ✨ Key Features

- **📱 Mobile First & Premium UI:** Beautiful glassmorphic design that works flawlessly on mobile devices and desktops.
- **📸 Smart Image Handling:** 
  - Compress images instantly on the client side to save data.
  - Distinct "Take Photo" and "Gallery" buttons for seamless mobile uploading.
  - Uploads securely straight to your Google Drive.
  - **Auto-Cleanup:** Deleting a saree automatically sends its image to the Google Drive trash.
- **📦 Advanced Inventory & Quantity Tracking:** 
  - Add quantities for bulk stock (e.g., 10 pieces of a model).
  - **Partial Sales:** Sell 2 pieces today, 3 pieces tomorrow. The app automatically tracks remaining stock and updates statuses to `Available`, `Partial`, or `Sold`.
- **💰 Financial Analytics Dashboard:** 
  - Real-time calculations of your **Total Inventory Value**.
  - Track **Revenue** from sold items.
  - Automatically calculates **Profit / Loss** margins when you input a custom sold price.
- **📜 Full Sales History & Undo:** 
  - Every single sale is logged with timestamps and quantities in a dedicated Sales History tab.
  - Made a mistake? Click **Undo Sale**, write a quick comment, and the inventory quantities and revenue are instantly restored.
- **☁️ 100% Free Cloud Database:** 
  - Bypasses expensive databases (like Firebase) by using Google Sheets as a JSON REST API. 
  - Highly resistant to ISP blocking and 100% free forever.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, CSS (Glassmorphism design)
- **Icons & Charts:** Lucide React, Recharts
- **Image Compression:** `browser-image-compression`
- **Backend/Database:** Google Apps Script (REST API), Google Sheets, Google Drive

## 🚀 Setup Instructions for the Backend

To deploy this project yourself, you need to set up the Google Sheets backend:

1. Create a new Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Copy the code from the latest `google_apps_script.js` provided in this project and paste it into the script editor.
4. Click **Deploy > New deployment**.
5. Select type: **Web app**.
6. Execute as: **Me**.
7. Who has access: **Anyone**.
8. Click **Deploy** and authorize the permissions.
9. Copy the generated **Web App URL** and paste it into `src/config.js` as the `SCRIPT_URL`.

*(Note: Whenever you update the Apps Script code, you must go to **Manage deployments**, edit the deployment, and select **New version**.)*

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Deployment
The frontend is optimized and ready to be deployed instantly on platforms like **Vercel**, **Netlify**, or **GitHub Pages**.
