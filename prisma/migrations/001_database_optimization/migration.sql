-- Database optimization migration
-- Adds indexes, fixes cascade rules, and improves data integrity

-- Step 1: Add critical indexes for performance
-- User indexes
CREATE INDEX idx_user_email ON "User" ("email");
CREATE INDEX idx_user_role_status ON "User" ("role", "status");
CREATE INDEX idx_user_created_at ON "User" ("createdAt");
CREATE INDEX idx_user_last_login ON "User" ("lastLoginAt");

-- Idea indexes
CREATE INDEX idx_idea_status_priority ON "Idea" ("status", "priority");
CREATE INDEX idx_idea_created_by ON "Idea" ("createdBy");
CREATE INDEX idx_idea_created_at ON "Idea" ("createdAt");
CREATE INDEX idx_idea_rice_score ON "Idea" ("riceScore") WHERE "riceScore" IS NOT NULL;
CREATE INDEX idx_idea_category ON "Idea" ("category") WHERE "category" IS NOT NULL;
CREATE INDEX idx_idea_title_text ON "Idea" USING gin(to_tsvector('russian', "title"));

-- Hypothesis indexes
CREATE INDEX idx_hypothesis_status_level ON "Hypothesis" ("status", "level");
CREATE INDEX idx_hypothesis_idea_id ON "Hypothesis" ("ideaId");
CREATE INDEX idx_hypothesis_created_by ON "Hypothesis" ("createdBy");
CREATE INDEX idx_hypothesis_owner ON "Hypothesis" ("ownerUserId") WHERE "ownerUserId" IS NOT NULL;
CREATE INDEX idx_hypothesis_created_at ON "Hypothesis" ("createdAt");
CREATE INDEX idx_hypothesis_priority ON "Hypothesis" ("priority");
CREATE INDEX idx_hypothesis_rice_score ON "Hypothesis" ("riceScore") WHERE "riceScore" IS NOT NULL;

-- Experiment indexes
CREATE INDEX idx_experiment_status_type ON "Experiment" ("status", "type");
CREATE INDEX idx_experiment_hypothesis_id ON "Experiment" ("hypothesisId");
CREATE INDEX idx_experiment_created_by ON "Experiment" ("createdBy");
CREATE INDEX idx_experiment_dates ON "Experiment" ("startDate", "endDate");
CREATE INDEX idx_experiment_actual_dates ON "Experiment" ("actualStartDate", "actualEndDate");

-- MVP indexes
CREATE INDEX idx_mvp_status_type ON "MVP" ("status", "type");
CREATE INDEX idx_mvp_experiment_id ON "MVP" ("experimentId");
CREATE INDEX idx_mvp_created_by ON "MVP" ("createdBy");

-- Comment indexes for efficient queries
CREATE INDEX idx_comment_idea_created ON "Comment" ("ideaId", "createdAt") WHERE "ideaId" IS NOT NULL;
CREATE INDEX idx_comment_hypothesis_created ON "Comment" ("hypothesisId", "createdAt") WHERE "hypothesisId" IS NOT NULL;
CREATE INDEX idx_comment_experiment_created ON "Comment" ("experimentId", "createdAt") WHERE "experimentId" IS NOT NULL;
CREATE INDEX idx_comment_mvp_created ON "Comment" ("mvpId", "createdAt") WHERE "mvpId" IS NOT NULL;
CREATE INDEX idx_comment_user_id ON "Comment" ("userId");

-- Activity indexes for audit trails
CREATE INDEX idx_activity_user_created ON "Activity" ("userId", "createdAt");
CREATE INDEX idx_activity_entity ON "Activity" ("entityType", "entityId");
CREATE INDEX idx_activity_type ON "Activity" ("type");

-- ICE Score indexes for analytics
CREATE INDEX idx_ice_score_idea ON "ICEScore" ("ideaId", "userId") WHERE "ideaId" IS NOT NULL;
CREATE INDEX idx_ice_score_hypothesis ON "ICEScore" ("hypothesisId", "userId") WHERE "hypothesisId" IS NOT NULL;

-- Step 2: Add soft delete fields
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Idea" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Hypothesis" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Experiment" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "MVP" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Comment" ADD COLUMN "deletedAt" TIMESTAMP;

-- Create indexes for soft delete queries
CREATE INDEX idx_user_deleted ON "User" ("deletedAt") WHERE "deletedAt" IS NOT NULL;
CREATE INDEX idx_idea_deleted ON "Idea" ("deletedAt") WHERE "deletedAt" IS NOT NULL;
CREATE INDEX idx_hypothesis_deleted ON "Hypothesis" ("deletedAt") WHERE "deletedAt" IS NOT NULL;
CREATE INDEX idx_experiment_deleted ON "Experiment" ("deletedAt") WHERE "deletedAt" IS NOT NULL;
CREATE INDEX idx_mvp_deleted ON "MVP" ("deletedAt") WHERE "deletedAt" IS NOT NULL;
CREATE INDEX idx_comment_deleted ON "Comment" ("deletedAt") WHERE "deletedAt" IS NOT NULL;

