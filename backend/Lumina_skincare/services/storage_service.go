package services

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/joho/godotenv"
)

func init() {
    godotenv.Load() // Ini akan membaca file .env
	fmt.Println("ENV Loaded")
}
// UploadImageToCloudinary mengupload gambar ke Cloudinary
func UploadImageToCloudinary(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	// Debugging: Cek env variabel
	fmt.Println("Cloudinary Cloud Name:", os.Getenv("CLOUDINARY_CLOUD_NAME"))
	fmt.Println("Cloudinary API Key:", os.Getenv("CLOUDINARY_API_KEY"))
	fmt.Println("Cloudinary API Secret:", os.Getenv("CLOUDINARY_API_SECRET"))

	// Inisialisasi Cloudinary
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if err != nil {
		return "", fmt.Errorf("failed to initialize Cloudinary: %v", err)
	}

	// Upload gambar ke Cloudinary
	uploadResult, err := cld.Upload.Upload(context.TODO(), file, uploader.UploadParams{
		Folder:   "lumina_skincare",
		PublicID: fileHeader.Filename,
	})
	if err != nil {
		fmt.Printf("Upload error: %v\n", err) // Debugging jika gagal upload
		return "", fmt.Errorf("failed to upload image: %v", err)
	}

	// Return URL gambar dari Cloudinary
	return uploadResult.SecureURL, nil
}

