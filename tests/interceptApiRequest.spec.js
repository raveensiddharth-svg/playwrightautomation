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

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*", route=>
        {
            route.continue({url:"https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6a565ec885b8849b49e99bed"});
        }
    );
    await page.locator("button[routerlink*='myorders']").click();
    await page.getByRole("button",{name:'View'}).first().click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*");
    await expect(page.locator("p.blink_me")).toHaveText("You are not authorize to view this order");  
})
