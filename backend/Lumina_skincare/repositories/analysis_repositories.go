package repositories

import (
	"lumina_skincare/models"

	"gorm.io/gorm"
)

// AnalysisRepository interface
type AnalysisRepository interface {
	GetAllAnalysis() ([]models.Analysis, error)
	GetAnalysisByID(id uint) (*models.Analysis, error)
	CreateAnalysis(analysis *models.Analysis) error
	DeleteAnalysis(id uint) error
}

type analysisRepository struct {
	db *gorm.DB
}

// NewAnalysisRepository membuat instance baru
func NewAnalysisRepository(db *gorm.DB) AnalysisRepository {
	return &analysisRepository{db}
}

// Ambil semua data analysis
func (r *analysisRepository) GetAllAnalysis() ([]models.Analysis, error) {
	var analysis []models.Analysis
	err := r.db.Find(&analysis).Error
	return analysis, err
}

// Ambil analysis berdasarkan ID
func (r *analysisRepository) GetAnalysisByID(id uint) (*models.Analysis, error) {
	var analysis models.Analysis
	err := r.db.First(&analysis, id).Error
	if err != nil {
		return nil, err
	}
	return &analysis, nil
}

// Tambah analysis baru
func (r *analysisRepository) CreateAnalysis(analysis *models.Analysis) error {
	return r.db.Create(analysis).Error
}

// Hapus analysis berdasarkan ID
func (r *analysisRepository) DeleteAnalysis(id uint) error {
	return r.db.Delete(&models.Analysis{}, id).Error
}
