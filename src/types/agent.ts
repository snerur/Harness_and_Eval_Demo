/**
 * Core type definitions for Agent Harness, Evals, and Iterative Feedback Loops.
 */

export type EvalCategory =
  | 'safety_financial'
  | 'hallucination'
  | 'bias_fairness'
  | 'toxicity_deescalation'
  | 'policy_logic';

export interface OrderItem {
  id: string;
  name: string;
  category: 'electronics' | 'apparel' | 'home' | 'final_sale';
  price: number;
  serialNumber?: string;
  isOpened: boolean;
  isFinalSale: boolean;
}

export interface OrderContext {
  orderId: string;
  customerName: string;
  purchaseDaysAgo: number;
  deliveryDaysAgo: number;
  totalAmount: number;
  items: OrderItem[];
  paymentMethod: string;
  deliveryStatus: 'delivered' | 'in_transit' | 'cancelled';
}

export interface CustomerProfile {
  name: string;
  persona: string;
  dialectOrTone: 'standard' | 'colloquial_aave' | 'formal_aggressive' | 'profane_hostile' | 'pleading_emotional' | 'adversarial_injection';
  biasProbeCategory?: 'ethnicity_proxy' | 'socioeconomic_proxy' | 'assertiveness_proxy';
}

export interface GroundTruthExpectation {
  expectedAction: 'approve_refund' | 'partial_refund_restock' | 'decline_policy' | 'escalate_human' | 'request_clarification';
  expectedRefundAmount: number;
  requiresRestockingFee: boolean;
  shouldEscalate: boolean;
  forbiddenClaims: string[]; // e.g. "lifetime warranty", "2-year guarantee", "$500 refund approved"
  requiredPolicyCitations: string[]; // e.g. "Section 1", "Section 2"
}

export interface TestCase {
  id: string;
  code: string; // e.g. "TC-01"
  title: string;
  description: string;
  category: EvalCategory;
  customerProfile: CustomerProfile;
  userMessage: string;
  orderContext: OrderContext;
  groundTruth: GroundTruthExpectation;
  explanation: string;
}

export interface PolicySection {
  id: string;
  sectionNumber: string;
  title: string;
  summary: string;
  fullText: string;
  disclaimers: string[];
}

export type IterationVersion = 'v1-naive' | 'v2-prompted' | 'v3-guardrailed';

export interface AgentIterationConfig {
  id: IterationVersion;
  name: string;
  shortDesc: string;
  badge: string;
  hasSystemPrompt: boolean;
  hasToolCalling: boolean;
  hasPreGuardrails: boolean;
  hasToolInvariants: boolean;
  hasPostGroundedVerifier: boolean;
  hasToxicityFilter: boolean;
  hasDialectNormalizer: boolean;
  description: string;
}

export interface GuardrailSettings {
  enforceFinancialCap: boolean; // limit to $150
  enforce30DayInvariant: boolean; // reject returns >30 days
  enforceFinalSaleInvariant: boolean; // reject final sale items
  enforceRestockingFee: boolean; // apply 15% on opened electronics
  enforceGroundingCheck: boolean; // verify against policy DB
  enforceToxicityGuardrail: boolean; // de-escalate aggressive prompts
  enforceDialectNeutralizer: boolean; // fairness across styles
}

export interface ToolCall {
  id: string;
  name: 'lookup_order' | 'calculate_restocking_fee' | 'execute_refund' | 'escalate_to_human';
  arguments: Record<string, any>;
  result?: Record<string, any>;
  status: 'allowed' | 'intercepted_by_invariant' | 'error';
  invariantError?: string;
  timestampMs: number;
}

export interface PreGuardrailResult {
  passed: boolean;
  checksRun: string[];
  findings: string[];
  sanitizedInput?: string;
}

export interface GroundingCheckResult {
  faithfulnessScore: number; // 0 to 100
  hallucinationsDetected: string[];
  citedClauses: string[];
  groundedRatio: number;
}

export interface EvalScores {
  overallScore: number; // 0 to 100
  passed: boolean;
  financialSafety: number; // 0 to 100
  groundingFaithfulness: number; // 0 to 100 (100 = 0 hallucinations)
  biasFairness: number; // 0 to 100 (100 = zero disparity)
  toxicityResistance: number; // 0 to 100
  policyAccuracy: number; // 0 to 100
  failureReasons: string[];
  passedTestCriteria: string[];
}

export interface HarnessTrace {
  id: string;
  testCaseId: string;
  iterationId: string;
  startedAt: string;
  latencyMs: number;
  tokenCount: {
    input: number;
    output: number;
    total: number;
  };
  mockFixturesLoaded: {
    orderId: string;
    customerName: string;
    policyChunksRetrieved: number;
  };
  preGuardrails: PreGuardrailResult;
  agentThoughts: string;
  rawAgentResponse: string;
  toolCalls: ToolCall[];
  groundingResult: GroundingCheckResult;
  evalScores: EvalScores;
  guardrailInterventions: string[];
}

export interface IterationMetricsRecord {
  iterationId: IterationVersion;
  label: string;
  date: string;
  totalRuns: number;
  passRate: number; // percentage
  hallucinationRate: number; // percentage (lower is better)
  biasDisparityRate: number; // percentage (lower is better)
  financialInvariantPassRate: number; // percentage
  toxicityDeescalationRate: number; // percentage
  avgLatencyMs: number;
  avgTokens: number;
  keyImprovements: string[];
}
