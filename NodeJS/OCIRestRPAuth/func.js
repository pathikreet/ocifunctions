const fdk = require('@fnproject/fdk');
const validUrl = require('valid-url');
const fs = require('fs')
const ro = require('./readObject')

fdk.handle(async (input) => {

    //Get RPST from Running container
    // const rpst = fs.readFileSync(process.env.OCI_RESOURCE_PRINCIPAL_RPST, { encoding: 'utf8' })
    // const payload = rpst.split('.')[1]
    // const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii')
    // const claims = JSON.parse(payloadDecoded)
    // return {
    //     'pem-file': process.env.OCI_RESOURCE_PRINCIPAL_PRIVATE_PEM
    //     , 'rpst-file': process.env.OCI_RESOURCE_PRINCIPAL_RPST
    //     , 'rpst-claims': claims
    // }

    const r = await ro.readObject(input.namespace, input.bucketName, input.fileName)
    return {
        'fileContents': r
    }
})

/**
 * Function to check whether an object is empty
 * @param {*} obj object to validate
 * @returns true if obj is empty, otherwise false
 */
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
