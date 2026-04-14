// app/api/contact/route.ts

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const { name, email, enquiryType, message } = await req.json();

    // 1. Validate Environment Variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.CONTACT_SHEET_ID;
    const tabName = process.env.CONTACT_TAB_NAME || 'New_VL_Contact_US_Submission';

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error('Missing Environment Variables:', {
        GOOGLE_CLIENT_EMAIL: !!clientEmail,
        GOOGLE_PRIVATE_KEY: !!privateKey,
        CONTACT_SHEET_ID: !!spreadsheetId,
        CONTACT_TAB_NAME: !!tabName
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
        name,
        email,
        enquiryType,
        message,
      ],
    ];

    // 4. Write to the Google Sheet
    try {
      // Use quotes only if needed, but for robust range parsing 'Tab Name'!A:E is standard.
      // The error "Unable to parse range" usually means the Tab Name is incorrect.
      const range = tabName.includes(' ') ? `'${tabName}'!A:E` : `${tabName}!A:E`;
      
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
      
      // Handle the 404 error specifically
      if (sheetError.code === 404) {
        return NextResponse.json({ 
          success: false, 
          message: `Sheet or Tab not found. Please verify: 1) Spreadsheet ID is correct. 2) Tab name "${tabName}" exists in the spreadsheet.` 
        }, { status: 404 });
      }

      throw sheetError; // Re-throw to be caught by the outer block
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ 
        success: false, 
        message: error.message || 'Failed to submit form.' 
    }, { status: 500 });
  }
}

