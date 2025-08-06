package controllers

import (
	"lumina_skincare/config"
	"lumina_skincare/helpers"
	"lumina_skincare/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetLatestRecommendations(c *gin.Context) {
	// 1. Ambil user aktif dari token
	user, err := helpers.GetUserFromToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// 2. Cari data history terakhir berdasarkan uploaded_at gambar
	var history models.History
	if err := config.DB.
		Joins("JOIN images ON images.image_id = history.image_id").
		Where("history.user_id = ?", user.UserID).
		Order("images.uploaded_at DESC").
		Preload("Image").
		Preload("Analysis").
		Preload("SkincareRecommendation").
		First(&history).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No history found"})
		return
	}

	// 3. Return semua data skincare recommendation terkait analysis ini
	var skincareRecs []models.SkincareRecommendation
	if err := config.DB.Where("analysis_id = ?", history.AnalysisID).Find(&skincareRecs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recommendations"})
		return
	}

	c.JSON(http.StatusOK, skincareRecs)
}
