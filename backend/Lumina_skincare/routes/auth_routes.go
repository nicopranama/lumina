package routes

import (
	"fmt"
	"lumina_skincare/controllers"
	"lumina_skincare/repositories"

	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(r *gin.Engine, userRepo *repositories.UserRepository) {
	fmt.Println("SetupRoutes dipanggil!")
	// Inisialisasi controller
	authController := controllers.NewAuthController(userRepo)

	// Tambahkan endpoint
	auth := r.Group("/auth")
	{
		auth.POST("/register", authController.RegisterUser)
		auth.POST("/login", authController.LoginUser)
	}
	for _, route := range r.Routes() {
		fmt.Println(route.Method, route.Path)
	}
}
