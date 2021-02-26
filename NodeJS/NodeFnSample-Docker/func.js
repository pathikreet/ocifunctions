const fdk = require('@fnproject/fdk');

fdk.handle(async (input) => {
    let name = "World";

    if(input && input.name){
        name = input.name;
    }
    
    return {
        'response': "Hello "+ name,
        'currentTime': currentDateTime()
    }
})

/**
 * Function to get the current DateTime
 * @returns current Date
 */
function currentDateTime() {
    return new Date();
}
