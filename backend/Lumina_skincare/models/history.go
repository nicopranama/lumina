package models

type History struct {
	HistoryID        uint `gorm:"primaryKey;autoIncrement;column:history_id" json:"history_id"`
	UserID           uint `gorm:"not null" json:"user_id"`
	ImageID          uint `gorm:"not null" json:"image_id"`
	AnalysisID       uint `gorm:"not null" json:"analysis_id"`
	RecommendationID uint `gorm:"not null" json:"recommendation_id"`

	User                   User                   `gorm:"foreignKey:UserID;references:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"user"`
	Image                  Image                  `gorm:"foreignKey:ImageID;references:ImageID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"image"`
	Analysis               Analysis               `gorm:"foreignKey:AnalysisID;references:AnalysisID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"analysis"`
	SkincareRecommendation SkincareRecommendation `gorm:"foreignKey:RecommendationID;references:RecommendationID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"skincare_recommendation"`
}

func (History) TableName() string {
	return "history"
}