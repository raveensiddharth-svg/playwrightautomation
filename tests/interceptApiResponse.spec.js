const {test, expect, request} = require("@playwright/test");

const loginRequestPayload = {
    userEmail: "raveen.siddharth@gmail.com",
    userPassword: "Welcome@123"
}

const createOrderPayload = {
    orders: [
        {
            country: "Cambodia",
            productOrderedId: "6960eae1c941646b7a8b3ed3"
        }
    ]
}

const getOrdersExpResponse = { data: [], message: "No Orders" };

let token;
let idOrder;

test.beforeAll(async ()=> 
{
    //Hit the login api to get the token
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
        {
            data : loginRequestPayload
        }
    );
    console.log("The response status code is "  + await loginResponse.status());
    expect(await loginResponse.status() === 200).toBeTruthy();

    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log("The token is " + token);

    //Hit the create order api to place an order
    const createOrderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
        {
            data : createOrderPayload,
            headers : {
                'Authorization' : token,
                'Content-Type' : 'application/json'
            }
        }
    );
    expect(await createOrderResponse.status() === 201).toBeTruthy();

    const createOrderResponseJson = await createOrderResponse.json();
    idOrder = createOrderResponseJson.orders[0];
    console.log("The order id from api is " + idOrder);
})

test('Login to Client app and fetch all the product names', async ({page})=>
{

    page.addInitScript(value => {
        window.localStorage.setItem('token',value)
    }, token);

    await page.goto("https://rahulshettyacademy.com/client");

    console.log("The page title is " + await page.title());
    await expect(page).toHaveTitle("Let's Shop");

    //Intercept the network api calls and alter the response

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6a467c50cd73adf7e58cee84", 
        async route =>
        {
            const actResponse = await page.request.fetch(route.request());
            let body = JSON.stringify(getOrdersExpResponse);
            await route.fulfill(
                {
                    actResponse,
                    body
                }
            );

        }
    );

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6a467c50cd73adf7e58cee84");
    const zeroStateMsg = await page.locator(".mt-4").textContent();
    console.log("The zero state msg is " + zeroStateMsg);
    await expect(zeroStateMsg.includes("Visit")).toBeTruthy();
    
})
