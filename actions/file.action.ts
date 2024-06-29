import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !bucketName || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing required AWS configuration");
}

const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export async function uploadFileToS3(file: Buffer, fileName: any) {
    try {
        const fileBuffer = file;
        const params: any = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${fileName}`,
            Body: fileBuffer,
            ContentType: "image/jpg",
            ACL: 'public-read'
        }

        const command = new PutObjectCommand(params);
        const response = await s3.send(command);

        const asset = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return { response, asset };

    } catch (error) {
        console.error(error)
    }

}