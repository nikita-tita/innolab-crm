import { z } from "zod"

// Базовые схемы
export const baseSchemas = {
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  status: z.string().min(1),
  url: z.string().url().optional(),
  percentage: z.number().min(0).max(100),
  positiveNumber: z.number().min(0),
  score: z.number().optional(),
  date: z.string().datetime().or(z.date())
}

// Пользователи
export const userSchemas = {
  create: z.object({
    name: baseSchemas.name,
    email: baseSchemas.email,
    password: z.string().min(6),
    role: z.enum(['LAB_DIRECTOR', 'PRODUCT_MANAGER', 'UX_RESEARCHER', 'MARKETER', 'SALES_EXPERT', 'OPERATIONS_EXPERT', 'HYPOTHESIS_OWNER', 'VIEWER', 'STAKEHOLDER', 'ADMIN'])
  }),

  update: z.object({
    name: baseSchemas.name.optional(),
    email: baseSchemas.email.optional(),
    role: z.enum(['LAB_DIRECTOR', 'PRODUCT_MANAGER', 'UX_RESEARCHER', 'MARKETER', 'SALES_EXPERT', 'OPERATIONS_EXPERT', 'HYPOTHESIS_OWNER', 'VIEWER', 'STAKEHOLDER', 'ADMIN']).optional(),
    status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
    isActive: z.boolean().optional()
  }),

  login: z.object({
    email: baseSchemas.email,
    password: z.string().min(1)
  })
}

// Идеи
export const ideaSchemas = {
  create: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(10).max(2000),
    category: z.string().max(100).optional(),
    priority: baseSchemas.priority.default('MEDIUM'),
    context: z.string().max(1000).optional(),
    // RICE компоненты
    reach: baseSchemas.positiveNumber.optional(),
    impact: z.number().min(1).max(5).optional(),
    confidence: baseSchemas.percentage.optional(),
    effort: baseSchemas.positiveNumber.min(1).optional()
  }),

  update: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
    category: z.string().max(100).optional(),
    priority: baseSchemas.priority.optional(),
    status: z.enum(['NEW', 'SCORED', 'SELECTED', 'IN_HYPOTHESIS', 'COMPLETED', 'ARCHIVED']).optional(),
    context: z.string().max(1000).optional(),
    reach: baseSchemas.positiveNumber.optional(),
    impact: z.number().min(1).max(5).optional(),
    confidence: baseSchemas.percentage.optional(),
    effort: baseSchemas.positiveNumber.min(1).optional()
  }),

  riceUpdate: z.object({
    reach: baseSchemas.positiveNumber,
    impact: z.number().min(1).max(5),
    confidence: baseSchemas.percentage,
    effort: baseSchemas.positiveNumber.min(1),
    score: baseSchemas.positiveNumber
  })
}

