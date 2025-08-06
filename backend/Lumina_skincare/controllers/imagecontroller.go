package controllers

import (
	"fmt"
	"lumina_skincare/config"
	"lumina_skincare/helpers"
	"lumina_skincare/models"
	"lumina_skincare/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetImages mengambil semua gambar dari database
func GetImages(c *gin.Context) {
	var images []models.Image
	if err := config.DB.Find(&images).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Debug: Print data sebelum dikirim ke JSON
	for _, image := range images {
		fmt.Printf("Dari DB -> Image ID: %d, User ID: %d, Image URL: %s\n", image.ImageID, image.UserID, image.ImageURL)
	}

	c.JSON(http.StatusOK, images)
}

// GetImageByID mengambil gambar berdasarkan ID
func GetImageByID(c *gin.Context) {
	var image models.Image
	id := c.Param("id")

	if err := config.DB.First(&image, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}
	c.JSON(http.StatusOK, image)
}

func SaveImageMetadata(c *gin.Context) {
	var image models.Image
	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simpan metadata gambar ke database
	if err := config.DB.Create(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Image metadata saved", "data": image})
}

// UploadImage menambahkan gambar baru ke database
func UploadImageHandler(c *gin.Context) {

	// 🔹 Ambil user dari token
	user, err := helpers.GetUserFromToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("User ID from token:", user.UserID)

	// Ambil file gambar dari request
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
		return
	}

	// Buka file sebelum dikirim ke Cloudinary
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	// Upload ke Cloudinary
	imageURL, err := services.UploadImageToCloudinary(src, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
		return
	}

	fmt.Println("✅ Uploaded Image URL:", imageURL)
	// Kirim hasil ke user
	analysisResult, err := services.AnalyzeFace(imageURL)
	if err != nil {
		fmt.Println("❌ Error saat analisis wajah:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze face"})
		return
	}

	// Kirim hasil analisis ke Gemini untuk rekomendasi skincare
	recommendation, err := services.GetSkincareRecommendationFromGemini(analysisResult)
	if err != nil {
		fmt.Println("❌ Error saat mengambil rekomendasi skincare:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get skincare recommendation"})
		return
	}

	fmt.Println("✅ Skincare Recommendation:", recommendation)

	// 🔹 Simpan data image ke DB
	image := models.Image{
		UserID:     user.UserID,
		ImageURL:   imageURL,
		UploadedAt: time.Now(),
	}
	if err := config.DB.Create(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image to database"})
		return
	}

	// 🔹 Simpan hasil analisis ke DB
	analysis := models.Analysis{
		ImageID:    image.ImageID,
		Result:     fmt.Sprintf("%v", analysisResult),
		AnalyzedAt: time.Now(),
	}
	if err := config.DB.Create(&analysis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save analysis to database"})
		return
	}

	// 🔹 Simpan rekomendasi skincare ke DB
	var savedRecommendations []models.SkincareRecommendation
	for _, rec := range recommendation {
		recModel := models.SkincareRecommendation{
			AnalysisID:    analysis.AnalysisID,
			Skincare_name: rec.SkincareName,
			Skincare_type: rec.SkincareType,
			Description:   rec.Description,
		}
		if err := config.DB.Create(&recModel).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save recommendation to database"})
			return
		}
		savedRecommendations = append(savedRecommendations, recModel)
	}

	fmt.Println("✅ Skincare Recommendation saved to DB")

	// 🔹 Simpan ke tabel history (gunakan rekomendasi pertama sebagai referensi)
	if len(savedRecommendations) > 0 {
		history := models.History{
			UserID:           user.UserID,
			ImageID:          image.ImageID,
			AnalysisID:       analysis.AnalysisID,
			RecommendationID: savedRecommendations[0].RecommendationID,
		}
		if err := config.DB.Create(&history).Error; err != nil {
			fmt.Println("❌ Gagal simpan History:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save history to database"})
			return
		}
		fmt.Println("✅ History berhasil disimpan")
	}

	fmt.Println("✅ UserID:", user.UserID)
	fmt.Println("✅ ImageID:", image.ImageID)
	fmt.Println("✅ AnalysisID:", analysis.AnalysisID)

	// Kirim hasil rekomendasi skincare ke user
	c.JSON(http.StatusOK, gin.H{
		"message":        "Skincare recommendation generated successfully",
		"recommendation": recommendation,
	})
}

// UpdateImage memperbarui data gambar berdasarkan ID
func UpdateImage(c *gin.Context) {
	var image models.Image
	id := c.Param("id")

	if err := config.DB.First(&image, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Save(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, image)
}

// DeleteImage menghapus gambar berdasarkan ID
func DeleteImage(c *gin.Context) {
	var image models.Image
	id := c.Param("id")

	if err := config.DB.First(&image, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	if err := config.DB.Delete(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}
