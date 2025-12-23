import { useState, useCallback } from 'react';
import {
  Target,
  MessageSquare,
  Cpu,
  Wrench,
  Database,
  GitBranch,
  Layout,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Download,
  RotateCcw
} from 'lucide-react';

import { Input, TextArea, CheckboxCard, LoadingSpinner, ErrorAlert } from '@/components/ui';
import { useWizard, useFormData } from '@/hooks';
import { generateDesign, downloadMarkdown } from '@/services/api';
import type { Step, ApiError, LoadingState } from '@/types';

const steps: Step[] = [
  { id: 1, name: "Purpose & Scope", icon: Target },
  { id: 2, name: "System Prompt Design", icon: MessageSquare },
  { id: 3, name: "Choose LLM", icon: Cpu },
  { id: 4, name: "Tools & Integrations", icon: Wrench },
  { id: 5, name: "Memory Systems", icon: Database },
  { id: 6, name: "Orchestration", icon: GitBranch },
  { id: 7, name: "User Interface", icon: Layout },
  { id: 8, name: "Testing & Evals", icon: ShieldCheck }
];

function App() {
  const { currentStep, isFirstStep, isLastStep, progress, goToNext, goToPrevious } = useWizard(steps);
  const { formData, updateField } = useFormData();

  const [result, setResult] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const handleGenerate = useCallback(async () => {
    setLoadingState('loading');
    setError(null);

    try {
      const response = await generateDesign(formData);
      setResult(response.markdown);
      setLoadingState('success');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoadingState('error');
    }
  }, [formData]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleGenerate();
    } else {
      goToNext();
    }
  }, [isLastStep, handleGenerate, goToNext]);

  const handleStartOver = useCallback(() => {
    setResult(null);
    setError(null);
    setLoadingState('idle');
  }, []);

  const handleDownload = useCallback(() => {
    if (result) {
      downloadMarkdown(result);
    }
  }, [result]);

  const dismissError = useCallback(() => {
    setError(null);
    setLoadingState('idle');
  }, []);

  // Result View
  if (result) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8 flex justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-5xl border border-slate-200">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Architecture Ready</h2>
              <p className="text-slate-500 mt-1">Your AI System Specification is ready for deployment.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                aria-label="Download design specification as markdown file"
              >
                <Download size={18} aria-hidden="true" /> Download .md
              </button>
              <button
                onClick={handleStartOver}
                className="flex items-center gap-2 border-2 border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                <RotateCcw size={18} aria-hidden="true" /> Start Over
              </button>
            </div>
          </div>
          <div className="relative group">
            <pre
              className="bg-slate-950 text-slate-300 p-8 rounded-2xl overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed h-[600px] shadow-inner border border-slate-800"
              role="region"
              aria-label="Generated design specification"
              tabIndex={0}
            >
              {result}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 font-sans antialiased text-slate-900">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-white/20">

        {/* Sidebar Navigation */}
        <nav
          className="w-full md:w-72 bg-slate-900 p-8 text-white hidden md:flex flex-col"
          aria-label="Wizard steps"
        >
          <div className="mb-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Cpu className="text-white" size={24} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase">Architect</h1>
          </div>

          <ol className="flex-1 space-y-2" role="list">
            {steps.map((step, idx) => (
              <li
                key={step.id}
                className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 ${
                  idx === currentStep
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-2'
                  : idx < currentStep
                  ? 'text-blue-400 opacity-80'
                  : 'text-slate-500 opacity-60'
                }`}
                aria-current={idx === currentStep ? 'step' : undefined}
              >
                <div className={`p-2 rounded-lg ${idx === currentStep ? 'bg-white/20' : 'bg-slate-800'}`}>
                  <step.icon size={18} aria-hidden="true" />
                </div>
                <span className="text-sm font-bold truncate">{step.name}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-2xl p-4">
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Session Date</p>
              <p className="text-xs font-mono text-blue-400">{new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden" role="main">

          {/* Header */}
          <header className="p-8 pb-4 flex justify-between items-start border-b border-slate-50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Phase {currentStep + 1}
                </span>
                <div className="h-1 w-1 bg-slate-300 rounded-full" aria-hidden="true"></div>
                <span className="text-slate-400 text-xs font-medium">System Designer Agent</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight flex items-center gap-3">
                <StepIcon size={32} className="text-blue-600" aria-hidden="true" />
                {steps[currentStep].name}
              </h2>
            </div>
            <div className="hidden sm:block" aria-live="polite">
              <p className="text-right text-[10px] uppercase font-bold text-slate-400 tracking-widest">Progress</p>
              <p className="text-xl font-black text-slate-900">{progress}%</p>
            </div>
          </header>

          {/* Error Display */}
          {error && (
            <div className="px-8 pt-4">
              <ErrorAlert message={error.message} onDismiss={dismissError} />
            </div>
          )}

          {/* Form Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-2xl">

              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Use Case"
                    value={formData.purpose.use_case}
                    onChange={v => updateField('purpose', 'use_case', v)}
                    placeholder="e.g. Enterprise Knowledge Base"
                  />
                  <Input
                    label="Success Criteria"
                    value={formData.purpose.success_criteria}
                    onChange={v => updateField('purpose', 'success_criteria', v)}
                    placeholder="e.g. < 2s Latency"
                  />
                  <div className="md:col-span-2">
                    <TextArea
                      label="User Needs"
                      value={formData.purpose.user_needs}
                      onChange={v => updateField('purpose', 'user_needs', v)}
                      placeholder="What specific problems are we solving?"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextArea
                      label="Constraints"
                      value={formData.purpose.constraints}
                      onChange={v => updateField('purpose', 'constraints', v)}
                      placeholder="Budget, Tech Stack, Regulatory requirements"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <Input
                    label="Role / Persona"
                    value={formData.prompt.role}
                    onChange={v => updateField('prompt', 'role', v)}
                    placeholder="Who is this agent?"
                  />
                  <TextArea
                    label="Primary Goals"
                    value={formData.prompt.goals}
                    onChange={v => updateField('prompt', 'goals', v)}
                    placeholder="What should it achieve?"
                  />
                  <TextArea
                    label="Core Instructions"
                    value={formData.prompt.instructions}
                    onChange={v => updateField('prompt', 'instructions', v)}
                    placeholder="Detailed behavioral logic..."
                  />
                  <TextArea
                    label="Guardrails"
                    value={formData.prompt.guardrails}
                    onChange={v => updateField('prompt', 'guardrails', v)}
                    placeholder="What should it NEVER do?"
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Base Model"
                    value={formData.model.base_model}
                    onChange={v => updateField('model', 'base_model', v)}
                    placeholder="Claude 3.5, GPT-4o..."
                  />
                  <Input
                    label="Context Window"
                    value={formData.model.context_window}
                    onChange={v => updateField('model', 'context_window', v)}
                    placeholder="128k, 200k..."
                  />
                  <Input
                    label="Temperature / Params"
                    value={formData.model.parameters}
                    onChange={v => updateField('model', 'parameters', v)}
                    placeholder="Temp: 0.7, Top-P: 0.9"
                  />
                  <Input
                    label="Cost/Latency Tradeoff"
                    value={formData.model.cost_latency_tradeoff}
                    onChange={v => updateField('model', 'cost_latency_tradeoff', v)}
                    placeholder="Focus on quality or speed?"
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <Input
                    label="APIs & Connectors"
                    value={formData.tools.apis}
                    onChange={v => updateField('tools', 'apis', v)}
                    placeholder="Stripe, Twilio, Slack (comma separated)"
                  />
                  <Input
                    label="MCP Servers"
                    value={formData.tools.mcp_servers}
                    onChange={v => updateField('tools', 'mcp_servers', v)}
                    placeholder="filesystem, github, brave-search"
                  />
                  <TextArea
                    label="Custom Functions / Tools"
                    value={formData.tools.custom_functions}
                    onChange={v => updateField('tools', 'custom_functions', v)}
                    placeholder="Define specialized agent capabilities..."
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4" role="group" aria-label="Memory options">
                    <CheckboxCard
                      label="Episodic"
                      description="Enable conversational history memory"
                      checked={formData.memory.episodic}
                      onChange={checked => updateField('memory', 'episodic', checked)}
                    />
                    <CheckboxCard
                      label="Working"
                      description="Enable short-term active context"
                      checked={formData.memory.working_memory}
                      onChange={checked => updateField('memory', 'working_memory', checked)}
                    />
                  </div>
                  <Input
                    label="Vector Database"
                    value={formData.memory.vector_db}
                    onChange={v => updateField('memory', 'vector_db', v)}
                    placeholder="Pinecone, Weaviate, Milvus..."
                  />
                  <Input
                    label="SQL / Structured Storage"
                    value={formData.memory.sql_db}
                    onChange={v => updateField('memory', 'sql_db', v)}
                    placeholder="PostgreSQL, MongoDB..."
                  />
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <Input
                    label="Workflow Patterns"
                    value={formData.orchestration.workflow}
                    onChange={v => updateField('orchestration', 'workflow', v)}
                    placeholder="Router, Sequential, Graph-based..."
                  />
                  <Input
                    label="System Triggers"
                    value={formData.orchestration.triggers}
                    onChange={v => updateField('orchestration', 'triggers', v)}
                    placeholder="User input, Event-based, CRON..."
                  />
                  <TextArea
                    label="Error Handling Logic"
                    value={formData.orchestration.error_handling}
                    onChange={v => updateField('orchestration', 'error_handling', v)}
                    placeholder="How do we handle hallucinations or API failures?"
                  />
                </div>
              )}

              {currentStep === 6 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Platform"
                    value={formData.interface.platform}
                    onChange={v => updateField('interface', 'platform', v)}
                    placeholder="Web App, CLI, Slack Bot..."
                  />
                  <Input
                    label="Interaction Mode"
                    value={formData.interface.interaction_mode}
                    onChange={v => updateField('interface', 'interaction_mode', v)}
                    placeholder="Chat, Proactive, Voice..."
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="API Endpoint Strategy"
                      value={formData.interface.api_endpoint}
                      onChange={v => updateField('interface', 'api_endpoint', v)}
                      placeholder="REST, WebSocket, GraphQL..."
                    />
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-6">
                  <Input
                    label="Unit Test Scenarios"
                    value={formData.testing.unit_tests}
                    onChange={v => updateField('testing', 'unit_tests', v)}
                    placeholder="e.g. Identity check, Tool failure (comma separated)"
                  />
                  <Input
                    label="Quality Metrics"
                    value={formData.testing.quality_metrics}
                    onChange={v => updateField('testing', 'quality_metrics', v)}
                    placeholder="Accuracy, RAG retrieval score, CSAT..."
                  />
                  <TextArea
                    label="Evaluation Strategy"
                    value={formData.testing.evals}
                    onChange={v => updateField('testing', 'evals', v)}
                    placeholder="LLM-as-a-judge, Human review, Semantic comparison..."
                  />
                </div>
              )}

            </div>
          </div>

          {/* Footer Controls */}
          <footer className="p-8 bg-slate-50 flex justify-between items-center border-t border-slate-100">
            <button
              onClick={goToPrevious}
              disabled={isFirstStep}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                isFirstStep
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-white hover:shadow-sm active:scale-95'
              }`}
              aria-label="Go to previous step"
            >
              <ChevronLeft size={20} aria-hidden="true" /> Back
            </button>

            <div className="flex gap-4">
              <div className="hidden sm:flex items-center gap-1.5 px-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'bg-blue-600 w-4'
                        : idx < currentStep
                          ? 'bg-blue-200 w-1.5'
                          : 'bg-slate-200 w-1.5'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={loadingState === 'loading'}
                className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                aria-label={isLastStep ? 'Finish and generate design' : 'Go to next step'}
              >
                {loadingState === 'loading' ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Processing...
                  </>
                ) : isLastStep ? (
                  <>Finish & Generate <ChevronRight size={20} aria-hidden="true" /></>
                ) : (
                  <>Next Step <ChevronRight size={20} aria-hidden="true" /></>
                )}
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
