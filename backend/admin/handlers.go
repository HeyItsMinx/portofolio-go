package admin

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/lib/pq"
)

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

func getProjectBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")

	query := `
		SELECT id, slug, title, client_label, category, summary, 
		       problem, my_role, key_decision, outcome, tech_stack, 
		       metrics, architecture, is_featured, sort_order, created_at, updated_at 
		FROM projects WHERE slug = $1`

	var p Project
	err := db.QueryRow(query, slug).Scan(
		&p.ID, &p.Slug, &p.Title, &p.ClientLabel, &p.Category, &p.Summary,
		&p.Problem, &p.MyRole, &p.KeyDecision, &p.Outcome, pq.Array(&p.TechStack),
		&p.Metrics, &p.Architecture, &p.IsFeatured, &p.SortOrder, &p.CreatedAt, &p.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
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

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
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

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted", "id": id})
}
