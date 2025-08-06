package controllers

import (
	"context"
	"fmt"
	"lumina_skincare/models"
	"lumina_skincare/repositories"
	"net/http"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

// Firebase Auth Client
var firebaseAuth *auth.Client

type AuthController struct {
	UserRepo *repositories.UserRepository
}

// Constructor
func NewAuthController(userRepo *repositories.UserRepository) *AuthController {
	return &AuthController{UserRepo: userRepo}
}

// Set Firebase Auth
func SetFirebaseAuth(client *auth.Client) {
	firebaseAuth = client
}

// Register User
func (c *AuthController) RegisterUser (ctx *gin.Context) {
	var userInput struct {
        Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.ShouldBindJSON(&userInput); err != nil {
		fmt.Println("❌ Error parsing JSON:", err)
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Input tidak valid"})
		return
	}

    fmt.Printf("✅ Data JSON berhasil diparsing: %+v\n", userInput)

    if userInput.Name == "" || userInput.Email == "" || userInput.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Semua field harus diisi"})
		return
	}

    userRecord, err := firebaseAuth.GetUserByEmail(context.Background(), userInput.Email)
	if err == nil {
		fmt.Println("⚠️ User sudah ada di Firebase, cek di MySQL...")

		// Cek user di MySQL berdasarkan UID Firebase
		existingUser, _ := c.UserRepo.GetUserByFirebaseUID(userRecord.UID)
		if existingUser != nil {
			fmt.Println("✅ User sudah ada di MySQL juga")
			ctx.JSON(http.StatusConflict, gin.H{"error": "User sudah ada di database"})
			return
		}

		fmt.Println("❌ User tidak ditemukan di MySQL, menambahkan ke database...")

		// Simpan user ke MySQL
		newUser := models.User{
			FirebaseUID: userRecord.UID, // Ambil UID dari Firebase
			Name:        userRecord.DisplayName,
			Email:       userRecord.Email,
		}
		if err := c.UserRepo.CreateUser(&newUser); err != nil {
			fmt.Println("❌ Gagal menyimpan user ke MySQL:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan pengguna di database"})
			return
		}

		fmt.Println("✅ User berhasil disimpan di MySQL:", newUser)
		ctx.JSON(http.StatusOK, gin.H{"message": "User berhasil disinkronkan ke database"})
		return
	}
	// Buat pengguna di Firebase
	params := (&auth.UserToCreate{}).
		Email(userInput.Email).
		Password(userInput.Password).
		DisplayName(userInput.Name)

	// Buat user di Firebase
	userRecord, err = firebaseAuth.CreateUser(context.Background(), params)
	if err != nil {
		fmt.Println("❌ Error membuat user di Firebase:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat pengguna di Firebase"})
		return
	}

    fmt.Println("Data yang diterima di backend:", userInput)

    existingUser, _ := c.UserRepo.GetUserByEmail(userInput.Email)
	if existingUser != nil {
		fmt.Println("❌ User sudah ada di database")
		ctx.JSON(http.StatusConflict, gin.H{"error": "User sudah ada di database"})
		return
	}

	// Simpan ke database
	newUser  := models.User{
		FirebaseUID: userRecord.UID,
        Name:        userInput.Name,
		Email:       userInput.Email,
	}

    fmt.Println("✅ Data yang disimpan ke DB:", newUser)

	if err := c.UserRepo.CreateUser(&newUser ); err != nil {
		fmt.Println("❌ Gagal menyimpan user ke database:", err)
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan pengguna di database"})
		return
	}

    fmt.Println("✅ User berhasil didaftarkan:", newUser)
    
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Pengguna berhasil didaftarkan!",
		"user": gin.H{
			"user_id":      newUser.UserID,
			"firebase_uid": newUser.FirebaseUID,
			"name":         newUser.Name,
			"email":        newUser.Email,
		},
	})
}


// Login User
func (c *AuthController) LoginUser(ctx *gin.Context) {
    var tokenInput struct {
        Token string `json:"token" binding:"required"`
    }

    if err := ctx.ShouldBindJSON(&tokenInput); err != nil {
        fmt.Println("Error parsing JSON:", err)
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    fmt.Println("Token diterima di backend:", tokenInput.Token) // Debug token yang diterima

    // Verifikasi token Firebase
    token, err := firebaseAuth.VerifyIDToken(context.Background(), tokenInput.Token)
    if err != nil {
        fmt.Println("Error verifikasi token:", err)
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid"})
        return
    }

    // Ambil UID dan email dari token
    firebaseUID := token.UID
    email, ok := token.Claims["email"].(string)
    if !ok {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Email tidak ditemukan dalam token"})
        return
    }

    // Cari user berdasarkan Firebase UID
    user, err := c.UserRepo.GetUserByFirebaseUID(firebaseUID)
    if err != nil {
        fmt.Println("User tidak ditemukan, membuat user baru...")

        userRecord, err := firebaseAuth.GetUser(context.Background(), firebaseUID)
		if err != nil {
			fmt.Println("❌ Error mengambil data user dari Firebase:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data user dari Firebase"})
			return
		}
        // Jika user tidak ditemukan, buat user baru
        newUser := models.User{
            FirebaseUID: firebaseUID,
            Name:    userRecord.DisplayName,
            Email:       email,
        }

        err = c.UserRepo.CreateUser(&newUser)
        if err != nil {
            fmt.Println("Error menyimpan user:", err)
            ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan user"})
            return
        }
		
        user = &newUser
    }
	
    ctx.JSON(http.StatusOK, gin.H{"message": "Login berhasil", "user": user})
    fmt.Println("User  logged in:", user)
}



