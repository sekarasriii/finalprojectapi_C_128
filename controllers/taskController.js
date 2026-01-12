// Controller for task endpoints
const getTasksByProject = (req, res) => {
    res.json({ success: true, message: `Get tasks for project ID ${req.params.projectId}` });
};

const createTask = (req, res) => {
    res.json({ success: true, message: 'Create a new task', data: req.body });
};

const updateTask = (req, res) => {
    res.json({ success: true, message: `Update task with ID ${req.params.id}`, data: req.body });
};

const deleteTask = (req, res) => {
    res.json({ success: true, message: `Delete task with ID ${req.params.id}` });
};

module.exports = { getTasksByProject, createTask, updateTask, deleteTask };