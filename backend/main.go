package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

var db *sql.DB

type Project struct {
	ID           string          `json:"id"`
	Slug         string          `json:"slug"`
	Title        string          `json:"title"`
	ClientLabel  string          `json:"client_label"`
	Category     string          `json:"category"`
	Summary      string          `json:"summary"`
	Problem      string          `json:"problem"`
	MyRole       string          `json:"my_role"`
	KeyDecision  string          `json:"key_decision"`
	Outcome      string          `json:"outcome"`
	TechStack    []string        `json:"tech_stack"`
	Metrics      json.RawMessage `json:"metrics"`
	Architecture json.RawMessage `json:"architecture"`
	IsFeatured   bool            `json:"is_featured"`
	SortOrder    int             `json:"sort_order"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
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

// CORS Middleware
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Preflight Request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func getProjects(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT id, slug, title, client_label, category, summary, 
		       problem, my_role, key_decision, outcome, tech_stack, 
		       metrics, architecture, is_featured, sort_order, created_at, updated_at 
		FROM projects ORDER BY sort_order ASC, created_at DESC`

	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	projects := []Project{}
	for rows.Next() {
		var p Project
		// TEXT to Go String
		err := rows.Scan(
			&p.ID, &p.Slug, &p.Title, &p.ClientLabel, &p.Category, &p.Summary,
			&p.Problem, &p.MyRole, &p.KeyDecision, &p.Outcome, pq.Array(&p.TechStack),
			&p.Metrics, &p.Architecture, &p.IsFeatured, &p.SortOrder, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			log.Println("Row scan error:", err)
			continue
		}
		projects = append(projects, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

func createProject(w http.ResponseWriter, r *http.Request) {
	var p Project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		log.Printf("JSON Decode Error: %v/n", err)
		http.Error(w, fmt.Sprintf("Invalid request payload: %v", err), http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO projects (
			slug, title, client_label, category, summary, 
			problem, my_role, key_decision, outcome, tech_stack, 
			metrics, architecture, is_featured, sort_order
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
		) RETURNING id, created_at, updated_at`

	// Go String to Postgre TEXT
	err := db.QueryRow(
		query,
		p.Slug, p.Title, p.ClientLabel, p.Category, p.Summary,
		p.Problem, p.MyRole, p.KeyDecision, p.Outcome, pq.Array(p.TechStack),
		string(p.Metrics), string(p.Architecture), p.IsFeatured, p.SortOrder,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)

	if err != nil {
		log.Println("Database Insert Error:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(p)
}

func updateProject(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var p Project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := `
		UPDATE projects SET 
			slug = $1, title = $2, client_label = $3, category = $4, summary = $5,
			problem = $6, my_role = $7, key_decision = $8, outcome = $9, 
			tech_stack = $10, metrics = $11, architecture = $12, 
			is_featured = $13, sort_order = $14, updated_at = now()
		WHERE id = $15`

	result, err := db.Exec(
		query,
		p.Slug, p.Title, p.ClientLabel, p.Category, p.Summary,
		p.Problem, p.MyRole, p.KeyDecision, p.Outcome, pq.Array(p.TechStack),
		string(p.Metrics), string(p.Architecture), p.IsFeatured, p.SortOrder, id,
	)

	if err != nil {
		log.Println("Database Insert Error:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	RowsAffected, err := result.RowsAffected()
	if err != nil || RowsAffected == 0 {
		http.Error(w, "Project not found or no changes have been made", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "updated", "id": id})
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	result, err := db.Exec("DELETE FROM projects WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Verify row deleted
	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted", "id": id})
}

func main() {
	initDB()

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/project", getProjects)
	mux.HandleFunc("POST /api/project", createProject)
	mux.HandleFunc("PUT /api/project/{id}", updateProject)
	mux.HandleFunc("DELETE /api/project/{id}", deleteProject)

	// Wrap Middleware
	handler := Middleware(mux)

	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
