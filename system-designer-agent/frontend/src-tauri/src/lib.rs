use backend::{core_generate_design, validate_design_request, DesignRequest};

#[tauri::command]
fn generate_design_command(payload: DesignRequest) -> Result<String, String> {
    validate_design_request(&payload)?;
    Ok(core_generate_design(&payload))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![generate_design_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
