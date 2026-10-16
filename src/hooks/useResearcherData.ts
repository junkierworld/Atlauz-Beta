import { useState, useEffect, useCallback, useMemo } from 'react';

const RESEARCHER_DATA_KEY = 'atlauz_researcher_data';

export interface ResearchProject {
  id: string;
  title: string;
  status: 'active' | 'in-review' | 'completed' | 'archived';
  collaborators: number;
  citations: number;
  progress: number; // 0-100
  papers?: string[]; // Paper IDs
  createdAt: string;
  updatedAt: string;
}

interface ResearcherDataState {
  projects: ResearchProject[];
}

const DEFAULT_STATE: ResearcherDataState = {
  projects: [],
};

/**
 * Hook for managing researcher projects with localStorage persistence
 * Same pattern as useStudentData for consistency
 */
export const useResearcherData = () => {
  const [data, setData] = useState<ResearcherDataState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RESEARCHER_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ResearcherDataState;
        setData(parsed);
      }
    } catch (error) {
      console.error('Failed to load researcher data from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(RESEARCHER_DATA_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save researcher data to localStorage:', error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [data, isLoaded]);

  // Project management
  const addProject = useCallback((project: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: ResearchProject = {
      ...project,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ResearchProject>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      ),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
  }, []);

  // Memoized sorted projects by progress
  const sortedProjects = useMemo(() => {
    return [...data.projects].sort((a, b) => b.progress - a.progress);
  }, [data.projects]);

  // Calculate citation stats
  const citationStats = useMemo(() => {
    return {
      totalCitations: data.projects.reduce((sum, p) => sum + p.citations, 0),
      activeProjects: data.projects.filter((p) => p.status === 'active').length,
      totalProjects: data.projects.length,
    };
  }, [data.projects]);

  return {
    data,
    isLoaded,
    addProject,
    updateProject,
    removeProject,
    sortedProjects,
    citationStats,
  };
};

export default useResearcherData;
