// app/api/subscription/route.ts

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// IMPORTANT: This route requires a SEPARATE Sheet ID or a different sheet name (tab)
// than your contact form, but it uses the SAME GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY
// environment variables you already set up on Vercel.

// If you want to use a completely different sheet ID, you must set a new env variable 
// like SUBSCRIPTION_SHEET_ID and use it here. 
// For simplicity, we assume you are using the same GOOGLE_SHEET_ID but a different tab name.

const SUBSCRIPTION_SHEET_NAME = 'Sheet1'; // Default tab name for the new sheet

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
  
  try {
    const { email } = await req.json();

    // 1. Validate Environment Variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.SUBSCRIPTION_SHEET_ID;
    const tabName = process.env.SUBSCRIPTION_TAB_NAME || 'New_VL_Free_Subscription';

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error('Missing Environment Variables:', {
        GOOGLE_CLIENT_EMAIL: !!clientEmail,
        GOOGLE_PRIVATE_KEY: !!privateKey,
        SUBSCRIPTION_SHEET_ID: !!spreadsheetId,
        SUBSCRIPTION_TAB_NAME: !!tabName
      });
      return NextResponse.json({ 
        success: false, 
        message: 'Server configuration error. Missing API credentials.' 
      }, { status: 500 });
    }

    // 2. Authenticate
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    // 3. Define the data to be written
    const values = [
      [
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), // Timestamp
        email, // Email Address
      ],
    ];
    
    // 4. Write to the Google Sheet
    try {
      const range = tabName.includes(' ') ? `'${tabName}'!A:B` : `${tabName}!A:B`;
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      return NextResponse.json({ 
          success: true, 
          rowsAppended: response.data.updates?.updatedRows 
      }, { status: 200 });
    } catch (sheetError: any) {
      console.error('Google Sheets Error:', {
        message: sheetError.message,
        code: sheetError.code,
        tabName,
        spreadsheetId
      });
      
      if (sheetError.code === 404) {
        return NextResponse.json({ 
          success: false, 
          message: `Sheet or Tab not found. Please verify: 1) Spreadsheet ID is correct. 2) Tab name "${tabName}" exists in the spreadsheet.` 
        }, { status: 404 });
      }

      throw sheetError;
    }

  } catch (error: any) {
    console.error('Subscription API Error:', error);
    return NextResponse.json({ 
        success: false, 
        message: error.message || 'Failed to log subscription data.' 
    }, { status: 500 });
  }
}

