import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { Alert } from "react-native";

interface InvoiceDataInterface {
  clientName: string;
  phoneNumber: string;
  reference: string;
  invoiceDate: string;
  bankName: string;
  acctName: string;
  acctNumber: string;
  items: Array<{
    description: string;
    unitPrice: string;
    VAT: number;
    total: string;
  }>;
}

export const generateInvoiceHTML = async (
  invoiceData: InvoiceDataInterface
) => {
  // get logo base64

  try {
    const logoAsset = Asset.fromModule(require("@/assets/images/lataLogo.png"));
    await logoAsset.downloadAsync();

    const base64Image = await FileSystem.readAsStringAsync(
      logoAsset.localUri!,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Lata Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 100px;
        }
        .invoice-title {
            font-size: 24px;
            margin: 0;
            color: #333;
        }
        .invoice-number {
            color: #666;
            margin: 5px 0;
        }
        .grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-group {
            margin-bottom: 20px;
        }
        .info-group h3 {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        .info-group p {
            margin: 5px 0;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #5113a1;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        .total-section {
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        .total-label {
            color: #666;
        }
        .total-amount {
            font-weight: bold;
        }
        .payment-note {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            font-size: 14px;
        }
        .contact-info {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="invoice-header">
        <div>
            <h1 class="invoice-title">INVOICE</h1>
            <p class="invoice-number">No: ${invoiceData.reference}</p>
        </div>
        <img src="data:image/png;base64,${base64Image}" class="logo" alt="Lata Logo">
    </div>

    <div class="grid-container">
        <div class="info-group">
            <h3>Bill to:</h3>
            <p>Client name: ${invoiceData.clientName}</p>
            <p>Phone number: ${invoiceData.phoneNumber}</p>
            <p>Payment ID: ${invoiceData.reference}</p>
        </div>
        <div class="info-group">
            <h3>Bank name: ${invoiceData.bankName}</h3>
            <p>Account name: ${invoiceData.acctName}</p>
            <p>Account number: ${invoiceData.acctNumber}</p>
        </div>
        <div class="info-group">
            <h3>Invoice date:</h3>
            <p>${invoiceData.invoiceDate}</p>
        </div>
        <div class="info-group">
            <h3>Due date:</h3>
            <p>${invoiceData.invoiceDate}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Unit price</th>
                <th>VAT %</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${invoiceData.items
              .map(
                (item) => `
                <tr>
                    <td>${item.description}</td>
                    <td>₦${item.unitPrice}</td>
                    <td>${item.VAT}%</td>
                    <td>₦${item.total}</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
    </table>

    <div class="total-section">
        <div class="total-row">
            <span class="total-label">Total excluding VAT</span>
            <span class="total-amount">₦${
              Number(invoiceData.items[0].unitPrice) -
              Number(invoiceData.items[1].unitPrice)
            }</span>
        </div>
        <div class="total-row">
            <span class="total-label">VAT 7.5%</span>
            <span class="total-amount">₦${
              Number(invoiceData.items[0].total) -
              Number(invoiceData.items[0].unitPrice)
            }</span>
        </div>
        <div class="total-row">
            <span class="total-label">Total amount due</span>
            <span class="total-amount">₦${
              Number(invoiceData.items[0].unitPrice) -
              Number(invoiceData.items[1].unitPrice) +
              (Number(invoiceData.items[0].total) -
                Number(invoiceData.items[0].unitPrice))
            }</span>
        </div>
    </div>

    <div class="payment-note">
        *Use your Payment ID as the narration on your bank transfer. Check the top of invoice to find your Payment ID
    </div>

    <div class="contact-info">
        <p>Contact Lata</p>
        <p>No 14, Palace Estate, Off Bola Street, Lagos | info@lata.ng | +234808934565</p>
    </div>
</body>
</html>
`;
    const htmlUri = `${FileSystem.documentDirectory}invoice-${invoiceData.reference}.html`;

    await FileSystem.writeAsStringAsync(htmlUri, invoiceHTML, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailableAsync = await Sharing.isAvailableAsync();
    if (isAvailableAsync) {
      await Sharing.shareAsync(htmlUri, {
        mimeType: "text/html",
        dialogTitle: "Download Subscription Invoice",
        UTI: "public.html",
      });

      return htmlUri;
    } else {
      Alert.alert("Failed to download invoice");
    }
  } catch (error) {
    Alert.alert("Catch Error: Failed to download file");
  }
};
