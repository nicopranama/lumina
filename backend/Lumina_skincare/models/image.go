package models

import "time"

type Image struct {
	ImageID   uint      `gorm:"primaryKey;autoIncrement;column:image_id" json:"image_id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	ImageURL  string    `gorm:"type:varchar(255);not null;column:image_URL" json:"image_url"`
	UploadedAt time.Time `gorm:"autoCreateTime" json:"uploaded_at"`

	User User `gorm:"foreignKey:UserID;references:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

