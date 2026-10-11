export type Department = 'Engineering' | 'FinTech' | 'Security & Compliance' | 'Customer Experience' | 'Legal' | 'Data Science';

export type PromptStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'DEPRECATED';

export type ModelCompatibility = 'GPT-4o' | 'Claude 3.5 Sonnet' | 'Gemini 1.5 Pro' | 'Llama 3' | 'Mistral Large';

export type UserType = 'ENTERPRISE' | 'PUBLIC';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: UserType;
  role: string;
  organization?: {
    id: string;
    name: string;
    domain: string;
    department: Department;
    tier: 'Enterprise Custom' | 'Team Pro';
  };
  token: string;
}

export interface CoreMetrics {
  accuracy: number; // 0-100
  llmJudge: number; // 0-100
  clarity: number; // 0-100
  reusability: number; // 0-100
  security: number; // 0-100
  costEfficiency: number; // 0-100
  latencyPredictionMs: number; // ms
  latencyScore: number; // 0-100
  promptComplexity: number; // 0-100
  contextPreservation: number; // 0-100
  instructionCompleteness: number; // 0-100
}

export interface EnterpriseMetrics {
  historicalSuccessRate: number; // 0-100
  organizationApprovalScore: number; // 0-100
  developerUsageFrequency: number; // uses / month
  internalDeveloperRating: number; // 0-5.0
  regressionStabilityScore: number; // 0-100
  testCoverageScore: number; // 0-100
  promptInjectionResistance: number; // 0-100
  dataLeakageRisk: 'Zero' | 'Low' | 'Medium' | 'High';
  hallucinationRiskScore: number; // 0-100 (lower is better, or inverted score)
  productionReliabilityScore: number; // 0-100
}

export interface PublicMetrics {
  communityRating: number; // 0-5.0
  numberOfFavorites: number;
  numberOfCopies: number;
  trendingScore: number; // 0-100
  usageGrowthPercent: number;
  communityTrustScore: number; // 0-100
}

export interface PromptQualityScore {
  overallScore: number; // 0-100
  tier: 'Enterprise Ready' | 'Production Grade' | 'Needs Optimization' | 'High Risk';
  health: '🟢 Excellent' | '🟡 Good' | '🔴 Needs Work';
  recommendation: '✅ Recommended for Production' | '⚠️ Recommended with Minor Edits' | '❌ Blocked by Governance';
  core: CoreMetrics;
  enterprise: EnterpriseMetrics;
  public: PublicMetrics;
  summaryHighlights: string[];
}

export interface PromptVersion {
  version: string;
  timestamp: string;
  author: string;
  changeLog: string;
  content: string;
  pqsScore: number;
}

export interface SecurityVulnerability {
  id: string;
  type: 'Prompt Injection' | 'PII Leakage Risk' | 'System Prompt Extraction' | 'Jailbreak Pattern' | 'Unbounded Generation';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  snippet: string;
  remediation: string;
}

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  category: 'Backend' | 'Security' | 'DevOps' | 'Frontend' | 'Data & AI' | 'Customer Support';
  department: Department;
  tags: string[];
  currentVersion: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  variables: string[];
  systemContext?: string;
  targetModels: ModelCompatibility[];
  status: PromptStatus;
  pqs: PromptQualityScore;
  versions: PromptVersion[];
  securityIssues: SecurityVulnerability[];
  createdAt: string;
  updatedAt: string;
  isEnterprise: boolean;
  isFavorite?: boolean;
}

export interface PromptRecommendation {
  prompt: PromptItem;
  rank: number;
  semanticSimilarity: number; // 0-100%
  pqsScore: number;
  accuracy: number;
  securityRating: 'Excellent' | 'Good' | 'Moderate';
  costTier: 'Ultra Low' | 'Low' | 'Moderate' | 'High';
  developerCount: number;
  averageRating: number;
  matchReason: string;
}

export interface OptimizationSuggestion {
  category: 'Missing Instructions' | 'Ambiguity' | 'Context Enhancement' | 'Security Hardening' | 'Token Efficiency' | 'Structure';
  severity: 'RECOMMENDED' | 'CRITICAL' | 'OPTIONAL';
  title: string;
  description: string;
  originalSnippet?: string;
  suggestedSnippet: string;
  tokenSavings?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: 'PROMPT_APPROVED' | 'PROMPT_OPTIMIZED' | 'SECURITY_FLAG_RESOLVED' | 'VERSION_ROLLBACK' | 'API_KEY_GENERATED' | 'PROMPT_DEPRECATED';
  promptTitle: string;
  department: Department;
  ipAddress: string;
  details: string;
}

export interface RegressionTestCase {
  id: string;
  name: string;
  inputVariables: Record<string, string>;
  expectedAssertions: string[];
  actualStatus: 'PASSED' | 'FAILED' | 'RUNNING';
  executionTimeMs: number;
  modelTested: ModelCompatibility;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  maskedKey: string;
  createdDate: string;
  lastUsedDate: string;
  scopes: string[];
  rateLimitPerMin: number;
  status: 'ACTIVE' | 'REVOKED';
}
