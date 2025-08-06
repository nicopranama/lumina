package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type FaceAnalysisResponse struct {
	AcnePercentage    float64 `json:"acne_percentage"`
	Brightness        float64 `json:"brightness"`
	Dullness         float64 `json:"dullness"`
	RednessPercentage float64 `json:"redness_percentage"`
}

func AnalyzeFace(imageURL string) (map[string]float64, error) {
	apiURL := "http://127.0.0.1:5000/analysis/analyze-face"

	// Buat request JSON
	requestBody, _ := json.Marshal(map[string]string{
		"image_url": imageURL,
	})

	// Kirim request ke Python API
	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Baca response dari API
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// ✅ Debugging: Print response dari Python API
	fmt.Println("🔍 Response dari Python API:", string(responseBody))

	// Decode JSON response langsung ke struct
	var result FaceAnalysisResponse
	if err := json.Unmarshal(responseBody, &result); err != nil {
		return nil, fmt.Errorf("gagal decode response JSON: %v", err)
	}

	// ✅ Return dalam bentuk JSON-friendly (map[string]float64)
	return map[string]float64{
		"acne_percentage":    result.AcnePercentage,
		"brightness":         result.Brightness,
		"dullness":           result.Dullness,
		"redness_percentage": result.RednessPercentage,
	}, nil
}
