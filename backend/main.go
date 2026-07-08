package main

import (
	"log"
	"net/http"

	"github.com/HeyItsMinx/portofolio-go.git/admin"
	"github.com/HeyItsMinx/portofolio-go.git/admin/controller"
)

func main() {
	admin.InitDB()

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/project", controller.GetProjects)
	mux.HandleFunc("GET /api/project/slug/{slug}", controller.GetProjectBySlug)
	mux.HandleFunc("POST /api/login", admin.Login)

	mux.Handle("POST /api/project", admin.AuthMiddleware(http.HandlerFunc(controller.CreateProject)))
	mux.Handle("PUT /api/project/{id}", admin.AuthMiddleware(http.HandlerFunc(controller.UpdateProject)))
	mux.Handle("DELETE /api/project/{id}", admin.AuthMiddleware(http.HandlerFunc(controller.DeleteProject)))

	mux.Handle("POST /api/upload", admin.AuthMiddleware(http.HandlerFunc(controller.UploadImage)))
	mux.Handle("DELETE /api/upload", admin.AuthMiddleware(http.HandlerFunc(controller.DeleteImage)))
	mux.Handle("GET /uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	mux.HandleFunc("GET /api/milestone", controller.GetMilestones)
	mux.Handle("POST /api/milestone", admin.AuthMiddleware(http.HandlerFunc(controller.CreateMilestone)))
	mux.Handle("PUT /api/milestone/{id}", admin.AuthMiddleware(http.HandlerFunc(controller.UpdateMilestone)))
	mux.Handle("DELETE /api/milestone/{id}", admin.AuthMiddleware(http.HandlerFunc(controller.DeleteMilestone)))

	handler := admin.Middleware(mux)

	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
