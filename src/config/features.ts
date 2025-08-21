// Feature flags for stretch features
export const FEATURE_FLAGS = {
  SMART_PRIORITIZE: false, // Set to true to enable Smart Prioritize button
  GENERATE_SUBTASKS: false, // Set to true to enable Generate Subtasks feature
  FILTER_PILLS: false, // Set to true to enable filter pills (All | Active | Completed)
} as const;

// Stub functions for stretch features
export const smartPrioritize = (taskTitle: string): 'High' | 'Medium' | 'Low' => {
  // Stub implementation - would use AI/ML in production
  const keywords = {
    high: ['urgent', 'important', 'deadline', 'asap', 'critical', 'emergency'],
    medium: ['meeting', 'call', 'review', 'plan', 'schedule'],
    low: ['organize', 'clean', 'buy', 'read', 'watch']
  };
  
  const title = taskTitle.toLowerCase();
  
  if (keywords.high.some(keyword => title.includes(keyword))) {
    return 'High';
  } else if (keywords.medium.some(keyword => title.includes(keyword))) {
    return 'Medium';
  } else {
    return 'Low';
  }
};

export const generateSubtasks = (taskTitle: string): string[] => {
  // Stub implementation - would use AI/ML in production
  const subtaskTemplates: Record<string, string[]> = {
    'meeting': [
      'Prepare agenda',
      'Send calendar invite',
      'Gather relevant documents',
      'Set up meeting room/video call',
      'Follow up with action items'
    ],
    'project': [
      'Define project scope',
      'Create timeline',
      'Assign team members',
      'Set up project tracking',
      'Schedule kickoff meeting'
    ],
    'presentation': [
      'Create outline',
      'Design slides',
      'Practice delivery',
      'Prepare Q&A responses',
      'Test technical setup'
    ]
  };
  
  const title = taskTitle.toLowerCase();
  
  // Simple keyword matching - would be more sophisticated in production
  for (const [keyword, subtasks] of Object.entries(subtaskTemplates)) {
    if (title.includes(keyword)) {
      return subtasks;
    }
  }
  
  // Default generic subtasks
  return [
    'Research and gather information',
    'Create initial plan',
    'Execute main work',
    'Review and refine',
    'Complete and document'
  ];
};
