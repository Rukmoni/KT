export interface SeoKeyword {
  id: string;
  keyword: string;
  target_url: string;
  position: number | null;
  previous_position: number | null;
  monthly_volume: number;
  competition: 'low' | 'medium' | 'high';
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  notes: string;
  last_checked: string;
  created_at: string;
}

export interface SeoAction {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'local' | 'content' | 'backlinks' | 'ai-seo' | 'performance';
  frequency: 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  is_completed: boolean;
  completed_at: string | null;
  due_date: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  automation_possible: boolean;
  created_at: string;
}

export interface SeoCheck {
  id: string;
  check_name: string;
  check_type: 'technical' | 'content' | 'performance' | 'structured-data' | 'ai-seo' | 'local';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  detail: string;
  checked_at: string;
}
