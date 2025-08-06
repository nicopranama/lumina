package repositories

import (
	"lumina_skincare/models"

	"gorm.io/gorm"
)

// HistoryRepository interface
type HistoryRepository interface {
	GetAllHistories() ([]models.History, error)
	GetHistoryByID(id uint) (*models.History, error)
	CreateHistory(history *models.History) error
	UpdateHistory(history *models.History) error
	DeleteHistory(id uint) error
}

type historyRepository struct {
	db *gorm.DB
}

// NewHistoryRepository membuat instance baru
func NewHistoryRepository(db *gorm.DB) HistoryRepository {
	return &historyRepository{db}
}

// Ambil semua data history
func (r *historyRepository) GetAllHistories() ([]models.History, error) {
	var histories []models.History
	err := r.db.Preload("User").Preload("Image").Preload("Analysis").Preload("Recommendation").Find(&histories).Error
	return histories, err
}

// Ambil satu history berdasarkan ID
func (r *historyRepository) GetHistoryByID(id uint) (*models.History, error) {
	var history models.History
	err := r.db.Preload("User").Preload("Image").Preload("Analysis").Preload("Recommendation").First(&history, id).Error
	if err != nil {
		return nil, err
	}
	return &history, nil
}

// Tambah history baru
func (r *historyRepository) CreateHistory(history *models.History) error {
	return r.db.Create(history).Error
}

// Update history
func (r *historyRepository) UpdateHistory(history *models.History) error {
	return r.db.Save(history).Error
}

// Hapus history berdasarkan ID
func (r *historyRepository) DeleteHistory(id uint) error {
	return r.db.Delete(&models.History{}, id).Error
}
