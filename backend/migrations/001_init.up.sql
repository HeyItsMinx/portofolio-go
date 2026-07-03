CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- gen_randon_uuid()

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    client_label TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,

    -- Case Study
    problem TEXT NOT NULL,
    my_role TEXT NOT NULL,
    key_decision TEXT NOT NULL,
    outcome TEXT NOT NULL,

    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    metrics JSONB NOT NULL DEFAULT '{}',
    architecture JSONB NOT NULL DEFAULT '{}',

    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);