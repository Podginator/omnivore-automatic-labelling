export type LabelSelectionConfig = {
  labelSelectionType: 'PERCENTAGES' | 'HIGHEST_SIMILARITY' | 'PER_LABEL_PERCENTAGE'
  percentages?: { percentage: number; maxLabels: number }[]
  maxLabels?: number
  labels?: { name: string; percentage: number }[]
  filters: string[]
}

/**
 * Configuration for choosing the maximum number of allowed labels. If the label similarity is above 0.9, it allows a max of 5 labels.
 * As it goes down, it allows less labels, as they're less likely to be relevant.
 */
export const SELECTION_CONFIG: LabelSelectionConfig = {
  labelSelectionType: 'PERCENTAGES',
  percentages: [
    {
      percentage: 0.75,
      maxLabels: 3,
    },
    {
      percentage: 0.7,
      maxLabels: 2,
    },
    {
      percentage: 0.5,
      maxLabels: 2,
    },
  ],
  filters: ['RSS', 'Politics'],
}

/**
 * This will always add the two most similar labels, regardless of their % similarity score.
 */
// export const SELECTION_CONFIG: LabelSelectionConfig = {
//   "labelSelectionType": "HIGHEST_SIMILARITY",
//   maxLabels: 2,
//  "filters": ["RSS"]

// }

/**
 * This will add the labels below, but only if they're in the list and above the %
 */
// export const SELECTION_CONFIG: LabelSelectionConfig = {
//   "labelSelectionType": "PER_LABEL_PERCENTAGE",
//   labels: {
//     "AI": 0.75
//   },
//  "filters": ["RSS"]
// }
