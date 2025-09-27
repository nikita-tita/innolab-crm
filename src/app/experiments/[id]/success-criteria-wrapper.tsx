"use client"

import { ExperimentSuccessCriteriaManager } from "@/components/ui/experiment-success-criteria"

interface ExperimentSuccessCriteria {
  id?: string
  name: string
  planValue: string
  actualValue?: string
  unit?: string
  isAchieved?: boolean
  notes?: string
}

interface ExperimentSuccessCriteriaWrapperProps {
  experimentId: string
  initialCriteria: ExperimentSuccessCriteria[]
  showActualValues: boolean
  disabled: boolean
}

export default function ExperimentSuccessCriteriaWrapper({
  experimentId,
  initialCriteria,
  showActualValues,
  disabled
}: ExperimentSuccessCriteriaWrapperProps) {

  const handleSave = async (criteria: ExperimentSuccessCriteria[]) => {
    const response = await fetch(`/api/experiments/${experimentId}/success-criteria`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(criteria),
    })

    if (!response.ok) {
      throw new Error('Failed to save success criteria')
    }
  }

  return (
    <ExperimentSuccessCriteriaManager
      experimentId={experimentId}
      initialCriteria={initialCriteria}
      onSave={handleSave}
      showActualValues={showActualValues}
      disabled={disabled}
    />
  )
}