const express = require('express');
const app = express();
const fileupload = require("express-fileupload");
const cors = require('cors');
const obj2gltf = require("obj2gltf");
const fs = require("fs");
const options = {
  binary: true,
};

app.use(express.json()); //parses the incoming request body for data
app.use(fileupload());
app.use(express.static("files"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000']
}));

app.post("/upload", (req, res) => {
  console.log('started to upload the file.....');
  const newpath = '/Users/codingblocks/desktop/file-upload-app/frontend/public/files/';
  const serverPath = __dirname + '/files/';  
  const file = req.files.file;
  const filename = file.name;
  file.mv(`${serverPath}${filename}`, (err) => {
    if (err) {
      return res.status(500).send({ message: "File upload failed", code: 200 });
    }
    obj2gltf(`${serverPath}${filename}`, options)
      .then(function (glb) {
        fs.writeFileSync(`${newpath}${filename.split('.')[0]}.glb`, glb);
        return res.status(200).send({ message: "File Uploaded", code: 200 });
      })
      .catch((err) => {
        console.log('something went wrong.....');
        return res.status(500).send({ message: "File upload failed", code: 200 });
      });
  });
});
   

app.listen(8000, () => {
    console.log('server started listening at port 8000');
});