// Гипотезы
export const hypothesisSchemas = {
  create: z.object({
    title: z.string().min(1).max(200),
    description: baseSchemas.description,
    statement: z.string().min(10).max(1000),
    ideaId: baseSchemas.id,
    level: z.enum(['LEVEL_1', 'LEVEL_2']).default('LEVEL_1'),
    priority: baseSchemas.priority.default('MEDIUM'),
    confidenceLevel: baseSchemas.percentage.default(50),
    testingMethod: z.string().max(500).optional(),
    successCriteriaText: z.string().max(1000).optional(),
    // Бизнес-контекст
    targetAudience: z.string().max(500).optional(),
    userValue: z.string().max(500).optional(),
    businessImpact: z.string().max(500).optional(),
    financialImpact: z.string().max(500).optional(),
    strategicAlignment: z.string().max(500).optional(),
    // RICE компоненты
    reach: baseSchemas.positiveNumber.optional(),
    impact: z.number().min(1).max(5).optional(),
    confidence: baseSchemas.percentage.optional(),
    effort: baseSchemas.positiveNumber.min(1).optional(),
    // Компоненты формулировки
    actionDescription: z.string().max(500).optional(),
    expectedResult: z.string().max(500).optional(),
    reasoning: z.string().max(500).optional()
  }),

  update: z.object({
    title: z.string().min(1).max(200).optional(),
    description: baseSchemas.description,
    statement: z.string().min(10).max(1000).optional(),
    level: z.enum(['LEVEL_1', 'LEVEL_2']).optional(),
    priority: baseSchemas.priority.optional(),
    status: z.enum(['DRAFT', 'SCORED', 'RESEARCH', 'EXPERIMENT_DESIGN', 'READY_FOR_TESTING', 'IN_EXPERIMENT', 'COMPLETED', 'VALIDATED', 'INVALIDATED', 'ITERATION', 'ARCHIVED']).optional(),
    confidenceLevel: baseSchemas.percentage.optional(),
    testingMethod: z.string().max(500).optional(),
    successCriteriaText: z.string().max(1000).optional(),
    targetAudience: z.string().max(500).optional(),
    userValue: z.string().max(500).optional(),
    businessImpact: z.string().max(500).optional(),
    financialImpact: z.string().max(500).optional(),
    strategicAlignment: z.string().max(500).optional(),
    reach: baseSchemas.positiveNumber.optional(),
    impact: z.number().min(1).max(5).optional(),
    confidence: baseSchemas.percentage.optional(),
    effort: baseSchemas.positiveNumber.min(1).optional(),
    actionDescription: z.string().max(500).optional(),
    expectedResult: z.string().max(500).optional(),
    reasoning: z.string().max(500).optional()
  }),

  deskResearch: z.object({
    notes: z.string().max(5000).optional(),
    sources: z.array(z.string()).or(z.string()).optional(),
    risks: z.array(z.string()).or(z.string()).optional(),
    opportunities: z.array(z.string()).or(z.string()).optional(),
    marketSize: z.string().max(200).optional(),
    competitors: z.array(z.string()).or(z.string()).optional(),
    assumptions: z.string().max(1000).optional()
  }),

  statusUpdate: z.object({
    status: z.enum(['DRAFT', 'SCORED', 'RESEARCH', 'EXPERIMENT_DESIGN', 'READY_FOR_TESTING', 'IN_EXPERIMENT', 'COMPLETED', 'VALIDATED', 'INVALIDATED', 'ITERATION', 'ARCHIVED'])
  })
}

// Эксперименты
export const experimentSchemas = {
  create: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(10).max(2000),
    hypothesisId: baseSchemas.id,
    type: z.enum(['USER_INTERVIEW', 'AB_TEST', 'PROTOTYPE_TEST', 'MVP_TEST', 'SURVEY', 'MARKET_RESEARCH', 'WIZARD_OF_OZ', 'LANDING_PAGE', 'DATA_ANALYSIS', 'OTHER']).default('OTHER'),
    startDate: baseSchemas.date.optional(),
    endDate: baseSchemas.date.optional(),
    methodology: z.string().max(1000).optional(),
    timeline: z.string().max(500).optional(),
    resources: z.string().max(1000).optional(),
    successMetrics: z.string().max(1000).optional()
  }),

  update: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
    type: z.enum(['USER_INTERVIEW', 'AB_TEST', 'PROTOTYPE_TEST', 'MVP_TEST', 'SURVEY', 'MARKET_RESEARCH', 'WIZARD_OF_OZ', 'LANDING_PAGE', 'DATA_ANALYSIS', 'OTHER']).optional(),
    status: z.enum(['PLANNING', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED']).optional(),
    startDate: baseSchemas.date.optional(),
    endDate: baseSchemas.date.optional(),
    actualStartDate: baseSchemas.date.optional(),
    actualEndDate: baseSchemas.date.optional(),
    methodology: z.string().max(1000).optional(),
    timeline: z.string().max(500).optional(),
    resources: z.string().max(1000).optional(),
    successMetrics: z.string().max(1000).optional()
  })
}

