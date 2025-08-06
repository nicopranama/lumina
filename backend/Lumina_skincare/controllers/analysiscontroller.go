package controllers

import (
	"fmt"
	"lumina_skincare/config"
	"lumina_skincare/helpers"
	"lumina_skincare/models"
	"lumina_skincare/services"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// GetAnalysis mengambil semua data analysis dari database
func GetAnalysis(c *gin.Context) {
	var analysis []models.Analysis
	if err := config.DB.Find(&analysis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, analysis)
}

// GetAnalysisByID mengambil satu analysis berdasarkan ID
func GetAnalysisByID(c *gin.Context) {
	var analysis models.Analysis
	id := c.Param("id")

	if err := config.DB.First(&analysis, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}
	c.JSON(http.StatusOK, analysis)
}

// CreateAnalysis menambahkan analysis baru ke database
func CreateAnalysis(c *gin.Context) {
	var analysis models.Analysis
	if err := c.ShouldBindJSON(&analysis); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	analysis.AnalysisID = 0 // Reset ID agar auto increment berjalan

	if err := config.DB.Create(&analysis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, analysis)
}

// UpdateAnalysis memperbarui data analysis berdasarkan ID
func UpdateAnalysis(c *gin.Context) {
	id := c.Param("id") // Ambil ID dari parameter URL

	var analysis models.Analysis
	if err := config.DB.First(&analysis, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}

	// Bind JSON ke struct
	if err := c.ShouldBindJSON(&analysis); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simpan perubahan ke database
	if err := config.DB.Save(&analysis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Analysis updated successfully", "data": analysis})
}

// DeleteAnalysis menghapus analysis berdasarkan ID
func DeleteAnalysis(c *gin.Context) {
	var analysis models.Analysis
	id := c.Param("id")

	if err := config.DB.First(&analysis, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Analysis not found"})
		return
	}

	if err := config.DB.Delete(&analysis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Analysis deleted successfully"})
}

func AnalyzeFaceHandler(c *gin.Context) {
	// Ambil file dari request
	var request struct {
		ImageURL string `json:"image_url" binding:"required"`
	}

	// Bind JSON dari request
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request, image_url is required"})
		return
	}

	// Kirim URL gambar ke service analisis wajah (Python)
	analysisResult, err := services.AnalyzeFace(request.ImageURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze face", "details": err.Error()})
		return
	}

	// Kirim hasil analisis ke user
	c.JSON(http.StatusOK, gin.H{
		"message":  "Face analyzed successfully",
		"analysis": analysisResult,
	})
}

func parseGoMapStringToMap(s string) (map[string]float64, error) {
	s = strings.TrimPrefix(s, "map[")
	s = strings.TrimSuffix(s, "]")

	parts := strings.Fields(s)
	result := make(map[string]float64)

	for _, part := range parts {
		kv := strings.Split(part, ":")
		if len(kv) != 2 {
			return nil, fmt.Errorf("invalid format for part: %s", part)
		}
		key := kv[0]
		valStr := kv[1]

		val, err := strconv.ParseFloat(valStr, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid float value for key %s: %v", key, err)
		}

		result[key] = val
	}
	return result, nil
}

func GetLatestAnalysis(c *gin.Context) {

	user, err := helpers.GetUserFromToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var history models.History
	if err := config.DB.
		Joins("JOIN images ON images.image_id = history.image_id").
		Where("history.user_id = ?", user.UserID).
		Order("images.uploaded_at DESC").
		Preload("Analysis").
		First(&history).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No history found"})
		return
	}

	fmt.Printf("Raw Result string: %v\n", history.Analysis.Result)
	fmt.Printf("Result length: %d\n", len(history.Analysis.Result))

	resultMap, err := parseGoMapStringToMap(history.Analysis.Result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Failed to parse result map string",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": resultMap})
}
