import { useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Design landing page",
    description: "Create the main landing page design.",
    priority: "High",
    status: "todo",
    dueDate: "2026-09-15",
    tag: "Design",
    project: "Website Redesign",
    favorite: true,
  },
  {
    id: 2,
    title: "Build authentication",
    description: "Implement login and signup functionality.",
    priority: "Urgent",
    status: "progress",
    dueDate: "2026-09-12",
    tag: "Development",
    project: "Website Redesign",
    favorite: false,
  },
  {
    id: 3,
    title: "Project documentation",
    description: "Prepare project documentation.",
    priority: "Medium",
    status: "completed",
    dueDate: "2026-09-10",
    tag: "Docs",
    project: "Mobile App",
    favorite: true,
  },
];

const columns = [
  { id: "todo", title: "To Do", icon: "○" },
  { id: "progress", title: "In Progress", icon: "◐" },
  { id: "completed", title: "Completed", icon: "✓" },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const [projects, setProjects] = useState([
    "Website Redesign",
    "Mobile App",
    "Marketing",
  ]);

  const [profile, setProfile] = useState({
    name: "Sawira Shakeel Raja",
    role: "BSCS Student",
    email: "sawira@example.com",
  });

  const [profileForm, setProfileForm] = useState({
    name: "Sawira Shakeel Raja",
    role: "BSCS Student",
    email: "sawira@example.com",
  });

  const [activePage, setActivePage] = useState("tasks");
  const [viewMode, setViewMode] = useState("board");
  const [selectedProject, setSelectedProject] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Title");

  const [calendarDate, setCalendarDate] = useState(new Date());

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    compactMode: false,
    deadlineAlerts: true,
    weeklySummary: true,
  });

  const [settingsSection, setSettingsSection] = useState("general");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "todo",
    dueDate: "",
    tag: "General",
    project: "Website Redesign",
    favorite: false,
  });

  const todoCount = tasks.filter((task) => task.status === "todo").length;

  const progressCount = tasks.filter(
    (task) => task.status === "progress"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const overdueCount = tasks.filter((task) => {
    if (!task.dueDate || task.status === "completed") {
      return false;
    }

    return new Date(task.dueDate) < new Date();
  }).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = tasks
    .filter((task) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.tag.toLowerCase().includes(search);

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      const matchesProject =
        selectedProject === "All" ||
        task.project === selectedProject;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesProject
      );
    })
    .sort((a, b) => {
      if (sortBy === "Title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "Due Date") {
        return (a.dueDate || "").localeCompare(
          b.dueDate || ""
        );
      }

      if (sortBy === "Priority") {
        const priorityOrder = {
          Urgent: 1,
          High: 2,
          Medium: 3,
          Low: 4,
        };

        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
        );
      }

      return 0;
    });

  function getInitials(name) {
    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  function formatDisplayDate(dateString) {
    if (!dateString) {
      return "No date";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function navigate(page) {
    setActivePage(page);
    setSelectedProject("All");
  }

  function openProject(projectName) {
    setSelectedProject(projectName);
    setActivePage("project");
  }

  function addProject() {
    const projectName = window.prompt(
      "Enter your new project name:"
    );

    if (!projectName) {
      return;
    }

    const cleanName = projectName.trim();

    if (!cleanName) {
      return;
    }

    const alreadyExists = projects.some(
      (project) =>
        project.toLowerCase() ===
        cleanName.toLowerCase()
    );

    if (alreadyExists) {
      window.alert(
        "A project with this name already exists."
      );
      return;
    }

    setProjects((currentProjects) => [
      ...currentProjects,
      cleanName,
    ]);

    setSelectedProject(cleanName);
    setActivePage("project");
  }

  function openCreateModal() {
    setEditingTask(null);

    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      status: "todo",
      dueDate: "",
      tag: "General",
      project:
        selectedProject !== "All"
          ? selectedProject
          : projects[0] || "Website Redesign",
      favorite: false,
    });

    setShowModal(true);
  }

  function openEditModal(task) {
    setEditingTask(task);

    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      tag: task.tag,
      project: task.project,
      favorite: task.favorite,
    });

    setShowModal(true);
  }

  function saveTask() {
    if (!newTask.title.trim()) {
      window.alert("Please enter a task title.");
      return;
    }

    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...newTask,
                title: newTask.title.trim(),
              }
            : task
        )
      );
    } else {
      const task = {
        id: Date.now(),
        ...newTask,
        title: newTask.title.trim(),
      };

      setTasks((currentTasks) => [
        ...currentTasks,
        task,
      ]);
    }

    setShowModal(false);
    setEditingTask(null);
  }

  function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );

    setShowDetails(false);
    setSelectedTask(null);
  }

  function toggleFavorite(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              favorite: !task.favorite,
            }
          : task
      )
    );
  }

  function openTaskDetails(task) {
    setSelectedTask(task);
    setShowDetails(true);
  }

  function handleDragStart(event, taskId) {
    event.dataTransfer.setData(
      "taskId",
      String(taskId)
    );
  }

  function handleDrop(event, status) {
    const taskId = Number(
      event.dataTransfer.getData("taskId")
    );

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: status,
            }
          : task
      )
    );
  }

  function clearFilters() {
    setSearchTerm("");
    setPriorityFilter("All");
    setSortBy("Title");
    setSelectedProject("All");
  }

  function getMonthTitle() {
    return calendarDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  function previousMonth() {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + 1,
        1
      )
    );
  }

  function goToday() {
    setCalendarDate(new Date());
  }

  function getCalendarDays() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        new Date(year, month, 0 - i)
      );
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(
        new Date(year, month, day)
      );
    }

    let nextDay = 1;

    while (days.length < 42) {
      days.push(
        new Date(
          year,
          month + 1,
          nextDay
        )
      );

      nextDay++;
    }

    return days;
  }

  function updateSetting(name, value) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: value,
    }));
  }

  function saveSettings() {
    window.alert("Settings saved successfully.");
  }

  function getProjectColor(index) {
    const colors = [
      "blue",
      "purple",
      "green",
    ];

    return colors[index % colors.length];
  }

  function openProfileModal() {
    setProfileForm({
      name: profile.name,
      role: profile.role,
      email: profile.email,
    });

    setShowProfileModal(true);
  }

  function saveProfile() {
    const cleanName = profileForm.name.trim();
    const cleanRole = profileForm.role.trim();
    const cleanEmail = profileForm.email.trim();

    if (!cleanName) {
      window.alert("Please enter your name.");
      return;
    }

    if (!cleanRole) {
      window.alert("Please enter your role.");
      return;
    }

    if (!cleanEmail) {
      window.alert("Please enter your email.");
      return;
    }

    setProfile({
      name: cleanName,
      role: cleanRole,
      email: cleanEmail,
    });

    setShowProfileModal(false);
  }

  function renderBoard() {
    return (
      <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (task) =>
              task.status === column.id
          );

          return (
            <div
              className="kanban-column"
              key={column.id}
              onDragOver={(event) =>
                event.preventDefault()
              }
              onDrop={(event) =>
                handleDrop(event, column.id)
              }
            >
              <div className="column-header">
                <div className="column-title">
                  <span className="column-icon">
                    {column.icon}
                  </span>

                  <span>{column.title}</span>

                  <span className="task-count">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  className="add-column-task"
                  onClick={openCreateModal}
                >
                  +
                </button>
              </div>

              <div className="column-content">
                {columnTasks.length === 0 ? (
                  <div className="empty-column">
                    <div>No tasks here</div>
                    <span>Drop a task here</span>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      className="task-card"
                      key={task.id}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(
                          event,
                          task.id
                        )
                      }
                      onClick={() =>
                        openTaskDetails(task)
                      }
                    >
                      <div className="task-card-top">
                        <span
                          className={
                            "priority priority-" +
                            task.priority.toLowerCase()
                          }
                        >
                          {task.priority}
                        </span>

                        <button
                          className="task-menu"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditModal(task);
                          }}
                        >
                          ⋮
                        </button>
                      </div>

                      <h3>{task.title}</h3>

                      <p>{task.description}</p>

                      <div className="task-card-bottom">
                        <span className="task-tag">
                          {task.tag}
                        </span>

                        <span>
                          {formatDisplayDate(
                            task.dueDate
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderList() {
    return (
      <div className="list-view">
        <div className="list-header">
          <span>Task</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Project</span>
          <span>Due Date</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-list">
            No tasks found.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              className="list-row"
              key={task.id}
              onClick={() =>
                openTaskDetails(task)
              }
            >
              <span className="list-task-name">
                {task.title}
              </span>

              <span
                className={
                  "priority priority-" +
                  task.priority.toLowerCase()
                }
              >
                {task.priority}
              </span>

              <span>
                {task.status === "todo"
                  ? "To Do"
                  : task.status === "progress"
                  ? "In Progress"
                  : "Completed"}
              </span>

              <span>{task.project}</span>

              <span>
                {formatDisplayDate(
                  task.dueDate
                )}
              </span>
            </div>
          ))
        )}
      </div>
    );
  }

  function renderCalendar() {
    const days = getCalendarDays();
    const todayKey = formatDateKey(
      new Date()
    );

    return (
      <div className="calendar-wrapper">
        <div className="calendar-topbar">
          <div>
            <h2>{getMonthTitle()}</h2>
          </div>

          <div className="calendar-actions">
            <button onClick={previousMonth}>
              ‹
            </button>

            <button onClick={goToday}>
              Today
            </button>

            <button onClick={nextMonth}>
              ›
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (
            <div
              className="calendar-weekday"
              key={day}
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const dayKey =
              formatDateKey(day);

            const dayTasks =
              filteredTasks.filter(
                (task) =>
                  task.dueDate === dayKey
              );

            const outsideMonth =
              day.getMonth() !==
              calendarDate.getMonth();

            const isToday =
              dayKey === todayKey;

            return (
              <div
                className={
                  "calendar-cell" +
                  (outsideMonth
                    ? " outside-month"
                    : "") +
                  (isToday
                    ? " today-cell"
                    : "")
                }
                key={index}
              >
                <div className="calendar-date">
                  {isToday ? (
                    <span className="today-number">
                      {day.getDate()}
                    </span>
                  ) : (
                    day.getDate()
                  )}
                </div>

                <div className="calendar-tasks">
                  {dayTasks.map((task) => (
                    <div
                      className="calendar-task"
                      key={task.id}
                      onClick={() =>
                        openTaskDetails(task)
                      }
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderDashboard() {
    return (
      <div className="dashboard">
        <div className="page-heading">
          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back. Here is your
              workspace overview.
            </p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
            <small>Across all projects</small>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
            <small>
              {completionPercentage}%
              completion
            </small>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{progressCount}</strong>
            <small>Currently active</small>
          </div>

          <div className="stat-card">
            <span>Overdue</span>
            <strong>{overdueCount}</strong>
            <small>Need attention</small>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Progress Overview</h3>

            <div className="progress-circle">
              <div>
                <strong>
                  {completionPercentage}%
                </strong>

                <span>Complete</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Task Breakdown</h3>

            <div className="breakdown-row">
              <span>To Do</span>
              <strong>{todoCount}</strong>
            </div>

            <div className="breakdown-row">
              <span>In Progress</span>
              <strong>{progressCount}</strong>
            </div>

            <div className="breakdown-row">
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderFavorites() {
    const favoriteTasks =
      tasks.filter(
        (task) => task.favorite
      );

    return (
      <div>
        <div className="page-heading">
          <div>
            <h1>Favorites</h1>

            <p>
              Your important tasks in one
              place.
            </p>
          </div>
        </div>

        {favoriteTasks.length === 0 ? (
          <div className="empty-list">
            No favorite tasks yet.
          </div>
        ) : (
          <div className="kanban-board">
            <div className="kanban-column">
              <div className="column-header">
                <div className="column-title">
                  <span>⭐</span>

                  <span>
                    Favorite Tasks
                  </span>

                  <span className="task-count">
                    {favoriteTasks.length}
                  </span>
                </div>
              </div>

              <div className="column-content">
                {favoriteTasks.map((task) => (
                  <div
                    className="task-card"
                    key={task.id}
                    onClick={() =>
                      openTaskDetails(task)
                    }
                  >
                    <div className="task-card-top">
                      <span
                        className={
                          "priority priority-" +
                          task.priority.toLowerCase()
                        }
                      >
                        {task.priority}
                      </span>

                      <button
                        className="task-menu"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(
                            task.id
                          );
                        }}
                      >
                        ★
                      </button>
                    </div>

                    <h3>{task.title}</h3>

                    <p>{task.description}</p>

                    <div className="task-card-bottom">
                      <span className="task-tag">
                        {task.project}
                      </span>

                      <span>
                        {formatDisplayDate(
                          task.dueDate
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderProjectPage() {
    const projectTasks =
      filteredTasks.filter(
        (task) =>
          task.project === selectedProject
      );

    return (
      <div>
        <div className="page-heading">
          <div>
            <div className="breadcrumb">
              Projects / {selectedProject}
            </div>

            <h1>{selectedProject}</h1>

            <p>
              Manage all tasks belonging to
              this project.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={openCreateModal}
          >
            + New Task
          </button>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>
              {projectTasks.length}
            </strong>
            <small>Project tasks</small>
          </div>

          <div className="stat-card">
            <span>To Do</span>

            <strong>
              {
                projectTasks.filter(
                  (task) =>
                    task.status === "todo"
                ).length
              }
            </strong>

            <small>Waiting to start</small>
          </div>

          <div className="stat-card">
            <span>In Progress</span>

            <strong>
              {
                projectTasks.filter(
                  (task) =>
                    task.status ===
                    "progress"
                ).length
              }
            </strong>

            <small>Currently active</small>
          </div>

          <div className="stat-card">
            <span>Completed</span>

            <strong>
              {
                projectTasks.filter(
                  (task) =>
                    task.status ===
                    "completed"
                ).length
              }
            </strong>

            <small>Finished tasks</small>
          </div>
        </div>

        <div className="kanban-board">
          {columns.map((column) => {
            const columnTasks =
              projectTasks.filter(
                (task) =>
                  task.status ===
                  column.id
              );

            return (
              <div
                className="kanban-column"
                key={column.id}
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={(event) =>
                  handleDrop(
                    event,
                    column.id
                  )
                }
              >
                <div className="column-header">
                  <div className="column-title">
                    <span className="column-icon">
                      {column.icon}
                    </span>

                    <span>
                      {column.title}
                    </span>

                    <span className="task-count">
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    className="add-column-task"
                    onClick={
                      openCreateModal
                    }
                  >
                    +
                  </button>
                </div>

                <div className="column-content">
                  {columnTasks.map((task) => (
                    <div
                      className="task-card"
                      key={task.id}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(
                          event,
                          task.id
                        )
                      }
                      onClick={() =>
                        openTaskDetails(
                          task
                        )
                      }
                    >
                      <div className="task-card-top">
                        <span
                          className={
                            "priority priority-" +
                            task.priority.toLowerCase()
                          }
                        >
                          {task.priority}
                        </span>

                        <button
                          className="task-menu"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditModal(task);
                          }}
                        >
                          ⋮
                        </button>
                      </div>

                      <h3>{task.title}</h3>

                      <p>{task.description}</p>

                      <div className="task-card-bottom">
                        <span className="task-tag">
                          {task.tag}
                        </span>

                        <span>
                          {formatDisplayDate(
                            task.dueDate
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="settings-page">
        <div className="settings-heading">
          <h1>Settings</h1>

          <p>
            Manage your workspace and
            application preferences.
          </p>
        </div>

        <div className="settings-layout">
          <div className="settings-navigation">
            <div className="settings-user">
              <div className="settings-user-avatar">
                {getInitials(profile.name)}
              </div>

              <div>
                <strong>
                  {profile.name}
                </strong>

                <span>
                  Workspace Owner
                </span>
              </div>
            </div>

            {[
              ["general", "General"],
              [
                "notifications",
                "Notifications",
              ],
              [
                "appearance",
                "Appearance",
              ],
              [
                "workspace",
                "Workspace",
              ],
              ["security", "Security"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={
                  settingsSection === id
                    ? "settings-nav-item active"
                    : "settings-nav-item"
                }
                onClick={() =>
                  setSettingsSection(id)
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="settings-content">
            {settingsSection === "general" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>General</h2>

                    <p>
                      Manage your basic account
                      preferences.
                    </p>
                  </div>

                  <span className="section-icon">
                    ⚙
                  </span>
                </div>

                <div className="profile-settings-box">
                  <div className="settings-user-avatar">
                    {getInitials(profile.name)}
                  </div>

                  <div>
                    <strong>
                      {profile.name}
                    </strong>

                    <p>
                      {profile.role} ·
                      TaskFlow Workspace
                    </p>
                  </div>

                  <button
                    className="outline-btn"
                    onClick={
                      openProfileModal
                    }
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="profile-info-extra">
                  <div>
                    <span>Email</span>
                    <strong>
                      {profile.email}
                    </strong>
                  </div>

                  <div>
                    <span>Role</span>
                    <strong>
                      {profile.role}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {settingsSection ===
              "notifications" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Notifications</h2>

                    <p>
                      Choose which notifications
                      you receive.
                    </p>
                  </div>

                  <span className="section-icon">
                    🔔
                  </span>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>
                      Notifications
                    </strong>

                    <span>
                      Receive task and
                      workspace notifications.
                    </span>
                  </div>

                  <button
                    className={
                      settings.notifications
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() =>
                      updateSetting(
                        "notifications",
                        !settings.notifications
                      )
                    }
                  >
                    <span></span>
                  </button>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>
                      Deadline Alerts
                    </strong>

                    <span>
                      Get notified when deadlines
                      are near.
                    </span>
                  </div>

                  <button
                    className={
                      settings.deadlineAlerts
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() =>
                      updateSetting(
                        "deadlineAlerts",
                        !settings.deadlineAlerts
                      )
                    }
                  >
                    <span></span>
                  </button>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>
                      Weekly Summary
                    </strong>

                    <span>
                      Receive a summary of your
                      weekly progress.
                    </span>
                  </div>

                  <button
                    className={
                      settings.weeklySummary
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() =>
                      updateSetting(
                        "weeklySummary",
                        !settings.weeklySummary
                      )
                    }
                  >
                    <span></span>
                  </button>
                </div>
              </div>
            )}

            {settingsSection ===
              "appearance" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Appearance</h2>

                    <p>
                      Customize how TaskFlow
                      looks.
                    </p>
                  </div>

                  <span className="section-icon">
                    ◐
                  </span>
                </div>

                <div className="theme-grid">
                  <button
                    className={
                      settings.darkMode
                        ? "theme-card"
                        : "theme-card active"
                    }
                    onClick={() =>
                      updateSetting(
                        "darkMode",
                        false
                      )
                    }
                  >
                    <div className="theme-screen light-theme">
                      Light
                    </div>

                    <div className="theme-card-info">
                      <strong>Light</strong>
                      <span>
                        Clean workspace
                      </span>
                    </div>
                  </button>

                  <button
                    className={
                      settings.darkMode
                        ? "theme-card active"
                        : "theme-card"
                    }
                    onClick={() =>
                      updateSetting(
                        "darkMode",
                        true
                      )
                    }
                  >
                    <div className="theme-screen dark-theme">
                      Dark
                    </div>

                    <div className="theme-card-info">
                      <strong>Dark</strong>
                      <span>
                        Focused workspace
                      </span>
                    </div>
                  </button>
                </div>

                <div className="setting-row">
                  <div>
                    <strong>
                      Compact Mode
                    </strong>

                    <span>
                      Reduce spacing to display
                      more tasks.
                    </span>
                  </div>

                  <button
                    className={
                      settings.compactMode
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() =>
                      updateSetting(
                        "compactMode",
                        !settings.compactMode
                      )
                    }
                  >
                    <span></span>
                  </button>
                </div>
              </div>
            )}

            {settingsSection ===
              "workspace" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Workspace</h2>

                    <p>
                      Configure your TaskFlow
                      workspace.
                    </p>
                  </div>

                  <span className="section-icon">
                    ▦
                  </span>
                </div>

                <div className="settings-form-grid">
                  <label>
                    Workspace Name

                    <input
                      defaultValue={
                        "TaskFlow Workspace"
                      }
                    />
                  </label>

                  <label>
                    Workspace Type

                    <select defaultValue="Personal">
                      <option>
                        Personal
                      </option>

                      <option>
                        Team
                      </option>

                      <option>
                        Business
                      </option>
                    </select>
                  </label>
                </div>

                <button
                  className="primary-btn"
                  onClick={saveSettings}
                >
                  Save Changes
                </button>
              </div>
            )}

            {settingsSection ===
              "security" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Security</h2>

                    <p>
                      Manage your account
                      security.
                    </p>
                  </div>

                  <span className="section-icon">
                    🔒
                  </span>
                </div>

                <div className="security-setting">
                  <div>
                    <strong>
                      Password
                    </strong>

                    <span>
                      Keep your account password
                      secure.
                    </span>
                  </div>

                  <button
                    className="outline-btn"
                    onClick={() =>
                      window.alert(
                        "Password management will be available soon."
                      )
                    }
                  >
                    Change Password
                  </button>
                </div>

                <div className="danger-zone">
                  <div>
                    <strong>
                      Reset Workspace
                    </strong>

                    <span>
                      This option will reset
                      workspace preferences.
                    </span>
                  </div>

                  <button
                    className="danger-btn"
                    onClick={() =>
                      window.alert(
                        "Workspace reset is disabled in this demo."
                      )
                    }
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderHelp() {
    return (
      <div>
        <div className="page-heading">
          <div>
            <h1>Help Center</h1>

            <p>
              Learn how to use your TaskFlow
              workspace.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Creating Tasks</h3>

            <p>
              Use the New Task button to create
              tasks, assign priorities, projects
              and deadlines.
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Kanban Board</h3>

            <p>
              Drag tasks between To Do, In
              Progress and Completed columns.
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Projects</h3>

            <p>
              Create projects from the sidebar
              and organize your work into
              separate areas.
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Calendar</h3>

            <p>
              Use Calendar view to see tasks
              according to their deadlines.
            </p>
          </div>
        </div>
      </div>
    );
  }

  function renderMainContent() {
    if (activePage === "dashboard") {
      return renderDashboard();
    }

    if (activePage === "favorites") {
      return renderFavorites();
    }

    if (activePage === "calendar") {
      return renderCalendar();
    }

    if (activePage === "project") {
      return renderProjectPage();
    }

    if (activePage === "settings") {
      return renderSettings();
    }

    if (activePage === "help") {
      return renderHelp();
    }

    return (
      <>
        <div className="page-heading">
          <div>
            <div className="breadcrumb">
              Workspace / Tasks
            </div>

            <h1>My Tasks</h1>

            <p>
              Organize your work and stay on
              top of your goals.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={openCreateModal}
          >
            + New Task
          </button>
        </div>

        <div className="toolbar">
          <div className="view-buttons">
            <button
              className={
                viewMode === "board"
                  ? "view-btn active"
                  : "view-btn"
              }
              onClick={() =>
                setViewMode("board")
              }
            >
              Board
            </button>

            <button
              className={
                viewMode === "list"
                  ? "view-btn active"
                  : "view-btn"
              }
              onClick={() =>
                setViewMode("list")
              }
            >
              List
            </button>

            <button
              className={
                viewMode === "calendar"
                  ? "view-btn active"
                  : "view-btn"
              }
              onClick={() =>
                setViewMode("calendar")
              }
            >
              Calendar
            </button>
          </div>

          <div className="filter-area">
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
            >
              <option>All</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
              }
            >
              <option>Title</option>
              <option>Due Date</option>
              <option>Priority</option>
            </select>

            <button
              className="clear-filter"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>

        {viewMode === "board" &&
          renderBoard()}

        {viewMode === "list" &&
          renderList()}

        {viewMode === "calendar" &&
          renderCalendar()}
      </>
    );
  }

  return (
    <div
      className={
        settings.darkMode
          ? "app dark-app"
          : "app"
      }
    >
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            T
          </div>

          <div>
            <strong>TaskFlow</strong>
            <span>Workspace</span>
          </div>
        </div>

        <div className="workspace-title">
          MY WORKSPACE
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={
              activePage === "tasks"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("tasks")
            }
          >
            <span>✓</span>
            My Tasks
          </button>

          <button
            className={
              activePage === "calendar"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("calendar")
            }
          >
            <span>□</span>
            Calendar
          </button>

          <button
            className={
              activePage === "favorites"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("favorites")
            }
          >
            <span>★</span>
            Favorites
          </button>
        </nav>

        <div className="projects-title">
          <span>PROJECTS</span>

          <button onClick={addProject}>
            +
          </button>
        </div>

        <div className="projects-list">
          {projects.map(
            (project, index) => (
              <button
                className={
                  selectedProject ===
                  project
                    ? "project-item active"
                    : "project-item"
                }
                key={project}
                onClick={() =>
                  openProject(project)
                }
              >
                <span
                  className={
                    "project-dot " +
                    getProjectColor(index)
                  }
                ></span>

                <span>{project}</span>
              </button>
            )
          )}
        </div>

        <button
          className="add-project"
          onClick={addProject}
        >
          <span>+</span>
          Add project
        </button>

        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() =>
              navigate("settings")
            }
          >
            <span>⚙</span>
            Settings
          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("help")
            }
          >
            <span>?</span>
            Help & Support
          </button>

          <div className="account-box">
            <div className="avatar">
              {getInitials(profile.name)}
            </div>

            <div>
              <strong>
                {profile.name}
              </strong>

              <span>
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            {activePage === "dashboard"
              ? "Dashboard"
              : activePage === "tasks"
              ? "My Tasks"
              : activePage === "calendar"
              ? "Calendar"
              : activePage === "favorites"
              ? "Favorites"
              : activePage === "project"
              ? selectedProject
              : activePage === "settings"
              ? "Settings"
              : "Help & Support"}
          </div>

          <div className="topbar-actions">
            <div className="global-search">
              <span>⌕</span>

              <input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />
            </div>

            <button className="top-icon">
              🔔
            </button>

            <div className="top-avatar">
              {getInitials(profile.name)}
            </div>
          </div>
        </header>

        <section className="content">
          {renderMainContent()}
        </section>
      </main>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingTask
                    ? "Edit Task"
                    : "Create New Task"}
                </h2>

                <p>
                  Add details and organize
                  your task.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <label>
                Task Title

                <input
                  value={newTask.title}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      title:
                        event.target.value,
                    })
                  }
                  placeholder="Enter task title"
                />
              </label>

              <label>
                Description

                <textarea
                  value={newTask.description}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      description:
                        event.target.value,
                    })
                  }
                  placeholder="Describe your task..."
                  rows="4"
                ></textarea>
              </label>

              <div className="settings-form-grid">
                <label>
                  Priority

                  <select
                    value={
                      newTask.priority
                    }
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        priority:
                          event.target.value,
                      })
                    }
                  >
                    <option>
                      Urgent
                    </option>

                    <option>
                      High
                    </option>

                    <option>
                      Medium
                    </option>

                    <option>
                      Low
                    </option>
                  </select>
                </label>

                <label>
                  Status

                  <select
                    value={
                      newTask.status
                    }
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        status:
                          event.target.value,
                      })
                    }
                  >
                    <option value="todo">
                      To Do
                    </option>

                    <option value="progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </label>

                <label>
                  Due Date

                  <input
                    type="date"
                    value={
                      newTask.dueDate
                    }
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        dueDate:
                          event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Tag

                  <input
                    value={newTask.tag}
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        tag:
                          event.target.value,
                      })
                    }
                    placeholder="e.g. Design"
                  />
                </label>
              </div>

              <label>
                Project

                <select
                  value={
                    newTask.project
                  }
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      project:
                        event.target.value,
                    })
                  }
                >
                  {projects.map(
                    (project) => (
                      <option
                        value={project}
                        key={project}
                      >
                        {project}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="favorite-check">
                <input
                  type="checkbox"
                  checked={
                    newTask.favorite
                  }
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      favorite:
                        event.target
                          .checked,
                    })
                  }
                />

                Add to Favorites
              </label>
            </div>

            <div className="modal-footer">
              <button
                className="outline-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={saveTask}
              >
                {editingTask
                  ? "Save Changes"
                  : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetails &&
        selectedTask && (
          <div
            className="modal-overlay"
            onClick={() =>
              setShowDetails(false)
            }
          >
            <div
              className="modal details-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="modal-header">
                <div>
                  <span
                    className={
                      "priority priority-" +
                      selectedTask.priority.toLowerCase()
                    }
                  >
                    {selectedTask.priority}
                  </span>

                  <h2>
                    {selectedTask.title}
                  </h2>

                  <p>
                    {
                      selectedTask.description
                    }
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowDetails(false)
                  }
                >
                  ×
                </button>
              </div>

              <div className="details-content">
                <div>
                  <strong>
                    Project
                  </strong>

                  <span>
                    {selectedTask.project}
                  </span>
                </div>

                <div>
                  <strong>
                    Status
                  </strong>

                  <span>
                    {selectedTask.status ===
                    "todo"
                      ? "To Do"
                      : selectedTask.status ===
                        "progress"
                      ? "In Progress"
                      : "Completed"}
                  </span>
                </div>

                <div>
                  <strong>
                    Due Date
                  </strong>

                  <span>
                    {formatDisplayDate(
                      selectedTask.dueDate
                    )}
                  </span>
                </div>

                <div>
                  <strong>
                    Tag
                  </strong>

                  <span>
                    {selectedTask.tag}
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="danger-btn"
                  onClick={() =>
                    deleteTask(
                      selectedTask.id
                    )
                  }
                >
                  Delete
                </button>

                <button
                  className="outline-btn"
                  onClick={() => {
                    setShowDetails(false);
                    openEditModal(
                      selectedTask
                    );
                  }}
                >
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        )}

      {showProfileModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowProfileModal(false)
          }
        >
          <div
            className="modal profile-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>Edit Profile</h2>

                <p>
                  Update your personal
                  information.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowProfileModal(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <div className="profile-edit-avatar">
              {getInitials(
                profileForm.name ||
                  profile.name
              )}
            </div>

            <div className="modal-body">
              <label>
                Full Name

                <input
                  type="text"
                  value={
                    profileForm.name
                  }
                  onChange={(event) =>
                    setProfileForm({
                      ...profileForm,
                      name:
                        event.target.value,
                    })
                  }
                  placeholder="Enter your name"
                />
              </label>

              <label>
                Role

                <input
                  type="text"
                  value={
                    profileForm.role
                  }
                  onChange={(event) =>
                    setProfileForm({
                      ...profileForm,
                      role:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. BSCS Student"
                />
              </label>

              <label>
                Email

                <input
                  type="email"
                  value={
                    profileForm.email
                  }
                  onChange={(event) =>
                    setProfileForm({
                      ...profileForm,
                      email:
                        event.target.value,
                    })
                  }
                  placeholder="Enter your email"
                />
              </label>
            </div>

            <div className="modal-footer">
              <button
                className="outline-btn"
                onClick={() =>
                  setShowProfileModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={saveProfile}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;