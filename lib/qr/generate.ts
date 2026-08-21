import QRCode from "qrcode";

export async function generateQrDataUrl(content: string): Promise<string> {
  return QRCode.toDataURL(content, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 400,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
}
