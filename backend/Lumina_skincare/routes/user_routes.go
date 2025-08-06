package routes

import (
	"lumina_skincare/controllers"

	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(r *gin.Engine) {
	// Group User Routes
	userRoutes := r.Group("/users")
	{
		userRoutes.GET("/", controllers.GetUsers)
		userRoutes.GET("/:id", controllers.GetUserByID)
		userRoutes.POST("/", controllers.CreateUser)
		userRoutes.PUT("/:id", controllers.UpdateUser)
		userRoutes.DELETE("/:id", controllers.DeleteUser)
	}
}
