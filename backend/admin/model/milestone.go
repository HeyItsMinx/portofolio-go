package model

import (
	"encoding/json"
	"time"
)

type Milestone struct {
	ID            string          `json:"id"`
	Title         string          `json:"title"`
	Organization  string          `json:"organization"`
	MilestoneType string          `json:"milestone_type"`
	Description   string          `json:"description"`
	GalleryImages []string        `json:"gallery_images"`
	Links         json.RawMessage `json:"links"`
	DateLabel     string          `json:"date_label"`
	SortOrder     int             `json:"sort_order"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}
