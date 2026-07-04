package main

import (
	"log"
	"net/http"

	"github.com/HeyItsMinx/portofolio-go/admin"
)

func main() {
	admin.InitDB()

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/project", admin.getProjects)
	mux.HandleFunc("GET /api/project/slug/{slug}", admin.getProjectBySlug)
	mux.HandleFunc("POST /api/login", admin.Login)

	mux.Handle("POST /api/project", admin.AuthMiddleware(http.HandlerFunc(admin.createProject)))
	mux.Handle("PUT /api/project/{id}", admin.AuthMiddleware(http.HandlerFunc(admin.updateProject)))
	mux.Handle("DELETE /api/project/{id}", admin.AuthMiddleware(http.HandlerFunc(admin.deleteProject)))

	handler := admin.Middleware(mux)

	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
