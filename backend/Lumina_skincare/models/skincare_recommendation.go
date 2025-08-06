package models

type SkincareRecommendation struct {
	RecommendationID uint   `gorm:"primaryKey;autoIncrement;column:recommendation_id" json:"recommendation_id"`
	AnalysisID       uint   `gorm:"not null" json:"analysis_id"`
	Skincare_name    string `gorm:"type:text;not null" json:"skincare_name"`
	Skincare_type    string `gorm:"type:text;not null" json:"skincare_type"`
	Description      string `gorm:"type:text;not null" json:"description"`

	Analysis Analysis `gorm:"foreignKey:AnalysisID;references:AnalysisID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func (SkincareRecommendation) TableName() string {
	return "skincare_recommendation" // Sesuaikan dengan nama di database
}
