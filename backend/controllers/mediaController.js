const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: "chatgram"
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);

                    return res.status(500).json({
                        message: "File upload failed"
                    });
                }

                return res.status(200).json({
                    message: "File uploaded successfully",
                    mediaUrl: result.secure_url,
                    resourceType: result.resource_type
                });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (error) {
        console.error("Upload error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    uploadMedia
};