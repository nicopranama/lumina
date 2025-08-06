package routes

import (
	"lumina_skincare/controllers"

	"github.com/gin-gonic/gin"
)

func SetupImageRoutes(r *gin.Engine) {
	// Group Image Routes
	imageRoutes := r.Group("/images")
	{
		imageRoutes.GET("/", controllers.GetImages)
		imageRoutes.GET("/:id", controllers.GetImageByID)
		imageRoutes.POST("/", controllers.SaveImageMetadata)
		imageRoutes.PUT("/:id", controllers.UpdateImage)
		imageRoutes.DELETE("/:id", controllers.DeleteImage)

		imageRoutes.POST("/upload", controllers.UploadImageHandler)
	}
}
