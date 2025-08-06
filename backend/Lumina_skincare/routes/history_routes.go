package routes

import (
	"lumina_skincare/controllers"

	"github.com/gin-gonic/gin"
)

func SetupHistoryRoutes(r *gin.Engine) {
	historyRoutes := r.Group("/history")
	{
		historyRoutes.GET("/", controllers.GetHistories)
		historyRoutes.GET("/:id", controllers.GetHistoryByID)
		historyRoutes.PUT("/:id", controllers.UpdateHistory)
		historyRoutes.POST("/", controllers.CreateHistory)
		historyRoutes.DELETE("/:id", controllers.DeleteHistory)

		historyRoutes.GET("/user", controllers.GetHistoryByUser)
	}
}