-- Step 3: Add data validation constraints
-- Ensure RICE components are in valid ranges
ALTER TABLE "Idea" ADD CONSTRAINT chk_idea_impact_range CHECK ("impact" IS NULL OR ("impact" >= 1 AND "impact" <= 5));
ALTER TABLE "Idea" ADD CONSTRAINT chk_idea_confidence_range CHECK ("confidence" IS NULL OR ("confidence" >= 0 AND "confidence" <= 100));
ALTER TABLE "Idea" ADD CONSTRAINT chk_idea_effort_positive CHECK ("effort" IS NULL OR "effort" > 0);
ALTER TABLE "Idea" ADD CONSTRAINT chk_idea_reach_positive CHECK ("reach" IS NULL OR "reach" > 0);

ALTER TABLE "Hypothesis" ADD CONSTRAINT chk_hypothesis_impact_range CHECK ("impact" IS NULL OR ("impact" >= 1 AND "impact" <= 5));
ALTER TABLE "Hypothesis" ADD CONSTRAINT chk_hypothesis_confidence_range CHECK ("confidence" IS NULL OR ("confidence" >= 0 AND "confidence" <= 100));
ALTER TABLE "Hypothesis" ADD CONSTRAINT chk_hypothesis_effort_positive CHECK ("effort" IS NULL OR "effort" > 0);
ALTER TABLE "Hypothesis" ADD CONSTRAINT chk_hypothesis_reach_positive CHECK ("reach" IS NULL OR "reach" > 0);
ALTER TABLE "Hypothesis" ADD CONSTRAINT chk_hypothesis_confidence_level_range CHECK ("confidenceLevel" >= 0 AND "confidenceLevel" <= 100);

-- ICE Score constraints
ALTER TABLE "ICEScore" ADD CONSTRAINT chk_ice_impact_range CHECK ("impact" >= 1 AND "impact" <= 10);
ALTER TABLE "ICEScore" ADD CONSTRAINT chk_ice_confidence_range CHECK ("confidence" >= 1 AND "confidence" <= 10);
ALTER TABLE "ICEScore" ADD CONSTRAINT chk_ice_ease_range CHECK ("ease" >= 1 AND "ease" <= 10);

-- Ensure valid date ranges for experiments
ALTER TABLE "Experiment" ADD CONSTRAINT chk_experiment_date_range CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "endDate" >= "startDate");
ALTER TABLE "Experiment" ADD CONSTRAINT chk_experiment_actual_date_range CHECK ("actualEndDate" IS NULL OR "actualStartDate" IS NULL OR "actualEndDate" >= "actualStartDate");

-- Step 4: Improve foreign key constraints with proper cascade rules
-- Drop existing foreign keys that need to be updated
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_experimentId_fkey";
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_hypothesisId_fkey";
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_ideaId_fkey";
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_mvpId_fkey";

-- Add updated foreign key constraints with proper cascade behavior
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "Hypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_mvpId_fkey" FOREIGN KEY ("mvpId") REFERENCES "MVP"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update hypothesis-idea relationship to CASCADE
ALTER TABLE "Hypothesis" DROP CONSTRAINT "Hypothesis_ideaId_fkey";
ALTER TABLE "Hypothesis" ADD CONSTRAINT "Hypothesis_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update experiment-hypothesis relationship to CASCADE
ALTER TABLE "Experiment" DROP CONSTRAINT "Experiment_hypothesisId_fkey";
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "Hypothesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update MVP-experiment relationship to CASCADE
ALTER TABLE "MVP" DROP CONSTRAINT "MVP_experimentId_fkey";
ALTER TABLE "MVP" ADD CONSTRAINT "MVP_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update SuccessCriteria-hypothesis relationship to CASCADE
ALTER TABLE "SuccessCriteria" DROP CONSTRAINT "SuccessCriteria_hypothesisId_fkey";
ALTER TABLE "SuccessCriteria" ADD CONSTRAINT "SuccessCriteria_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "Hypothesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update ExperimentResult-experiment relationship to CASCADE
ALTER TABLE "ExperimentResult" DROP CONSTRAINT "ExperimentResult_experimentId_fkey";
ALTER TABLE "ExperimentResult" ADD CONSTRAINT "ExperimentResult_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Add missing unique constraints for data integrity
-- Ensure hypothesis titles are unique within an idea
ALTER TABLE "Hypothesis" ADD CONSTRAINT unq_hypothesis_title_per_idea UNIQUE ("ideaId", "title");

-- Ensure experiment titles are unique within a hypothesis
ALTER TABLE "Experiment" ADD CONSTRAINT unq_experiment_title_per_hypothesis UNIQUE ("hypothesisId", "title");

-- Ensure MVP titles are unique within an experiment
ALTER TABLE "MVP" ADD CONSTRAINT unq_mvp_title_per_experiment UNIQUE ("experimentId", "title");

