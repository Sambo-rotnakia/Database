const Task = require('../model/taskModel');

exports.getTasks = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const tasks = await Task.getAll(req.session.user.id); 
    res.render('user/tasks', { tasks });
};

exports.addTask = async (req, res) => {
    try {
        const { title, description, status = 'Pending', due_date } = req.body;

        // Validate and convert `due_date` to a Date object, or set to null if not provided
        const parsedDueDate = due_date ? new Date(due_date) : null;

        // Check if `due_date` is valid (optional)
        if (due_date && isNaN(parsedDueDate.getTime())) {
            return res.status(400).send({ error: 'Invalid due_date format' });
        }

        // Create the task with `due_date`
        await Task.create({
            user_id: req.session.user.id,
            title,
            description,
            status,
            due_date: parsedDueDate
        });

        res.redirect('/tasks');
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send({ error: 'Failed to add task' });
    }
};




exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    await Task.delete(id);
    res.redirect('/tasks');
};