use backend::{
    DesignRequest, Purpose, Prompt, ModelConfig, Tools, Memory, Orchestration, Interface, Testing
};
// Import the public command function (need to make it public in lib.rs first or test logic directly)
// Since the tauri command just wraps core_generate_design which is already tested in backend,
// we want to test that the Tauri BUILD and specific command wrapper works.
// However, tauri commands are often private.
// Best practice: Test the shared logic (already done in backend) and minimal integration test here.

#[test]
fn test_tauri_command_integration() {
    // Construct the complex payload
    let payload = DesignRequest {
        purpose: Purpose {
            use_case: "Desktop App".into(),
            user_needs: "Speed".into(),
            success_criteria: "Works".into(),
            constraints: "None".into(),
        },
        prompt: Prompt {
            goals: "G".into(),
            role: "R".into(),
            instructions: "I".into(),
            guardrails: "G".into(),
        },
        model: ModelConfig {
            base_model: "M".into(),
            parameters: "P".into(),
            context_window: "C".into(),
            cost_latency_tradeoff: "T".into(),
        },
        tools: Tools {
            apis: vec!["A".into()],
            mcp_servers: vec!["M".into()],
            custom_functions: "C".into(),
        },
        memory: Memory {
            episodic: true,
            working_memory: false,
            vector_db: "V".into(),
            sql_db: "S".into(),
        },
        orchestration: Orchestration {
            workflow: "W".into(),
            triggers: "T".into(),
            error_handling: "E".into(),
        },
        interface: Interface {
            platform: "P".into(),
            interaction_mode: "I".into(),
            api_endpoint: "A".into(),
        },
        testing: Testing {
            unit_tests: vec!["U".into()],
            quality_metrics: "Q".into(),
            evals: "E".into(),
        },
    };

    // Call the core function directly (simulating what the command does)
    // This confirms dependency linking works
    let result = backend::core_generate_design(&payload);
    
    assert!(result.contains("# System Design Specification: Desktop App"));
    assert!(result.contains("**Use Case:** Desktop App"));
}
