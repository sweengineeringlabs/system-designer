use axum::routing::{get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use tower_http::limit::RequestBodyLimitLayer;
use tower_http::trace::TraceLayer;
use tracing::info;
use validator::Validate;

pub mod config;
pub mod error;
pub mod extractors;
pub mod health;
pub mod logging;
pub mod middleware;

use crate::config::Config;
use crate::error::{AppError, AppResult};
use crate::extractors::ValidatedJson;
use crate::health::{health_check, readiness_check};
use crate::middleware::{cors_layer, security_headers};

/// Build the application router with configuration
pub fn app_with_config(config: &Config) -> Result<Router, AppError> {
    let cors = cors_layer(config)?;

    let router = Router::new()
        .route("/health", get(health_check))
        .route("/ready", get(readiness_check))
        .route("/generate", post(generate_design))
        .layer(axum::middleware::from_fn(security_headers))
        .layer(TraceLayer::new_for_http())
        .layer(RequestBodyLimitLayer::new(config.max_body_size))
        .layer(cors);

    Ok(router)
}

/// Build a default application router (for tests and backward compatibility)
pub fn app() -> Router {
    let config = Config::default();
    app_with_config(&config).expect("Failed to create app with default config")
}

// ============================================================================
// Request/Response Types with Validation
// ============================================================================

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct DesignRequest {
    #[validate(nested)]
    pub purpose: Purpose,
    #[validate(nested)]
    pub prompt: Prompt,
    #[validate(nested)]
    pub model: ModelConfig,
    #[validate(nested)]
    pub tools: Tools,
    pub memory: Memory,
    #[validate(nested)]
    pub orchestration: Orchestration,
    #[validate(nested)]
    pub interface: Interface,
    #[validate(nested)]
    pub testing: Testing,
}

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct Purpose {
    #[validate(length(max = 500))]
    pub use_case: String,
    #[validate(length(max = 2000))]
    pub user_needs: String,
    #[validate(length(max = 2000))]
    pub success_criteria: String,
    #[validate(length(max = 2000))]
    pub constraints: String,
}

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct Prompt {
    #[validate(length(max = 2000))]
    pub goals: String,
    #[validate(length(max = 500))]
    pub role: String,
    #[validate(length(max = 10000))]
    pub instructions: String,
    #[validate(length(max = 5000))]
    pub guardrails: String,
}

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct ModelConfig {
    #[validate(length(max = 100))]
    pub base_model: String,
    #[validate(length(max = 500))]
    pub parameters: String,
    #[validate(length(max = 100))]
    pub context_window: String,
    #[validate(length(max = 500))]
    pub cost_latency_tradeoff: String,
}

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct Tools {
    #[validate(length(max = 50))]
    pub apis: Vec<String>,
    #[validate(length(max = 20))]
    pub mcp_servers: Vec<String>,
    #[validate(length(max = 5000))]
    pub custom_functions: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Memory {
    pub episodic: bool,
    pub working_memory: bool,
    pub vector_db: String,
    pub sql_db: String,
}

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct Orchestration {
    #[validate(length(max = 200))]
    pub workflow: String,
    #[validate(length(max = 1000))]
    pub triggers: String,
    #[validate(length(max = 1000))]
    pub error_handling: String,
}

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct Interface {
    #[validate(length(max = 100))]
    pub platform: String,
    #[validate(length(max = 200))]
    pub interaction_mode: String,
    #[validate(length(max = 500))]
    pub api_endpoint: String,
}

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct Testing {
    #[validate(length(max = 100))]
    pub unit_tests: Vec<String>,
    #[validate(length(max = 1000))]
    pub quality_metrics: String,
    #[validate(length(max = 2000))]
    pub evals: String,
}

#[derive(Serialize)]
struct DesignResponse {
    markdown: String,
}

// ============================================================================
// Core Logic (pure function - no side effects)
// ============================================================================

/// Validate a design request (for Tauri integration)
pub fn validate_design_request(request: &DesignRequest) -> Result<(), String> {
    request.validate().map_err(|e| {
        e.field_errors()
            .into_iter()
            .flat_map(|(field, errors)| {
                errors.iter().map(move |err| {
                    format!(
                        "{}: {}",
                        field,
                        err.message
                            .as_ref()
                            .map(|c| c.to_string())
                            .unwrap_or_else(|| "invalid".to_string())
                    )
                })
            })
            .collect::<Vec<_>>()
            .join("; ")
    })
}

/// Generate design document from request (pure logic)
pub fn core_generate_design(payload: &DesignRequest) -> String {
    format!(
        r#"# System Design Specification: {}

## 1. Purpose & Scope
- **Use Case:** {}
- **User Needs:** {}
- **Success Criteria:** {}
- **Constraints:** {}

## 2. System Prompt Design
- **Role & Persona:** {}
- **Primary Goals:** {}
- **Instructions:** {}
- **Guardrails:** {}

## 3. Model Selection
- **Base Model:** {}
- **Parameters:** {}
- **Context Window:** {}
- **Tradeoffs:** {}

## 4. Tools & Integrations
- **External APIs:** {:?}
- **MCP Servers:** {:?}
- **Custom Functions:** {}

## 5. Memory Systems
- **Episodic Memory:** {}
- **Working Memory:** {}
- **Vector Database:** {}
- **SQL/Structured DB:** {}

## 6. Orchestration
- **Workflow Pattern:** {}
- **System Triggers:** {}
- **Error Handling:** {}

## 7. User Interface
- **Platform:** {}
- **Interaction Mode:** {}
- **API Strategy:** {}

## 8. Testing & Evals
- **Unit Tests:** {:?}
- **Quality Metrics:** {}
- **Evaluation Strategy:** {}

---
*Generated by System Designer Agent*"#,
        payload.purpose.use_case,
        payload.purpose.use_case,
        payload.purpose.user_needs,
        payload.purpose.success_criteria,
        payload.purpose.constraints,
        payload.prompt.role,
        payload.prompt.goals,
        payload.prompt.instructions,
        payload.prompt.guardrails,
        payload.model.base_model,
        payload.model.parameters,
        payload.model.context_window,
        payload.model.cost_latency_tradeoff,
        payload.tools.apis,
        payload.tools.mcp_servers,
        payload.tools.custom_functions,
        payload.memory.episodic,
        payload.memory.working_memory,
        payload.memory.vector_db,
        payload.memory.sql_db,
        payload.orchestration.workflow,
        payload.orchestration.triggers,
        payload.orchestration.error_handling,
        payload.interface.platform,
        payload.interface.interaction_mode,
        payload.interface.api_endpoint,
        payload.testing.unit_tests,
        payload.testing.quality_metrics,
        payload.testing.evals
    )
}

// ============================================================================
// HTTP Handler
// ============================================================================

async fn generate_design(
    ValidatedJson(payload): ValidatedJson<DesignRequest>,
) -> AppResult<Json<DesignResponse>> {
    info!(use_case = %payload.purpose.use_case, "Processing design generation request");

    let md = core_generate_design(&payload);

    info!(output_length = md.len(), "Design generation complete");
    Ok(Json(DesignResponse { markdown: md }))
}
