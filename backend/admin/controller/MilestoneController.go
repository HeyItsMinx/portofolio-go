package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/HeyItsMinx/portofolio-go.git/admin"
	"github.com/HeyItsMinx/portofolio-go.git/admin/model"
	"github.com/lib/pq"
)

func GetMilestones(w http.ResponseWriter, r *http.Request) {
	query := `SELECT id, title, organization, milestone_type, description, date_label, gallery_images, links, sort_order, created_at, updated_at 
	          FROM milestones ORDER BY sort_order ASC, created_at DESC`

	rows, err := admin.DB.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	milestones := []model.Milestone{}
	for rows.Next() {
		var m model.Milestone
		err := rows.Scan(&m.ID, &m.Title, &m.Organization, &m.MilestoneType, &m.Description, &m.DateLabel, pq.Array(&m.GalleryImages), &m.SortOrder, &m.CreatedAt, &m.UpdatedAt)
		if err != nil {
			log.Println("Row scan error:", err)
			continue
		}
		milestones = append(milestones, m)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(milestones)
}

func CreateMilestone(w http.ResponseWriter, r *http.Request) {
	var m model.Milestone
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received Milestone: %+v\n", m)

	if m.Title == "" || m.MilestoneType == "" {
		http.Error(w, "Missing required fields: title, milestone_type", http.StatusBadRequest)
		return
	}

	query := `INSERT INTO milestones (title, organization, milestone_type, description, date_label, gallery_images, links, sort_order)
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at, updated_at`

	err := admin.DB.QueryRow(query, m.Title, m.Organization, m.MilestoneType, m.Description, m.DateLabel, pq.Array(m.GalleryImages), m.SortOrder).
		Scan(&m.ID, &m.CreatedAt, &m.UpdatedAt)

	if err != nil {
		log.Println("Database Insert Error:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(m)
}

func UpdateMilestone(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var m model.Milestone
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received Milestone: %+v\n", m)

	if m.Title == "" || m.MilestoneType == "" {
		http.Error(w, "Missing required fields: title, milestone_type", http.StatusBadRequest)
		return
	}

	query := `UPDATE milestones SET title = $1, organization = $2, milestone_type = $3, 
	          description = $4, date_label = $5, gallery_images = $6, links = $7, sort_order = $8, updated_at = now() WHERE id = $9`

	result, err := admin.DB.Exec(query, m.Title, m.Organization, m.MilestoneType, m.Description, m.DateLabel, pq.Array(m.GalleryImages), m.SortOrder, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Milestone not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "updated", "id": id})
}

func DeleteMilestone(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	result, err := admin.DB.Exec("DELETE FROM milestones WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Milestone not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted", "id": id})
}
