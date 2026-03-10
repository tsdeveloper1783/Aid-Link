
-- =========================================
-- 1. Roles
-- =========================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Seed roles
INSERT INTO roles (role_name) VALUES ('donor'), ('recipient')
ON CONFLICT DO NOTHING;

-- =========================================
-- 2. Users & Auth
-- =========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    phone_number VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 3. User Profiles (Common Profile Data)
-- =========================================
CREATE TABLE user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    address TEXT,
    city VARCHAR(100),
    profile_picture TEXT,
    agreed_terms BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','banned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 4. Donations & Payment
-- =========================================
CREATE TABLE donations (
    donation_id SERIAL PRIMARY KEY,
    donor_user_id INT REFERENCES users(user_id) ON DELETE SET NULL, -- nullable for anonymous donations
    recipient_application_id INT NULL REFERENCES aid_applications(application_id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(8) DEFAULT 'PKR',
    frequency VARCHAR(20) CHECK (frequency IN ('once', 'weekly', 'fortnightly', 'monthly')) DEFAULT 'once',
    donation_purpose TEXT,
    note TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','successful','failed','refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods (e.g., card, easypaisa, etc.)
CREATE TABLE payment_methods (
    method_id SERIAL PRIMARY KEY,
    method_key VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    metadata JSONB
);

-- Transaction details for donations (securely store transaction data)
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    donation_id INT NOT NULL REFERENCES donations(donation_id) ON DELETE CASCADE,
    method_id INT REFERENCES payment_methods(method_id),
    gateway_txn_id VARCHAR(200),
    card_token VARCHAR(255),
    last4 CHAR(4),
    transaction_status VARCHAR(20) DEFAULT 'pending' CHECK (transaction_status IN ('pending','successful','failed','cancelled')),
    response JSONB,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 5. Donor & Recipient Profiles
-- =========================================
CREATE TABLE donor_profiles (
    donor_profile_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    city VARCHAR(100),
    total_donations_count INT DEFAULT 0,
    total_donated_amount NUMERIC(14,2) DEFAULT 0,
    about TEXT,
    verified BOOLEAN DEFAULT FALSE,
    member_since DATE DEFAULT CURRENT_DATE
);

CREATE TABLE recipient_profiles (
    recipient_profile_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NULL REFERENCES users(user_id) ON DELETE SET NULL, -- nullable if public recipients
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    father_name VARCHAR(150),
    family_members INT,
    previous_job VARCHAR(150),
    city VARCHAR(100),
    address TEXT,
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('Low','Medium','High','Urgent')) DEFAULT 'Medium',
    about TEXT,
    profile_image TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 6. Aid Applications (Recipient Requests)
-- =========================================
CREATE TABLE aid_applications (
    application_id SERIAL PRIMARY KEY,
    recipient_profile_id INT NOT NULL REFERENCES recipient_profiles(recipient_profile_id) ON DELETE CASCADE,
    cnic VARCHAR(30),
    aid_type VARCHAR(50) CHECK (aid_type IN ('Education','Medical','Orphan','Food')),
    case_title VARCHAR(255),
    description TEXT,
    required_amount NUMERIC(12,2),
    collected_amount NUMERIC(12,2) DEFAULT 0,
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('Low','Medium','High')) DEFAULT 'Medium',
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending','Under Review','Approved','Rejected','Completed')),
    declaration_1 BOOLEAN DEFAULT FALSE,
    declaration_2 BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INT REFERENCES users(user_id),
    reviewed_at TIMESTAMP
);

CREATE INDEX idx_aid_applications_status ON aid_applications(status);
CREATE INDEX idx_aid_applications_recipient ON aid_applications(recipient_profile_id);

-- =========================================
-- 7. Aid Documents
-- =========================================
CREATE TABLE aid_documents (
    document_id SERIAL PRIMARY KEY,
    application_id INT NOT NULL REFERENCES aid_applications(application_id) ON DELETE CASCADE,
    document_type VARCHAR(120),
    file_path TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size_bytes INT,
    uploaded_by INT REFERENCES users(user_id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 8. Donation Allocations (Tracking Partial Donations)
-- =========================================
CREATE TABLE donation_allocations (
    allocation_id SERIAL PRIMARY KEY,
    donation_id INT NOT NULL REFERENCES donations(donation_id) ON DELETE CASCADE,
    application_id INT NOT NULL REFERENCES aid_applications(application_id) ON DELETE CASCADE,
    amount_allocated NUMERIC(12,2) NOT NULL CHECK (amount_allocated > 0),
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 9. Messaging & Notifications
-- =========================================
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    metadata JSONB,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('info','success','warning','error')) DEFAULT 'info',
    related_kind VARCHAR(50),
    related_id INT,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

-- =========================================
-- 10. Preferences & Notification Settings (per user)
-- =========================================
CREATE TABLE user_preferences (
    pref_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    language VARCHAR(30) DEFAULT 'English',
    currency VARCHAR(10) DEFAULT 'PKR',
    date_format VARCHAR(30) DEFAULT 'DD-MM-YYYY'
);

CREATE TABLE user_notification_settings (
    settings_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    donation_emails BOOLEAN DEFAULT TRUE,
    monthly_reports BOOLEAN DEFAULT FALSE,
    new_recipient_alerts BOOLEAN DEFAULT FALSE
);

-- =========================================
-- 11. Role Change Requests & Account Logs
-- =========================================
CREATE TABLE role_change_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    cnic VARCHAR(30) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INT REFERENCES users(user_id),
    reviewed_at TIMESTAMP
);

CREATE TABLE account_deletion_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    confirmation_text VARCHAR(50),
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 12. Contact Page Messages
-- =========================================
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone_number VARCHAR(30),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','responded','archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- Useful Indexes
-- =========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_donations_donor ON donations(donor_user_id);
CREATE INDEX idx_transactions_donation ON transactions(donation_id);

