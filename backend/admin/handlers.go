package admin

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/lib/pq"
)

func GetProjects(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT id, slug, title, client_label, category, summary, description, cover_image_url, gallery_images,
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
			&p.ID, &p.Slug, &p.Title, &p.ClientLabel, &p.Category, &p.Summary, &p.Description, &p.CoverImageUrl, &p.GalleryImages,
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

func GetProjectBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")

	query := `
		SELECT id, slug, title, client_label, category, summary, description, cover_image_url, gallery_images,
		       problem, my_role, key_decision, outcome, tech_stack, 
		       metrics, architecture, is_featured, sort_order, created_at, updated_at 
		FROM projects WHERE slug = $1`

	var p Project
	err := db.QueryRow(query, slug).Scan(
		&p.ID, &p.Slug, &p.Title, &p.ClientLabel, &p.Category, &p.Summary, &p.Description, &p.CoverImageUrl, &p.GalleryImages,
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

func CreateProject(w http.ResponseWriter, r *http.Request) {
	var p Project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		log.Printf("JSON Decode Error: %v/n", err)
		http.Error(w, fmt.Sprintf("Invalid request payload: %v", err), http.StatusBadRequest)
		return
	}

	if p.Title == "" || p.Slug == "" || p.Category == "" || p.ClientLabel == "" || len(p.TechStack) == 0 {
		http.Error(w, "Missing required fields:", http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO projects (
			slug, title, client_label, category, summary, description, cover_image_url, gallery_images,
			problem, my_role, key_decision, outcome, tech_stack, 
			metrics, architecture, is_featured, sort_order
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
		) RETURNING id, created_at, updated_at`

	err := db.QueryRow(
		query,
		p.Slug, p.Title, p.ClientLabel, p.Category, p.Summary, p.Description, p.CoverImageUrl, p.GalleryImages,
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

func UpdateProject(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var p Project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if p.Title == "" || p.Slug == "" || p.Category == "" || p.ClientLabel == "" || len(p.TechStack) == 0 {
		http.Error(w, "Missing required fields:", http.StatusBadRequest)
		return
	}

	query := `
		UPDATE projects SET 
			slug = $1, title = $2, client_label = $3, category = $4, summary = $5, description = $6, cover_image_url = $7, gallery_images = $8
			problem = $9, my_role = $10, key_decision = $11, outcome = $12, 
			tech_stack = $13, metrics = $14, architecture = $15, 
			is_featured = $16, sort_order = $17, updated_at = now()
		WHERE id = $17`

	result, err := db.Exec(
		query,
		p.Slug, p.Title, p.ClientLabel, p.Category, p.Summary, p.Description, p.CoverImageUrl, p.GalleryImages,
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

func DeleteProject(w http.ResponseWriter, r *http.Request) {
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
