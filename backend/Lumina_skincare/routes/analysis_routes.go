package routes

import (
	"lumina_skincare/controllers"

	"github.com/gin-gonic/gin"
)

func SetupAnalysisRoutes(r *gin.Engine) {
	// Group Analysis Routes
	analysisRoutes := r.Group("/analysis")
	{
		analysisRoutes.GET("/", controllers.GetAnalysis)
		analysisRoutes.GET("/:id", controllers.GetAnalysisByID)
		analysisRoutes.PUT("/:id", controllers.UpdateAnalysis)
		analysisRoutes.POST("/", controllers.CreateAnalysis)
		analysisRoutes.DELETE("/:id", controllers.DeleteAnalysis)

		analysisRoutes.POST("/analyze-face", controllers.AnalyzeFaceHandler)
		analysisRoutes.GET("/latest", controllers.GetLatestAnalysis)
	}
}
