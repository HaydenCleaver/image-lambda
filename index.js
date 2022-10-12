const AWS = require('aws-sdk');
const S3 = new AWS.S3();


exports.handler = async (event) => {
    
    let bucket = event.Records[0].s3.bucket.name;
    let key = 'images.json';
    
    let images = await S3.getObject({Bucket: bucket, Key: key}).promise();
    
    if(images){
        let stringifiedImages = images.Body.toString();
        let parsedImages = JSON.parse(stringifiedImages);
        
        let data = {
            imgName: event.Records[0].s3.object.name,
            imgSize: event.Records[0].s3.object.size,
            imgType: event.Records[0].s3.object.type,
        }
        
        let newImages = {...images, data}
        
        stringifiedImages = newImages.Body.toString();
        parsedImages = JSON.parse(stringifiedImages);
        console.log('---------------', parsedImages, '------------');
        
        await S3.putObject({Bucket: bucket, Key: key, Body: JSON.stringify(newImages)}).promise();
        
    } else {
        images = [];
        let data = {
            imgName: event.Records[0].s3.object.name,
            imgSize: event.Records[0].s3.object.size,
            imgType: event.Records[0].s3.object.type,
        }
        images.push(data);
        
        console.log('-------------', images , '--------------------');
        await S3.putObject({Bucket: bucket, Key: key, Body: JSON.stringify(images)}).promise();
    }
   
    let stringifiedImages = images.Body.toString();
    let parsedImages = JSON.parse(stringifiedImages);
    
    console.log('-------------', parsedImages , '----------------');
    
};