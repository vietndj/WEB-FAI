const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');

async function run() {
    const urls = [
        { name: "Trang_chu", url: "http://localhost:3001/" },
        { name: "Aptech_1_nam", url: "http://localhost:3001/dao-tao/aptech/1-nam" },
        { name: "Aptech_6_thang", url: "http://localhost:3001/dao-tao/aptech/6-thang" },
        { name: "Aptech_Ngan_han", url: "http://localhost:3001/dao-tao/aptech/100-200h" },
        { name: "Arena_AMSP", url: "http://localhost:3001/dao-tao/arena/amsp" },
        { name: "Arena_6_18_thang", url: "http://localhost:3001/dao-tao/arena/6-18-thang" },
        { name: "Arena_100H", url: "http://localhost:3001/dao-tao/arena/100h" },
        { name: "Skillking_18_thang", url: "http://localhost:3001/dao-tao/skillking/18-thang" }
    ];

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1080 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('17.9 Nghiệm thu');

    sheet.columns = [
        { header: 'STT', key: 'stt', width: 5 },
        { header: 'Trang', key: 'trang', width: 20 },
        { header: 'URL', key: 'url', width: 40 },
        { header: 'Trạng thái', key: 'status', width: 25 },
        { header: 'Ảnh chụp', key: 'anh', width: 40 }
    ];

    let row = 2;
    for (let i = 0; i < urls.length; i++) {
        const item = urls[i];
        console.log("Capturing", item.name);
        try {
            await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait for images
            const path = `${item.name}.png`;
            await page.screenshot({ path: path, fullPage: true });

            sheet.addRow({ stt: i + 1, trang: item.name, url: item.url, status: "ĐÃ NGHIỆM THU ĐẠT 100%" });
            sheet.getRow(row).height = 150;
            
            const imageId = workbook.addImage({
                filename: path,
                extension: 'png',
            });
            sheet.addImage(imageId, {
                tl: { col: 4, row: row - 1 },
                ext: { width: 250, height: 180 }
            });
        } catch (e) {
            console.error("Error with", item.url, e);
            sheet.addRow({ stt: i + 1, trang: item.name, url: item.url, status: "LỖI" });
        }
        row++;
    }

    await browser.close();
    await workbook.xlsx.writeFile('17.9_nghiem_thu_final.xlsx');
    console.log("Excel generated!");
}

run();
