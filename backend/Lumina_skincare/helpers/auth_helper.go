package helpers

import (
	"context"
	"errors"
	"lumina_skincare/config"
	"lumina_skincare/models"
	"strings"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

var firebaseAuth *auth.Client

// Setter untuk inject FirebaseAuth dari main.go
func SetFirebaseAuthClient(client *auth.Client) {
	firebaseAuth = client
}

// Fungsi untuk ambil user dari token Authorization
func GetUserFromToken(c *gin.Context) (*models.User, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return nil, errors.New("authorization header tidak ditemukan")
	}

	// Format token: "Bearer <token>"
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return nil, errors.New("format authorization header salah")
	}

	tokenString := parts[1]
	token, err := firebaseAuth.VerifyIDToken(context.Background(), tokenString)
	if err != nil {
		return nil, errors.New("token tidak valid")
	}

	firebaseUID := token.UID
	var user models.User
	if err := config.DB.Where("firebase_uid = ?", firebaseUID).First(&user).Error; err != nil {
		return nil, errors.New("user tidak ditemukan")
	}

	return &user, nil
}
