CREATE TABLE verification_case (
    id BINARY(16) PRIMARY KEY,
    status VARCHAR(32) NOT NULL,
    risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE uploaded_document (
    id BINARY(16) PRIMARY KEY,
    case_id BINARY(16) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    document_type VARCHAR(32) NOT NULL,
    CONSTRAINT fk_uploaded_document_case FOREIGN KEY (case_id) REFERENCES verification_case(id)
);

CREATE TABLE red_flag (
    id BINARY(16) PRIMARY KEY,
    case_id BINARY(16) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    CONSTRAINT fk_red_flag_case FOREIGN KEY (case_id) REFERENCES verification_case(id)
);
