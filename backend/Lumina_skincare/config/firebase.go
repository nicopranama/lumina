package config

import (
	"context"
	"io"
	"log"
	"mime/multipart"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

var FirebaseAuth *auth.Client

func InitFirebase() {
	// Gunakan path absolut ke file JSON
	opt := option.WithCredentialsFile("C:/LuminaProject/Lumina_skincare/config/lumina-skin-care-firebase-adminsdk-fbsvc-8ebfca47d6.json")

	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase App: %v", err)
	}

	client, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("Error initializing Firebase Auth: %v", err)
	}

	FirebaseAuth = client
	log.Println("Firebase Auth initialized successfully!")
}

func UploadToFirebase(file *multipart.FileHeader) (string, error) {
	ctx := context.Background()
	bucketName := "your-bucket-name" // Ganti dengan nama bucket Anda

	// Inisialisasi Firebase Storage
	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		return "", err
	}

	storageClient, err := app.Storage(ctx)
	if err != nil {
		return "", err
	}

	bucket, err := storageClient.Bucket(bucketName)
	if err != nil {
		return "", err
	}

	// Buka file
	f, err := file.Open()
	if err != nil {
		return "", err
	}
	defer f.Close()

	// Upload file ke Firebase Storage
	object := bucket.Object(file.Filename) // Ganti dengan penamaan yang sesuai
	wc := object.NewWriter(ctx)
	if _, err := io.Copy(wc, f); err != nil {
		return "", err
	}
	if err := wc.Close(); err != nil {
		return "", err
	}

	// Dapatkan URL file
	url := "https://firebasestorage.googleapis.com/v0/b/" + bucketName + "/o/" + file.Filename + "?alt=media"
	return url, nil
}
