package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var db *sql.DB

type StudyCase struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type ResponseData struct {
	Message string `json:"message"`
	Status  string `json:"status"`
	DBState string `json:"db_state"`
}

func initDB() {
	var err error

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to open DB Connection: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("failed to ping DB: %v", err)
	}

	log.Println("Connected to PostgreSQL")
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	dbStatus := "Connected"
	if err := db.Ping(); err != nil {
		dbStatus = "Disconnected"
	}

	data := ResponseData{
		Message: "System initialized and awaiting data.",
		Status:  "Active",
		DBState: dbStatus,
	}

	json.NewEncoder(w).Encode(data)
}

func main() {
	initDB()

	http.HandleFunc("/api/data", apiHandler)

	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
