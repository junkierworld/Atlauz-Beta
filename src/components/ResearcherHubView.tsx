import React, { useState, useMemo } from 'react';
import {
  BookMarked,
  Users,
  FileText,
  BarChart3,
  Share2,
  Plus,
  Trash2,
  Edit2,
  Search,
  X as CloseIcon,
} from 'lucide-react';
import {
  CognitiveTelemetry,
  ResourceItem,
  UserAccountSettings,
  CompanionState,
  ConnectedApp,
} from '../types';
import { FrostedPanel } from './FrostedPanel';
import { HubWelcome } from './HubWelcome';
import { Card } from './Card';
import { ActionButton } from './ActionButton';
import { useResearcherData } from '../hooks/useResearcherData';

interface ResearcherHubViewProps {
  telemetry: CognitiveTelemetry;
  connectedApps: ConnectedApp[];
  resources: ResourceItem[];
  companion?: CompanionState;
  onOpenResource: (resource: ResourceItem) => void;
  onCreateResourceClick: () => void;
  onOpenLibrary: () => void;
  onOpenWorkspace: () => void;
  onOpenFishing?: () => void;
  onOpenProfile?: () => void;
  onShowToast: (msg: string) => void;
  settings?: UserAccountSettings;
}

export const ResearcherHubView = React.memo(function ResearcherHubViewComponent({
  telemetry,
  resources,
  companion,
  onOpenResource,
  onCreateResourceClick,
  onOpenLibrary,
  onOpenWorkspace,
  onOpenFishing,
  onShowToast,
  settings,
}: ResearcherHubViewProps) {
  const isDark = settings?.theme === 'dark';

  // UI state
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [frozenPanels, setFrozenPanels] = useState({
    projects: false,
    citations: false,
    papers: false,
  });
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState<'all' | 'active' | 'in-review' | 'completed'>('all');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showAddProject, setShowAddProject] = useState(false);

  // Researcher data
  const { data, addProject, updateProject, removeProject, sortedProjects, citationStats } = useResearcherData();

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = sortedProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) &&
        (projectFilter === 'all' || p.status === projectFilter)
    );
    return filtered;
  }, [sortedProjects, projectSearch, projectFilter]);

  const handleSaveProject = (projectData: any) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
      onShowToast(`Project "${projectData.title}" updated`);
      setEditingProject(null);
    } else {
      addProject(projectData);
      onShowToast(`Project "${projectData.title}" added`);
    }
    setShowAddProject(false);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto space-y-3.5 animate-fade-in pb-20 font-sans">
      {isWelcomeVisible && (
        <HubWelcome
          username={settings?.username || 'Researcher'}
          telemetry={telemetry}
          settings={settings}
          isFirstVisit={false}
          onDismiss={() => setIsWelcomeVisible(false)}
        />
      )}

      {/* Active Research Projects */}
      <FrostedPanel
        id="panel-researcher-projects"
        title={`Active Research Projects (${filteredProjects.length}/${data.projects.length})`}
        icon={<BookMarked className="w-4 h-4 text-white" />}
        badge="Research"
        isFrosted={frozenPanels.projects}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, projects: !p.projects }))}
        isDark={isDark}
        headerActions={
          <button
            onClick={() => {
              setEditingProject(null);
              setShowAddProject(true);
            }}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
            title="Add Project"
          >
            <Plus className="w-4 h-4 text-neutral-400 hover:text-white" />
          </button>
        }
      >
        {/* Search & Filter */}
        {data.projects.length > 0 && (
          <div className="mb-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                }`}
              />
              {projectSearch && (
                <button
                  onClick={() => setProjectSearch('')}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'active', 'in-review', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    projectFilter === filter
                      ? isDark
                        ? 'bg-white text-black'
                        : 'bg-neutral-900 text-white'
                      : isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300'
                  }`}
                >
                  {filter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className={`p-4 rounded border text-center ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'}`}>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {data.projects.length === 0 ? 'No projects yet. ' : 'No matching projects. '}
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowAddProject(true);
                }}
                className="text-white hover:underline font-bold"
              >
                Click + to add one
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} isDark={isDark} className="p-4 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>{project.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`text-xs px-2 py-1 rounded font-mono ${project.status === 'active' ? (isDark ? 'bg-green-950/30 text-green-400' : 'bg-green-100 text-green-700') : (isDark ? 'bg-blue-950/30 text-blue-400' : 'bg-blue-100 text-blue-700')}`}>
                          {project.status === 'active' ? 'Active' : project.status.toUpperCase()}
                        </span>
                        <span className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{project.citations} citations</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className={`w-full h-1.5 rounded-full overflow-hidden mb-3 ${isDark ? 'bg-neutral-800' : 'bg-neutral-300'}`}>
                    <div className={`h-full transition-all ${isDark ? 'bg-white' : 'bg-neutral-900'}`} style={{ width: `${project.progress}%` }} />
                  </div>

                  {/* Collaborators */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-500" />
                    <span className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{project.collaborators} collaborators</span>
                  </div>
                </div>

                <div className="ml-2 flex gap-1 flex-shrink-0">
                  <button onClick={() => { setEditingProject(project); setShowAddProject(true); }} className="p-2 hover:bg-blue-950/30 rounded transition-colors" title="Edit Project">
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button onClick={() => removeProject(project.id)} className="p-2 hover:bg-red-950/30 rounded transition-colors" title="Delete Project">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FrostedPanel>

      {/* Citation Matrix */}
      <FrostedPanel
        id="panel-researcher-citations"
        title="Citation Matrix & H-Index"
        icon={<BarChart3 className="w-4 h-4 text-white" />}
        badge="Metrics"
        isFrosted={frozenPanels.citations}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, citations: !p.citations }))}
        isDark={isDark}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Card onClick={() => {}} isDark={isDark} className="p-3 text-center cursor-pointer hover:scale-105">
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{citationStats.totalCitations}</p>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Total Citations</p>
          </Card>

          <Card onClick={() => {}} isDark={isDark} className="p-3 text-center cursor-pointer hover:scale-105">
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{citationStats.activeProjects}</p>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Active Projects</p>
          </Card>

          <Card onClick={() => {}} isDark={isDark} className="p-3 text-center cursor-pointer hover:scale-105">
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{citationStats.totalProjects}</p>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Total Projects</p>
          </Card>
        </div>
      </FrostedPanel>

      {/* Recent Papers */}
      <FrostedPanel
        id="panel-researcher-papers"
        title={`Recent Papers (${resources.length})`}
        icon={<FileText className="w-4 h-4 text-white" />}
        badge="Documents"
        isFrosted={frozenPanels.papers}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, papers: !p.papers }))}
        isDark={isDark}
      >
        {resources.length === 0 ? (
          <p className={`text-xs py-4 text-center ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>No papers yet. Start writing a new research paper.</p>
        ) : (
          <div className="space-y-2">
            {resources.slice(0, 5).map((resource) => (
              <Card key={resource.id} onClick={() => onOpenResource(resource)} isDark={isDark} className="p-3 text-left">
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>{resource.title}</h4>
                <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{resource.type} • {resource.updatedAt}</p>
              </Card>
            ))}
          </div>
        )}
      </FrostedPanel>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ActionButton onClick={onCreateResourceClick} variant="primary" isDark={isDark}>
          New Paper
        </ActionButton>
        <ActionButton onClick={onOpenLibrary} isDark={isDark}>
          View Library
        </ActionButton>
        <ActionButton onClick={onOpenWorkspace} isDark={isDark} icon={<Share2 className="w-3 h-3" />}>
          Collaborate
        </ActionButton>
        {onOpenFishing && (
          <ActionButton onClick={onOpenFishing} isDark={isDark}>
            Tank
          </ActionButton>
        )}
      </div>
    </div>
  );
});

export default ResearcherHubView;
