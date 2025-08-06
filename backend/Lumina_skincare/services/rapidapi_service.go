package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type RapidAPIResponse struct {
	Result struct {
		PhotoAnalysis struct {
			SkinQuality struct {
				Description string `json:"description"`
			} `json:"skin_quality"`
			CheekArea struct {
				Description string `json:"description"`
			} `json:"cheek_area"`
		} `json:"photo_analysis"`
	} `json:"result"`
}

func AnalyzeFaceWithRapidAPI(file multipart.File, fileHeader *multipart.FileHeader) (RapidAPIResponse, error) {
	var result RapidAPIResponse
	
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		return result, fmt.Errorf("error loading .env file: %v", err)
	}

	apiKey := os.Getenv("RAPIDAPI_KEY")
	apiHost := os.Getenv("RAPIDAPI_HOST")

	// Debug: Cek apakah API Key dan Host terbaca
	fmt.Println("API Key:", apiKey)
	fmt.Println("API Host:", apiHost)

	if apiKey == "" || apiHost == "" {
		fmt.Println("🚨 ERROR: API Key atau Host kosong! Pastikan .env sudah benar.")
		return result, fmt.Errorf("missing API credentials")
	}
	// Buat body request multipart
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Tambahkan file ke body request
	part, err := writer.CreateFormFile("image", fileHeader.Filename)
	if err != nil {
		fmt.Println("Error CreateFormFile:", err)
		return result, fmt.Errorf("failed to create form file: %v", err)
	}
	_, err = io.Copy(part, file)
	if err != nil {
		fmt.Println("Error Copy File:", err)
		return result, fmt.Errorf("failed to copy file to request: %v", err)
	}
	writer.Close()
	
	fmt.Println("=== DEBUG: Body Request sebelum dikirim ===")
	fmt.Println("Content-Type:", writer.FormDataContentType())
	
	
	// Kirim request ke RapidAPI
	req, err := http.NewRequest("POST", "https://face-beauty-score-api-skin-analyze-attractiveness-test.p.rapidapi.com/check", body)
	if err != nil {
		fmt.Println("Error Create Request:", err)
		return result, fmt.Errorf("failed to create request: %v", err)
	}
	req.Header.Set("x-rapidapi-key", apiKey)
	req.Header.Set("x-rapidapi-host", apiHost)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	fmt.Println("=== DEBUG: Headers sebelum request dikirim ===")
	
	for key, values := range req.Header {
		for _, value := range values {
			fmt.Printf("%s: %s\n", key, value)
		}
	}
	fmt.Println("========================================")
	
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error Request ke RapidAPI:", err)
		return result, fmt.Errorf("request to RapidAPI failed: %v", err)
	}
	defer resp.Body.Close()

	fmt.Println("Status Code dari RapidAPI:", resp.StatusCode)
	// Jika status bukan 200, return error
	if resp.StatusCode != http.StatusOK {
		return result, fmt.Errorf("RapidAPI returned status: %d", resp.StatusCode)
	}

	// Decode response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error Read Response Body:", err)
		return result, fmt.Errorf("failed to read response body: %v", err)
	}
	fmt.Println("Response dari RapidAPI:", string(respBody))

	if resp.StatusCode != http.StatusOK {
		return result, fmt.Errorf("RapidAPI returned status: %d, response: %s", resp.StatusCode, string(respBody))
	}

	err = json.Unmarshal(respBody, &result)
	if err != nil {
		fmt.Println("Error Parsing JSON:", err)
		return result, fmt.Errorf("failed to parse JSON response: %v", err)
	}

	return result, nil
} 
