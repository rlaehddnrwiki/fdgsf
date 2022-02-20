const puppeteer = require('puppeteer');

async function start(id, pw) {
    console.log(`아이디 ${id}`)
    console.log(`비밀번호 ${pw}`)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        if (dialog.message().includes("게시물을 삭제하시겠습니까?")) {
            console.log("게시물을 삭제하시겠습니까?")
            dialog.accept()
        }
    });
    await page.goto('https://www.dcinside.com/');
    await page.type("#user_id", id)
    await page.type("#pw", pw)
    await page.click("#login_ok")
    await page.waitForNavigation()

    await page.goto(`https://gallog.dcinside.com/${id}/posting`);
    var delete_button = "#container > article > div > div.wrap_right > section > div.gallog_cont.postings > div > ul > li > div > div > button"
    while (await page.$(delete_button) !== null) {
        await page.click(delete_button)
        await page.waitForNavigation()
        await page.waitForTimeout(2000)
    }
    delete_button = "#container > article > div > div.wrap_right > section > div.gallog_cont.comments > div > ul > li > div > div > button"
    await page.goto(`https://gallog.dcinside.com/${id}/comment`);
    while (await page.$(delete_button) !== null) {
        await page.click(delete_button)
        await page.waitForNavigation()
        await page.waitForTimeout(2000)
    }
    alarm.textContent = "다 지움 ! 수고하셨습니다. 이제 다 지워졌으니 "
};

start("아이디","패스워드")