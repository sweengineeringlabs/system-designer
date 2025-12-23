use axum::Json;
use serde::Serialize;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

/// Global readiness flag - can be set to false during graceful shutdown
pub static READY: AtomicBool = AtomicBool::new(true);

#[derive(Serialize)]
pub struct HealthResponse {
    status: &'static str,
    timestamp: u64,
    version: &'static str,
}

#[derive(Serialize)]
pub struct ReadinessResponse {
    ready: bool,
    checks: ReadinessChecks,
    timestamp: u64,
}

#[derive(Serialize)]
pub struct ReadinessChecks {
    accepting_requests: bool,
    memory_ok: bool,
}

pub async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "healthy",
        timestamp: current_timestamp(),
        version: env!("CARGO_PKG_VERSION"),
    })
}

pub async fn readiness_check() -> Json<ReadinessResponse> {
    let ready = READY.load(Ordering::SeqCst);
    let memory_ok = check_memory();

    Json(ReadinessResponse {
        ready: ready && memory_ok,
        checks: ReadinessChecks {
            accepting_requests: ready,
            memory_ok,
        },
        timestamp: current_timestamp(),
    })
}

fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

fn check_memory() -> bool {
    use sysinfo::System;

    let mut sys = System::new();
    sys.refresh_memory();

    let available = sys.available_memory();
    let total = sys.total_memory();

    // Consider unhealthy if less than 5% memory available
    if total > 0 {
        (available as f64 / total as f64) > 0.05
    } else {
        true
    }
}
