package main

import (
	"context"
	"fmt"
	"log"
	"lumina_skincare/config"
	"lumina_skincare/controllers"
	"lumina_skincare/helpers"
	"lumina_skincare/repositories"
	"lumina_skincare/routes"
	"os"
	"time"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

func InitFirebase() *auth.Client {
	// Pastikan file kredensial ada
	opt := option.WithCredentialsFile("C:\\LuminaProject\\Lumina_skincare\\config\\lumina-skin-care-firebase-adminsdk-fbsvc-8ebfca47d6.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase app: %v", err)
	}

	client, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("Error getting Auth client: %v", err)
	}

	fmt.Println("Firebase Auth client initialized!")
	return client
}

func main() {
	// Inisialisasi database
	config.ConnectDB()

	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found or cannot be loaded")
	} else {
		log.Println(".env loaded successfully")
	}

	fmt.Println("GEMINI_API_KEY:", os.Getenv("GEMINI_API_KEY"))
	// Inisialisasi repository user
	userRepo := repositories.NewUserRepository(config.DB)

	// Inisialisasi Firebase
	opt := option.WithCredentialsFile("C:\\LuminaProject\\Lumina_skincare\\config\\lumina-skin-care-firebase-adminsdk-fbsvc-8ebfca47d6.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase app: %v", err)
	}

	// Ambil Firebase Auth Client
	authClient, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("Error initializing Firebase Auth: %v", err)
	}

	controllers.SetFirebaseAuth(authClient)

	// Set Firebase Auth di controller
	firebaseAuth := InitFirebase()
	helpers.SetFirebaseAuthClient(firebaseAuth)
	controllers.SetFirebaseAuth(firebaseAuth)
	fmt.Println("Firebase Auth initialized successfully!")

	// Buat router Gin
	r := gin.Default()

	// Middleware CORS (Tambahkan ini!)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Setup routes
	fmt.Println("Memanggil SetupRoutes...")
	routes.SetupAuthRoutes(r, userRepo)
	routes.SetupImageRoutes(r)
	routes.SetupAnalysisRoutes(r)
	routes.SetupUserRoutes(r)
	routes.SetupHistoryRoutes(r)
	routes.SetupSkincareRecommendationRoutes(r)

	for _, route := range r.Routes() {
		fmt.Println(route.Method, route.Path)
	}
	// Jalankan server di port 8080
	fmt.Println("Server running on port 8080 (accessible from network)...")
	r.Run("0.0.0.0:8080")
}
