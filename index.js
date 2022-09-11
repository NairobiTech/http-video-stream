const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/pages/index.html");
});

app.get("/baseruns", function (req, res) {
  res.json([
    {
      slug: "django-crash-course",
      frontmatter: {
        title: "Django Crash Course",
        date: "March 5, 2021",
        excerpt:
          "Django is a very powerful, high level Python framework for building web applications",
        cover_image: "/images/posts/img3.jpg",
        video: "bigbuck.mp4",
      },
    },
  ]);
});

app.get("/baserun", function (req, res) {
  res.json({
    slug: "django-crash-course",
    frontmatter: {
      title: "Django Crash Course",
      date: "March 5, 2021",
      excerpt:
        "Django is a very powerful, high level Python framework for building web applications",
      cover_image: "/images/posts/img3.jpg",
      video: "http://localhost:8000/video?v=bigbuck.mp4",
    },
    content: "Lorem markdownum fine incustoditam unda factura versum occuluere Aeneas",
  });
});

app.get("/video", function (req, res) {
  const video = req.query.v;
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const baseVideoPath = "static/videos/";
  const videoPath = baseVideoPath + video;
  const videoSize = fs.statSync(videoPath).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});
