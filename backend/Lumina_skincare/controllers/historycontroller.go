package controllers

import (
	"errors"
	"lumina_skincare/config"
	"lumina_skincare/helpers"
	"lumina_skincare/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetHistories mengambil semua data history dengan data relasinya
func GetHistories(c *gin.Context) {
	var histories []models.History

	if err := config.DB.
		Preload("User").                                       // Ambil User langsung (1x saja)
		Preload("Image.User").                                 // Pastikan Image juga ambil User
		Preload("Analysis.Image.User").                        // Ambil Analysis, Image, dan User di dalamnya
		Preload("SkincareRecommendation.Analysis.Image.User"). // Ambil semua hubungan sampai User
		Find(&histories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, histories)
}

// GetHistoryByID mengambil satu history berdasarkan ID
// GetHistoryByID - Mengambil data history berdasarkan ID dengan preload relasi
func GetHistoryByID(c *gin.Context) {
	id := c.Param("id")
	var history models.History

	// Ambil history berdasarkan ID dengan Preload semua relasi
	if err := config.DB.Preload("User").
		Preload("Image.User").                                 // Preload User di dalam Image
		Preload("Analysis.Image.User").                        // Preload Image dan User di dalam Analysis
		Preload("SkincareRecommendation.Analysis.Image.User"). // Preload semua relasi di dalam SkincareRecommendation
		First(&history, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "History not found"})
		return
	}

	c.JSON(http.StatusOK, history)
}

// CreateHistory menambahkan history baru
func CreateHistory(c *gin.Context) {
	var history models.History
	if err := c.ShouldBindJSON(&history); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simpan history ke database
	if err := config.DB.Create(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Ambil ulang history dengan relasi yang lengkap
	var fullHistory models.History
	if err := config.DB.
		Preload("User").
		Preload("Image.User").
		Preload("Analysis.Image.User").
		Preload("SkincareRecommendation.Analysis.Image.User").
		First(&fullHistory, history.HistoryID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, fullHistory)
}

// UpdateHistory memperbarui data history berdasarkan ID
func UpdateHistory(c *gin.Context) {
	id := c.Param("id")
	var history models.History

	// Cek apakah history ada
	if err := config.DB.First(&history, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "History not found"})
		return
	}

	var input models.History
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validasi FK sebelum update
	if err := validateForeignKeys(input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update hanya field yang boleh diubah
	updateData := map[string]interface{}{
		"user_id":           input.UserID,
		"image_id":          input.ImageID,
		"analysis_id":       input.AnalysisID,
		"recommendation_id": input.RecommendationID,
	}

	if err := config.DB.Model(&history).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Ambil ulang history yang sudah diperbarui dengan preload untuk mengisi relasi
	var updatedHistory models.History
	if err := config.DB.Preload("User").
		Preload("Image.User").
		Preload("Analysis.Image.User").
		Preload("SkincareRecommendation.Analysis.Image.User").
		First(&updatedHistory, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "History updated successfully", "data": updatedHistory})
}

// DeleteHistory menghapus history berdasarkan ID
func DeleteHistory(c *gin.Context) {
	id := c.Param("id")
	var history models.History

	// Cek apakah history ada
	if err := config.DB.First(&history, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "History not found"})
		return
	}

	// Hapus dari database
	if err := config.DB.Delete(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "History deleted successfully"})
}

func validateForeignKeys(history models.History) error {
	var count int64

	// Cek User
	if err := config.DB.Model(&models.User{}).Where("user_id = ?", history.UserID).Count(&count).Error; err != nil || count == 0 {
		return errors.New("invalid user_id")
	}

	// Cek Image
	if err := config.DB.Model(&models.Image{}).Where("image_id = ?", history.ImageID).Count(&count).Error; err != nil || count == 0 {
		return errors.New("invalid image_id")
	}

	// Cek Analysis
	if err := config.DB.Model(&models.Analysis{}).Where("analysis_id = ?", history.AnalysisID).Count(&count).Error; err != nil || count == 0 {
		return errors.New("invalid analysis_id")
	}

	// Cek SkincareRecommendation
	if err := config.DB.Model(&models.SkincareRecommendation{}).Where("recommendation_id = ?", history.RecommendationID).Count(&count).Error; err != nil || count == 0 {
		return errors.New("invalid recommendation_id")
	}

	return nil
}

// GetHistoryByUser menampilkan semua history milik user yang sedang login
func GetHistoryByUser(c *gin.Context) {
	user, err := helpers.GetUserFromToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var histories []models.History
	if err := config.DB.
		Preload("Image").
		Preload("SkincareRecommendation").
		Where("user_id = ?", user.UserID).
		Find(&histories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil history user"})
		return
	}

	c.JSON(http.StatusOK, histories)
}
