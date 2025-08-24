import fs from 'fs';
import path from 'path';

// Reusable video streaming function
function streamVideoWithTracking(req:any, res:any, options = {}) {
  const { folderPath, triggerSeconds = 5, contentType = 'video/mp4' }:any = options;
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const fileStream = fs.createReadStream(filePath);
  let totalBytesSent = 0;
  let startTime = Date.now();

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  // Track streaming progress
  fileStream.on('data', (chunk) => {
    totalBytesSent += chunk.length;

    const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
    if (elapsedTimeInSeconds >= triggerSeconds) {
      console.log(
        `${triggerSeconds} seconds streamed: ${totalBytesSent} bytes`,
      );
      startTime = Date.now(); // reset
    }
  });

  // Handle errors
  fileStream.on('error', (err) => {
    console.error('Error streaming file:', err);
    res.status(500).send('Error streaming video');
  });

  fileStream.on('end', () => {
    console.log('File streaming completed.');
  });

  fileStream.pipe(res);
}

export default streamVideoWithTracking;


// app.get('/stream/video/:filename', (req, res) => {
//   streamVideoWithTracking(req, res, {
//     folderPath: path.join(__dirname, 'videos'),
//     triggerSeconds: 5,
//   });
// });