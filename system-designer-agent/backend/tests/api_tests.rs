use backend::app;
use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use tower::ServiceExt; // for `oneshot`
use http_body_util::BodyExt; // for `collect`
use serde_json::json;

#[tokio::test]
async fn test_health_check() {
    let app = app();

    let response = app
        .oneshot(Request::builder().uri("/health").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(body_json.get("status").unwrap().as_str().unwrap(), "healthy");
    assert!(body_json.get("timestamp").is_some());
    assert_eq!(body_json.get("version").unwrap().as_str().unwrap(), "0.1.0");
}

#[tokio::test]
async fn test_readiness_check() {
    let app = app();

    let response = app
        .oneshot(Request::builder().uri("/ready").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert!(body_json.get("ready").unwrap().as_bool().unwrap());
    assert!(body_json.get("checks").is_some());
    assert!(body_json.get("timestamp").is_some());
}

#[tokio::test]
async fn test_generate_design_success() {
    let app = app();

    let payload = json!({
        "purpose": {
            "use_case": "Test Bot",
            "user_needs": "Testing",
            "success_criteria": "Pass",
            "constraints": "None"
        },
        "prompt": {
            "goals": "Test",
            "role": "Tester",
            "instructions": "Run tests",
            "guardrails": "None"
        },
        "model": {
            "base_model": "GPT-Test",
            "parameters": "T=0",
            "context_window": "1k",
            "cost_latency_tradeoff": "Balance"
        },
        "tools": {
            "apis": ["TestAPI"],
            "mcp_servers": ["TestMCP"],
            "custom_functions": "None"
        },
        "memory": {
            "episodic": true,
            "working_memory": false,
            "vector_db": "TestVector",
            "sql_db": "TestSQL"
        },
        "orchestration": {
            "workflow": "Sequential",
            "triggers": "Manual",
            "error_handling": "Log"
        },
        "interface": {
            "platform": "CLI",
            "interaction_mode": "Text",
            "api_endpoint": "REST"
        },
        "testing": {
            "unit_tests": ["Test1"],
            "quality_metrics": "Coverage",
            "evals": "Manual"
        }
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/generate")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    let markdown = body_json.get("markdown").unwrap().as_str().unwrap();
    assert!(markdown.contains("# System Design Specification: Test Bot"));
    assert!(markdown.contains("**Use Case:** Test Bot"));
    assert!(markdown.contains("**Role & Persona:** Tester"));
}

#[tokio::test]
async fn test_generate_design_invalid_payload() {
    let app = app();

    // Missing fields (e.g., empty object)
    let payload = json!({});

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/generate")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    // Returns 400 Bad Request for JSON extraction failure (missing fields)
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body_json: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(body_json.get("code").unwrap().as_str().unwrap(), "BAD_REQUEST");
}

#[tokio::test]
async fn test_method_not_allowed() {
    let app = app();

    // POST to /health should be not allowed (only GET)
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/health")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::METHOD_NOT_ALLOWED);
}

#[tokio::test]
async fn test_malformed_json() {
    let app = app();

    // Invalid JSON syntax (missing closing brace)
    let invalid_json = r#"{ "purpose": { "use_case": "Test" "#;

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/generate")
                .header("content-type", "application/json")
                .body(Body::from(invalid_json))
                .unwrap(),
        )
        .await
        .unwrap();

    // Returns 400 Bad Request for syntax errors
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn test_wrong_content_type() {
    let app = app();

    // Valid JSON payload but wrong header
    let payload = json!({ "purpose": { "use_case": "Test" } });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/generate")
                .header("content-type", "text/plain") // Wrong header
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    // Returns 400 Bad Request for wrong content type
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn test_boolean_rendering_logic() {
    let app = app();

    // Create a payload with specific boolean values (false) to check rendering
    let payload = json!({
        "purpose": { "use_case": "", "user_needs": "", "success_criteria": "", "constraints": "" },
        "prompt": { "goals": "", "role": "", "instructions": "", "guardrails": "" },
        "model": { "base_model": "", "parameters": "", "context_window": "", "cost_latency_tradeoff": "" },
        "tools": { "apis": [], "mcp_servers": [], "custom_functions": "" },
        "memory": {
            "episodic": false,  // Testing FALSE
            "working_memory": false,
            "vector_db": "", "sql_db": ""
        },
        "orchestration": { "workflow": "", "triggers": "", "error_handling": "" },
        "interface": { "platform": "", "interaction_mode": "", "api_endpoint": "" },
        "testing": { "unit_tests": [], "quality_metrics": "", "evals": "" }
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/generate")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body_json: serde_json::Value = serde_json::from_slice(&body).unwrap();
    let markdown = body_json.get("markdown").unwrap().as_str().unwrap();

    // Verify that "false" is rendered in the markdown text
    assert!(markdown.contains("- **Episodic Memory:** false"));
}
