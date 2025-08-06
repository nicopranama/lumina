package controllers

import (
	"fmt"
	"lumina_skincare/config"
	"lumina_skincare/models"
	"lumina_skincare/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetSkincareRecommendations mengambil semua data rekomendasi skincare
func GetSkincareRecommendations(c *gin.Context) {
	var recommendations []models.SkincareRecommendation
	if err := config.DB.Find(&recommendations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, recommendations)
}

// GetSkincareRecommendationByID mengambil satu rekomendasi skincare berdasarkan ID
func GetSkincareRecommendationByID(c *gin.Context) {
	var recommendation models.SkincareRecommendation
	id := c.Param("id")

	if err := config.DB.First(&recommendation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Skincare recommendation not found"})
		return
	}
	c.JSON(http.StatusOK, recommendation)
}

// CreateSkincareRecommendation menambahkan rekomendasi skincare baru
func CreateSkincareRecommendation(c *gin.Context) {
	var recommendation models.SkincareRecommendation
	if err := c.ShouldBindJSON(&recommendation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recommendation.RecommendationID = 0 // Reset ID agar auto increment berjalan

	if err := config.DB.Create(&recommendation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, recommendation)
}

// UpdateSkincareRecommendation memperbarui data rekomendasi skincare berdasarkan ID
func UpdateSkincareRecommendation(c *gin.Context) {
	id := c.Param("id")

	var recommendation models.SkincareRecommendation
	if err := config.DB.First(&recommendation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Skincare recommendation not found"})
		return
	}

	if err := c.ShouldBindJSON(&recommendation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Save(&recommendation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Skincare recommendation updated successfully", "data": recommendation})
}

// DeleteSkincareRecommendation menghapus rekomendasi skincare berdasarkan ID
func DeleteSkincareRecommendation(c *gin.Context) {
	var recommendation models.SkincareRecommendation
	id := c.Param("id")

	if err := config.DB.First(&recommendation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Skincare recommendation not found"})
		return
	}

	if err := config.DB.Delete(&recommendation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Skincare recommendation deleted successfully"})
}

func GetSkincareRecommendationFromGemini(c *gin.Context) {
	var analysisResult struct {
		AcnePercentage    float64 `json:"acne_percentage"`
		Brightness        float64 `json:"brightness"`
		Dullness          float64 `json:"dullness"`
		RednessPercentage float64 `json:"redness_percentage"`
	}

	if err := c.ShouldBindJSON(&analysisResult); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Panggil Gemini untuk mendapatkan rekomendasi
	analysisData := map[string]float64{
		"acne_percentage":    analysisResult.AcnePercentage,
		"brightness":         analysisResult.Brightness,
		"dullness":           analysisResult.Dullness,
		"redness_percentage": analysisResult.RednessPercentage,
	}

	// Panggil Gemini untuk mendapatkan rekomendasi
	recommendation, err := services.GetSkincareRecommendationFromGemini(analysisData)
	if err != nil {
		fmt.Println("Error Gemini:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get skincare recommendation"})
		return
	}

	c.JSON(http.StatusOK, recommendation)
}

func GetRecommendationsByAnalysisID(c *gin.Context) {
	analysisID := c.Param("id")

	var recommendations []models.SkincareRecommendation
	if err := config.DB.Where("analysis_id = ?", analysisID).Find(&recommendations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, recommendations)
}
