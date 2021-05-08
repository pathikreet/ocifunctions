const fdk = require('@fnproject/fdk');
const httpRequest = require('https');

fdk.handle(async (input, ctx) => {
    let hctx = ctx.httpGateway;
    let data = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    };

    try {
        // Call ThirdParty API
        console.log('Calling Third Party API');
        const apiRes = await callThirdParty(data, "https://jsonplaceholder.typicode.com/posts", "GET");

        //Set "Fn-Http-Status" as a custom HTTP response header
        hctx.statusCode = apiRes.status;
        return apiRes.payload;
    } catch (error) {
        console.log('Promise Rejected Reason :: ', error);
        //Set "Fn-Http-Status" Code as a response header
        hctx.statusCode = 500;
        return {
            'Errors': {
                'Error': [
                    {
                        'ReasonCode': 'ORACLE-FN_INTERNAL_ERR',
                        'Description': error.stack
                    }
                ]
            }
        };
    }
});

async function callThirdParty(payload, uri, httpMethod) {
    return new Promise(function (resolve, reject) {
        let responseData = '';

        var requestHeaders = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        };

        const options = {
            method: httpMethod,
            headers: requestHeaders
        };

        const request = httpRequest.request(uri, options, response => {
            console.log('Status : ', response.statusCode);
            //console.log('Headers : ', response.headers);
            response.on('data', dataChunk => {
                responseData += dataChunk;
            });

            response.on('end', () => {
                //console.log('Response :: ', responseData);
                try {
                    var apiResponse = {
                        'status': response.statusCode,
                        'headers': response.headers,
                        'payload': JSON.parse(responseData)
                    };
                    resolve(apiResponse);
                } catch (error) {
                    //Handle all Non JSON responses returned for HTTP 5xx 
                    var errorResponse = {
                        'status': response.statusCode,
                        'error': error,
                        'payload': responseData
                    };
                    reject(errorResponse);
                }

            });
        });

        request.on('error', error => {
            console.log('ERROR :: ', error);
            reject(error);
        });

        request.write(JSON.stringify(payload));
        request.end();
    });
};
