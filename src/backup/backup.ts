// import fs from "fs";

// import {
//   S3Client,
//   PutObjectCommand,
// } from "@aws-sdk/client-s3";

// const s3 = new S3Client({
//   region: proce@aws-sdk/client-s3ss.env.AWS_REGION,
// });

// export async function uploadFileToS3(
//   filePath: string,
//   bucket: string,
//   key: string
// ) {
//   const command = new PutObjectCommand({
//     Bucket: bucket,
//     Key: key,
//     Body: fs.createReadStream(filePath),
//   });

//   await s3.send(command);
// }