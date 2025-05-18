import { EditableField } from './ui/editable-field';
import { PersonalData, Task, TaskNote } from '@/lib/types';
import { useState } from 'react';
import { createNewTask, addNoteToTask } from '@/lib/storage';

interface PersonalDashboardProps {
  data: PersonalData;
  onUpdate: (data: PersonalData) => void;
  onResetDay: () => void;
  viewMode: 'daily' | 'weekly' | 'monthly';
}

export function PersonalDashboard({ data, onUpdate, onResetDay, viewMode }: PersonalDashboardProps) {
  const [newTaskName, setNewTaskName] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleFieldUpdate = (field: keyof Omit<PersonalData, 'tasks' | 'dailyProgress' | 'weeklyTasks' | 'dailyTasks'>, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleTaskToggle = (taskId: string) => {
    onUpdate({
      ...data,
      tasks: data.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    });
  };

  const handleTaskScoreUpdate = (taskId: string, score: number) => {
    onUpdate({
      ...data,
      tasks: data.tasks.map((task) =>
        task.id === taskId ? { ...task, score } : task
      ),
    });
  };

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    
    const newTask = createNewTask(newTaskName, 'Personal', selectedDay || undefined);
    
    onUpdate({
      ...data,
      tasks: [...(data?.tasks || []), newTask],
      dailyTasks: selectedDay 
        ? { 
            ...(data?.dailyTasks || {}), 
            [selectedDay.toString()]: [
              ...((data?.dailyTasks || {})[selectedDay.toString()] || []), 
              newTask
            ] 
          }
        : (data?.dailyTasks || {})
    });
    
    setNewTaskName('');
    setSelectedDay(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = data.tasks.find(task => task.id === taskId);
    
    if (!taskToDelete) return;
    
    // Remove from main tasks list
    const updatedTasks = data.tasks.filter(task => task.id !== taskId);
    
    // If task has a day, also remove from dailyTasks
    let updatedDailyTasks = { ...data.dailyTasks };
    if (taskToDelete.day) {
      const dayKey = taskToDelete.day.toString();
      updatedDailyTasks[dayKey] = (updatedDailyTasks[dayKey] || [])
        .filter(task => task.id !== taskId);
    }
    
    // If task has a week, also remove from weeklyTasks
    let updatedWeeklyTasks = { ...data.weeklyTasks };
    if (taskToDelete.week) {
      const weekKey = taskToDelete.week.toString();
      updatedWeeklyTasks[weekKey] = (updatedWeeklyTasks[weekKey] || [])
        .filter(task => task.id !== taskId);
    }
    
    onUpdate({
      ...data,
      tasks: updatedTasks,
      dailyTasks: updatedDailyTasks,
      weeklyTasks: updatedWeeklyTasks
    });
  };

  const handleAddNote = (taskId: string) => {
    if (!newNoteContent.trim()) return;
    
    const updatedTasks = data.tasks.map(task => {
      if (task.id === taskId) {
        return addNoteToTask(task, newNoteContent);
      }
      return task;
    });
    
    onUpdate({
      ...data,
      tasks: updatedTasks
    });
    
    setNewNoteContent('');
    setSelectedTaskId(null);
  };

  // Initialize tasks if not present
  if (!data.tasks || data.tasks.length === 0 || !data.dailyTasks || !data.weeklyTasks) {
    setTimeout(() => {
      const defaultTasks = [
        createNewTask('Quran: 3 juzz Revision', 'Personal'),
        createNewTask('Tafsir Surah Baqarah:233 - 244', 'Personal'),
        createNewTask('Arabic: Finish parts book and topics revise for level 4', 'Personal'),
        createNewTask('Spanish: N/A This month', 'Personal'),
        createNewTask('Matters of The Heart: Read the book 4 times', 'Personal')
      ];
      
      onUpdate({
        ...data,
        tasks: defaultTasks,
        dailyTasks: data.dailyTasks || {},
        weeklyTasks: data.weeklyTasks || {}
      });
    }, 0);
  }

  // Days of the week
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Generate array of days in current month
  const currentDate = new Date();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const days = Array.from({ length: daysInMonth || 30 }, (_, i) => i + 1);
  
  // Render the appropriate view based on viewMode
  const renderContent = () => {
    switch (viewMode) {
      case 'daily':
        return renderDailyView();
      case 'weekly':
        return renderWeeklyView();
      case 'monthly':
        return renderMonthlyView();
      default:
        return renderDailyView();
    }
  };
  
  const renderDailyView = () => {
    // Ensure days is always an array
    const safetyDays = Array.isArray(days) && days.length > 0 ? days : Array.from({ length: 30 }, (_, i) => i + 1);
    
    // Ensure data.dailyTasks is always initialized
    const dailyTasks = data.dailyTasks || {};
    
    // Group tasks by day
    return (
      <div>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {safetyDays.map((day) => {
            const isToday = day === new Date().getDate();
            const hasCompletedTasks = dailyTasks[day]?.some(task => task?.completed) || false;
            const hasTasks = dailyTasks[day]?.length > 0 || false;
            
            return (
              <button 
                key={day}
                className={`h-12 rounded-lg flex flex-col items-center justify-center transition-all ${
                  isToday 
                    ? 'bg-blue-600 text-white font-medium ring-2 ring-blue-300' 
                    : hasCompletedTasks
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : hasTasks
                        ? 'bg-slate-700 text-white border border-slate-600'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              >
                <span className="text-sm">{day}</span>
                {hasTasks && (
                  <span className="text-xs mt-0.5">
                    {dailyTasks[day]?.filter(t => t?.completed)?.length || 0}/{dailyTasks[day]?.length || 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {selectedDay && (
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Day {selectedDay} Tasks</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Add new task..."
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
                />
                <button
                  onClick={handleAddTask}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  Add Task
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {dailyTasks[selectedDay]?.length > 0 ? (
                dailyTasks[selectedDay]?.map((task) => (
                  <div key={task.id} className="bg-slate-800 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskToggle(task.id)}
                          className="h-5 w-5 rounded-md border-slate-600 bg-slate-800"
                        />
                        <span className={task.completed ? 'line-through text-slate-400' : 'text-white'}>
                          {task.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                          className="text-slate-400 hover:text-white px-2 py-1 rounded"
                        >
                          {(task.notes || []).length > 0 ? `Notes (${task.notes.length})` : 'Add Note'}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    {selectedTaskId === task.id && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        {task.notes.length > 0 && (
                          <div className="mb-3 space-y-2">
                            {task.notes.map(note => (
                              <div key={note.id} className="bg-slate-700 p-2 rounded text-sm text-slate-300">
                                {note.content}
                                <div className="text-xs text-slate-500 mt-1">
                                  {new Date(note.createdAt).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder="Add a note..."
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
                          />
                          <button
                            onClick={() => handleAddNote(task.id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 py-6">No tasks for day {selectedDay}. Add a task to get started.</p>
              )}
            </div>
          </div>
        )}
        
        {!selectedDay && (
          <div className="bg-slate-700 p-6 rounded-lg text-center">
            <p className="text-slate-300 mb-4">Select a day from the calendar above to view or add tasks.</p>
            <p className="text-slate-400 text-sm">Daily view helps you organize tasks for specific days of the month.</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderWeeklyView = () => {
    // Display tasks organized by week
    // Ensure data.weeklyTasks is always initialized
    const weeklyTasks = data.weeklyTasks || {};
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weekDays.map((day, index) => (
          <div key={index} className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">{day}</h3>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {weeklyTasks[index.toString()]?.length > 0 ? (
                weeklyTasks[index.toString()]?.map((task) => (
                  <div key={task.id} className="bg-slate-800 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskToggle(task.id)}
                          className="h-5 w-5 rounded-md border-slate-600 bg-slate-800"
                        />
                        <span className={task.completed ? 'line-through text-slate-400' : 'text-white'}>
                          {task.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                          className="text-slate-400 hover:text-white px-2 py-1 rounded"
                        >
                          {(task.notes || []).length > 0 ? `Notes (${task.notes.length})` : 'Add Note'}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    {selectedTaskId === task.id && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        {task.notes.length > 0 && (
                          <div className="mb-3 space-y-2">
                            {task.notes.map(note => (
                              <div key={note.id} className="bg-slate-700 p-2 rounded text-sm text-slate-300">
                                {note.content}
                                <div className="text-xs text-slate-500 mt-1">
                                  {new Date(note.createdAt).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder="Add a note..."
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
                          />
                          <button
                            onClick={() => handleAddNote(task.id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-slate-400">
                  <p>No tasks for {day}</p>
                  <button
                    onClick={() => {
                      setSelectedDay(index);
                      setNewTaskName('');
                    }}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add a task
                  </button>
                </div>
              )}
            </div>
            
            {selectedDay === index && (
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder={`Add a task for ${day}...`}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newTaskName.trim()) return;
                      
                      const newTask = createNewTask(newTaskName, 'Personal', undefined, index);
                      
                      onUpdate({
                        ...data,
                        tasks: [...data.tasks, newTask],
                        weeklyTasks: { 
                          ...(data.weeklyTasks || {}), 
                          [index.toString()]: [
                            ...((data.weeklyTasks || {})[index.toString()] || []), 
                            newTask
                          ] 
                        }
                      });
                      
                      setNewTaskName('');
                      setSelectedDay(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const renderMonthlyView = () => {
    // Display all monthly tasks
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Monthly Tasks</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Add a monthly task..."
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
            />
            <button
              onClick={() => {
                if (!newTaskName.trim()) return;
                
                const newTask = createNewTask(newTaskName, 'Personal');
                
                onUpdate({
                  ...data,
                  tasks: [...data.tasks, newTask],
                });
                
                setNewTaskName('');
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              Add Task
            </button>
          </div>
        </div>
        
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {(data.tasks || []).filter(task => !task.day && !task.week).map((task) => (
            <div key={task.id} className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(task.id)}
                    className="h-5 w-5 rounded-md border-slate-600 bg-slate-700"
                  />
                  <span className={task.completed ? 'line-through text-slate-400' : 'text-white'}>
                    {task.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-slate-400 mr-2 text-sm">Score:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                        <button
                          key={score}
                          className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                            (task.score || 0) >= score
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-600 text-slate-300'
                          }`}
                          onClick={() => handleTaskScoreUpdate(task.id, score)}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                    className="text-slate-400 hover:text-white px-2 py-1 rounded"
                  >
                    {(task.notes || []).length > 0 ? `Notes (${task.notes.length})` : 'Add Note'}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {selectedTaskId === task.id && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  {task.notes.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {task.notes.map(note => (
                        <div key={note.id} className="bg-slate-800 p-2 rounded text-sm text-slate-300">
                          {note.content}
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(note.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
                    />
                    <button
                      onClick={() => handleAddNote(task.id)}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {(data.tasks || []).filter(task => !task.day && !task.week).length === 0 && (
          <div className="bg-slate-700 p-6 rounded-lg text-center">
            <p className="text-slate-300">No monthly tasks yet.</p>
            <p className="text-slate-400 text-sm mt-2">Add a task using the form above.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
} 