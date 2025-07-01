-- NeighborFit Database Schema
-- Creates tables for neighborhood data, user preferences, and matching results

-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_feedback;
DROP TABLE IF EXISTS neighborhood_amenities;
DROP TABLE IF EXISTS neighborhood_scores;
DROP TABLE IF EXISTS neighborhoods;
DROP TABLE IF EXISTS user_sessions;

-- Create neighborhoods table
CREATE TABLE neighborhoods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    population INTEGER,
    median_age INTEGER,
    median_income INTEGER,
    average_rent INTEGER,
    median_home_price INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create neighborhood_scores table
CREATE TABLE neighborhood_scores (
    id SERIAL PRIMARY KEY,
    neighborhood_id INTEGER REFERENCES neighborhoods(id) ON DELETE CASCADE,
    walkability_score INTEGER CHECK (walkability_score >= 0 AND walkability_score <= 100),
    safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
    affordability_score INTEGER CHECK (affordability_score >= 0 AND affordability_score <= 100),
    nightlife_score INTEGER CHECK (nightlife_score >= 0 AND nightlife_score <= 100),
    family_friendly_score INTEGER CHECK (family_friendly_score >= 0 AND family_friendly_score <= 100),
    transit_score INTEGER CHECK (transit_score >= 0 AND transit_score <= 100),
    walk_score INTEGER,
    crime_rate DECIMAL(5, 2),
    school_rating DECIMAL(3, 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create neighborhood_amenities table
CREATE TABLE neighborhood_amenities (
    id SERIAL PRIMARY KEY,
    neighborhood_id INTEGER REFERENCES neighborhoods(id) ON DELETE CASCADE,
    restaurants_count INTEGER DEFAULT 0,
    bars_count INTEGER DEFAULT 0,
    cafes_count INTEGER DEFAULT 0,
    parks_count INTEGER DEFAULT 0,
    gyms_count INTEGER DEFAULT 0,
    grocery_stores_count INTEGER DEFAULT 0,
    schools_count INTEGER DEFAULT 0,
    hospitals_count INTEGER DEFAULT 0,
    transit_stops_count INTEGER DEFAULT 0,
    bike_lanes_miles DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table for tracking preferences
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    preferences JSONB,
    lifestyle VARCHAR(50),
    budget_min INTEGER,
    budget_max INTEGER,
    priorities TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create user_feedback table for algorithm improvement
CREATE TABLE user_feedback (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES user_sessions(session_id),
    neighborhood_id INTEGER REFERENCES neighborhoods(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    match_score INTEGER,
    was_helpful BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample Seattle neighborhoods
INSERT INTO neighborhoods (name, city, state, latitude, longitude, description, population, median_age, median_income, average_rent, median_home_price) VALUES
('Capitol Hill', 'Seattle', 'WA', 47.6205, -122.3212, 'Vibrant arts district with excellent nightlife, walkable streets, and a strong coffee culture.', 28000, 29, 75000, 2800, 850000),
('Fremont', 'Seattle', 'WA', 47.6517, -122.3493, 'Quirky neighborhood known for its local character, Sunday market, and family-friendly atmosphere.', 15000, 35, 82000, 2400, 720000),
('Ballard', 'Seattle', 'WA', 47.6768, -122.3831, 'Historic maritime neighborhood with a thriving brewery scene and waterfront access.', 22000, 32, 78000, 2600, 780000),
('Queen Anne', 'Seattle', 'WA', 47.6236, -122.3564, 'Upscale neighborhood with stunning city views, close to Seattle Center and cultural attractions.', 18000, 38, 95000, 3200, 950000),
('Georgetown', 'Seattle', 'WA', 47.5420, -122.3237, 'Industrial-chic neighborhood with affordable housing, art studios, and an emerging food scene.', 8000, 31, 65000, 1900, 580000),
('Wallingford', 'Seattle', 'WA', 47.6615, -122.3340, 'Residential neighborhood with tree-lined streets, local shops, and strong community feel.', 19000, 36, 85000, 2500, 750000),
('Belltown', 'Seattle', 'WA', 47.6137, -122.3414, 'Urban downtown living with high-rise condos, restaurants, and nightlife.', 12000, 33, 88000, 3000, 920000),
('Green Lake', 'Seattle', 'WA', 47.6815, -122.3238, 'Family-friendly area centered around the lake with outdoor activities and good schools.', 16000, 37, 79000, 2300, 680000);

-- Insert neighborhood scores
INSERT INTO neighborhood_scores (neighborhood_id, walkability_score, safety_score, affordability_score, nightlife_score, family_friendly_score, transit_score, walk_score, crime_rate, school_rating) VALUES
(1, 95, 75, 60, 90, 65, 85, 95, 4.2, 7.5), -- Capitol Hill
(2, 85, 85, 70, 70, 80, 75, 85, 2.8, 8.2), -- Fremont
(3, 80, 80, 65, 85, 75, 70, 80, 3.1, 7.8), -- Ballard
(4, 75, 90, 55, 60, 85, 80, 75, 1.9, 8.8), -- Queen Anne
(5, 65, 70, 85, 75, 60, 65, 65, 4.8, 6.5), -- Georgetown
(6, 78, 88, 68, 65, 90, 72, 78, 2.2, 9.1), -- Wallingford
(7, 88, 72, 45, 95, 55, 90, 88, 3.8, 7.2), -- Belltown
(8, 82, 92, 75, 55, 95, 68, 82, 1.5, 9.3); -- Green Lake

-- Insert neighborhood amenities
INSERT INTO neighborhood_amenities (neighborhood_id, restaurants_count, bars_count, cafes_count, parks_count, gyms_count, grocery_stores_count, schools_count, hospitals_count, transit_stops_count, bike_lanes_miles) VALUES
(1, 145, 32, 28, 3, 8, 6, 2, 1, 15, 4.2), -- Capitol Hill
(2, 68, 15, 12, 5, 4, 8, 3, 0, 8, 6.1), -- Fremont
(3, 89, 22, 18, 4, 6, 7, 2, 1, 12, 5.3), -- Ballard
(4, 72, 18, 15, 6, 5, 5, 4, 2, 18, 3.8), -- Queen Anne
(5, 35, 8, 6, 2, 3, 4, 1, 0, 6, 2.9), -- Georgetown
(6, 52, 12, 14, 8, 3, 9, 5, 1, 10, 7.2), -- Wallingford
(7, 98, 28, 22, 2, 7, 4, 1, 1, 22, 2.1), -- Belltown
(8, 45, 8, 11, 12, 4, 6, 6, 1, 9, 8.5); -- Green Lake

-- Create indexes for better query performance
CREATE INDEX idx_neighborhoods_city_state ON neighborhoods(city, state);
CREATE INDEX idx_neighborhood_scores_neighborhood_id ON neighborhood_scores(neighborhood_id);
CREATE INDEX idx_neighborhood_amenities_neighborhood_id ON neighborhood_amenities(neighborhood_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_feedback_session_id ON user_feedback(session_id);
CREATE INDEX idx_user_feedback_neighborhood_id ON user_feedback(neighborhood_id);

-- Create a view for complete neighborhood data
CREATE VIEW neighborhood_complete AS
SELECT 
    n.id,
    n.name,
    n.city,
    n.state,
    n.latitude,
    n.longitude,
    n.description,
    n.population,
    n.median_age,
    n.median_income,
    n.average_rent,
    n.median_home_price,
    s.walkability_score,
    s.safety_score,
    s.affordability_score,
    s.nightlife_score,
    s.family_friendly_score,
    s.transit_score,
    s.walk_score,
    s.crime_rate,
    s.school_rating,
    a.restaurants_count,
    a.bars_count,
    a.cafes_count,
    a.parks_count,
    a.gyms_count,
    a.grocery_stores_count,
    a.schools_count,
    a.hospitals_count,
    a.transit_stops_count,
    a.bike_lanes_miles
FROM neighborhoods n
LEFT JOIN neighborhood_scores s ON n.id = s.neighborhood_id
LEFT JOIN neighborhood_amenities a ON n.id = a.neighborhood_id;

-- Create function to calculate overall neighborhood score
CREATE OR REPLACE FUNCTION calculate_overall_score(
    walkability INTEGER,
    safety INTEGER,
    affordability INTEGER,
    nightlife INTEGER,
    family_friendly INTEGER,
    transit INTEGER
) RETURNS INTEGER AS $$
BEGIN
    RETURN ROUND((walkability + safety + affordability + nightlife + family_friendly + transit) / 6.0);
END;
$$ LANGUAGE plpgsql;

-- Create function to find matching neighborhoods
CREATE OR REPLACE FUNCTION find_neighborhood_matches(
    user_walkability INTEGER DEFAULT 5,
    user_safety INTEGER DEFAULT 5,
    user_affordability INTEGER DEFAULT 5,
    user_nightlife INTEGER DEFAULT 5,
    user_family_friendly INTEGER DEFAULT 5,
    user_transit INTEGER DEFAULT 5,
    max_results INTEGER DEFAULT 10
) RETURNS TABLE (
    neighborhood_id INTEGER,
    neighborhood_name VARCHAR(100),
    match_score INTEGER,
    weighted_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.name,
        calculate_overall_score(s.walkability_score, s.safety_score, s.affordability_score, 
                              s.nightlife_score, s.family_friendly_score, s.transit_score) as match_score,
        ROUND(
            (s.walkability_score * user_walkability + 
             s.safety_score * user_safety + 
             s.affordability_score * user_affordability + 
             s.nightlife_score * user_nightlife + 
             s.family_friendly_score * user_family_friendly + 
             s.transit_score * user_transit) / 
            (user_walkability + user_safety + user_affordability + 
             user_nightlife + user_family_friendly + user_transit)::DECIMAL, 2
        ) as weighted_score
    FROM neighborhoods n
    JOIN neighborhood_scores s ON n.id = s.neighborhood_id
    ORDER BY weighted_score DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Insert sample user session for testing
INSERT INTO user_sessions (session_id, preferences, lifestyle, budget_min, budget_max, priorities) VALUES
('test-session-001', 
 '{"walkability": [8], "safety": [9], "nightlife": [6], "familyFriendly": [7], "publicTransit": [8]}',
 'young-professional',
 2000,
 3000,
 ARRAY['Walkable amenities', 'Safe neighborhood', 'Public transportation']);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_neighborhoods_updated_at 
    BEFORE UPDATE ON neighborhoods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your environment)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO neighborfit_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO neighborfit_app;

COMMIT;
