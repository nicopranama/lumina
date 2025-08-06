package routes

import (
	"lumina_skincare/controllers"

	"github.com/gin-gonic/gin"
)

func SetupSkincareRecommendationRoutes(r *gin.Engine) {
	skincareRoutes := r.Group("/skincare_recommendation")
	{
		skincareRoutes.GET("/", controllers.GetSkincareRecommendations)
		skincareRoutes.GET("/:id", controllers.GetSkincareRecommendationByID)
		skincareRoutes.PUT("/:id", controllers.UpdateSkincareRecommendation)
		skincareRoutes.POST("/", controllers.CreateSkincareRecommendation)
		skincareRoutes.DELETE("/:id", controllers.DeleteSkincareRecommendation)

		skincareRoutes.POST("/gemini", controllers.GetSkincareRecommendationFromGemini)

		skincareRoutes.GET("/analysis/:id", controllers.GetRecommendationsByAnalysisID)
		skincareRoutes.GET("/dashboard/recommendations", controllers.GetLatestRecommendations)

	}
}
