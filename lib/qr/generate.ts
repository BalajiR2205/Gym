import QRCode from "qrcode";

export async function generateQrDataUrl(content: string): Promise<string> {
  return QRCode.toDataURL(content, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 480,
    color: {
      dark: "#171717",
      light: "#FFFFFF",
    },
  });
}
