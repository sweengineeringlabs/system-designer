use std::net::SocketAddr;
use std::sync::atomic::Ordering;

use backend::{app_with_config, config::Config, health::READY, logging};
use tracing::info;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load configuration from environment
    let config = Config::from_env().map_err(|e| anyhow::anyhow!("Configuration error: {}", e))?;

    // Initialize logging
    logging::init(&config.log_level)?;

    // Build the application
    let app = app_with_config(&config)?;

    let addr = SocketAddr::from((config.host, config.port));
    info!(address = %addr, "Server starting");

    let listener = tokio::net::TcpListener::bind(addr).await?;

    // Serve with graceful shutdown
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    info!("Server shutdown complete");
    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("Failed to install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            info!("Received Ctrl+C, initiating graceful shutdown");
        }
        _ = terminate => {
            info!("Received SIGTERM, initiating graceful shutdown");
        }
    }

    // Mark as not ready to stop accepting new requests
    READY.store(false, Ordering::SeqCst);

    // Give in-flight requests time to complete
    info!("Waiting for in-flight requests to complete...");
    tokio::time::sleep(std::time::Duration::from_secs(2)).await;
}
