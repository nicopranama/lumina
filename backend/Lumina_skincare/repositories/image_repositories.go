package repositories

import (
	"lumina_skincare/models"

	"gorm.io/gorm"
)

// ImageRepository interface
type ImageRepository interface {
	GetAllImages() ([]models.Image, error)
	GetImageByID(id uint) (*models.Image, error)
	CreateImage(image *models.Image) error
	DeleteImage(id uint) error
}

type imageRepository struct {
	db *gorm.DB
}

// NewImageRepository membuat instance baru
func NewImageRepository(db *gorm.DB) ImageRepository {
	return &imageRepository{db}
}

// Ambil semua image
func (r *imageRepository) GetAllImages() ([]models.Image, error) {
	var images []models.Image
	err := r.db.Find(&images).Error
	return images, err
}

// Ambil image berdasarkan ID
func (r *imageRepository) GetImageByID(id uint) (*models.Image, error) {
	var image models.Image
	err := r.db.First(&image, id).Error
	if err != nil {
		return nil, err
	}
	return &image, nil
}

// Tambah image baru
func (r *imageRepository) CreateImage(image *models.Image) error {
	return r.db.Create(image).Error
}

// Hapus image
func (r *imageRepository) DeleteImage(id uint) error {
	return r.db.Delete(&models.Image{}, id).Error
}