-- Ensure success criteria names are unique within a hypothesis
ALTER TABLE "SuccessCriteria" ADD CONSTRAINT unq_success_criteria_name_per_hypothesis UNIQUE ("hypothesisId", "name");

-- Step 6: Create composite indexes for common query patterns
-- Composite index for idea filtering and sorting
CREATE INDEX idx_idea_status_priority_created ON "Idea" ("status", "priority", "createdAt");

-- Composite index for hypothesis workflow queries
CREATE INDEX idx_hypothesis_status_level_priority ON "Hypothesis" ("status", "level", "priority");

-- Composite index for experiment timeline queries
CREATE INDEX idx_experiment_status_dates ON "Experiment" ("status", "startDate", "endDate");

-- Composite index for user activity queries
CREATE INDEX idx_user_role_active_created ON "User" ("role", "isActive", "createdAt");

-- Step 7: Add triggers for automatic RICE score calculation
CREATE OR REPLACE FUNCTION calculate_rice_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate RICE score for Ideas
    IF TG_TABLE_NAME = 'Idea' THEN
        IF NEW.reach IS NOT NULL AND NEW.impact IS NOT NULL AND NEW.confidence IS NOT NULL AND NEW.effort IS NOT NULL AND NEW.effort > 0 THEN
            NEW."riceScore" = (NEW.reach::float * NEW.impact::float * NEW.confidence::float / 100.0) / NEW.effort::float;
        ELSE
            NEW."riceScore" = NULL;
        END IF;
    END IF;

    -- Calculate RICE score for Hypotheses
    IF TG_TABLE_NAME = 'Hypothesis' THEN
        IF NEW.reach IS NOT NULL AND NEW.impact IS NOT NULL AND NEW.confidence IS NOT NULL AND NEW.effort IS NOT NULL AND NEW.effort > 0 THEN
            NEW."riceScore" = (NEW.reach::float * NEW.impact::float * NEW.confidence::float / 100.0) / NEW.effort::float;
        ELSE
            NEW."riceScore" = NULL;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic RICE calculation
DROP TRIGGER IF EXISTS trg_idea_rice_score ON "Idea";
CREATE TRIGGER trg_idea_rice_score
    BEFORE INSERT OR UPDATE ON "Idea"
    FOR EACH ROW EXECUTE FUNCTION calculate_rice_score();

DROP TRIGGER IF EXISTS trg_hypothesis_rice_score ON "Hypothesis";
CREATE TRIGGER trg_hypothesis_rice_score
    BEFORE INSERT OR UPDATE ON "Hypothesis"
    FOR EACH ROW EXECUTE FUNCTION calculate_rice_score();

-- Step 8: Add audit trigger for tracking changes
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert audit record for important entity changes
    IF TG_OP = 'INSERT' THEN
        INSERT INTO "Activity" ("type", "description", "entityType", "entityId", "userId", "metadata")
        VALUES (
            'CREATED',
            'Entity created: ' || TG_TABLE_NAME,
            LOWER(TG_TABLE_NAME),
            NEW.id,
            COALESCE(NEW."createdBy", NEW."userId", 'system'),
            jsonb_build_object('operation', 'INSERT', 'table', TG_TABLE_NAME)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        -- Only log if status changed (for workflow tracking)
        IF (TG_TABLE_NAME = 'Idea' AND OLD.status != NEW.status) OR
           (TG_TABLE_NAME = 'Hypothesis' AND OLD.status != NEW.status) OR
           (TG_TABLE_NAME = 'Experiment' AND OLD.status != NEW.status) OR
           (TG_TABLE_NAME = 'MVP' AND OLD.status != NEW.status) THEN
            INSERT INTO "Activity" ("type", "description", "entityType", "entityId", "userId", "metadata")
            VALUES (
                'STATUS_CHANGED',
                'Status changed from ' || OLD.status || ' to ' || NEW.status,
                LOWER(TG_TABLE_NAME),
                NEW.id,
                COALESCE(NEW."createdBy", NEW."userId", 'system'),
                jsonb_build_object('operation', 'STATUS_CHANGE', 'oldStatus', OLD.status, 'newStatus', NEW.status)
            );
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for key entities
DROP TRIGGER IF EXISTS trg_idea_audit ON "Idea";
CREATE TRIGGER trg_idea_audit
    AFTER INSERT OR UPDATE ON "Idea"
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

DROP TRIGGER IF EXISTS trg_hypothesis_audit ON "Hypothesis";
CREATE TRIGGER trg_hypothesis_audit
    AFTER INSERT OR UPDATE ON "Hypothesis"
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

DROP TRIGGER IF EXISTS trg_experiment_audit ON "Experiment";
CREATE TRIGGER trg_experiment_audit
    AFTER INSERT OR UPDATE ON "Experiment"
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

DROP TRIGGER IF EXISTS trg_mvp_audit ON "MVP";
CREATE TRIGGER trg_mvp_audit
    AFTER INSERT OR UPDATE ON "MVP"
    FOR EACH ROW EXECUTE FUNCTION audit_changes();