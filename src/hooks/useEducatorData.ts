import { useState, useEffect, useCallback, useMemo } from 'react';

const EDUCATOR_DATA_KEY = 'atlauz_educator_data';

export interface ClassSection {
  id: string;
  name: string;
  code: string;
  students: number;
  engagement: number; // 0-100
  averageGrade: string; // A, B+, etc.
  pendingSubmissions: number;
  createdAt: string;
  updatedAt: string;
}

interface EducatorDataState {
  classes: ClassSection[];
}

const DEFAULT_STATE: EducatorDataState = {
  classes: [],
};

/**
 * Hook for managing educator classes with localStorage persistence
 * Same pattern as useStudentData for consistency
 */
export const useEducatorData = () => {
  const [data, setData] = useState<EducatorDataState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(EDUCATOR_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as EducatorDataState;
        setData(parsed);
      }
    } catch (error) {
      console.error('Failed to load educator data from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(EDUCATOR_DATA_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save educator data to localStorage:', error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [data, isLoaded]);

  // Class management
  const addClass = useCallback((classData: Omit<ClassSection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClass: ClassSection = {
      ...classData,
      id: `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      classes: [...prev.classes, newClass],
    }));
    return newClass;
  }, []);

  const updateClass = useCallback((id: string, updates: Partial<ClassSection>) => {
    setData((prev) => ({
      ...prev,
      classes: prev.classes.map((cls) =>
        cls.id === id
          ? { ...cls, ...updates, updatedAt: new Date().toISOString() }
          : cls
      ),
    }));
  }, []);

  const removeClass = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      classes: prev.classes.filter((cls) => cls.id !== id),
    }));
  }, []);

  // Memoized sorted classes by engagement
  const sortedClasses = useMemo(() => {
    return [...data.classes].sort((a, b) => b.engagement - a.engagement);
  }, [data.classes]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const total = data.classes.length;
    if (total === 0) {
      return {
        totalStudents: 0,
        averageEngagement: 0,
        pendingAssignments: 0,
        submitRate: 0,
        averageGrade: 'N/A',
      };
    }

    const totalStudents = data.classes.reduce((sum, c) => sum + c.students, 0);
    const averageEngagement = Math.round(
      data.classes.reduce((sum, c) => sum + c.engagement, 0) / total
    );
    const pendingAssignments = data.classes.reduce((sum, c) => sum + c.pendingSubmissions, 0);

    return {
      totalStudents,
      averageEngagement,
      pendingAssignments,
      submitRate: 94, // Mock for now
      averageGrade: 'B+', // Mock for now
    };
  }, [data.classes]);

  return {
    data,
    isLoaded,
    addClass,
    updateClass,
    removeClass,
    sortedClasses,
    analytics,
  };
};

export default useEducatorData;
