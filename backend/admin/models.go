package admin

import (
	"encoding/json"
	"time"
)

type Project struct {
	ID            string          `json:"id"`
	Slug          string          `json:"slug"`
	Title         string          `json:"title"`
	ClientLabel   string          `json:"client_label"`
	Category      string          `json:"category"`
	Summary       string          `json:"summary"`
	Description   string          `json:"description"`
	CoverImageUrl string          `json:"cover_image_url"`
	GalleryImages []string        `json:"gallery_images"`
	Problem       string          `json:"problem"`
	MyRole        string          `json:"my_role"`
	KeyDecision   string          `json:"key_decision"`
	Outcome       string          `json:"outcome"`
	TechStack     []string        `json:"tech_stack"`
	Metrics       json.RawMessage `json:"metrics"`
	Architecture  json.RawMessage `json:"architecture"`
	IsFeatured    bool            `json:"is_featured"`
	SortOrder     int             `json:"sort_order"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}
