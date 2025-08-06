package repositories

import (
	"lumina_skincare/models"

	"gorm.io/gorm"
)

// SkincareRecommendationRepository interface
type SkincareRecommendationRepository interface {
	GetAllSkincareRecommendations() ([]models.SkincareRecommendation, error)
	GetSkincareRecommendationByID(id uint) (*models.SkincareRecommendation, error)
	CreateSkincareRecommendation(recommendation *models.SkincareRecommendation) error
	UpdateSkincareRecommendation(recommendation *models.SkincareRecommendation) error
	DeleteSkincareRecommendation(id uint) error
}

type skincareRecommendationRepository struct {
	db *gorm.DB
}

// NewSkincareRecommendationRepository membuat instance baru
func NewSkincareRecommendationRepository(db *gorm.DB) SkincareRecommendationRepository {
	return &skincareRecommendationRepository{db}
}

// Ambil semua data rekomendasi skincare
func (r *skincareRecommendationRepository) GetAllSkincareRecommendations() ([]models.SkincareRecommendation, error) {
	var recommendations []models.SkincareRecommendation
	err := r.db.Find(&recommendations).Error
	return recommendations, err
}

// Ambil satu rekomendasi skincare berdasarkan ID
func (r *skincareRecommendationRepository) GetSkincareRecommendationByID(id uint) (*models.SkincareRecommendation, error) {
	var recommendation models.SkincareRecommendation
	err := r.db.First(&recommendation, id).Error
	if err != nil {
		return nil, err
	}
	return &recommendation, nil
}

// Tambah rekomendasi skincare baru
func (r *skincareRecommendationRepository) CreateSkincareRecommendation(recommendation *models.SkincareRecommendation) error {
	return r.db.Create(recommendation).Error
}

// Update rekomendasi skincare
func (r *skincareRecommendationRepository) UpdateSkincareRecommendation(recommendation *models.SkincareRecommendation) error {
	return r.db.Save(recommendation).Error
}

// Hapus rekomendasi skincare berdasarkan ID
func (r *skincareRecommendationRepository) DeleteSkincareRecommendation(id uint) error {
	return r.db.Delete(&models.SkincareRecommendation{}, id).Error
}
