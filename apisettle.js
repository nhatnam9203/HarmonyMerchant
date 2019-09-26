GET
https://api2.levincidemo.com/api//waiting

--return data -- 
"data": {
        "settlementId": 0,
        "paymentByHarmony": 47528.0,
        "paymentByCreditCard": 0.0,
        "paymentByCash": 3162.0,
        "otherPayment": 0.0,
        "total": 50690.0,
        "note": null,
        "settlementDate": "2019-09-06T23:46:56.514666",
        "checkouts": null,
        "merchantId": 0,
        "checkout": [
            633,
            632,
            612,
            544,
            432,
            412,
            411,
            410,
            405
        ],
        "settlementStaff": [
            {
                "staffId": 168,
                "name": "Asdfghjk",
                "totalAmount": 6229.0
            },
            {
                "staffId": 186,
                "name": "Anna",
                "totalAmount": 3667.0
            },
            {
                "staffId": 166,
                "name": "Al",
                "totalAmount": 11307.0
            },
            {
                "staffId": 185,
                "name": "Lulu",
                "totalAmount": 11003.0
            }
        ]
		
		
		
GET
https://api2.levincidemo.com/api/settlement/checkoutbystaff/186

--return data -- 
"data": [
        {
            "checkoutId": 632,
            "status": "pending",
            "customerName": "Aa Bb",
            "date": "yesterday",
            "time": "02:38 PM"
        },
        {
            "checkoutId": 410,
            "status": "pending",
            "customerName": "Luc Nguyen",
            "date": "8/7/2019",
            "time": "11:15 AM"
        }]
		
		
POST
https://api2.levincidemo.com/api/settlement/
{
	"paymentByHarmony": 47528.0,
    "paymentByCreditCard": 0.0,
    "paymentByCash": 3162.0,
    "otherPayment": 0.0,
    "total": 50690.0,
    "note": "test thu thoi",
    "checkout": [
        633,
        632,
        612,
        544,
        432,
        412,
        411,
        410,
        405,
        383
    ]
}

GET
https://localhost:44339/api/settlement/search?from=2019-09-01&to=2019-09-30&key