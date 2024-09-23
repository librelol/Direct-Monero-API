exports.renderIndex = (req, res) => {
    res.render('index', {
        title: 'Welcome to My Website',
        header: 'Hello, World!',
        content: 'This is the main content of the page.',
        footer: '© 2023 My Website'
    });
};