// Критерии успеха
export const successCriteriaSchemas = {
  create: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    targetValue: z.number(),
    actualValue: z.number().optional(),
    unit: z.string().min(1).max(20),
    achieved: z.boolean().default(false)
  }),

  update: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    targetValue: z.number().optional(),
    actualValue: z.number().optional(),
    unit: z.string().min(1).max(20).optional(),
    achieved: z.boolean().optional()
  })
}

// MVP
export const mvpSchemas = {
  create: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(10).max(2000),
    experimentId: baseSchemas.id,
    type: z.enum(['PROTOTYPE', 'LANDING_PAGE', 'WIREFRAME', 'DEMO', 'OTHER', 'MOCKUP']),
    url: baseSchemas.url,
    features: z.string().max(2000).optional(),
    technicalSpecs: z.string().max(2000).optional(),
    resources: z.string().max(1000).optional(),
    timeline: z.string().max(500).optional(),
    successCriteria: z.string().max(1000).optional()
  }),

  update: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
    type: z.enum(['PROTOTYPE', 'LANDING_PAGE', 'WIREFRAME', 'DEMO', 'OTHER', 'MOCKUP']).optional(),
    status: z.enum(['PLANNING', 'DEVELOPMENT', 'TESTING', 'DEPLOYED', 'ARCHIVED']).optional(),
    url: baseSchemas.url,
    features: z.string().max(2000).optional(),
    technicalSpecs: z.string().max(2000).optional(),
    resources: z.string().max(1000).optional(),
    timeline: z.string().max(500).optional(),
    successCriteria: z.string().max(1000).optional()
  })
}

// Результаты экспериментов
export const experimentResultSchemas = {
  create: z.object({
    metricName: z.string().min(1).max(100),
    value: z.number(),
    unit: z.string().min(1).max(20),
    notes: z.string().max(1000).optional()
  }),

  update: z.object({
    metricName: z.string().min(1).max(100).optional(),
    value: z.number().optional(),
    unit: z.string().min(1).max(20).optional(),
    notes: z.string().max(1000).optional()
  })
}

// Комментарии
export const commentSchemas = {
  create: z.object({
    content: z.string().min(1).max(2000),
    ideaId: baseSchemas.id.optional(),
    hypothesisId: baseSchemas.id.optional(),
    experimentId: baseSchemas.id.optional(),
    mvpId: baseSchemas.id.optional()
  }).refine(data => {
    const targets = [data.ideaId, data.hypothesisId, data.experimentId, data.mvpId]
    return targets.filter(Boolean).length === 1
  }, {
    message: "Exactly one target (ideaId, hypothesisId, experimentId, or mvpId) must be provided"
  }),

  update: z.object({
    content: z.string().min(1).max(2000)
  })
}

// Фильтры для списков
export const filterSchemas = {
  ideas: z.object({
    status: z.enum(['NEW', 'SCORED', 'SELECTED', 'IN_HYPOTHESIS', 'COMPLETED', 'ARCHIVED']).optional(),
    category: z.string().optional(),
    priority: baseSchemas.priority.optional(),
    search: z.string().optional(),
    include: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  }),

  hypotheses: z.object({
    status: z.enum(['DRAFT', 'SCORED', 'RESEARCH', 'EXPERIMENT_DESIGN', 'READY_FOR_TESTING', 'IN_EXPERIMENT', 'COMPLETED', 'VALIDATED', 'INVALIDATED', 'ITERATION', 'ARCHIVED']).optional(),
    level: z.enum(['LEVEL_1', 'LEVEL_2']).optional(),
    priority: baseSchemas.priority.optional(),
    ideaId: baseSchemas.id.optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  }),

  experiments: z.object({
    status: z.enum(['PLANNING', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED']).optional(),
    type: z.enum(['USER_INTERVIEW', 'AB_TEST', 'PROTOTYPE_TEST', 'MVP_TEST', 'SURVEY', 'MARKET_RESEARCH', 'WIZARD_OF_OZ', 'LANDING_PAGE', 'DATA_ANALYSIS', 'OTHER']).optional(),
    hypothesisId: baseSchemas.id.optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })
}