const router = require("express").Router()
const multer = require("multer")
const { uploadFile } = require("../config/s3")

const upload = multer({ dest: "uploads/" })

router.post("/upload", upload.single("image"), async (req, res) => {
    const file = req.file
    const result = await uploadFile(file)

    const dscription = req.body.dscription
    res.send("🤪")
})


module.exports = router