const bwipjs = require("bwip-js");
const { uploadToS3 } = require("./s3Services");

async function generateAndUploadBarcode(barcodeValue) {
    const buffer = await bwipjs.toBuffer({
        bcid: "code128",
        text: barcodeValue,
        scale: 3,
        height: 10,
        includetext: true
    });

    const filePath = `app_assets/products/barcodes/${barcodeValue}.png`;

    const cdnUrl = await uploadToS3(buffer, filePath, "image/png");

    return {
        barcodeValue,
        filePath,
        cdnUrl
    };
}

module.exports = { generateAndUploadBarcode };
