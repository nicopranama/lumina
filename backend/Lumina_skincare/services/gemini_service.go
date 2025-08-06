package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type SkincareRecommendation struct {
	SkincareName string `json:"skincare_name"`
	SkincareType string `json:"skincare_type"`
	Description  string `json:"description"`
}

// Fungsi untuk mendapatkan rekomendasi skincare dari Gemini
func GetSkincareRecommendationFromGemini(analysisData map[string]float64) ([]SkincareRecommendation, error) {
	// Ambil API Key dari environment variable
	geminiAPIKey := os.Getenv("GEMINI_API_KEY")
	if geminiAPIKey == "" {
		return nil, errors.New("GEMINI_API_KEY not set")
	}

	// URL API Gemini
	apiURL := "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiAPIKey

	// 🔹 Format prompt untuk Gemini
	prompt := fmt.Sprintf(`Saya memiliki kondisi kulit wajah sebagai berikut:
	- Jerawat: %.2f%%	
	- Kecerahan: %.2f	
	- Kusam: %.2f	
	- Kemerahan: %.2f%%	

	Berdasarkan kondisi ini, rekomendasikan produk skincare yang benar-benar dibutuhkan saja.  
	Tampilkan produk skincare dasar seperti facial wash, moisturizer, sunscreen, serum, atau toner dari produk-produk ternama supaya lebih mudah dicari.  
	Tidak perlu menambahkan produk lain jika tidak diperlukan. Tolong berikan deskripsi produk nya dalam bahasa inggris. Jangan jadikan 1 moisturizer dan sunscreen. Pastikan merek produknya juga unik (jangan dari brand itu-itu saja).

	Berikan respons dalam **JSON murni** tanpa teks tambahan. 
    Jangan menambahkan kata-kata lain sebelum atau sesudah JSON.

    Format respons HARUS berupa JSON murni seperti ini:
	[
  		{
    		"skincare_name": "Nama Skincare 1",
    		"skincare_type": "Jenis Skincare 1",
    		"description": "Deskripsi singkat produk ini"
  		},
  		{
    		"skincare_name": "Nama Skincare 2",
    		"skincare_type": "Jenis Skincare 2",
    		"description": "Deskripsi singkat produk ini"
  		},
		...
	]`,
		analysisData["acne_percentage"],
		analysisData["brightness"],
		analysisData["dullness"],
		analysisData["redness_percentage"],
	)

	// 🔹 Buat request JSON
	requestBody, _ := json.Marshal(map[string]interface{}{
		"contents": []map[string]interface{}{
			{"parts": []map[string]string{
				{"text": prompt},
			}},
		},
	})

	fmt.Println("✅ Request Body:", string(requestBody))

	// 🔹 Kirim request ke Gemini API
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// 🔹 Baca response dari Gemini
	body, _ := io.ReadAll(resp.Body)
	fmt.Println("✅ Raw Response from Gemini:", string(body))

	if len(body) == 0 {
		return nil, errors.New("gemini API returned empty response")
	}

	// 🔹 Parsing JSON response
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		fmt.Println("❌ JSON Unmarshal Error:", err)
		fmt.Println("🔍 Response Body:", string(body))
		return nil, err
	}

	// 🔹 Ambil rekomendasi dari response Gemini
	candidates, ok := result["candidates"].([]interface{})
	if !ok || len(candidates) == 0 {
		return nil, errors.New("invalid response: missing 'candidates' field")
	}

	// 🔹 Ambil 'parts' dari 'content'
	candidate := candidates[0].(map[string]interface{})
	content, ok := candidate["content"].(map[string]interface{})
	if !ok {
		return nil, errors.New("invalid response structure: missing 'content'")
	}

	parts, ok := content["parts"].([]interface{})
	if !ok || len(parts) == 0 {
		return nil, errors.New("invalid response: missing 'parts'")
	}

	// 🔹 Ambil teks JSON yang dihasilkan
	outputText, ok := parts[0].(map[string]interface{})["text"].(string)
	if !ok {
		return nil, errors.New("unexpected response format: missing 'text'")
	}

	fmt.Println("✅ Full Output Text:", outputText)

	// 🔹 Bersihkan JSON agar bisa di-parse
	outputText = strings.TrimSpace(outputText)
	outputText = strings.TrimPrefix(outputText, "```json")
	outputText = strings.TrimSuffix(outputText, "```")
	outputText = strings.TrimSpace(outputText) // Hapus spasi ekstra

	// 🔍 Debugging: Lihat hasil ekstraksi JSON
	fmt.Println("✅ Extracted JSON:", outputText)

	// 🔹 Pastikan JSON tidak kosong
	if outputText == "" {
		return nil, errors.New("failed to extract JSON from Gemini response (empty output)")
	}

	// 🔹 Parse JSON ke struct
	var recommendations []SkincareRecommendation
	if err := json.Unmarshal([]byte(outputText), &recommendations); err != nil {
		fmt.Println("❌ JSON Parsing Error:", err)
		fmt.Println("🔍 Final JSON String:", outputText)
		return nil, err
	}

	return recommendations, nil
}
