import { useState, useEffect, useCallback, useMemo } from 'react';
import { StudentCourse, StudentAssignment } from '../types';

const STUDENT_DATA_KEY = 'atlauz_student_data';

interface StudentDataState {
  courses: StudentCourse[];
  assignments: StudentAssignment[];
}

const DEFAULT_STATE: StudentDataState = {
  courses: [],
  assignments: [],
};

/**
 * Hook for managing student courses and assignments with localStorage persistence
 * Data is saved automatically on any change
 * Optimized with memoization for performance
 */
export const useStudentData = () => {
  const [data, setData] = useState<StudentDataState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STUDENT_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StudentDataState;
        setData(parsed);
      }
    } catch (error) {
      console.error('Failed to load student data from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Debounced save to localStorage to avoid excessive writes
  useEffect(() => {
    if (!isLoaded) return;
    
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save student data to localStorage:', error);
      }
    }, 300); // Debounce by 300ms

    return () => clearTimeout(timeoutId);
  }, [data, isLoaded]);

  // Course management
  const addCourse = useCallback((course: Omit<StudentCourse, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCourse: StudentCourse = {
      ...course,
      id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
    return newCourse;
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<StudentCourse>) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.map((course) =>
        course.id === id
          ? { ...course, ...updates, updatedAt: new Date().toISOString() }
          : course
      ),
    }));
  }, []);

  const removeCourse = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.filter((course) => course.id !== id),
      // Remove assignments for this course
      assignments: prev.assignments.filter((assignment) => assignment.courseId !== id),
    }));
  }, []);

  // Assignment management
  const addAssignment = useCallback(
    (assignment: Omit<StudentAssignment, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newAssignment: StudentAssignment = {
        ...assignment,
        id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setData((prev) => ({
        ...prev,
        assignments: [...prev.assignments, newAssignment],
        // Increment assignment count for the course
        courses: prev.courses.map((course) =>
          course.id === assignment.courseId
            ? { ...course, totalAssignments: course.totalAssignments + 1 }
            : course
        ),
      }));
      return newAssignment;
    },
    []
  );

  const updateAssignment = useCallback((id: string, updates: Partial<StudentAssignment>) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((assignment) =>
        assignment.id === id
          ? { ...assignment, ...updates, updatedAt: new Date().toISOString() }
          : assignment
      ),
    }));
  }, []);

  const removeAssignment = useCallback((id: string) => {
    setData((prev) => {
      const assignment = prev.assignments.find((a) => a.id === id);
      return {
        ...prev,
        assignments: prev.assignments.filter((assignment) => assignment.id !== id),
        // Decrement assignment count for the course
        courses: prev.courses.map((course) =>
          course.id === assignment?.courseId && assignment
            ? { ...course, totalAssignments: Math.max(0, course.totalAssignments - 1) }
            : course
        ),
      };
    });
  }, []);

  // Get upcoming assignments (sorted by due date)
  const getUpcomingAssignments = useCallback(() => {
    return [...data.assignments].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });
  }, [data.assignments]);

  // Get assignments for a specific course (memoized)
  const getAssignmentsForCourse = useCallback(
    (courseId: string) => {
      return data.assignments.filter((assignment) => assignment.courseId === courseId);
    },
    [data.assignments]
  );

  // Memoized sorted assignments for performance
  const sortedAssignments = useMemo(() => getUpcomingAssignments(), [getUpcomingAssignments]);

  return {
    data,
    isLoaded,
    // Courses
    addCourse,
    updateCourse,
    removeCourse,
    // Assignments
    addAssignment,
    updateAssignment,
    removeAssignment,
    getAssignmentsForCourse,
    getUpcomingAssignments,
    sortedAssignments, // Pre-sorted for performance
  };
};

export default useStudentData;
