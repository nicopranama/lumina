package models

import "time"

type Analysis struct {
	AnalysisID uint      `gorm:"primaryKey;autoIncrement;column:analysis_id" json:"analysis_id"`
	ImageID    uint      `gorm:"not null;index" json:"image_id"`
	Result     string    `gorm:"type:text;not null" json:"result"`
	AnalyzedAt time.Time `gorm:"autoCreateTime" json:"analyzed_at"`

	Image Image `gorm:"foreignKey:ImageID;references:ImageID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func (Analysis) TableName() string {
    return "analysis" // Pastikan ini sesuai dengan nama tabel di MySQL
}
