package models

import (
	"time"
)

type User struct {
	UserID      uint      `gorm:"primaryKey;autoIncrement;column:user_id" json:"user_id"`
	FirebaseUID string    `gorm:"type:varchar(255);unique;not null" json:"firebase_uid"` // Tambah Firebase UID
	Name        string    `gorm:"type:varchar(255);not null" json:"name"`
	Email       string    `gorm:"type:varchar(255);unique;not null" json:"email"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`

	Images []Image `gorm:"foreignKey:UserID;references:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"images"`
}


