export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY',
  COMPLEX_MC = 'COMPLEX_MC',
  DRAG_AND_DROP = 'DRAG_AND_DROP',
  FILL_IN_BLANKS = 'FILL_IN_BLANKS'
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For MC and Complex MC
  correctAnswer: any; // string, string[], or object for drag and drop
  explanation: string;
  difficulty?: Difficulty;
  matrixData?: any; // For visual questions
}

export interface Example {
  label: string;
  data: (number | string)[][] | (number | string)[];
}

export interface SubTopic {
  id: string;
  title: string;
  content: string;
  examples: Example[];
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  subTopics: SubTopic[];
  quizzes: Question[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface DuelResult {
  winner: 1 | 2 | null;
  player1Score: number;
  player2Score: number;
  duration: number;
}

export interface GameState {
  currentStageIndex: number;
  currentSubTopicIndex: number;
  isQuizActive: boolean;
  score: number;
  streak: number;
  unlockedRewards: string[];
  completedStages: string[];
  difficulty: Difficulty;
  achievements: string[]; // IDs of unlocked achievements
  labExperiments: number; // Counter for scientist achievement
}
