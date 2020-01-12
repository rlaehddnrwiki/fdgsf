const puppeteer = require('puppeteer');

let login_button = document.getElementById("login")
let alarm = document.getElementById("alarm")


login_button.addEventListener("click", () => {
    login_button.disabled = true
    alarm.textContent = "지우는중... 프로그램을 종료하면 작동 중지합니다."
    let id = document.getElementById("id").value
    console.log(id)
    let pw = document.getElementById("pw").value
    console.log(pw)
    start(id, pw)
})

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
        } else {
            alarm.textContent = dialog.message()
            login_button.disabled = false
            await browser.close();
        } 

    });
    await page.goto('https://www.dcinside.com/');
    await page.type("#user_id", id)
    await page.type("#pw", pw)
    await page.click("#login_ok")
    await page.waitForNavigation()

    await page.goto(`https://gallog.dcinside.com/${id}/posting`);
    var delete_button = "#container > article > div > section > div > div > ul > li:nth-child(1) > div > div > button"
    while (await page.$(delete_button) !== null) {
        await page.click(delete_button)
        await page.waitForNavigation()
    }
    delete_button = "#container > article > div > section > div > div > ul > li > div > div > button"
    await page.goto(`https://gallog.dcinside.com/${id}/comment`);
    while (await page.$(delete_button) !== null) {
        await page.click(delete_button)
        await page.waitForNavigation()
    }
    alarm.textContent = "다 지움 ! 수고하셨습니다. 이제 다 지워졌으니 "
    login_button.disabled = false
    //await browser.close();
};