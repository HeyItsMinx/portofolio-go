package main

import (
	"log"
	"net/http"

	"github.com/HeyItsMinx/portofolio-go.git/admin"
)

func main() {
	admin.InitDB()

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/project", admin.GetProjects)
	mux.HandleFunc("GET /api/project/slug/{slug}", admin.GetProjectBySlug)
	mux.HandleFunc("POST /api/login", admin.Login)

	mux.Handle("POST /api/project", admin.AuthMiddleware(http.HandlerFunc(admin.CreateProject)))
	mux.Handle("PUT /api/project/{id}", admin.AuthMiddleware(http.HandlerFunc(admin.UpdateProject)))
	mux.Handle("DELETE /api/project/{id}", admin.AuthMiddleware(http.HandlerFunc(admin.DeleteProject)))

	// Image Handler
	mux.Handle("/api/upload", admin.AuthMiddleware(http.HandlerFunc(admin.UploadImage)))
	mux.Handle("GET /uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	handler := admin.Middleware(mux)

	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
