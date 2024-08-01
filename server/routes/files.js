const router = require("express").Router();
const Post = require("../models/Post");
const verify = require("../verifyToken");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const officegen = require("officegen");
const path = require("path");
const fs = require("fs");
// Export posts to CSV
router.get("/excel", verify, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id });

    const csvWriter = createCsvWriter({
      path: "posts.csv",
      header: [
        { id: "title", title: "Title" },
        { id: "content", title: "Content" },
      ],
    });

    const data = posts.map((post) => ({
      title: post.title,
      content: post.content,
    }));

    await csvWriter.writeRecords(data);

    const filePath = path.join(__dirname, "..", "posts.csv");
    res.setHeader("Content-Disposition", "attachment; filename=posts.csv");
    res.setHeader("Content-Type", "text/csv");

    fs.createReadStream(filePath)
      .pipe(res)
      .on("finish", () => {
        fs.unlinkSync(filePath); // Clean up the file after sending it
      });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while generating the CSV file" });
  }
});

// Export posts to Word
router.get("/word", verify, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id });
    const doc = officegen("docx");

    posts.forEach((post) => {
      const pObj = doc.createP();
      pObj.addText(post.title, { bold: true, font_size: 24 });
      pObj.addLineBreak();
      pObj.addText(post.content);
      doc.putPageBreak();
    });

    res.setHeader("Content-Disposition", "attachment; filename=posts.docx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    doc.generate(res);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while generating the Word file" });
  }
});

module.exports = router;
