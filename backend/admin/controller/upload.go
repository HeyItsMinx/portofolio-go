package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const uploadDir = "./uploads"
const maxUploadSize = 5 << 20

var allowedExts = map[string]bool{
	".jpg": true, ".jpeg": true, ".png": true, ".webp": true, ".gif": true, ".jfif": true,
}

func UploadImage(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)

	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		log.Printf("Parse Form Error: %v", err)
		http.Error(w, "File too large (max 5MB)", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		log.Printf("FormFile Error: %v", err)
		http.Error(w, "No image file provided", http.StatusBadRequest)
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if !allowedExts[ext] {
		http.Error(w, "Unsupported file type", http.StatusBadRequest)
		return
	}

	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		log.Printf("Directory Creation Error: %v", err)
		http.Error(w, "Server storage error", http.StatusInternalServerError)
		return
	}

	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	destPath := filepath.Join(uploadDir, filename)

	dest, err := os.Create(destPath)
	if err != nil {
		log.Printf("File Creation Error: %v", err)
		http.Error(w, "Could not save file", http.StatusInternalServerError)
		return
	}
	defer dest.Close()

	if _, err := io.Copy(dest, file); err != nil {
		log.Printf("File Copy Error: %v", err)
		http.Error(w, "Could not save file", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"url": "/uploads/" + filename})
}

func DeleteImage(w http.ResponseWriter, r *http.Request) {
	var body struct {
		URL string `json:"url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if body.URL == "" || !strings.HasPrefix(body.URL, "/uploads/") {
		http.Error(w, "Invalid image URL", http.StatusBadRequest)
		return
	}

	filename := strings.TrimPrefix(body.URL, "/uploads/")

	if strings.Contains(filename, "..") || strings.ContainsAny(filename, "/\\") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}

	path := filepath.Join(uploadDir, filename)

	if err := os.Remove(path); err != nil {
		if os.IsNotExist(err) {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{"status": "already_deleted"})
			return
		}
		http.Error(w, "Could not delete file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}
