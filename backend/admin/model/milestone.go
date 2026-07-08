package model

import "time"

type Milestone struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Organization  string    `json:"organization"`
	MilestoneType string    `json:"milestone_type"`
	Description   string    `json:"description"`
	DateLabel     string    `json:"date_label"`
	SortOrder     int       `json:"sort_order"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
