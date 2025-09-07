import express from 'express';
import bodyParser from 'body-parser';
import db from './database.js';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const categories = ['Yoga', 'Power Electronics', 'Artificial Intelligence'];

// Home - show all posts or by category
app.get('/', (req, res) => {
    const { category } = req.query;
    let posts;
    if (category && categories.includes(category)) {
        posts = db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC').all(category);
    } else {
        posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    }
    res.render('index', { posts, categories, selectedCategory: category || 'All' });
});

// New post form
app.get('/post/new', (req, res) => {
    res.render('new', { categories });
});

// Create new post
app.post('/post', (req, res) => {
    const { title, content, category } = req.body;
    db.prepare('INSERT INTO posts (title, content, category) VALUES (?, ?, ?)').run(title, content, category);
    res.redirect('/');
});

// Edit post form
app.get('/post/edit/:id', (req, res) => {
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    if (post) res.render('edit', { post, categories });
    else res.redirect('/');
});

// Update post
app.post('/post/edit/:id', (req, res) => {
    const { title, content, category } = req.body;
    db.prepare('UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ?')
      .run(title, content, category, req.params.id);
    res.redirect('/');
});

// Delete post
app.post('/post/delete/:id', (req, res) => {
    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
