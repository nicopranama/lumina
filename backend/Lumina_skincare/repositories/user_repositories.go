package repositories

import (
	"lumina_skincare/models"

	"gorm.io/gorm"
)

// UserRepository interface untuk operasi user
type UserRepository struct {
	DB *gorm.DB
}

// Constructor untuk UserRepository
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

// Fungsi untuk mendapatkan semua user
// Fungsi untuk mendapatkan user berdasarkan Firebase UID
func (r *UserRepository) GetUserByFirebaseUID(firebaseUID string) (*models.User, error) {
	var user models.User
	result := r.DB.Where("firebase_uid = ?", firebaseUID).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
    var user models.User
    if err := r.DB.Where("email = ?", email).First(&user).Error; err != nil {
        return nil, err
    }
    return &user, nil
}

// Fungsi untuk menyimpan user baru ke database
func (r *UserRepository) CreateUser(user *models.User) error {
	return r.DB.Create(user).Error
}

